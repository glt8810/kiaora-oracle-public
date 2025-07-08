import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { google } from "googleapis";
import { OracleCard, drawRandomCard } from "@/lib/oracle-cards";
import { sendOracleConsultation } from "@/lib/email";

// --- CONFIGURATION ---
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

// Initialize the Google Gemini AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Function to get an authenticated Google Sheets client
async function getSheetsClient() {
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountJson) {
        throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set.");
    }
    const credentials = JSON.parse(serviceAccountJson);
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return google.sheets({ version: 'v4', auth });
}

interface UserSubmission {
    rowIndex: number;
    name: string;
    lastSubmissionTimestamp: string;
}

/**
 * Finds a user's submission in the Google Sheet by email.
 * @param email The email of the user to find.
 * @returns {Promise<UserSubmission | null>} An object with rowIndex, name, and lastSubmissionTimestamp, or null if not found.
 */
async function findUserSubmission(email: string): Promise<UserSubmission | null> {
    try {
        const sheets = await getSheetsClient();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:C', // Read Email, Name, and Timestamp columns
        });

        const rows = response.data.values;
        if (rows && rows.length) {
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (row[0] === email) {
                    return {
                        rowIndex: i,
                        name: row[1] || "",
                        lastSubmissionTimestamp: row[2] || "",
                    };
                }
            }
        }
        return null; // Email not found
    } catch (error) {
        console.error("Error finding user submission in Google Sheet:", error);
        throw new Error("Could not retrieve user data from Google Sheet due to a server error.");
    }
}

/**
 * Adds a new consultation to the Google Sheet or updates an existing one.
 * If rowIndex is provided, it updates; otherwise, it appends.
 */
async function addOrUpdateConsultation(
    email: string,
    name: string,
    timestamp: string,
    rowIndex?: number
): Promise<boolean> {
    try {
        const sheets = await getSheetsClient();
        if (rowIndex !== undefined && rowIndex !== null) {
            const range = `Sheet1!B${rowIndex + 1}:C${rowIndex + 1}`;
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: range,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [[name, timestamp]], // Update name and timestamp
                },
            });
            console.log(`Updated row ${rowIndex + 1} for email ${email}`);
        } else {
            await sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: 'Sheet1!A:C',
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [[email, name, timestamp]],
                },
            });
            console.log(`Appended new row for email ${email}`);
        }
        return true;
    } catch (error) {
        console.error("Error adding or updating Google Sheet:", error);
        return false;
    }
}

// Helper function to check if two dates are the same day
function isSameDay(dateStr1: string, dateStr2: string): boolean {
    if (!dateStr1 || !dateStr2) return false; // Handle empty or invalid timestamps
    try {
        const d1 = new Date(dateStr1);
        const d2 = new Date(dateStr2);
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    } catch (e) {
        console.error("Error comparing dates:", e);
        return false; // If timestamps are invalid, treat as not the same day to be safe or handle error appropriately
    }
}

export async function POST(request: Request) {
  try {
    const { question, card, email, name, timestamp } = await request.json();

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    let sheetOperationSuccessful = false;

    if (email) {
        const existingSubmission = await findUserSubmission(email);

        if (existingSubmission) {
            // User found, check timestamp
            if (isSameDay(existingSubmission.lastSubmissionTimestamp, timestamp)) {
                // Submission from today already exists
                return NextResponse.json({ error: "You have already consulted the oracle today. Please return tomorrow for new guidance." }, { status: 429 });
            } else {
                // Submission from a previous day, update it
                sheetOperationSuccessful = await addOrUpdateConsultation(email, name, timestamp, existingSubmission.rowIndex);
                if (!sheetOperationSuccessful) {
                    console.error(`Failed to update consultation for existing user: ${email}`);
                    return NextResponse.json({ error: "Your consultation was generated, but there was an issue updating your details. Please try again later." }, { status: 500 });
                }
            }
        } else {
            // New user, add them
            sheetOperationSuccessful = await addOrUpdateConsultation(email, name, timestamp);
            if (!sheetOperationSuccessful) {
                console.error(`Failed to add consultation for new user: ${email}`);
                return NextResponse.json({ error: "Your consultation was generated, but there was an issue saving your details. Please try again later." }, { status: 500 });
            }
        }
    } else {
        // No email provided, proceed without sheet operations but mark as "successful" for flow
        sheetOperationSuccessful = true;
    }
    
    // Generate AI response - this happens regardless of email submission status,
    // but email sending and sheet recording depend on `email` being present.
    const selectedCard: OracleCard = card || drawRandomCard();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are KiaOra Oracle, an intuitive Maori healer specializing in spiritual guidance. User name: "${name || "Seeker"}" User intent/question: "${question}" Card Drawn: "${selectedCard.name}" - "${selectedCard.meaning}" Create a personalized, insightful, and supportive oracle reading integrating the user's intent and the meaning of the card, using a mystical yet reassuring tone aligned with holistic Māori healing practices. Keep your response concise (80-120 words), actionable, and warm.`;

    const result = await model.generateContent(prompt);
    const responseText = (await result.response).text() || "The oracle is silent at this moment. Please try again later.";

    // Send email only if email was provided and sheet operation was successful
    if (email && sheetOperationSuccessful) {
        const emailSentSuccessfully = await sendOracleConsultation(email, question, responseText, name);
        if (!emailSentSuccessfully) {
            // Log the error and inform the client, but still return the oracle response
            console.error(`Failed to send consultation email to ${email}. Oracle response was generated.`);
            // Optionally, you could choose to return a more specific error to the client here if email is critical
            // For now, we'll let the main response proceed but log the email failure.
            // Consider if this should be a hard failure for the user.
            // If email is critical, you might do:
            // return NextResponse.json({ error: "Oracle response generated, but failed to send email." }, { status: 500 });
        }
    }
    
    return NextResponse.json({
      response: responseText,
    });

  } catch (error: any) { // Catch any error, including those from findUserSubmission
    console.error("Oracle API error:", error);
    // Check if it's an error message we threw intentionally (e.g., from findUserSubmission)
    const errorMessage = error.message || "Failed to consult the oracle due to an unexpected server error.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}