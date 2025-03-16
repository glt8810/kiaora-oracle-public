// Oracle cards with Māori spiritual concepts and meanings
export interface OracleCard {
  name: string;
  meaning: string;
  image: string; // Path to card image
}

export const oracleCards: OracleCard[] = [
  {
    name: "Mana",
    meaning: "Personal power and spiritual authority",
    image: "/images/cards/mana.jpg",
  },
  {
    name: "Wairua",
    meaning: "Spirit and soul connection",
    image: "/images/cards/wairua.jpg",
  },
  {
    name: "Aroha",
    meaning: "Love, compassion, and empathy",
    image: "/images/cards/aroha.jpg",
  },
  {
    name: "Kaitiakitanga",
    meaning: "Guardianship and protection of sacred energy",
    image: "/images/cards/kaitiakitanga.jpg",
  },
  {
    name: "Whakapapa",
    meaning: "Ancestral connections and lineage wisdom",
    image: "/images/cards/whakapapa.jpg",
  },
  {
    name: "Mauri",
    meaning: "Life force and vital essence",
    image: "/images/cards/mauri.jpg",
  },
  {
    name: "Tapu",
    meaning: "Sacred restrictions and spiritual boundaries",
    image: "/images/cards/tapu.jpg",
  },
  {
    name: "Manaakitanga",
    meaning: "Hospitality, kindness, and support",
    image: "/images/cards/manaakitanga.jpg",
  },
  {
    name: "Whanaungatanga",
    meaning: "Relationships and community bonds",
    image: "/images/cards/whanaungatanga.jpg",
  },
  {
    name: "Rangimarie",
    meaning: "Peace and tranquility",
    image: "/images/cards/rangimarie.jpg",
  },
  {
    name: "Ihi",
    meaning: "Spiritual power and psychic force",
    image: "/images/cards/ihi.jpg",
  },
  {
    name: "Wehi",
    meaning: "Awe and reverence for the divine",
    image: "/images/cards/wehi.jpg",
  },
  {
    name: "Tikanga",
    meaning: "Right way of doing things and proper protocols",
    image: "/images/cards/tikanga.jpg",
  },
  {
    name: "Rahui",
    meaning: "Conservation and balanced resource management",
    image: "/images/cards/rahui.jpg",
  },
  {
    name: "Whakairo",
    meaning: "Creative expression and artistic purpose",
    image: "/images/cards/whakairo.jpg",
  },
  {
    name: "Karakia",
    meaning: "Prayer and spiritual incantation",
    image: "/images/cards/karakia.jpg",
  },
  {
    name: "Tangaroa",
    meaning: "Ocean wisdom and emotional depths",
    image: "/images/cards/tangaroa.jpg",
  },
  {
    name: "Tane Mahuta",
    meaning: "Forest energy and natural growth",
    image: "/images/cards/tane-mahuta.jpg",
  },
  {
    name: "Tumatauenga",
    meaning: "Courage and strategic action",
    image: "/images/cards/tumatauenga.jpg",
  },
  {
    name: "Rongo",
    meaning: "Peace and agricultural abundance",
    image: "/images/cards/rongo.jpg",
  },
  {
    name: "Haumia",
    meaning: "Wild food energy and uncultivated potential",
    image: "/images/cards/haumia.jpg",
  },
  {
    name: "Ruaumoko",
    meaning: "Change, transformation, and renewal",
    image: "/images/cards/ruaumoko.jpg",
  },
];

// Function to perform traditional three-pile fortune telling shuffling
export function performTraditionalShuffle(): OracleCard[] {
  // Make a copy of the cards to shuffle
  let cards = [...oracleCards];

  // Step 1: Fisher-Yates modern shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  // Step 2: Traditional three-pile cut (common in tarot and fortune telling)
  const pileSize = Math.floor(cards.length / 3);
  const pile1 = cards.slice(0, pileSize);
  const pile2 = cards.slice(pileSize, pileSize * 2);
  const pile3 = cards.slice(pileSize * 2);

  // Step 3: Reassemble piles in a different order (sometimes done by querents)
  cards = [...pile3, ...pile1, ...pile2];

  // Step 4: Final cut
  const cutPoint = Math.floor(Math.random() * cards.length);
  cards = [...cards.slice(cutPoint), ...cards.slice(0, cutPoint)];

  return cards;
}

// Function to draw a random card
export function drawRandomCard(): OracleCard {
  const randomIndex = Math.floor(Math.random() * oracleCards.length);
  return oracleCards[randomIndex];
}
