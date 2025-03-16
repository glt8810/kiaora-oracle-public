import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ConsultationForm from "@/components/ConsultationForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-mystic-purple to-twilight-blue text-ethereal-mist">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="font-seasons text-6xl md:text-7xl lg:text-8xl mb-4 text-soft-gold">
            KiaOra Oracle
          </h1>
          <p className="font-circe text-xl md:text-2xl text-moonlight-silver max-w-2xl mx-auto">
            Seek wisdom from the mystical realms and discover your path
          </p>
        </header>

        {/* Consultation Form */}
        <section className="mb-16">
          <ConsultationForm />
        </section>

        {/* Services */}
        <section className="mb-16">
          <h2 className="font-seasons text-3xl md:text-4xl text-soft-gold text-center mb-8">
            Mystical Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-twilight-blue/80 border border-deep-sea-green">
              <CardHeader>
                <CardTitle className="font-seasons text-2xl text-soft-gold">
                  Mystical Insights
                </CardTitle>
                <CardDescription className="font-circe text-moonlight-silver">
                  Receive guidance from the oracle
                </CardDescription>
              </CardHeader>
              <CardContent className="font-quincy text-ethereal-mist">
                <p>
                  The oracle sees beyond the veil of the present, offering
                  wisdom that transcends time and space.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-deep-sea-green hover:bg-deep-sea-green/80 text-ethereal-mist">
                  Seek Guidance
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-twilight-blue/80 border border-deep-sea-green">
              <CardHeader>
                <CardTitle className="font-seasons text-2xl text-soft-gold">
                  Cosmic Readings
                </CardTitle>
                <CardDescription className="font-circe text-moonlight-silver">
                  Explore the celestial patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="font-quincy text-ethereal-mist">
                <p>
                  The stars and planets align to reveal truths about your
                  journey and the paths that lie ahead.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-deep-sea-green hover:bg-deep-sea-green/80 text-ethereal-mist">
                  Read the Stars
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-twilight-blue/80 border border-deep-sea-green">
              <CardHeader>
                <CardTitle className="font-seasons text-2xl text-soft-gold">
                  Ethereal Visions
                </CardTitle>
                <CardDescription className="font-circe text-moonlight-silver">
                  Glimpse into the unknown
                </CardDescription>
              </CardHeader>
              <CardContent className="font-quincy text-ethereal-mist">
                <p>
                  Through the mists of time, visions of possibility emerge to
                  guide your decisions and illuminate your path.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-deep-sea-green hover:bg-deep-sea-green/80 text-ethereal-mist">
                  Receive Vision
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center">
          <p className="font-circe text-moonlight-silver">
            &copy; {new Date().getFullYear()} KiaOra Oracle | Mystical Guidance
            for the Modern Seeker
          </p>
        </footer>
      </div>
    </div>
  );
}
