import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Diamond,
  Headphones,
  Leaf,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { useTranslation } from "react-i18next";

/* ============================================================
   TYPES
============================================================ */

type ProductCategory =
  | "Lehenga"
  | "Sherwani"
  | "Saree"
  | "Collection";

type ProductType =
  | "lehenga"
  | "sherwani"
  | "saree"
  | "collection";

type FeatureIcon =
  | "leaf"
  | "diamond"
  | "sparkles"
  | "dress";

type FeatureKey =
  | "premiumQuality"
  | "exquisiteCraftsmanship"
  | "gracefulComfort"
  | "lightweightComfort"
  | "comfortableTailoring"
  | "timelessElegance"
  | "elegantFinish"
  | "modernElegance"
  | "regalElegance"
  | "quietLuxury"
  | "bridalComfort"
  | "modernRoyalty"
  | "contemporaryElegance"
  | "comfortableStructure"
  | "elegantComfort";

type ProductConfig = {
  titleKey: string;
  eyebrowKey: string;
  descriptionKey: string;
  longDescriptionKey: string;

  images: string[];

  number: string;

  category: ProductCategory;
  type: ProductType;

  backLabelKey: string;
  backPath: string;

  exploreLabelKey: string;
  explorePath: string;

  detailKeys: string[];

  accent: string;
  accentLight: string;
  accentDark: string;
  background: string;

  features: {
    icon: FeatureIcon;
    featureKey: FeatureKey;
  }[];
};

type AccordionKey =
  | "details"
  | "stylist"
  | "declaration";

/* ============================================================
   TRANSLATION HELPERS
============================================================ */

const productText = (
  prefix: string,
  field: string,
) => `products.${prefix}.${field}`;

const featureTitleText = (
  key: FeatureKey,
) => `product.${key}`;

const featureDescriptionText = (
  key: FeatureKey,
) => `product.descriptions.${key}`;

/* ============================================================
   SUPPORTED LANGUAGES
============================================================ */

const SUPPORTED_LANGUAGES = [
  "en",
  "ta",
  "de",
  "fr",
  "it",
] as const;

type SupportedLanguage =
  (typeof SUPPORTED_LANGUAGES)[number];

/* ============================================================
   PRODUCT NAME FALLBACKS
============================================================ */

const productNameFallbacks: Record<
  string,
  Record<string, string>
> = {
  "royal-maroon": {
    en: "Royal Maroon",
    ta: "ராயல் மெரூன்",
    de: "Königliches Maroon",
    fr: "Royal Maroon",
    it: "Royal Maroon",
  },

  "ivory-garden": {
    en: "Ivory Garden",
    ta: "ஐவரி கார்டன்",
    de: "Ivory Garden",
    fr: "Ivory Garden",
    it: "Ivory Garden",
  },

  "blush-pink": {
    en: "Blush Pink",
    ta: "பிளஷ் பிங்க்",
    de: "Blush Pink",
    fr: "Blush Pink",
    it: "Blush Pink",
  },

  "golden-tissue": {
    en: "Golden Tissue",
    ta: "கோல்டன் டிஷ்யூ",
    de: "Goldenes Tissue",
    fr: "Golden Tissue",
    it: "Golden Tissue",
  },

  "ivory-heritage": {
    en: "Ivory Heritage",
    ta: "ஐவரி ஹெரிடேஜ்",
    de: "Ivory Heritage",
    fr: "Ivory Heritage",
    it: "Ivory Heritage",
  },

  "royal-sand": {
    en: "Royal Sand",
    ta: "ராயல் சாண்ட்",
    de: "Königliches Sand",
    fr: "Royal Sand",
    it: "Royal Sand",
  },

  "midnight-embroidery": {
    en: "Midnight Embroidery",
    ta: "மிட்நைட் எம்பிராய்டரி",
    de: "Mitternachtsstickerei",
    fr: "Broderie Midnight",
    it: "Ricamo Midnight",
  },

  "champagne-classic": {
    en: "Champagne Classic",
    ta: "சாம்பெயின் கிளாசிக்",
    de: "Champagner Klassik",
    fr: "Champagne Classique",
    it: "Champagne Classico",
  },

  "regal-ivory": {
    en: "Regal Ivory",
    ta: "ரீகல் ஐவரி",
    de: "Königliches Ivory",
    fr: "Ivoire Royal",
    it: "Avorio Regale",
  },

  "mocha-textured": {
    en: "Mocha Textured",
    ta: "மோக்கா டெக்ஸ்சர்ட்",
    de: "Texturiertes Mocha",
    fr: "Mocha Texturé",
    it: "Mocha Testurizzato",
  },

  "classic-beige": {
    en: "Classic Beige",
    ta: "கிளாசிக் பெய்ஜ்",
    de: "Klassisches Beige",
    fr: "Beige Classique",
    it: "Beige Classico",
  },

  "royal-charcoal": {
    en: "Royal Charcoal",
    ta: "ராயல் சார்கோல்",
    de: "Königliches Anthrazit",
    fr: "Charbon Royal",
    it: "Antracite Regale",
  },

  "royal-red": {
    en: "Royal Red",
    ta: "ராயல் ரெட்",
    de: "Königliches Rot",
    fr: "Rouge Royal",
    it: "Rosso Regale",
  },

  "ivory-gold": {
    en: "Ivory Gold",
    ta: "ஐவரி கோல்ட்",
    de: "Ivory Gold",
    fr: "Ivoire Doré",
    it: "Avorio Dorato",
  },

  "blush-rose": {
    en: "Blush Rose",
    ta: "பிளஷ் ரோஸ்",
    de: "Blush Rose",
    fr: "Rose Poudré",
    it: "Rosa Cipria",
  },

  "emerald-grace": {
    en: "Emerald Grace",
    ta: "எமரால்ட் கிரேஸ்",
    de: "Smaragdgrüne Eleganz",
    fr: "Grâce Émeraude",
    it: "Grazia Smeraldo",
  },

  "champagne-drape": {
    en: "Champagne Drape",
    ta: "சாம்பெயின் ட்ரேப்",
    de: "Champagner-Drape",
    fr: "Drapé Champagne",
    it: "Drappeggio Champagne",
  },

  "midnight-blue": {
    en: "Midnight Blue",
    ta: "மிட்நைட் ப்ளூ",
    de: "Mitternachtsblau",
    fr: "Bleu Nuit",
    it: "Blu Notte",
  },
};

/* ============================================================
   COLLECTION FALLBACKS
============================================================ */

const collectionNameFallbacks: Record<
  string,
  Record<string, string>
> = {
  lehengas: {
    en: "Lehenga Collection",
    ta: "லெஹங்கா தொகுப்பு",
    de: "Lehenga Kollektion",
    fr: "Collection Lehenga",
    it: "Collezione Lehenga",
  },

  sherwanis: {
    en: "Sherwani Collection",
    ta: "ஷெர்வானி தொகுப்பு",
    de: "Sherwani Kollektion",
    fr: "Collection Sherwani",
    it: "Collezione Sherwani",
  },

  sarees: {
    en: "Saree Collection",
    ta: "சேலை தொகுப்பு",
    de: "Sari Kollektion",
    fr: "Collection de Saris",
    it: "Collezione Saree",
  },
};

/* ============================================================
   LEHENGA PRODUCTS
============================================================ */

const lehengaProducts: Record<
  string,
  ProductConfig
