import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to save oracle consultations
export async function saveConsultation(
  question: string,
  response: string | null,
  email?: string,
  cardName?: string,
  cardMeaning?: string
) {
  // If response is null, set a fallback message
  const safeResponse = response || "No response available";

  try {
    const { data, error } = await supabase
      .from("consultations")
      .insert([
        {
          question,
          response: safeResponse,
          email: email || null,
          card_name: cardName,
          card_meaning: cardMeaning,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Error saving consultation:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to save consultation:", error);
    return null;
  }
}

// Helper function to check if an email has been used for a consultation today
export async function hasConsultedToday(email: string): Promise<boolean> {
  if (!email) return false;

  try {
    // Get the start of today in ISO format
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfToday = today.toISOString();

    // Get the end of today in ISO format
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const endOfToday = tomorrow.toISOString();

    const { error, count } = await supabase
      .from("consultations")
      .select("*", { count: "exact" })
      .eq("email", email)
      .gte("created_at", startOfToday)
      .lt("created_at", endOfToday);

    if (error) {
      console.error("Error checking consultation history:", error);
      // In case of error, allow the request to proceed
      return false;
    }

    // Return true if there are any consultations today for this email
    return count !== null && count > 0;
  } catch (error) {
    console.error("Failed to check consultation history:", error);
    // In case of error, allow the request to proceed
    return false;
  }
}
