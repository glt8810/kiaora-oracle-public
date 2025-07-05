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

/**
 * Checks if a user has already made a submission today using the Google Sheet.
 */
async function hasConsultedToday(email: string): Promise<boolean> {
    try {
        const sheets = await getSheetsClient();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:C', // Check columns for Email and Timestamp
        });

        const rows = response.data.values;
        if (rows && rows.length) {
            const today = new Date().toDateString();
            return rows.some(row => {
                const rowEmail = row[0];
                const rowTimestamp = row[2];
                if (rowEmail === email && rowTimestamp) {
                    const submissionDate = new Date(rowTimestamp).toDateString();
                    return submissionDate === today;
                }
                return false;
            });
        }
        return false;
    } catch (error) {
        console.error("Error checking Google Sheet:", error);
        // Fail open - allow consultation if sheet check fails
        return false;
    }
}

/**
 * Adds a new entry to the Google Sheet.
 */
async function recordConsultation(email: string, name: string) {
    try {
        const sheets = await getSheetsClient();
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:C',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[email, name, new Date().toISOString()]],
            },
        });
    } catch (error) {
        console.error("Error writing to Google Sheet:", error);
        // Log the error but don't block the user's response
    }
}

export async function POST(request: Request) {
  try {
    const { question, card, email, name } = await request.json();

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    if (email) {
      if (await hasConsultedToday(email)) {
        return NextResponse.json({ error: "You have already consulted the oracle today. Please return tomorrow for new guidance." }, { status: 429 });
      }
    }

    const selectedCard: OracleCard = card || drawRandomCard();
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const prompt = `You are KiaOra Oracle, an intuitive Maori healer specializing in spiritual guidance. User name: "${name || "Seeker"}" User intent/question: "${question}" Card Drawn: "${selectedCard.name}" - "${selectedCard.meaning}" Create a personalized, insightful, and supportive oracle reading integrating the user's intent and the meaning of the card, using a mystical yet reassuring tone aligned with holistic Māori healing practices. Keep your response concise (80-120 words), actionable, and warm.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text() || "The oracle is silent at this moment. Please try again later.";

    // Record consultation and send email
    if (email) {
        // We use `await` here but don't let it block the response to the user.
        // The recording and emailing can happen in the background.
        recordConsultation(email, name);
        sendOracleConsultation(email, question, responseText, name);
    }
    
    return NextResponse.json({
      response: responseText,
    });

  } catch (error) {
    console.error("Oracle API error:", error);
    return NextResponse.json(
      { error: "Failed to consult the oracle. " + (error as Error).message },
      { status: 500 }
    );
  }
}