> = {
  "royal-maroon": {
    titleKey: productText("royalMaroon", "title"),
    eyebrowKey: productText("royalMaroon", "eyebrow"),
    descriptionKey: productText("royalMaroon", "description"),
    longDescriptionKey: productText(
      "royalMaroon",
      "longDescription",
    ),

    images: [
      "/images/lehenga-bridal.png",
      "/images/lehenga-bridal-2.png",
      "/images/lehenga-bridal-3.png",
    ],

    number: "01",
    category: "Lehenga",
    type: "lehenga",

    backLabelKey: "common.backToLehengas",
    backPath: "lehengas",

    exploreLabelKey: "common.exploreLehengas",
    explorePath: "lehengas",

    detailKeys: [
      productText("royalMaroon", "details.0"),
      productText("royalMaroon", "details.1"),
      productText("royalMaroon", "details.2"),
    ],

    accent: "#8F3B3B",
    accentLight: "#F5E5E2",
    accentDark: "#652727",
    background: "#FBF7F3",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "bridalComfort",
      },
      {
        icon: "dress",
        featureKey: "timelessElegance",
      },
    ],
  },

  "ivory-garden": {
    titleKey: productText("ivoryGarden", "title"),
    eyebrowKey: productText("ivoryGarden", "eyebrow"),
    descriptionKey: productText("ivoryGarden", "description"),
    longDescriptionKey: productText(
      "ivoryGarden",
      "longDescription",
    ),

    images: [
      "/images/lehenga-collection.png",
      "/images/lehenga-collection-2.png",
      "/images/lehenga-collection-3.png",
    ],

    number: "02",
    category: "Lehenga",
    type: "lehenga",

    backLabelKey: "common.backToLehengas",
    backPath: "lehengas",

    exploreLabelKey: "common.exploreLehengas",
    explorePath: "lehengas",

    detailKeys: [
      productText("ivoryGarden", "details.0"),
      productText("ivoryGarden", "details.1"),
      productText("ivoryGarden", "details.2"),
    ],

    accent: "#B38B58",
    accentLight: "#F4EBDD",
    accentDark: "#806038",
    background: "#FBF9F5",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "lightweightComfort",
      },
      {
        icon: "dress",
        featureKey: "timelessElegance",
      },
    ],
  },

  "blush-pink": {
    titleKey: productText("blushPink", "title"),
    eyebrowKey: productText("blushPink", "eyebrow"),
    descriptionKey: productText("blushPink", "description"),
    longDescriptionKey: productText(
      "blushPink",
      "longDescription",
    ),

    images: [
      "/images/lehenga-occasion.png",
      "/images/lehenga-occasion-2.png",
      "/images/lehenga-occasion-3.png",
    ],

    number: "03",
    category: "Lehenga",
    type: "lehenga",

    backLabelKey: "common.backToLehengas",
    backPath: "lehengas",

    exploreLabelKey: "common.exploreLehengas",
    explorePath: "lehengas",

    detailKeys: [
      productText("blushPink", "details.0"),
      productText("blushPink", "details.1"),
      productText("blushPink", "details.2"),
    ],

    accent: "#B56F7A",
    accentLight: "#F6E8EA",
    accentDark: "#7F4652",
    background: "#FCF8F7",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "lightweightComfort",
      },
      {
        icon: "dress",
        featureKey: "elegantFinish",
      },
    ],
  },

  "golden-tissue": {
    titleKey: productText("goldenTissue", "title"),
    eyebrowKey: productText("goldenTissue", "eyebrow"),
    descriptionKey: productText("goldenTissue", "description"),
    longDescriptionKey: productText(
      "goldenTissue",
      "longDescription",
    ),

    images: [
      "/images/lehenga-wedding.png",
      "/images/lehenga-wedding-2.png",
      "/images/lehenga-wedding-3.png",
    ],

    number: "04",
    category: "Lehenga",
    type: "lehenga",

    backLabelKey: "common.backToLehengas",
    backPath: "lehengas",

    exploreLabelKey: "common.exploreLehengas",
    explorePath: "lehengas",

    detailKeys: [
      productText("goldenTissue", "details.0"),
      productText("goldenTissue", "details.1"),
      productText("goldenTissue", "details.2"),
    ],

    accent: "#B1844E",
    accentLight: "#F3E8D8",
    accentDark: "#77562F",
    background: "#FCF8F1",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "lightweightComfort",
      },
      {
        icon: "dress",
        featureKey: "timelessElegance",
      },
    ],
  },
};

/* ============================================================
   SHERWANI PRODUCTS
============================================================ */

const sherwaniProducts: Record<
  string,
  ProductConfig
> = {
  "ivory-heritage": {
    titleKey: productText("ivoryHeritage", "title"),
    eyebrowKey: productText("ivoryHeritage", "eyebrow"),
    descriptionKey: productText(
      "ivoryHeritage",
      "description",
    ),
    longDescriptionKey: productText(
      "ivoryHeritage",
      "longDescription",
    ),

    images: [
      "/images/sherwani-1.png",
      "/images/sherwani-1-2.png",
      "/images/sherwani-1-3.png",
    ],

    number: "01",
    category: "Sherwani",
    type: "sherwani",

    backLabelKey: "common.backToSherwanis",
    backPath: "sherwanis",

    exploreLabelKey: "common.exploreSherwanis",
    explorePath: "sherwanis",

    detailKeys: [
      productText("ivoryHeritage", "details.0"),
      productText("ivoryHeritage", "details.1"),
      productText("ivoryHeritage", "details.2"),
    ],

    accent: "#A88455",
    accentLight: "#F1E9DC",
    accentDark: "#765C38",
    background: "#FBF8F2",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "comfortableTailoring",
      },
      {
        icon: "dress",
        featureKey: "timelessElegance",
      },
    ],
  },

  "royal-sand": {
    titleKey: productText("royalSand", "title"),
    eyebrowKey: productText("royalSand", "eyebrow"),
    descriptionKey: productText("royalSand", "description"),
    longDescriptionKey: productText(
      "royalSand",
      "longDescription",
    ),

    images: [
      "/images/sherwani-2.png",
      "/images/sherwani-2-2.png",
      "/images/sherwani-2-3.png",
    ],

    number: "02",
    category: "Sherwani",
    type: "sherwani",

    backLabelKey: "common.backToSherwanis",
    backPath: "sherwanis",

    exploreLabelKey: "common.exploreSherwanis",
    explorePath: "sherwanis",

    detailKeys: [
      productText("royalSand", "details.0"),
      productText("royalSand", "details.1"),
      productText("royalSand", "details.2"),
    ],

    accent: "#B1844E",
    accentLight: "#F3E8D8",
    accentDark: "#77562F",
    background: "#FCF8F1",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "lightweightComfort",
      },
      {
        icon: "dress",
        featureKey: "contemporaryElegance",
      },
    ],
  },

  "midnight-embroidery": {
    titleKey: productText(
      "midnightEmbroidery",
      "title",
    ),
    eyebrowKey: productText(
      "midnightEmbroidery",
      "eyebrow",
    ),
    descriptionKey: productText(
      "midnightEmbroidery",
      "description",
    ),
    longDescriptionKey: productText(
      "midnightEmbroidery",
      "longDescription",
    ),

    images: [
      "/images/sherwani-3.png",
      "/images/sherwani-3-2.png",
      "/images/sherwani-3-3.png",
    ],

    number: "03",
    category: "Sherwani",
    type: "sherwani",

    backLabelKey: "common.backToSherwanis",
    backPath: "sherwanis",

    exploreLabelKey: "common.exploreSherwanis",
    explorePath: "sherwanis",

    detailKeys: [
      productText(
        "midnightEmbroidery",
        "details.0",
      ),
      productText(
        "midnightEmbroidery",
        "details.1",
      ),
      productText(
        "midnightEmbroidery",
        "details.2",
      ),
    ],

    accent: "#35475A",
    accentLight: "#E8EDF2",
    accentDark: "#233140",
    background: "#F7F8F8",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "comfortableStructure",
      },
      {
        icon: "dress",
        featureKey: "modernRoyalty",
      },
    ],
  },

  "champagne-classic": {
    titleKey: productText(
      "champagneClassic",
      "title",
    ),
    eyebrowKey: productText(
      "champagneClassic",
      "eyebrow",
    ),
    descriptionKey: productText(
      "champagneClassic",
      "description",
    ),
    longDescriptionKey: productText(
      "champagneClassic",
      "longDescription",
    ),

    images: [
      "/images/sherwani-4.png",
      "/images/sherwani-4-2.png",
      "/images/sherwani-4-3.png",
    ],

    number: "04",
    category: "Sherwani",
    type: "sherwani",

    backLabelKey: "common.backToSherwanis",
    backPath: "sherwanis",

    exploreLabelKey: "common.exploreSherwanis",
    explorePath: "sherwanis",

    detailKeys: [
      productText(
        "champagneClassic",
        "details.0",
      ),
      productText(
        "champagneClassic",
        "details.1",
      ),
      productText(
        "champagneClassic",
        "details.2",
      ),
    ],

    accent: "#B18A59",
    accentLight: "#F3EBDD",
    accentDark: "#795E3D",
    background: "#FBF8F1",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "comfortableTailoring",
      },
      {
        icon: "dress",
        featureKey: "timelessElegance",
      },
    ],
  },

  "regal-ivory": {
    titleKey: productText("regalIvory", "title"),
    eyebrowKey: productText("regalIvory", "eyebrow"),
    descriptionKey: productText(
      "regalIvory",
      "description",
    ),
    longDescriptionKey: productText(
      "regalIvory",
      "longDescription",
    ),

    images: [
      "/images/sherwani-5.png",
      "/images/sherwani-5-2.png",
      "/images/sherwani-5-3.png",
    ],

    number: "05",
    category: "Sherwani",
    type: "sherwani",

    backLabelKey: "common.backToSherwanis",
    backPath: "sherwanis",

    exploreLabelKey: "common.exploreSherwanis",
    explorePath: "sherwanis",

    detailKeys: [
      productText("regalIvory", "details.0"),
      productText("regalIvory", "details.1"),
      productText("regalIvory", "details.2"),
    ],

    accent: "#A58B69",
    accentLight: "#F1EADF",
    accentDark: "#705B40",
    background: "#FBF9F4",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "lightweightComfort",
      },
      {
        icon: "dress",
        featureKey: "regalElegance",
      },
    ],
  },

  "mocha-textured": {
    titleKey: productText("mochaTextured", "title"),
    eyebrowKey: productText(
      "mochaTextured",
      "eyebrow",
    ),
    descriptionKey: productText(
      "mochaTextured",
      "description",
    ),
    longDescriptionKey: productText(
      "mochaTextured",
      "longDescription",
    ),

    images: [
      "/images/sherwani-6.png",
      "/images/sherwani-6-2.png",
      "/images/sherwani-6-3.png",
    ],

    number: "06",
    category: "Sherwani",
    type: "sherwani",

    backLabelKey: "common.backToSherwanis",
    backPath: "sherwanis",

    exploreLabelKey: "common.exploreSherwanis",
    explorePath: "sherwanis",

    detailKeys: [
      productText("mochaTextured", "details.0"),
      productText("mochaTextured", "details.1"),
      productText("mochaTextured", "details.2"),
    ],

    accent: "#85664B",
    accentLight: "#EFE5DA",
    accentDark: "#604633",
    background: "#FAF7F2",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "comfortableTailoring",
      },
      {
        icon: "dress",
        featureKey: "quietLuxury",
      },
    ],
  },

  "classic-beige": {
    titleKey: productText("classicBeige", "title"),
    eyebrowKey: productText(
      "classicBeige",
      "eyebrow",
    ),
    descriptionKey: productText(
      "classicBeige",
      "description",
    ),
    longDescriptionKey: productText(
      "classicBeige",
      "longDescription",
    ),

    images: [
      "/images/sherwani-7.png",
      "/images/sherwani-7-2.png",
      "/images/sherwani-7-3.png",
    ],

    number: "07",
    category: "Sherwani",
    type: "sherwani",

    backLabelKey: "common.backToSherwanis",
    backPath: "sherwanis",

    exploreLabelKey: "common.exploreSherwanis",
    explorePath: "sherwanis",

    detailKeys: [
      productText("classicBeige", "details.0"),
      productText("classicBeige", "details.1"),
      productText("classicBeige", "details.2"),
    ],

    accent: "#9B805C",
    accentLight: "#F0E8DC",
    accentDark: "#6D573D",
    background: "#FBF8F3",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "lightweightComfort",
      },
      {
        icon: "dress",
        featureKey: "timelessElegance",
      },
    ],
  },

  "royal-charcoal": {
    titleKey: productText(
      "royalCharcoal",
      "title",
    ),
    eyebrowKey: productText(
      "royalCharcoal",
      "eyebrow",
    ),
    descriptionKey: productText(
      "royalCharcoal",
      "description",
    ),
    longDescriptionKey: productText(
      "royalCharcoal",
      "longDescription",
    ),

    images: [
      "/images/sherwani-8.png",
      "/images/sherwani-8-2.png",
      "/images/sherwani-8-3.png",
    ],

    number: "08",
    category: "Sherwani",
    type: "sherwani",

    backLabelKey: "common.backToSherwanis",
    backPath: "sherwanis",

    exploreLabelKey: "common.exploreSherwanis",
    explorePath: "sherwanis",

    detailKeys: [
      productText("royalCharcoal", "details.0"),
      productText("royalCharcoal", "details.1"),
      productText("royalCharcoal", "details.2"),
    ],

    accent: "#4E5155",
    accentLight: "#E9EAEB",
    accentDark: "#303237",
    background: "#F7F7F7",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "comfortableTailoring",
      },
      {
        icon: "dress",
        featureKey: "modernElegance",
      },
    ],
  },
};

