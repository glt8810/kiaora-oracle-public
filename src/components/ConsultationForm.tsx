"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  oracleCards,
  OracleCard,
  performTraditionalShuffle,
} from "@/lib/oracle-cards";
import Image from "next/image";
import EmailForm from "@/components/EmailForm";

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
  const [error, setError] = useState("");
  const [shuffling, setShuffling] = useState(false);
  const [displayCards, setDisplayCards] = useState<OracleCard[]>([]);
  const [cardPositions, setCardPositions] = useState<
    { x: number; y: number; rotation: number; scale: number }[]
  >([]);
  const [finalCardSelected, setFinalCardSelected] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [selectedCard, setSelectedCard] = useState<OracleCard | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [animationState, setAnimationState] = useState<
    "idle" | "shuffling" | "selecting" | "revealing" | "completed"
  >("idle");

  // Use refs instead of state for animation timeouts to avoid render loops
  const shuffleAnimationIdRef = useRef<number | null>(null);
  const finalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resultTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Total animation time - reduced by half from original
  const totalShufflingTime = 2000; // 2.5 seconds total (reduced from 5 seconds)
  const finalSelectionTime = 750; // Time for final card selection (reduced from 1500ms)

  // Function to create dynamic random positions for the cards
  const getRandomPosition = (index: number, total: number) => {
    const isCenter = index === Math.floor(total / 2);

    // Apply more dynamic random positioning
    const xRange = isCenter ? 30 : 120;
    const yRange = isCenter ? 15 : 60;
    const rotRange = isCenter ? 10 : 45;

    return {
      x: Math.random() * xRange * 2 - xRange,
      y: Math.random() * yRange * 2 - yRange,
      rotation: Math.random() * rotRange * 2 - rotRange,
      scale: 0.8 + Math.random() * 0.4,
    };
  };

  // Function to create a fan layout for the final card reveal
  const createFanLayout = (index: number, total: number) => {
    if (index === 0) {
      // The selected card moves to center and scales up
      return {
        x: 0,
        y: -10,
        rotation: 0,
        scale: 1.2,
      };
    } else {
      // Other cards fan out
      const angleSpread = 140;
      const fanAngle = -angleSpread / 2 + (angleSpread / (total - 1)) * index;
      const radius = 180;

      return {
        x: radius * Math.sin((fanAngle * Math.PI) / 180),
        y: -40 + radius * (1 - Math.cos((fanAngle * Math.PI) / 180)) * 0.3,
        rotation: fanAngle,
        scale: 0.7,
      };
    }
  };

  // Log animation state changes for debugging
  useEffect(() => {
    // Animation state monitoring (no console log needed)
  }, [animationState]);

  // Simplified animation logic
  useEffect(() => {
    // Clean up all timeouts at the beginning
    const cleanupAnimations = () => {
      if (shuffleAnimationIdRef.current) {
        window.clearTimeout(shuffleAnimationIdRef.current);
        shuffleAnimationIdRef.current = null;
      }
      if (finalTimerRef.current) {
        clearTimeout(finalTimerRef.current);
        finalTimerRef.current = null;
      }
      if (resultTimerRef.current) {
        clearTimeout(resultTimerRef.current);
        resultTimerRef.current = null;
      }
    };

    // Start fresh
    cleanupAnimations();

    if (animationState === "idle") {
      return;
    }

    if (animationState === "shuffling" && displayCards.length > 0) {
      // Create continuous shuffling animation
      const animateCards = () => {
        setCardPositions(
          displayCards.map((_, i) => getRandomPosition(i, displayCards.length))
        );

        // Continue animation while shuffling
        shuffleAnimationIdRef.current = window.setTimeout(animateCards, 400);
      };

      // Start the animation
      animateCards();

      // Schedule the transition to selection phase
      finalTimerRef.current = setTimeout(() => {
        setAnimationState("selecting");
      }, totalShufflingTime - finalSelectionTime);
    }

    if (animationState === "selecting") {
      // Stop the continuous animation
      if (shuffleAnimationIdRef.current) {
        clearTimeout(shuffleAnimationIdRef.current);
        shuffleAnimationIdRef.current = null;
      }

      setFinalCardSelected(true);

      // Set the final fan layout
      setCardPositions(
        displayCards.map((_, i) => createFanLayout(i, displayCards.length))
      );

      // Schedule the reveal phase
      resultTimerRef.current = setTimeout(() => {
        setAnimationState("revealing");
      }, finalSelectionTime);
    }

    if (animationState === "revealing") {
      // This is where we select the card and show the email form
      const shuffledDeck = performTraditionalShuffle();
      const chosenCard = shuffledDeck[0];

      // Update state in sequence to avoid race conditions
      setSelectedCard(chosenCard);
      setCardInfo(chosenCard);
      setFinalCardSelected(false);
      setShuffling(false);

      // Force email form to show with a small delay
      window.setTimeout(() => {
        document.body.classList.add("email-form-active");
        setShowEmailForm(true);
        setAnimationState("completed");
      }, 100);
    }

    // Cleanup function for unmount or dependency changes
    return cleanupAnimations;
  }, [animationState, displayCards, totalShufflingTime, finalSelectionTime]);

  // Function to handle the card shuffling process
  const performCardShuffling = () => {
    // Reset all animation states
    setShowEmailForm(false);
    document.body.classList.remove("email-form-active");
    setFinalCardSelected(false);

    // Start with more cards (9) for a more dynamic feel
    const initialCards = Array(9)
      .fill(null)
      .map(() => oracleCards[Math.floor(Math.random() * oracleCards.length)]);

    setDisplayCards(initialCards);

    // Set initial random positions
    setCardPositions(
      initialCards.map((_, i) => getRandomPosition(i, initialCards.length))
    );

    // Mark shuffling state
    setShuffling(true);

    // Start the animation sequence
    setAnimationState("shuffling");
  };

  // Handler for email form submission
  const handleEmailSubmit = (email: string) => {
    setShowEmailForm(false);
    document.body.classList.remove("email-form-active");

    // Now fetch the oracle response with the selected card
    if (selectedCard) {
      fetchOracleResponse(selectedCard, email);
    }
  };

  // Handler for canceling email submission
  const handleEmailCancel = () => {
    setShowEmailForm(false);
    document.body.classList.remove("email-form-active");
    setError("");
    setLoading(false);
    setCardInfo(null);
    setResponse("");
    setSelectedCard(null);
    setAnimationState("idle");
    setFeedbackMessage(
      "Your journey with the oracle awaits. When you're ready, please provide your email to receive your mystical guidance."
    );
  };

  // Function to fetch response from oracle API
  const fetchOracleResponse = async (
    selectedCard: OracleCard,
    email: string
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
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          // User has already consulted the oracle today
          setError(
            data.error ||
              "You have already consulted the oracle today. Please return tomorrow for new guidance."
          );
          setShowEmailForm(false);
          document.body.classList.remove("email-form-active");
          return;
        }
        throw new Error(data.error || "Failed to consult the oracle");
      }

      setResponse(data.response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      setError("Please enter a question for the oracle");
      return;
    }

    setLoading(true);
    setError("");
    setCardInfo(null);
    setResponse("");
    setAnimationState("idle");

    // Start the card shuffling animation
    performCardShuffling();
  };

  // Add a cleanup effect when component unmounts
  useEffect(() => {
    // Cleanup function for component unmount
    return () => {
      if (shuffleAnimationIdRef.current) {
        window.clearTimeout(shuffleAnimationIdRef.current);
        shuffleAnimationIdRef.current = null;
      }
      if (finalTimerRef.current) {
        clearTimeout(finalTimerRef.current);
        finalTimerRef.current = null;
      }
      if (resultTimerRef.current) {
        clearTimeout(resultTimerRef.current);
        resultTimerRef.current = null;
      }
      document.body.classList.remove("email-form-active");
    };
  }, []);

  // Debug function for development (not used in production)
  // const debugShowEmailForm = () => {
  //   document.body.classList.add("email-form-active");
  //   setShowEmailForm(true);
  // };

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
              {feedbackMessage && (
                <div className="mt-4 p-3 bg-mystic-purple/40 border border-soft-gold/50 rounded-md text-ethereal-mist font-circe text-center">
                  {feedbackMessage}
                </div>
              )}
              {error && (
                <div className="mt-4 mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200 font-circe">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full relative overflow-hidden group bg-gradient-to-r from-deep-sea-green to-mystic-purple text-ethereal-mist font-seasons text-lg py-6 border border-soft-gold/30 rounded-md shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:border-soft-gold/60 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-soft-gold/50 disabled:opacity-70 disabled:cursor-not-allowed my-4"
                disabled={loading || shuffling}
              >
                {loading || shuffling ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-soft-gold"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {shuffling
                      ? `Consulting the oracle... (${animationState})`
                      : "Seeking wisdom..."}
                  </span>
                ) : (
                  <>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-soft-gold/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    <span className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2 text-soft-gold"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17.1 14.95c.412.16.9-.08.9-.5v-2.9c0-.41-.508-.65-.9-.49l-2.4 1a.5.5 0 00-.3.46v1.5c0 .19.1.36.3.45l2.4.98zM10 2c-4.42 0-8 3.58-8 8 0 3.26 1.95 6.06 4.75 7.33V15.1c-2.15-1.15-3.6-3.43-3.6-6.05 0-3.87 3.13-7 7-7s7 3.13 7 7c0 .34-.03.67-.08 1h.08v-1c0-4.42-3.58-8-8-8zm.26 12.72v2.41c0 .39.43.63.78.44l3.07-1.71a.5.5 0 00.18-.69 7.95 7.95 0 01-.68-1.2.5.5 0 00-.68-.23l-2.17 1.23a.5.5 0 00-.25.43v.32z" />
                        <path d="M10.12 8.21V7.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v.71c.72.1 1.39.46 1.97 1.05a.5.5 0 01-.04.7l-.7.71a.5.5 0 01-.7 0 2.5 2.5 0 00-1.77-.73c-.71 0-1.1.31-1.1.81 0 .42.23.65.93.95l.93.39c1.31.55 1.92 1.28 1.92 2.32 0 1.26-.95 2.05-2.43 2.21v.74a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-.71c-.85-.11-1.65-.53-2.28-1.23a.5.5 0 01.02-.71l.72-.7a.5.5 0 01.7.01 2.63 2.63 0 001.87.89c.87 0 1.18-.38 1.18-.88 0-.39-.15-.63-.95-.98l-1.04-.43C8.38 12.8 7.9 12.08 7.9 11c0-1.19.97-2 2.22-2.16z" />
                      </svg>
                      Ask a question & Pick a card
                    </span>
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          {/* Enhanced Card Shuffling Animation */}
          {shuffling && (
            <CardContent className="pt-0 relative">
              <div className="mb-2 text-center font-seasons text-soft-gold">
                {finalCardSelected
                  ? "Your card reveals itself..."
                  : "The cards are shuffling..."}
              </div>

              {/* Container for the card deck with 3D perspective */}
              <div className="relative h-64 perspective-1000 my-8">
                {/* Centered origin point for animations */}
                <div className="absolute left-1/2 top-1/2 w-0 h-0">
                  {displayCards.map((card, index) => {
                    const position = cardPositions[index] || {
                      x: 0,
                      y: 0,
                      rotation: 0,
                      scale: 1,
                    };

                    return (
                      <div
                        key={index}
                        className={`absolute w-32 h-44 transition-all ${
                          finalCardSelected ? "duration-1000" : "duration-500"
                        } 
                          ${
                            finalCardSelected && index === 0
                              ? "z-30"
                              : `z-${10 + index}`
                          }
                          shadow-lg`}
                        style={{
                          transform: `translate(-50%, -50%) 
                            translate(${position.x}px, ${position.y}px) 
                            rotate(${position.rotation}deg) 
                            scale(${position.scale})`,
                          transition: `transform ${
                            finalCardSelected ? "1s" : "0.5s"
                          } ${index * 0.03}s ease-${
                            finalCardSelected ? "out" : "in-out"
                          }`,
                        }}
                      >
                        <div
                          className={`w-full h-full relative rounded-lg overflow-hidden
                            ${
                              finalCardSelected && index === 0
                                ? "ring-2 ring-soft-gold"
                                : ""
                            }
                            transform-style-3d transition-transform`}
                        >
                          <div className="absolute inset-0 backface-hidden transform">
                            <Image
                              src="/images/cards/card-back.svg"
                              alt="Card back"
                              width={300}
                              height={450}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>

                        {/* Card glimmer effect */}
                        {finalCardSelected && index === 0 && (
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-soft-gold/30 to-transparent animate-shimmer"
                            style={{
                              backgroundSize: "200% 100%",
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          )}

          {(response || cardInfo) && (
            <CardFooter className="flex flex-col">
              {cardInfo && (
                <div className="mb-4 w-full">
                  <h3 className="font-seasons text-xl text-soft-gold mb-2">
                    Card Drawn:
                  </h3>
                  <div className="p-4 bg-mystic-purple/70 border border-soft-gold rounded-md mb-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <div className="relative w-32 h-44 rounded-md overflow-hidden">
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
                  <h3 className="font-seasons text-xl text-soft-gold mb-2">
                    The Oracle Speaks:
                  </h3>
                  <div className="p-4 bg-mystic-purple/50 border border-soft-gold/30 rounded-md">
                    <p className="font-quincy text-ethereal-mist">{response}</p>
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
