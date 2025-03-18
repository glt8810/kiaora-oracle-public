"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OracleCard, performTraditionalShuffle } from "@/lib/oracle-cards";
import Image from "next/image";
import EmailForm from "@/components/EmailForm";
import LoadingModal from "@/components/LoadingModal";
import { toast } from "sonner";

interface CardInfo {
  name: string;
  meaning: string;
  image: string;
}

export default function ConsultationForm() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [cardInfo, setCardInfo] = useState<CardInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [selectedCard, setSelectedCard] = useState<OracleCard | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Handler for email form submission
  const handleEmailSubmit = (email: string, name: string) => {
    setShowEmailForm(false);
    document.body.classList.remove("email-form-active");

    // Now fetch the oracle response with the selected card
    if (selectedCard) {
      fetchOracleResponse(selectedCard, email, name);
    }
  };

  // Handler for canceling email submission
  const handleEmailCancel = () => {
    setShowEmailForm(false);
    document.body.classList.remove("email-form-active");
    setCardInfo(null);
    setResponse("");
    setSelectedCard(null);
    setQuestion("");
    setFeedbackMessage(
      "Your journey with the oracle awaits. When you're ready, please provide your email to receive your mystical guidance."
    );
  };

  // Function to fetch response from oracle API
  const fetchOracleResponse = async (
    selectedCard: OracleCard,
    email: string,
    name: string
  ) => {
    try {
      setLoading(true);
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          card: selectedCard,
          email,
          name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          // User has already consulted the oracle today
          toast.error("Daily Limit Reached", {
            description:
              data.error ||
              "You have already consulted the oracle today. Please return tomorrow for new guidance.",
          });
          setShowEmailForm(false);
          document.body.classList.remove("email-form-active");
          setQuestion("");
          return;
        }
        throw new Error(data.error || "Failed to consult the oracle");
      }

      setResponse(data.response);
      setQuestion(""); // Clear the question field after receiving response
    } catch (err) {
      toast.error("Error", {
        description:
          err instanceof Error ? err.message : "An unknown error occurred",
      });
      setQuestion("");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      toast.error("Please enter a question for the oracle", {
        description: "Your question will help guide the oracle's response",
      });
      return;
    }

    setLoading(true);
    setCardInfo(null);
    setResponse("");

    // Select a card directly without animation
    const shuffledDeck = performTraditionalShuffle();
    const chosenCard = shuffledDeck[0];
    setSelectedCard(chosenCard);
    setCardInfo(chosenCard);

    // Show email form
    document.body.classList.add("email-form-active");
    setShowEmailForm(true);
  };

  // Add a cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      document.body.classList.remove("email-form-active");
    };
  }, []);

  return (
    <>
      <div className="w-full max-w-2xl mx-auto">
        <Card className="bg-twilight-blue/80 border border-deep-sea-green">
          <CardHeader>
            <CardTitle className="font-seasons text-2xl text-soft-gold">
              Consult the Oracle
            </CardTitle>
            <CardDescription className="font-circe text-moonlight-silver">
              Ask your question and receive mystical guidance from our Māori
              healer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="question"
                  className="block font-circe text-moonlight-silver mb-2"
                >
                  Your Question
                </label>
                <textarea
                  id="question"
                  className="w-full p-3 bg-twilight-blue border border-deep-sea-green rounded-md text-ethereal-mist font-circe focus:outline-none focus:ring-2 focus:ring-soft-gold"
                  rows={4}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What guidance do you seek from the oracle?"
                />
              </div>
              <div className="mb-6">
                <div className="p-6 bg-mystic-purple/40 border-2 border-soft-gold/50 rounded-lg shadow-lg mb-6">
                  <h3 className="font-seasons text-xl text-soft-gold mb-2">
                    Ask & Pick a card
                  </h3>
                  <p className="font-circe text-moonlight-silver">
                    First, ask your question above. Then, select one of the
                    cards below to receive your mystical guidance from the
                    oracle.
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  {[1, 2, 3].map((index) => (
                    <button
                      key={index}
                      onClick={handleSubmit}
                      disabled={loading}
                      className="relative w-32 h-44 rounded-lg overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-soft-gold/20 to-mystic-purple opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                      <Image
                        src="/images/cards/card-back.svg"
                        alt={`Card ${index}`}
                        width={300}
                        height={450}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-soft-gold font-seasons text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Choose Card {index}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              {loading && <LoadingModal isOpen={loading} />}
              {feedbackMessage && (
                <div className="mt-4 p-3 bg-mystic-purple/40 border-2 border-soft-gold/50 rounded-md text-ethereal-mist font-circe text-center">
                  {feedbackMessage}
                </div>
              )}
            </form>
          </CardContent>

          {(response || cardInfo) && (
            <CardFooter className="flex flex-col">
              {cardInfo && (
                <div className="mb-4 w-full">
                  <h3 className="font-seasons text-xl text-soft-gold mb-2">
                    Card Drawn:
                  </h3>
                  <div className="p-4 bg-mystic-purple/70 border-2 border-soft-gold/50 rounded-md mb-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <div className="relative w-32 h-44 rounded-md overflow-hidden border-2 border-soft-gold/50">
                        <Image
                          src={cardInfo.image}
                          alt={cardInfo.name}
                          width={300}
                          height={450}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-seasons text-lg text-soft-gold mb-1">
                          {cardInfo.name}
                        </h4>
                        <p className="font-circe text-moonlight-silver">
                          {cardInfo.meaning}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {response && (
                <>
                  <h3 className="font-seasons text-2xl text-soft-gold mb-4 text-center">
                    The Oracle Speaks
                  </h3>
                  <div className="p-6 bg-mystic-purple/70 border-2 border-soft-gold rounded-lg shadow-[0_0_20px_rgba(218,165,32,0.15),0_0_40px_rgba(75,0,130,0.15)] mb-6 relative before:absolute before:inset-0 before:border before:border-mystic-purple/30 before:rounded-lg before:animate-pulse before:opacity-50 after:absolute after:inset-0 after:border after:border-soft-gold/20 after:rounded-lg after:animate-pulse after:opacity-30 after:delay-1000">
                    <div className="absolute inset-0 bg-gradient-to-br from-soft-gold/10 via-transparent to-mystic-purple/10 rounded-lg" />
                    <p className="font-quincy text-ethereal-mist text-lg leading-relaxed relative z-10">
                      {response}
                    </p>
                  </div>
                  <div className="p-4 bg-mystic-purple/20 rounded-md">
                    <p className="font-circe text-moonlight-silver text-center text-sm">
                      Your reading has been sent to your email for future
                      reference.
                    </p>
                  </div>
                </>
              )}
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Use the separated EmailForm component */}
      <EmailForm
        isOpen={showEmailForm}
        onSubmit={handleEmailSubmit}
        onCancel={handleEmailCancel}
        selectedCard={selectedCard}
      />
    </>
  );
}