/* ============================================================
   SAREE PRODUCTS
============================================================ */

const sareeProducts: Record<
  string,
  ProductConfig
> = {
  "royal-red": {
    titleKey: productText("royalRed", "title"),
    eyebrowKey: productText("royalRed", "eyebrow"),
    descriptionKey: productText("royalRed", "description"),
    longDescriptionKey: productText(
      "royalRed",
      "longDescription",
    ),

    images: [
      "/images/saree-1.png",
      "/images/saree-1-2.png",
      "/images/saree-1-3.png",
    ],

    number: "01",
    category: "Saree",
    type: "saree",

    backLabelKey: "common.backToSarees",
    backPath: "sarees",

    exploreLabelKey: "common.exploreSarees",
    explorePath: "sarees",

    detailKeys: [
      productText("royalRed", "details.0"),
      productText("royalRed", "details.1"),
      productText("royalRed", "details.2"),
    ],

    accent: "#9B3030",
    accentLight: "#F5E1DF",
    accentDark: "#682323",
    background: "#FBF7F3",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "gracefulComfort",
      },
      {
        icon: "dress",
        featureKey: "timelessElegance",
      },
    ],
  },

  "ivory-gold": {
    titleKey: productText("ivoryGold", "title"),
    eyebrowKey: productText("ivoryGold", "eyebrow"),
    descriptionKey: productText(
      "ivoryGold",
      "description",
    ),
    longDescriptionKey: productText(
      "ivoryGold",
      "longDescription",
    ),

    images: [
      "/images/saree-2.png",
      "/images/saree-2-2.png",
      "/images/saree-2-3.png",
    ],

    number: "02",
    category: "Saree",
    type: "saree",

    backLabelKey: "common.backToSarees",
    backPath: "sarees",

    exploreLabelKey: "common.exploreSarees",
    explorePath: "sarees",

    detailKeys: [
      productText("ivoryGold", "details.0"),
      productText("ivoryGold", "details.1"),
      productText("ivoryGold", "details.2"),
    ],

    accent: "#B18A52",
    accentLight: "#F3EBDD",
    accentDark: "#765B34",
    background: "#FBF8F2",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "gracefulComfort",
      },
      {
        icon: "dress",
        featureKey: "timelessElegance",
      },
    ],
  },

  "blush-rose": {
    titleKey: productText("blushRose", "title"),
    eyebrowKey: productText("blushRose", "eyebrow"),
    descriptionKey: productText(
      "blushRose",
      "description",
    ),
    longDescriptionKey: productText(
      "blushRose",
      "longDescription",
    ),

    images: [
      "/images/saree-3.png",
      "/images/saree-3-2.png",
      "/images/saree-3-3.png",
    ],

    number: "03",
    category: "Saree",
    type: "saree",

    backLabelKey: "common.backToSarees",
    backPath: "sarees",

    exploreLabelKey: "common.exploreSarees",
    explorePath: "sarees",

    detailKeys: [
      productText("blushRose", "details.0"),
      productText("blushRose", "details.1"),
      productText("blushRose", "details.2"),
    ],

    accent: "#B46F7D",
    accentLight: "#F6E7EA",
    accentDark: "#7D4653",
    background: "#FCF8F7",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "gracefulComfort",
      },
      {
        icon: "dress",
        featureKey: "elegantFinish",
      },
    ],
  },

  "emerald-grace": {
    titleKey: productText(
      "emeraldGrace",
      "title",
    ),
    eyebrowKey: productText(
      "emeraldGrace",
      "eyebrow",
    ),
    descriptionKey: productText(
      "emeraldGrace",
      "description",
    ),
    longDescriptionKey: productText(
      "emeraldGrace",
      "longDescription",
    ),

    images: [
      "/images/saree-4.png",
      "/images/saree-4-2.png",
      "/images/saree-4-3.png",
    ],

    number: "04",
    category: "Saree",
    type: "saree",

    backLabelKey: "common.backToSarees",
    backPath: "sarees",

    exploreLabelKey: "common.exploreSarees",
    explorePath: "sarees",

    detailKeys: [
      productText("emeraldGrace", "details.0"),
      productText("emeraldGrace", "details.1"),
      productText("emeraldGrace", "details.2"),
    ],

    accent: "#55715D",
    accentLight: "#E8EFEA",
    accentDark: "#354C3C",
    background: "#F8FAF7",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "gracefulComfort",
      },
      {
        icon: "dress",
        featureKey: "timelessElegance",
      },
    ],
  },

  "champagne-drape": {
    titleKey: productText(
      "champagneDrape",
      "title",
    ),
    eyebrowKey: productText(
      "champagneDrape",
      "eyebrow",
    ),
    descriptionKey: productText(
      "champagneDrape",
      "description",
    ),
    longDescriptionKey: productText(
      "champagneDrape",
      "longDescription",
    ),

    images: [
      "/images/saree-5.png",
      "/images/saree-5-2.png",
      "/images/saree-5-3.png",
    ],

    number: "05",
    category: "Saree",
    type: "saree",

    backLabelKey: "common.backToSarees",
    backPath: "sarees",

    exploreLabelKey: "common.exploreSarees",
    explorePath: "sarees",

    detailKeys: [
      productText(
        "champagneDrape",
        "details.0",
      ),
      productText(
        "champagneDrape",
        "details.1",
      ),
      productText(
        "champagneDrape",
        "details.2",
      ),
    ],

    accent: "#AE8756",
    accentLight: "#F3EADD",
    accentDark: "#765B3D",
    background: "#FBF8F2",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "gracefulComfort",
      },
      {
        icon: "dress",
        featureKey: "quietLuxury",
      },
    ],
  },

  "midnight-blue": {
    titleKey: productText(
      "midnightBlue",
      "title",
    ),
    eyebrowKey: productText(
      "midnightBlue",
      "eyebrow",
    ),
    descriptionKey: productText(
      "midnightBlue",
      "description",
    ),
    longDescriptionKey: productText(
      "midnightBlue",
      "longDescription",
    ),

    images: [
      "/images/saree-6.png",
      "/images/saree-6-2.png",
      "/images/saree-6-3.png",
    ],

    number: "06",
    category: "Saree",
    type: "saree",

    backLabelKey: "common.backToSarees",
    backPath: "sarees",

    exploreLabelKey: "common.exploreSarees",
    explorePath: "sarees",

    detailKeys: [
      productText(
        "midnightBlue",
        "details.0",
      ),
      productText(
        "midnightBlue",
        "details.1",
      ),
      productText(
        "midnightBlue",
        "details.2",
      ),
    ],

    accent: "#46566C",
    accentLight: "#E8EDF2",
    accentDark: "#2D3A4C",
    background: "#F7F8F9",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "gracefulComfort",
      },
      {
        icon: "dress",
        featureKey: "modernElegance",
      },
    ],
  },
};

