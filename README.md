# KiaOra Oracle

A mystical web application built with Next.js, TypeScript, Shadcn UI, TailwindCSS, Google Gemini, Resend, and Google Sheets.

## Features

- Beautiful mystical UI with custom color palette
- Custom typography with The Seasons, Circe Contrast, and Quincy fonts
- Integration with OpenAI for oracle responses
- Email notifications with Resend
- Daily submission limit enforced using Google Sheets

## Color Palette

| Color Name | Hex Code | Usage |
| --- | --- | --- |
| **Mystic Purple** | `#4B0082` | Primary background, Oracle's robe |
| **Deep Sea Green** | `#2E8B57` | Secondary background, highlights |
| **Twilight Blue** | `#1A1F4D` | Dark elements, contrast |
| **Soft Gold** | `#DAA520` | Accents, button highlights, glowing effects |
| **Moonlight Silver** | `#D3D3D3` | Text highlights, soft glow |
| **Ethereal Mist** | `#F5F5F5` | Background texture, fog-like effects |

## Typography

| Usage | Font | Style |
| --- | --- | --- |
| Headings | The Seasons | Elegant, mystical, high-contrast serif |
| Body Text | Circe Contrast | Clean, modern sans-serif for readability |
| Alternative Body Font | Quincy | Softer serif option |

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your API keys:
   ```
   # OpenAI API Key
   GEMINI_API_KEY=your_gemini_api_key_here

   # Resend API Key
   RESEND_API_KEY=your_resend_api_key_here

   # Sender Email
   DEVELOPER_EMAIL=your_sender_email_here

   # Google Sheets Configuration
   GOOGLE_SHEET_ID=your_spreadsheet_id_here
   GOOGLE_SERVICE_ACCOUNT_JSON={"type": "service_account", ...}
   ```
4. Add your custom fonts to the `public/fonts` directory
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `src/app`: Next.js app router pages
- `src/components`: UI components
- `src/lib`: Utility functions and configurations
- `public/fonts`: Custom font files

## License

MIT
