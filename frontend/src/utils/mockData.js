export const SPICES_DATA = [
  {
    id: 1,
    name: "Ceylon Cinnamon Quills",
    category: "Whole Spices",
    price: 24.99,
    rating: 5,
    image: "https://images.unsplash.com/photo-1599390725350-255d6100790d?q=80&w=600",
    spiceLevel: 1,
    origin: "Sri Lanka",
    description: "Authentic Grade ALBA Ceylon Cinnamon, known for its sweet aroma and delicate flavor."
  },
  {
    id: 2,
    name: "Saffron Threads (Super Negin)",
    category: "Rare Exotics",
    price: 89.99,
    rating: 5,
    image: "https://images.unsplash.com/photo-1615485242273-04287840130d?q=80&w=600",
    spiceLevel: 0,
    origin: "Iran",
    description: "The world's most expensive spice, hand-picked for maximum potency and color."
  },
  {
    id: 3,
    name: "Smoked Paprika de la Vera",
    category: "Artisanal Powders",
    price: 15.50,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600",
    spiceLevel: 2,
    origin: "Spain",
    description: "Oak-smoked peppers ground into a rich, deep red powder with a bold smoky finish."
  },
  {
    id: 4,
    name: "Black Tellicherry Peppercorns",
    category: "Whole Spices",
    price: 18.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=600",
    spiceLevel: 3,
    origin: "India",
    description: "Extra-large peppercorns with a complex, citrusy heat and intense aroma."
  },
  {
    id: 5,
    name: "Ghost Pepper Flakes",
    category: "Artisanal Powders",
    price: 22.00,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1594911771141-944a95e0c521?q=80&w=600",
    spiceLevel: 5,
    origin: "India",
    description: "Extremely hot flakes for the brave. Intense heat with fruity undertones."
  },
  {
    id: 6,
    name: "Madagascar Vanilla Beans",
    category: "Rare Exotics",
    price: 35.00,
    rating: 5,
    image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=600",
    spiceLevel: 0,
    origin: "Madagascar",
    description: "Grade A Bourbon Vanilla beans, plump and bursting with aromatic seeds."
  }
];

export const CATEGORIES = [
  { name: "Whole Spices", image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=800" },
  { name: "Artisanal Powders", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800" },
  { name: "Signature Blends", image: "https://images.unsplash.com/photo-1594911771141-944a95e0c521?q=80&w=800" },
  { name: "Rare Exotics", image: "https://images.unsplash.com/photo-1615485242273-04287840130d?q=80&w=800" }
];

export const SUBSCRIPTION_PLANS = [
  {
    id: 'starter',
    name: "The Discovery Box",
    price: 29.99,
    period: "month",
    features: ["3 Sample Packs", "Recipe Cards", "Free Shipping"],
    color: "var(--color-accent)"
  },
  {
    id: 'gourmet',
    name: "The Gourmet Selection",
    price: 49.99,
    period: "month",
    features: ["5 Full-size Spices", "Chef's Masterclass Access", "10% Member Discount"],
    color: "var(--color-primary)",
    featured: true
  },
  {
    id: 'connoisseur',
    name: "The Master Collector",
    price: 89.99,
    period: "month",
    features: ["8 Rare Spices", "Personalized Spice Sommelier", "20% Lifetime Discount"],
    color: "var(--color-secondary-dark)"
  }
];