/* ============================================================
   COLLECTION LANDING DATA
============================================================ */

const collections: Record<
  string,
  ProductConfig
> = {
  lehengas: {
    titleKey: "collections.lehengas.title",
    eyebrowKey: "collections.lehengas.eyebrow",
    descriptionKey: "collections.lehengas.description",
    longDescriptionKey:
      "collections.lehengas.longDescription",

    images: [
      "/images/lehenga-collection.png",
    ],

    number: "01",

    category: "Collection",
    type: "collection",

    backLabelKey:
      "common.backToCollections",

    backPath: "collections",

    exploreLabelKey:
      "common.exploreLehengas",

    explorePath: "lehengas",

    detailKeys: [
      "collections.lehengas.details.0",
      "collections.lehengas.details.1",
      "collections.lehengas.details.2",
    ],

    accent: "#8F3B3B",
    accentLight: "#F5E5E2",
    accentDark: "#652727",
    background: "#FBF7F3",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "elegantComfort",
      },
      {
        icon: "dress",
        featureKey: "timelessElegance",
      },
    ],
  },

  sherwanis: {
    titleKey: "collections.sherwanis.title",
    eyebrowKey: "collections.sherwanis.eyebrow",
    descriptionKey:
      "collections.sherwanis.description",
    longDescriptionKey:
      "collections.sherwanis.longDescription",

    images: [
      "/images/sherwani-collection.png",
    ],

    number: "02",

    category: "Collection",
    type: "collection",

    backLabelKey:
      "common.backToCollections",

    backPath: "collections",

    exploreLabelKey:
      "common.exploreSherwanis",

    explorePath: "sherwanis",

    detailKeys: [
      "collections.sherwanis.details.0",
      "collections.sherwanis.details.1",
      "collections.sherwanis.details.2",
    ],

    accent: "#A88455",
    accentLight: "#F1E9DC",
    accentDark: "#765C38",
    background: "#FBF8F2",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "comfortableTailoring",
      },
      {
        icon: "dress",
        featureKey: "timelessElegance",
      },
    ],
  },

  sarees: {
    titleKey: "collections.sarees.title",
    eyebrowKey: "collections.sarees.eyebrow",
    descriptionKey: "collections.sarees.description",
    longDescriptionKey:
      "collections.sarees.longDescription",

    images: [
      "/images/saree-collection.png",
    ],

    number: "03",

    category: "Collection",
    type: "collection",

    backLabelKey:
      "common.backToCollections",

    backPath: "collections",

    exploreLabelKey:
      "common.exploreSarees",

    explorePath: "sarees",

    detailKeys: [
      "collections.sarees.details.0",
      "collections.sarees.details.1",
      "collections.sarees.details.2",
    ],

    accent: "#9B3030",
    accentLight: "#F5E1DF",
    accentDark: "#682323",
    background: "#FBF7F3",

    features: [
      { icon: "leaf", featureKey: "premiumQuality" },
      {
        icon: "diamond",
        featureKey: "exquisiteCraftsmanship",
      },
      {
        icon: "sparkles",
        featureKey: "gracefulComfort",
      },
      {
        icon: "dress",
        featureKey: "timelessElegance",
      },
    ],
  },
};

/* ============================================================
   FEATURE ICON
============================================================ */

