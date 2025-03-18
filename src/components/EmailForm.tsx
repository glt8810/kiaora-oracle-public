import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";

interface EmailFormProps {
  onSubmit: (email: string, name: string) => void;
  onCancel: () => void;
  isOpen: boolean;
  selectedCard?: {
    name: string;
    meaning: string;
    image: string;
  } | null;
}

export default function EmailForm({
  onSubmit,
  onCancel,
  isOpen,
  selectedCard,
}: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState("");

  // Clear errors when re-opening form
  useEffect(() => {
    if (isOpen) {
      setEmailError("");
      setNameError("");
      setTermsError("");
    }
  }, [isOpen]);

  // Ensure body class is in sync with component visibility
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("email-form-active");
    } else {
      document.body.classList.remove("email-form-active");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Name is required
    if (!name.trim()) {
      setNameError("Please enter your name");
      return;
    }

    // Email is required
    if (!email.trim()) {
      setEmailError("Please enter your email to receive your reading");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Terms must be accepted
    if (!termsAccepted) {
      setTermsError("Please accept the terms and conditions");
      return;
    }

    onSubmit(email, name);
    // Reset fields after submission
    setEmail("");
    setName("");
    setTermsAccepted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-twilight-blue border-2 border-soft-gold rounded-lg p-4 sm:p-6 md:p-8 shadow-2xl relative">
        <h2 className="font-seasons text-xl sm:text-2xl text-soft-gold font-semibold tracking-wide drop-shadow-md text-center mb-4 sm:mb-6">
          Your Card Has Been Drawn
        </h2>

        {selectedCard && (
          <div className="mt-3 sm:mt-4 flex flex-col items-center gap-3 sm:gap-5 bg-black/20 p-3 sm:p-6 rounded-lg border border-soft-gold/30 shadow-inner">
            <div className="relative w-28 h-42 sm:w-32 sm:h-48 rounded-md overflow-hidden ring-4 ring-soft-gold/40 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Image
                src={selectedCard.image}
                alt={selectedCard.name}
                width={300}
                height={450}
                className="object-cover"
                priority
              />
            </div>
            <div className="text-center">
              <h3 className="font-seasons text-lg sm:text-xl text-soft-gold mb-1 sm:mb-2">
                {selectedCard.name}
              </h3>
              <p className="font-circe text-white text-xs sm:text-sm max-w-xs mx-auto">
                {selectedCard.meaning}
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 sm:mt-6 py-2 sm:py-3 px-3 sm:px-5 bg-deep-sea-green/30 rounded-lg border border-deep-sea-green">
          <p className="font-circe text-white text-base sm:text-lg leading-relaxed font-semibold text-center [text-shadow:_0_1px_1px_rgb(0_0_0_/_80%)]">
            Enter your email to receive your complete mystical reading
          </p>
        </div>

        <div className="mt-4 sm:mt-6">
          <div className="inline-block mb-1 sm:mb-2">
            <Label
              htmlFor="name"
              className="font-circe text-white text-base sm:text-lg font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] [text-shadow:_0_1px_1px_rgb(0_0_0_/_80%)]"
            >
              Name <span className="text-soft-gold">*</span>
            </Label>
          </div>
          <Input
            id="name"
            placeholder="Your name"
            className="mt-1 bg-twilight-blue border-2 border-soft-gold text-white text-base sm:text-lg p-3 sm:p-4
                     font-medium placeholder:text-ethereal-mist/70 focus:ring-2 
                     focus:ring-soft-gold shadow-inner w-full"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            autoFocus
          />
          {nameError && (
            <p className="mt-2 text-red-300 text-sm sm:text-base font-circe font-bold drop-shadow-sm">
              {nameError}
            </p>
          )}
        </div>

        <div className="mt-4 sm:mt-6">
          <div className="inline-block mb-1 sm:mb-2">
            <Label
              htmlFor="email"
              className="font-circe text-white text-base sm:text-lg font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] [text-shadow:_0_1px_1px_rgb(0_0_0_/_80%)]"
            >
              Email <span className="text-soft-gold">*</span>
            </Label>
          </div>
          <Input
            id="email"
            placeholder="your@email.com"
            className="mt-1 bg-twilight-blue border-2 border-soft-gold text-white text-base sm:text-lg p-3 sm:p-4
                     font-medium placeholder:text-ethereal-mist/70 focus:ring-2 
                     focus:ring-soft-gold shadow-inner w-full"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            autoFocus
          />
          {emailError && (
            <p className="mt-2 text-red-300 text-sm sm:text-base font-circe font-bold drop-shadow-sm">
              {emailError}
            </p>
          )}
          <p className="mt-2 sm:mt-3 text-white/70 text-xs sm:text-sm font-circe italic leading-relaxed drop-shadow-sm">
            We value your privacy. Your email will only be used to deliver your
            reading.
          </p>
        </div>

        <div className="mt-4 sm:mt-6">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked: boolean) => {
                setTermsAccepted(checked);
                setTermsError("");
              }}
              className="mt-1"
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="terms"
                className="font-circe text-white text-sm sm:text-base leading-relaxed"
              >
                I accept the{" "}
                <Link
                  href="/terms"
                  className="text-soft-gold hover:text-mystic-purple underline"
                >
                  terms and conditions
                </Link>
              </Label>
            </div>
          </div>
          {termsError && (
            <p className="mt-2 text-red-300 text-sm sm:text-base font-circe font-bold drop-shadow-sm">
              {termsError}
            </p>
          )}
        </div>

        <div className="mt-4 sm:mt-6 flex flex-col-reverse gap-3 sm:gap-4">
          <Button
            onClick={onCancel}
            variant="ghost"
            size="default"
            className="text-ethereal-mist text-sm
                     font-medium hover:text-soft-gold w-full
                     hover:bg-mystic-purple/10 min-h-[44px]"
          >
            Go Back
          </Button>
          <Button
            onClick={handleSubmit}
            variant="mystic"
            size="lg"
            className="font-bold text-base sm:text-lg py-4 sm:py-6 w-full
                     bg-gradient-to-r from-mystic-purple to-deep-sea-green
                     border-2 border-soft-gold/50 hover:border-soft-gold
                     hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]
                     transition-all duration-300 min-h-[44px]"
          >
            Subscribe for deeper insights
          </Button>
        </div>
      </div>
    </div>
  );
}
