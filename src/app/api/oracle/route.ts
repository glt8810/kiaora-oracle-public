import { NextResponse } from "next/server";
// Import OpenAI
import OpenAI from "openai";
import { drawRandomCard, OracleCard } from "@/lib/oracle-cards";
import { saveConsultation, hasConsultedToday } from "@/lib/supabase";
import { sendOracleConsultation } from "@/lib/email";

// Global flag to control whether to use OpenAI API (set to false to save costs)
const USE_OPENAI_API = false;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * The function POST takes a user question and card selection, creates a mystical prompt,
 * calls the OpenAI API for a response (if enabled), and returns the response.
 * @param {Request} request - The request object containing question and card info
 * @returns Response containing the Oracle's guidance
 */
export async function POST(request: Request) {
  try {
    const { question, card, email } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // If an email was provided, check if they've already consulted today
    if (email) {
      const hasAlreadyConsulted = await hasConsultedToday(email);
      if (hasAlreadyConsulted) {
        return NextResponse.json(
          {
            error:
              "You have already consulted the oracle today. Please return tomorrow for new guidance.",
          },
          { status: 429 } // Too Many Requests
        );
      }
    }

    // Use the provided card or draw one randomly as fallback
    const selectedCard: OracleCard = card || drawRandomCard();

    let response;

    if (USE_OPENAI_API) {
      // Create a mystical prompt for the oracle
      const prompt = `
        You are KiaOra Oracle, an intuitive Maori healer specializing in spiritual guidance.
        User intent/question: "${question}"
        Card Drawn: "${selectedCard.name}" - "${selectedCard.meaning}"
        Create a personalized, insightful, and supportive oracle reading integrating the user's intent and the meaning of the card, using a mystical yet reassuring tone aligned with holistic Māori healing practices.
        Keep your response concise (80-120 words), actionable, and warm.
      `;

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      response =
        completion.choices[0].message.content ||
        "The oracle is silent at this moment. Please try again later.";
    } else {
      // Use a test response when OpenAI API is disabled
      response = `Test Oracle Response: The ${selectedCard.name} card suggests ${selectedCard.meaning}. Consider this in relation to your question about "${question}". May wisdom guide your path forward.`;
    }

    // Save consultation to Supabase
    await saveConsultation(
      question,
      response,
      email,
      selectedCard.name,
      selectedCard.meaning
    );

    // Send email if an email address was provided
    if (email) {
      try {
        await sendOracleConsultation(email, question, response);
      } catch (emailError) {
        // Log the error but don't fail the whole request
        console.error("Failed to send email:", emailError);
      }
    }

    // Return just the response as the card info is already known to the frontend
    return NextResponse.json({
      response,
    });
  } catch (error) {
    console.error("Oracle API error:", error);
    return NextResponse.json(
      { error: "Failed to consult the oracle" },
      { status: 500 }
    );
  }
}