function FeatureIcon({
  type,
  color,
}: {
  type: FeatureIcon;
  color: string;
}) {
  if (type === "leaf") {
    return (
      <Leaf
        size={30}
        strokeWidth={1.1}
        color={color}
      />
    );
  }

  if (type === "diamond") {
    return (
      <Diamond
        size={30}
        strokeWidth={1.1}
        color={color}
      />
    );
  }

  if (type === "sparkles") {
    return (
      <Sparkles
        size={30}
        strokeWidth={1.1}
        color={color}
      />
    );
  }

  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M11 5.5C11 8.2 13.2 10 16 10C18.8 10 21 8.2 21 5.5"
        stroke={color}
        strokeWidth="1.15"
      />

      <path
        d="M11 6H8.5L6.5 12.5L12 16L10.5 28H21.5L20 16L25.5 12.5L23.5 6H21"
        stroke={color}
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ============================================================
   ACCORDION
============================================================ */

function AccordionRow({
  title,
  icon,
  open,
  onClick,
  children,
}: {
  title: string;
  icon: ReactNode;
  open: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-black/7 last:border-b-0">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between px-5 py-5 text-left transition-colors duration-300 hover:bg-black/2"
        aria-expanded={open}
      >
        <span className="flex items-center gap-4">
          <span className="flex h-8 w-8 items-center justify-center">
            {icon}
          </span>

          <span className="text-[12px] font-medium uppercase tracking-[0.13em]">
            {title}
          </span>
        </span>

        {open ? (
          <ChevronUp
            size={18}
            strokeWidth={1}
          />
        ) : (
          <Plus
            size={18}
            strokeWidth={1}
          />
        )}
      </button>

      <div
        className={`grid transition-all duration-500 ${
          open
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pl-17 text-[12px] leading-6 text-black/55">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   INSTAGRAM ICON
============================================================ */

function InstagramIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <circle
        cx="17.4"
        cy="6.6"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}

/* ============================================================
   WHATSAPP ICON
============================================================ */

function WhatsAppIcon() {
  return (
    <svg
      width="29"
      height="29"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 11.5C20 16.2 16.2 20 11.5 20C10 20 8.6 19.6 7.3 18.9L4 20L5.1 16.8C4.4 15.5 4 14 4 12.5C4 7.8 7.8 4 12.5 4C17.2 4 20 7.8 20 11.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M8.5 9.5C8.8 12 10.5 13.8 13.2 15C14 15.3 14.8 15.2 15.3 14.5L16 13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

function CollectionDetailPage() {
  const { slug } = useParams<{
    slug: string;
  }>();

  const location = useLocation();
  const navigate = useNavigate();

  const { t, i18n } =
    useTranslation();

  /* ==========================================================
     LANGUAGE
  ========================================================== */

  const pathLanguage =
    location.pathname.split("/")[1]?.toLowerCase() ||
    "";

  const i18nLanguage =
    (
      i18n.language ||
      "en"
    )
      .split("-")[0]
      .toLowerCase();

  const language: SupportedLanguage =
    SUPPORTED_LANGUAGES.includes(
      pathLanguage as SupportedLanguage,
    )
      ? (pathLanguage as SupportedLanguage)
      : SUPPORTED_LANGUAGES.includes(
            i18nLanguage as SupportedLanguage,
          )
        ? (i18nLanguage as SupportedLanguage)
        : "en";

  const currentLanguage =
    language;

  /* ==========================================================
     ROUTE INFORMATION
  ========================================================== */

  const isLehengaProduct =
    location.pathname.includes(
      "/lehengas/",
    );

  const isSherwaniProduct =
    location.pathname.includes(
      "/sherwanis/",
    );

  const isSareeProduct =
    location.pathname.includes(
      "/sarees/",
    );

  const isCollectionPage =
    location.pathname.includes(
      "/collections/",
    );

  /* ==========================================================
     STATE
  ========================================================== */

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [zoomOpen, setZoomOpen] =
    useState(false);

  const [openAccordion, setOpenAccordion] =
    useState<AccordionKey | null>(
      "details",
    );

  /* ==========================================================
     FIND CURRENT PRODUCT
  ========================================================== */

  let detail: ProductConfig | null =
    null;

  if (isLehengaProduct && slug) {
    detail =
      lehengaProducts[slug] ??
      null;
  } else if (
    isSherwaniProduct &&
    slug
  ) {
    detail =
      sherwaniProducts[slug] ??
      null;
  } else if (
    isSareeProduct &&
    slug
  ) {
    detail =
      sareeProducts[slug] ??
      null;
  } else if (
    isCollectionPage &&
    slug
  ) {
    detail =
      collections[slug] ??
      null;
  }

  /* ==========================================================
     TRANSLATION VALIDATION
  ========================================================== */

  const isUsableTranslation = (
    value: unknown,
  ): value is string => {
    if (
      typeof value !== "string"
    ) {
      return false;
    }

    const trimmed =
      value.trim();

    if (!trimmed) {
      return false;
    }

    const rawKeyPrefixes = [
      "products.",
      "collections.",
      "common.",
      "product.",
    ];

    if (
      rawKeyPrefixes.some(
        (prefix) =>
          trimmed.startsWith(
            prefix,
          ),
      )
    ) {
      return false;
    }

    return true;
  };

  /* ==========================================================
     SAFE TRANSLATION
  ========================================================== */

  const getTranslationValue = (
    key: string,
    lng: string,
  ): unknown => {
    try {
      return t(key, {
        lng,
        defaultValue: "",
      });
    } catch {
      return "";
    }
  };

  const translateString = (
    key: string,
    fallback = "",
  ): string => {
    const languagesToTry =
      Array.from(
        new Set([
          currentLanguage,
          i18nLanguage,
          "en",
        ]),
      );

    for (const lng of languagesToTry) {
      const value =
        getTranslationValue(
          key,
          lng,
        );

      if (
        isUsableTranslation(
          value,
        )
      ) {
        return value;
      }
    }

    return fallback;
  };

  const translateFromKeys = (
    keys: string[],
    fallback = "",
  ): string => {
    for (const key of keys) {
      const translated =
        translateString(
          key,
          "",
        );

      if (translated) {
        return translated;
      }
    }

    return fallback;
  };

  /* ==========================================================
     LANGUAGE-SPECIFIC UI LABELS
     
     These are intentionally handled here so that an English
     value accidentally left inside fr.json / it.json / ta.json
     cannot appear on the website.
  ========================================================== */

  const uiLabels: Record<
    SupportedLanguage,
    {
      visitInstagram: string;
      shareProduct: string;
      exploreLehengas: string;
      exploreSherwanis: string;
      exploreSarees: string;
      exploreCollection: string;
      productDetails: string;
      contactStylist: string;
      stylistDescription: string;
      bookAppointment: string;
      productDeclaration: string;
      productDeclarationText: string;
      chatWhatsapp: string;
      category: string;
      reference: string;
      collection: string;
      backToLehengas: string;
      backToSherwanis: string;
      backToSarees: string;
      backToCollections: string;
      backToCollection: string;
      viewImage: string;
      nextImage: string;
      previousImage: string;
      zoomImage: string;
      imagePreview: string;
      close: string;
      pieceNotFound: string;
      requestedPieceNotFound: string;
      instagram: string;
      whatsappMessage: string;
    }
  > = {
    en: {
      visitInstagram: "Visit Our Instagram",
      shareProduct: "Visit Our Instagram",
      exploreLehengas: "Explore Lehengas",
      exploreSherwanis: "Explore Sherwanis",
      exploreSarees: "Explore Sarees",
      exploreCollection: "Explore Collection",
      productDetails: "Product Details",
      contactStylist: "Contact Our Stylist",
      stylistDescription:
        "Our stylist team can help you with sizing, styling, colour coordination and appointment availability.",
      bookAppointment: "Book an Appointment",
      productDeclaration: "Product Information",
      productDeclarationText:
        "Each Muhurtham piece is presented as a considered occasionwear creation. Variations in embroidery, texture and finish may occur as part of the craftsmanship.",
      chatWhatsapp: "Chat with us on WhatsApp",
      category: "Category",
      reference: "Reference",
      collection: "Collection",
      backToLehengas: "Back to Lehengas",
      backToSherwanis: "Back to Sherwanis",
      backToSarees: "Back to Sarees",
      backToCollections: "Back to Collections",
      backToCollection: "Back to Collection",
      viewImage: "View Image",
      nextImage: "Next Image",
      previousImage: "Previous Image",
      zoomImage: "Zoom Image",
      imagePreview: "Image Preview",
      close: "Close",
      pieceNotFound: "Piece Not Found",
      requestedPieceNotFound:
        "The requested collection piece could not be found.",
      instagram: "Instagram",
      whatsappMessage:
        "Hello Muhurtham Collection, I am interested in this piece.",
    },

    ta: {
      visitInstagram:
        "எங்கள் Instagram-ஐப் பார்வையிடுங்கள்",
      shareProduct:
        "எங்கள் Instagram-ஐப் பார்வையிடுங்கள்",
      exploreLehengas:
        "லெஹங்காக்களைப் பார்வையிடுங்கள்",
      exploreSherwanis:
        "ஷெர்வானிகளைப் பார்வையிடுங்கள்",
      exploreSarees:
        "சேலைகளைப் பார்வையிடுங்கள்",
      exploreCollection:
        "தொகுப்பைப் பார்வையிடுங்கள்",
      productDetails:
        "தயாரிப்பு விவரங்கள்",
      contactStylist:
        "எங்கள் ஸ்டைலிஸ்ட்டைத் தொடர்புகொள்ளுங்கள்",
      stylistDescription:
        "அளவு, ஸ்டைலிங், நிற ஒருங்கிணைப்பு மற்றும் சந்திப்பு கிடைப்பது குறித்து எங்கள் ஸ்டைலிஸ்ட் குழு உங்களுக்கு உதவ முடியும்.",
      bookAppointment:
        "சந்திப்பை முன்பதிவு செய்யுங்கள்",
      productDeclaration:
        "தயாரிப்பு தகவல்",
      productDeclarationText:
        "ஒவ்வொரு Muhurtham ஆடையும் கவனமாக உருவாக்கப்பட்ட விழாக்கால ஆடை வடிவமைப்பாக வழங்கப்படுகிறது. கைவினைத்திறனின் இயல்பான பகுதியாக எம்பிராய்டரி, துணியின் அமைப்பு மற்றும் இறுதித் தோற்றத்தில் சிறிய வேறுபாடுகள் இருக்கலாம்.",
      chatWhatsapp:
        "WhatsApp மூலம் எங்களைத் தொடர்புகொள்ளுங்கள்",
      category: "வகை",
      reference: "குறிப்பு",
      collection: "தொகுப்பு",
      backToLehengas:
        "லெஹங்காக்களுக்குத் திரும்பவும்",
      backToSherwanis:
        "ஷெர்வானிகளுக்குத் திரும்பவும்",
      backToSarees:
        "சேலைகளுக்குத் திரும்பவும்",
      backToCollections:
        "தொகுப்புகளுக்குத் திரும்பவும்",
      backToCollection:
        "தொகுப்புக்குத் திரும்பவும்",
      viewImage:
        "படத்தைப் பார்க்கவும்",
      nextImage:
        "அடுத்த படம்",
      previousImage:
        "முந்தைய படம்",
      zoomImage:
        "படத்தை பெரிதாக்கவும்",
      imagePreview:
        "பட முன்னோட்டம்",
      close:
        "மூடவும்",
      pieceNotFound:
        "தயாரிப்பு கிடைக்கவில்லை",
      requestedPieceNotFound:
        "நீங்கள் கோரிய தொகுப்பு தயாரிப்பைக் கண்டறிய முடியவில்லை.",
      instagram:
        "Instagram",
      whatsappMessage:
        "வணக்கம் Muhurtham Collection, இந்த ஆடையில் எனக்கு ஆர்வம் உள்ளது. மேலும் விவரங்களைத் தெரிவிக்கவும்.",
    },

    de: {
      visitInstagram:
        "Besuchen Sie unser Instagram",
      shareProduct:
        "Besuchen Sie unser Instagram",
      exploreLehengas:
        "Lehengas entdecken",
      exploreSherwanis:
        "Sherwanis entdecken",
      exploreSarees:
        "Saris entdecken",
      exploreCollection:
        "Kollektion entdecken",
      productDetails:
        "Produktdetails",
      contactStylist:
        "Kontaktieren Sie unseren Stylisten",
      stylistDescription:
        "Unser Stylisten-Team hilft Ihnen gerne bei Größe, Styling, Farbabstimmung und Terminverfügbarkeit.",
      bookAppointment:
        "Termin vereinbaren",
      productDeclaration:
        "Produktinformationen",
      productDeclarationText:
        "Jedes Muhurtham-Stück wird als sorgfältig gestaltete Festmode präsentiert. Unterschiede bei Stickerei, Textur und Verarbeitung können als natürlicher Teil der Handwerkskunst auftreten.",
      chatWhatsapp:
        "Kontaktieren Sie uns über WhatsApp",
      category: "Kategorie",
      reference: "Referenz",
      collection: "Kollektion",
      backToLehengas:
        "Zurück zu Lehengas",
      backToSherwanis:
        "Zurück zu Sherwanis",
      backToSarees:
        "Zurück zu Saris",
      backToCollections:
        "Zurück zu Kollektionen",
      backToCollection:
        "Zurück zur Kollektion",
      viewImage:
        "Bild ansehen",
      nextImage:
        "Nächstes Bild",
      previousImage:
        "Vorheriges Bild",
      zoomImage:
        "Bild vergrößern",
      imagePreview:
        "Bildvorschau",
      close:
        "Schließen",
      pieceNotFound:
        "Stück nicht gefunden",
      requestedPieceNotFound:
        "Das angeforderte Stück konnte nicht gefunden werden.",
      instagram:
        "Instagram",
      whatsappMessage:
        "Hallo Muhurtham Collection, ich interessiere mich für dieses Stück.",
    },

    fr: {
      visitInstagram:
        "Visitez notre Instagram",
      shareProduct:
        "Visitez notre Instagram",
      exploreLehengas:
        "Découvrir les lehengas",
      exploreSherwanis:
        "Découvrir les sherwanis",
      exploreSarees:
        "Découvrir les saris",
      exploreCollection:
        "Découvrir la collection",
      productDetails:
        "Détails du produit",
      contactStylist:
        "Contactez notre styliste",
      stylistDescription:
        "Notre équipe de stylistes peut vous accompagner pour les tailles, le style, l’harmonie des couleurs et la disponibilité des rendez-vous.",
      bookAppointment:
        "Prendre rendez-vous",
      productDeclaration:
        "Informations sur le produit",
      productDeclarationText:
        "Chaque pièce Muhurtham est présentée comme une création de cérémonie soigneusement pensée. De légères variations dans les broderies, les textures et les finitions peuvent apparaître naturellement dans le travail artisanal.",
      chatWhatsapp:
        "Contactez-nous sur WhatsApp",
      category: "Catégorie",
      reference: "Référence",
      collection: "Collection",
      backToLehengas:
        "Retour aux lehengas",
      backToSherwanis:
        "Retour aux sherwanis",
      backToSarees:
        "Retour aux saris",
      backToCollections:
        "Retour aux collections",
      backToCollection:
        "Retour à la collection",
      viewImage:
        "Voir l’image",
      nextImage:
        "Image suivante",
      previousImage:
        "Image précédente",
      zoomImage:
        "Agrandir l’image",
      imagePreview:
        "Aperçu de l’image",
      close:
        "Fermer",
      pieceNotFound:
        "Pièce introuvable",
      requestedPieceNotFound:
        "La pièce demandée est introuvable.",
      instagram:
        "Instagram",
      whatsappMessage:
        "Bonjour Muhurtham Collection, cette pièce m’intéresse.",
    },

    it: {
      visitInstagram:
        "Visita il nostro Instagram",
      shareProduct:
        "Visita il nostro Instagram",
      exploreLehengas:
        "Scopri i lehenga",
      exploreSherwanis:
        "Scopri gli sherwani",
      exploreSarees:
        "Scopri i sari",
      exploreCollection:
        "Scopri la collezione",
      productDetails:
        "Dettagli del prodotto",
      contactStylist:
        "Contatta il nostro stylist",
      stylistDescription:
        "Il nostro team di stylist può aiutarti con taglie, stile, coordinamento dei colori e disponibilità degli appuntamenti.",
      bookAppointment:
        "Prenota un appuntamento",
      productDeclaration:
        "Informazioni sul prodotto",
      productDeclarationText:
        "Ogni capo Muhurtham è presentato come una creazione da cerimonia attentamente curata. Piccole variazioni nella ricamatura, nella texture e nella finitura possono verificarsi naturalmente come parte dell’artigianalità.",
      chatWhatsapp:
        "Contattaci su WhatsApp",
      category: "Categoria",
      reference: "Riferimento",
      collection: "Collezione",
      backToLehengas:
        "Torna ai lehenga",
      backToSherwanis:
        "Torna agli sherwani",
      backToSarees:
        "Torna ai sari",
      backToCollections:
        "Torna alle collezioni",
      backToCollection:
        "Torna alla collezione",
      viewImage:
        "Visualizza immagine",
      nextImage:
        "Immagine successiva",
      previousImage:
        "Immagine precedente",
      zoomImage:
        "Ingrandisci immagine",
      imagePreview:
        "Anteprima immagine",
      close:
        "Chiudi",
      pieceNotFound:
        "Articolo non trovato",
      requestedPieceNotFound:
        "L'articolo richiesto non è stato trovato.",
      instagram:
        "Instagram",
      whatsappMessage:
        "Ciao Muhurtham Collection, sono interessato a questo capo.",
    },
  };

  const labels =
    uiLabels[currentLanguage];

  /* ==========================================================
     PRODUCT NAME
  ========================================================== */

  const getProductName = (
    productSlug: string,
    titleKey: string,
  ): string => {
    const translated =
      translateString(
        titleKey,
        "",
      );

    if (translated) {
      return translated;
    }

    const fallback =
      productNameFallbacks[
        productSlug
      ];

    if (fallback) {
      return (
        fallback[currentLanguage] ||
        fallback.en ||
        productSlug
      );
    }

    return productSlug
      .split("-")
      .map(
        (word) =>
          word
            .charAt(0)
            .toUpperCase() +
          word.slice(1),
      )
      .join(" ");
  };

  /* ==========================================================
     COLLECTION NAME
  ========================================================== */

  const getCollectionName = (
    collectionSlug: string,
    titleKey: string,
  ): string => {
    const translated =
      translateString(
        titleKey,
        "",
      );

    if (translated) {
      return translated;
    }

    const fallback =
      collectionNameFallbacks[
        collectionSlug
      ];

    if (fallback) {
      return (
        fallback[currentLanguage] ||
        fallback.en ||
        "Collection"
      );
    }

    return "Collection";
  };

  /* ==========================================================
     NOT FOUND
  ========================================================== */

  if (!detail) {
    return (
      <main className="min-h-screen bg-ivory text-ink">
        <div className="page-container flex min-h-[70vh] items-center justify-center px-6 text-center">
          <div>
            <p className="eyebrow text-brown">
              {translateFromKeys(
                [
                  "brand.name",
                  "common.brandName",
                ],
                "Muhurtham Collection",
              )}
            </p>

            <h1 className="luxury-heading mt-5 text-5xl">
              {labels.pieceNotFound}
            </h1>

            <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-black/55">
              {labels.requestedPieceNotFound}
            </p>

            <button
              type="button"
              onClick={() => {
                if (
                  isSherwaniProduct
                ) {
                  navigate(
                    `/${language}/sherwanis`,
                  );
                  return;
                }

                if (
                  isSareeProduct
                ) {
                  navigate(
                    `/${language}/sarees`,
                  );
                  return;
                }

                if (
                  isCollectionPage
                ) {
                  navigate(
                    `/${language}/collections`,
                  );
                  return;
                }

                navigate(
                  `/${language}/lehengas`,
                );
              }}
              className="mt-8 border border-ink px-7 py-4 text-[9px] uppercase tracking-[0.22em] transition-all duration-300 hover:bg-ink hover:text-white"
            >
              {labels.backToCollection}
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     PRODUCT TITLE
  ========================================================== */

  const title =
    detail.type === "collection" &&
    slug
      ? getCollectionName(
          slug,
          detail.titleKey,
        )
      : getProductName(
          slug || "",
          detail.titleKey,
        );

  /* ==========================================================
     TRANSLATED CONTENT
  ========================================================== */

  const eyebrow =
    translateString(
      detail.eyebrowKey,
      detail.category,
    );

  const description =
    translateString(
      detail.descriptionKey,
      "",
    );

  const longDescription =
    translateString(
      detail.longDescriptionKey,
      description,
    );

  /* ==========================================================
     CATEGORY
  ========================================================== */

  const translatedCategory =
    translateFromKeys(
      [
        `common.categories.${detail.category.toLowerCase()}`,
        `categories.${detail.category.toLowerCase()}`,
      ],
      detail.category,
    );

  /* ==========================================================
     FIXED LOCALIZED LABELS
  ========================================================== */

  const productDetailsLabel =
    labels.productDetails;

  const contactStylistLabel =
    labels.contactStylist;

  const stylistDescription =
    labels.stylistDescription;

  const bookAppointmentLabel =
    labels.bookAppointment;

  const productDeclarationLabel =
    labels.productDeclaration;

  const productDeclarationText =
    labels.productDeclarationText;

  /* ==========================================================
     EXPLORE LABEL
     
     IMPORTANT:
     Do NOT use translateString() here because an English
     value in the JSON can override the fallback.
  ========================================================== */

  const getExploreLabel = (): string => {
    if (
      detail?.category ===
      "Lehenga"
    ) {
      return labels.exploreLehengas;
    }

    if (
      detail?.category ===
      "Sherwani"
    ) {
      return labels.exploreSherwanis;
    }

    if (
      detail?.category ===
      "Saree"
    ) {
      return labels.exploreSarees;
    }

    return labels.exploreCollection;
  };

  const exploreLabel =
    getExploreLabel();

  /* ==========================================================
     BACK LABEL
  ========================================================== */

  const getBackLabel = (): string => {
    if (
      detail?.category ===
      "Lehenga"
    ) {
      return labels.backToLehengas;
    }

    if (
      detail?.category ===
      "Sherwani"
    ) {
      return labels.backToSherwanis;
    }

    if (
      detail?.category ===
      "Saree"
    ) {
      return labels.backToSarees;
    }

    return labels.backToCollections;
  };

  const backLabel =
    getBackLabel();

  /* ==========================================================
     DETAILS
  ========================================================== */

  const translatedDetails =
    detail.detailKeys.map(
      (key) =>
        translateString(
          key,
          "",
        ),
    );

  /* ==========================================================
     IMAGE SAFETY
  ========================================================== */

  const imageCount =
    detail.images.length;

  const safeSelectedImage =
    imageCount > 0
      ? Math.min(
          Math.max(
            selectedImage,
            0,
          ),
          imageCount - 1,
        )
      : 0;

  const currentImage =
    detail.images[
      safeSelectedImage
    ];

  /* ==========================================================
     IMAGE NAVIGATION
  ========================================================== */

  const nextImage = () => {
    if (imageCount <= 1) {
      return;
    }

    setSelectedImage(
      (current) =>
        (current + 1) %
        imageCount,
    );
  };

  const previousImage = () => {
    if (imageCount <= 1) {
      return;
    }

    setSelectedImage(
      (current) =>
        (current -
          1 +
          imageCount) %
        imageCount,
    );
  };

  /* ==========================================================
     ACCORDION
  ========================================================== */

  const toggleAccordion = (
    key: AccordionKey,
  ) => {
    setOpenAccordion(
      (current) =>
        current === key
          ? null
          : key,
    );
  };

  /* ==========================================================
     BACK PATH
  ========================================================== */

  const getBackPath = () => {
    if (
      detail.category ===
      "Lehenga"
    ) {
      return `/${language}/lehengas`;
    }

    if (
      detail.category ===
      "Sherwani"
    ) {
      return `/${language}/sherwanis`;
    }

    if (
      detail.category ===
      "Saree"
    ) {
      return `/${language}/sarees`;
    }

    return `/${language}/collections`;
  };

  /* ==========================================================
     WHATSAPP
  ========================================================== */

  const whatsappMessage =
    encodeURIComponent(
      `${labels.whatsappMessage} "${title}".`,
    );

  const whatsappUrl =
    `https://wa.me/41799303237?text=${whatsappMessage}`;

  /* ==========================================================
     INSTAGRAM
  ========================================================== */

  const handleInstagram = () => {
    window.open(
      "https://www.instagram.com/",
      "_blank",
      "noopener,noreferrer",
    );
  };

  /* ==========================================================
     THEME
  ========================================================== */

  const themeStyle = {
    "--product-accent":
      detail.accent,
    "--product-accent-light":
      detail.accentLight,
    "--product-accent-dark":
      detail.accentDark,
  } as CSSProperties;

  return (
    <main
      className="min-h-screen transition-colors duration-700"
      style={{
        backgroundColor:
          detail.background,
        ...themeStyle,
      }}
    >
      {/* =====================================================
          BACK NAVIGATION
      ===================================================== */}

      <section className="border-b border-black/6">
        <div className="mx-auto flex max-w-375 items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={() =>
              navigate(
                getBackPath(),
              )
            }
            className="group inline-flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.22em] transition-colors duration-300"
            style={{
              color:
                detail.accentDark,
            }}
          >
            <ArrowLeft
              size={15}
              strokeWidth={1}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            {backLabel}
          </button>

          <div className="hidden items-center gap-3 text-[8px] uppercase tracking-[0.22em] text-black/35 sm:flex">
            <span>
              {translatedCategory}
            </span>

            <span>/</span>

            <span>
              {detail.number}
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN PRODUCT
      ===================================================== */}

      <section className="mx-auto max-w-375 px-3 py-3 sm:px-5 sm:py-5 lg:px-7 lg:py-7">
        <div className="overflow-hidden rounded-3xl border border-black/4.5 bg-white/60 shadow-[0_20px_80px_rgba(0,0,0,0.045)]">
          <div className="grid lg:grid-cols-2">
            {/* =================================================
                IMAGE GALLERY
            ================================================= */}

            <div className="relative bg-black/2 p-4 sm:p-7 lg:p-10">
              <div className="flex gap-4">
                {imageCount > 1 && (
                  <div className="hidden w-19 shrink-0 flex-col items-center gap-4 sm:flex">
                    {detail.images.map(
                      (
                        image,
                        index,
                      ) => (
                        <button
                          key={`${image}-${index}`}
                          type="button"
                          onClick={() =>
                            setSelectedImage(
                              index,
                            )
                          }
                          className={`relative h-23 w-17 overflow-hidden rounded-lg border bg-white p-0.5 transition-all duration-500 ${
                            safeSelectedImage ===
                            index
                              ? "shadow-lg"
                              : "border-black/7 opacity-70 hover:opacity-100"
                          }`}
                          style={
                            safeSelectedImage ===
                            index
                              ? {
                                  borderColor:
                                    detail.accent,
                                }
                              : undefined
                          }
                          aria-label={`${labels.viewImage} ${
                            index + 1
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${title} ${
                              index + 1
                            }`}
                            className="h-full w-full rounded object-cover"
                            loading={
                              index ===
                              0
                                ? "eager"
                                : "lazy"
                            }
                          />
                        </button>
                      ),
                    )}

                    <button
                      type="button"
                      onClick={
                        nextImage
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:scale-105"
                      style={{
                        color:
                          detail.accentDark,
                      }}
                      aria-label={
                        labels.nextImage
                      }
                    >
                      <ChevronDown
                        size={18}
                        strokeWidth={1}
                      />
                    </button>
                  </div>
                )}

                <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl bg-[#E9E2D8]">
                  {currentImage && (
                    <img
                      key={
                        currentImage
                      }
                      src={
                        currentImage
                      }
                      alt={title}
                      className="min-h-140 w-full object-cover object-center transition-transform duration-1000 hover:scale-[1.015] sm:min-h-175 lg:min-h-195"
                    />
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[8px] uppercase tracking-[0.18em] text-black/55 backdrop-blur">
                    {String(
                      safeSelectedImage +
                        1,
                    ).padStart(
                      2,
                      "0",
                    )}{" "}
                    /{" "}
                    {String(
                      imageCount,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setZoomOpen(
                        true,
                      )
                    }
                    className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:scale-105"
                    style={{
                      color:
                        detail.accentDark,
                    }}
                    aria-label={
                      labels.zoomImage
                    }
                  >
                    <Search
                      size={17}
                      strokeWidth={1.2}
                    />
                  </button>

                  {imageCount >
                    1 && (
                    <div className="absolute bottom-5 left-5 flex gap-2">
                      <button
                        type="button"
                        onClick={
                          previousImage
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md transition-transform hover:scale-105"
                        aria-label={
                          labels.previousImage
                        }
                      >
                        <ArrowLeft
                          size={16}
                          strokeWidth={
                            1
                          }
                        />
                      </button>

                      <button
                        type="button"
                        onClick={
                          nextImage
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md transition-transform hover:scale-105"
                        aria-label={
                          labels.nextImage
                        }
                      >
                        <ArrowRight
                          size={16}
                          strokeWidth={
                            1
                          }
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* MOBILE THUMBNAILS */}

              {imageCount >
                1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1 sm:hidden">
                  {detail.images.map(
                    (
                      image,
                      index,
                    ) => (
                      <button
                        key={`mobile-${image}-${index}`}
                        type="button"
                        onClick={() =>
                          setSelectedImage(
                            index,
                          )
                        }
                        className="h-20 w-16 shrink-0 overflow-hidden rounded-md border bg-white p-0.5"
                        style={{
                          borderColor:
                            safeSelectedImage ===
                            index
                              ? detail.accent
                              : "rgba(0,0,0,0.07)",
                        }}
                        aria-label={`${labels.viewImage} ${
                          index + 1
                        }`}
                      >
                        <img
                          src={image}
                          alt=""
                          className="h-full w-full rounded object-cover"
                          loading="lazy"
                        />
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* =================================================
                PRODUCT INFORMATION
            ================================================= */}

            <div className="flex flex-col px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16 xl:px-20">
              {/* EYEBROW */}

              <div className="flex items-center gap-3">
                <Sparkles
                  size={21}
                  strokeWidth={1}
                  style={{
                    color:
                      detail.accent,
                  }}
                />

                <span
                  className="text-[9px] uppercase tracking-[0.28em]"
                  style={{
                    color:
                      detail.accentDark,
                  }}
                >
                  {eyebrow}
                </span>
              </div>

              {/* TITLE */}

              <h1 className="mt-6 max-w-2xl font-display text-4xl leading-[1.12] text-ink sm:text-5xl lg:text-[52px]">
                {title}
              </h1>

              {/* DECORATIVE LINE */}

              <div className="my-7 flex items-center gap-3">
                <span
                  className="h-px w-16"
                  style={{
                    backgroundColor:
                      detail.accent,
                  }}
                />

                <span
                  className="h-2.5 w-2.5 rotate-45 border"
                  style={{
                    borderColor:
                      detail.accent,
                  }}
                />

                <span
                  className="h-px w-16"
                  style={{
                    backgroundColor:
                      detail.accent,
                  }}
                />
              </div>

              {/* DESCRIPTION */}

              {description && (
                <p className="max-w-2xl text-[14px] leading-7 text-black/55 sm:text-[15px]">
                  {description}
                </p>
              )}

              {/* FEATURES */}

              <div className="mt-7 grid grid-cols-2 overflow-hidden rounded-xl border border-black/7 sm:grid-cols-4">
                {detail.features.map(
                  (
                    feature,
                    index,
                  ) => {
                    const featureTitle =
                      translateString(
                        featureTitleText(
                          feature.featureKey,
                        ),
                        "",
                      );

                    const featureDescription =
                      translateString(
                        featureDescriptionText(
                          feature.featureKey,
                        ),
                        "",
                      );

                    return (
                      <div
                        key={`${feature.featureKey}-${index}`}
                        className={`flex min-h-30 flex-col items-center justify-center px-3 py-5 text-center ${
                          index !==
                          detail.features
                            .length -
                            1
                            ? "border-r border-black/7"
                            : ""
                        } ${
                          index <
                          2
                            ? "border-b sm:border-b-0"
                            : ""
                        }`}
                      >
                        <FeatureIcon
                          type={
                            feature.icon
                          }
                          color={
                            detail.accent
                          }
                        />

                        {featureTitle && (
                          <p className="mt-4 text-[11px] font-medium">
                            {
                              featureTitle
                            }
                          </p>
                        )}

                        {featureDescription && (
                          <p className="mt-1 max-w-30 text-[9px] leading-4 text-black/45">
                            {
                              featureDescription
                            }
                          </p>
                        )}
                      </div>
                    );
                  },
                )}
              </div>

              {/* WHATSAPP */}

              <a
                href={
                  whatsappUrl
                }
                target="_blank"
                rel="noreferrer"
                className="group mt-7 flex min-h-15.5 items-center justify-between rounded-xl px-6 text-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-0.5"
                style={{
                  backgroundColor:
                    detail.accentDark,
                }}
              >
                <span className="flex items-center gap-4">
                  <WhatsAppIcon />

                  <span className="text-[11px] font-medium uppercase tracking-[0.14em]">
                    {
                      labels.chatWhatsapp
                    }
                  </span>
                </span>

                <ArrowRight
                  size={19}
                  strokeWidth={1}
                  className="transition-transform duration-500 group-hover:translate-x-1"
                />
              </a>

              {/* =================================================
                  ACCORDIONS
              ================================================= */}

              <div className="mt-4 overflow-hidden rounded-xl border border-black/7 bg-white/45">
                {/* PRODUCT DETAILS */}

                <AccordionRow
                  title={
                    productDetailsLabel
                  }
                  icon={
                    <Leaf
                      size={22}
                      strokeWidth={1}
                      style={{
                        color:
                          detail.accent,
                      }}
                    />
                  }
                  open={
                    openAccordion ===
                    "details"
                  }
                  onClick={() =>
                    toggleAccordion(
                      "details",
                    )
                  }
                >
                  {longDescription && (
                    <p>
                      {
                        longDescription
                      }
                    </p>
                  )}

                  <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-[10px] uppercase tracking-[0.08em] text-black/40">
                    <span>
                      {labels.category}
                    </span>

                    <span className="text-right text-black/65">
                      {
                        translatedCategory
                      }
                    </span>

                    <span>
                      {labels.reference}
                    </span>

                    <span className="text-right text-black/65">
                      {
                        detail.number
                      }
                    </span>

                    <span>
                      {labels.collection}
                    </span>

                    <span className="text-right text-black/65">
                      {eyebrow}
                    </span>
                  </div>

                  {translatedDetails.filter(
                    Boolean,
                  ).length > 0 && (
                    <div className="mt-5 space-y-2">
                      {translatedDetails
                        .filter(
                          Boolean,
                        )
                        .map(
                          (
                            item,
                            index,
                          ) => (
                            <div
                              key={`${item}-${index}`}
                              className="flex items-start gap-3"
                            >
                              <span
                                className="mt-2 h-1 w-1 shrink-0 rounded-full"
                                style={{
                                  backgroundColor:
                                    detail.accent,
                                }}
                              />

                              <span>
                                {
                                  item
                                }
                              </span>
                            </div>
                          ),
                        )}
                    </div>
                  )}
                </AccordionRow>

                {/* CONTACT STYLIST */}

                <AccordionRow
                  title={
                    contactStylistLabel
                  }
                  icon={
                    <Headphones
                      size={22}
                      strokeWidth={1}
                      style={{
                        color:
                          detail.accent,
                      }}
                    />
                  }
                  open={
                    openAccordion ===
                    "stylist"
                  }
                  onClick={() =>
                    toggleAccordion(
                      "stylist",
                    )
                  }
                >
                  <p>
                    {
                      stylistDescription
                    }
                  </p>

                  <Link
                    to={`/${language}/appointment`}
                    className="mt-4 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em]"
                    style={{
                      color:
                        detail.accentDark,
                    }}
                  >
                    {
                      bookAppointmentLabel
                    }

                    <ArrowUpRight
                      size={13}
                      strokeWidth={1}
                    />
                  </Link>
                </AccordionRow>

                {/* PRODUCT DECLARATION */}

                <AccordionRow
                  title={
                    productDeclarationLabel
                  }
                  icon={
                    <ShieldCheck
                      size={22}
                      strokeWidth={1}
                      style={{
                        color:
                          detail.accent,
                      }}
                    />
                  }
                  open={
                    openAccordion ===
                    "declaration"
                  }
                  onClick={() =>
                    toggleAccordion(
                      "declaration",
                    )
                  }
                >
                  <p>
                    {
                      productDeclarationText
                    }
                  </p>
                </AccordionRow>
              </div>
            </div>
          </div>

          {/* =====================================================
              INSTAGRAM / SOCIAL SECTION
          ===================================================== */}

          <div className="border-t border-black/6 px-5 py-8 sm:px-10 sm:py-10 lg:px-14">
            <div className="mx-auto flex max-w-375 flex-col items-center">
              <div className="flex w-full max-w-md items-center gap-3">
                <span
                  className="h-px flex-1"
                  style={{
                    backgroundColor:
                      `${detail.accent}55`,
                  }}
                />

                <span
                  className="whitespace-nowrap text-center text-[10px] font-medium uppercase tracking-[0.24em]"
                  style={{
                    color:
                      detail.accentDark,
                  }}
                >
                  {labels.visitInstagram}
                </span>

                <span
                  className="h-px flex-1"
                  style={{
                    backgroundColor:
                      `${detail.accent}55`,
                  }}
                />
              </div>

              <button
                type="button"
                onClick={
                  handleInstagram
                }
                className="mt-6 flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow-[0_7px_20px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-1"
                style={{
                  borderColor:
                    `${detail.accent}35`,
                  color:
                    detail.accentDark,
                }}
                aria-label={
                  labels.instagram
                }
              >
                <InstagramIcon />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BOTTOM NAVIGATION
      ===================================================== */}

      <section className="mx-auto max-w-375 px-5 pb-16 pt-2 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-5 border-t border-black/6 pt-8 sm:flex-row">
          <button
            type="button"
            onClick={() =>
              navigate(
                getBackPath(),
              )
            }
            className="group inline-flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.2em]"
            style={{
              color:
                detail.accentDark,
            }}
          >
            <ArrowLeft
              size={15}
              strokeWidth={1}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            {backLabel}
          </button>

          <Link
            to={`/${language}/${detail.explorePath}`}
            className="group inline-flex items-center gap-4 border px-7 py-3.5 text-[9px] font-medium uppercase tracking-[0.2em] transition-all duration-500"
            style={{
              borderColor:
                detail.accentDark,
              color:
                detail.accentDark,
            }}
            onMouseEnter={(
              event,
            ) => {
              event.currentTarget.style.backgroundColor =
                detail.accentDark;

              event.currentTarget.style.color =
                "#ffffff";
            }}
            onMouseLeave={(
              event,
            ) => {
              event.currentTarget.style.backgroundColor =
                "transparent";

              event.currentTarget.style.color =
                detail.accentDark;
            }}
          >
            {exploreLabel}

            <ArrowUpRight
              size={14}
              strokeWidth={1}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </section>

      {/* =====================================================
          ZOOM MODAL
      ===================================================== */}

      {zoomOpen &&
        currentImage && (
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-5 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={
              labels.imagePreview
            }
            onClick={() =>
              setZoomOpen(
                false,
              )
            }
          >
            <button
              type="button"
              onClick={() =>
                setZoomOpen(
                  false,
                )
              }
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-black"
              aria-label={
                labels.close
              }
            >
              <X
                size={19}
                strokeWidth={1.2}
              />
            </button>

            {imageCount >
              1 && (
              <button
                type="button"
                onClick={(
                  event,
                ) => {
                  event.stopPropagation();
                  previousImage();
                }}
                className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-3 text-black md:flex"
                aria-label={
                  labels.previousImage
                }
              >
                <ArrowLeft
                  size={20}
                  strokeWidth={1}
                />
              </button>
            )}

            <img
              src={
                currentImage
              }
              alt={title}
              className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
              onClick={(
                event,
              ) =>
                event.stopPropagation()
              }
            />

            {imageCount >
              1 && (
              <button
                type="button"
                onClick={(
                  event,
                ) => {
                  event.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-3 text-black md:flex"
                aria-label={
                  labels.nextImage
                }
              >
                <ArrowRight
                  size={20}
                  strokeWidth={1}
                />
              </button>
            )}

            {imageCount >
              1 && (
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 md:hidden">
                <button
                  type="button"
                  onClick={(
                    event,
                  ) => {
                    event.stopPropagation();
                    previousImage();
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black"
                  aria-label={
                    labels.previousImage
                  }
                >
                  <ArrowLeft
                    size={17}
                    strokeWidth={1}
                  />
                </button>

                <button
                  type="button"
                  onClick={(
                    event,
                  ) => {
                    event.stopPropagation();
                    nextImage();
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black"
                  aria-label={
                    labels.nextImage
                  }
                >
                  <ArrowRight
                    size={17}
                    strokeWidth={1}
                  />
                </button>
              </div>
            )}
          </div>
        )}
    </main>
  );
}

export default CollectionDetailPage;