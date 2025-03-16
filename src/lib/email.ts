import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Function to send oracle consultation via email
export async function sendOracleConsultation(
  email: string,
  question: string,
  response: string
) {
  try {
    // Check if we're in development/testing environment
    const isDevelopment =
      process.env.NODE_ENV === "development" || !process.env.NODE_ENV;

    // Get developer test email from environment variable or use a default
    const developerEmail = process.env.DEVELOPER_EMAIL || "dev@example.com";

    // Set recipient email - in development, always use developer email to avoid Resend restrictions
    const recipientEmail = isDevelopment ? developerEmail : email;

    // If in development and email doesn't match developer's email, log info but don't throw error
    if (isDevelopment && email !== developerEmail) {
      console.log(
        `[DEV MODE] Email would be sent to ${email}, redirecting to ${developerEmail} for testing`
      );
    }

    const { error } = await resend.emails.send({
      from: `KiaOra Oracle <${
        process.env.SENDER_EMAIL || "onboarding@resend.dev"
      }>`,
      to: recipientEmail,
      subject: "Your Oracle Consultation",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h1 style="color: #4B0082; text-align: center;">KiaOra Oracle</h1>
          <div style="background-color: #1A1F4D; color: #F5F5F5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #DAA520; margin-top: 0;">Your Question</h2>
            <p style="color: #D3D3D3;">${question}</p>
            
            <h2 style="color: #DAA520; margin-top: 20px;">The Oracle's Response</h2>
            <p style="color: #F5F5F5;">${response}</p>
          </div>
          <p style="text-align: center; color: #666; font-size: 14px;">
            &copy; ${new Date().getFullYear()} KiaOra Oracle | Mystical Guidance for the Modern Seeker
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return false;
    }

    console.log(
      `Email sent successfully to ${
        isDevelopment ? `${developerEmail} (redirected from ${email})` : email
      }`
    );
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
