# KiaOra Oracle

A mystical web application built with Next.js, TypeScript, Shadcn UI, TailwindCSS, OpenAI, Resend, and Supabase.

## Features

- Beautiful mystical UI with custom color palette
- Custom typography with The Seasons, Circe Contrast, and Quincy fonts
- Integration with OpenAI for oracle responses
- Email notifications with Resend
- Data storage with Supabase

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
   OPENAI_API_KEY=your_openai_api_key_here

   # Resend API Key
   RESEND_API_KEY=your_resend_api_key_here

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
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
