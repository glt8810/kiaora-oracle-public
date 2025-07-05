import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { google } from "googleapis";
import fs from "fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { OracleCard, drawRandomCard } from "@/lib/oracle-cards";
import { sendOracleConsultation } from "@/lib/email";

// --- CONFIGURATION ---
const KEY_FILE_PATH = "kiaora-oracle-a36c160aed51.json"; // Your service account key file
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SUBMISSIONS_FILE = 'submissions.csv';

// Initialize the Google Gemini AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Checks if a user has already made a submission today.
 */
async function hasConsultedToday(email: string): Promise<boolean> {
  if (!fs.existsSync(SUBMISSIONS_FILE)) return false;
  const fileContent = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
  if (fileContent.trim() === '') return false;
  
  const records = parse(fileContent, { columns: true, skip_empty_lines: true });
  const userRecord = records.find((record: any) => record.Email === email);

  if (userRecord) {
    const lastSubmitted = new Date(userRecord.LastSubmitted);
    const today = new Date();
    return lastSubmitted.toDateString() === today.toDateString();
  }
  return false;
}

/**
 * Updates the submission timestamp for a user.
 */
async function updateSubmissionTime(email: string) {
  let records: any[] = [];
  if (fs.existsSync(SUBMISSIONS_FILE)) {
      const fileContent = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
      if (fileContent.trim() !== '') {
        records = parse(fileContent, { columns: true, skip_empty_lines: true });
      }
  }

  const userIndex = records.findIndex((record: any) => record.Email === email);
  const now = new Date().toISOString();

  if (userIndex !== -1) {
    records[userIndex].LastSubmitted = now;
  } else {
    records.push({ Email: email, LastSubmitted: now });
  }
  
  const csvString = stringify(records, { header: true });
  fs.writeFileSync(SUBMISSIONS_FILE, csvString);
}

/**
 * Adds a new entry to the Google Sheet.
 */
async function addToGoogleSheet(email: string, name: string) {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE_PATH,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A:C',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [[email, name, new Date().toISOString()]],
        },
    });
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
    let responseText;
    
    // --- Gemini API Call ---
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const prompt = `You are KiaOra Oracle, an intuitive Maori healer specializing in spiritual guidance. User name: "${name || "Seeker"}" User intent/question: "${question}" Card Drawn: "${selectedCard.name}" - "${selectedCard.meaning}" Create a personalized, insightful, and supportive oracle reading integrating the user's intent and the meaning of the card, using a mystical yet reassuring tone aligned with holistic Māori healing practices. Keep your response concise (80-120 words), actionable, and warm.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    responseText = response.text();
    // --- End Gemini API Call ---

    if (!responseText) {
        responseText = "The oracle is silent at this moment. Please try again later.";
    }

    // Update submission records and send email
    if (email) {
        await updateSubmissionTime(email);
        await addToGoogleSheet(email, name);
        await sendOracleConsultation(email, question, responseText, name);
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