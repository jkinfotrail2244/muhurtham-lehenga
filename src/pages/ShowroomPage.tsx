import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";

/* =========================================================
   TYPES
========================================================= */

type SupportedLanguage =
  | "en"
  | "fr"
  | "de"
  | "it";

/* =========================================================
   SHOWROOM DETAILS
========================================================= */

const SHOWROOM_ADDRESS =
  "Luzernerstrasse 17, 6252 Dagmersellen, Switzerland";

const PHONE_DISPLAY = "+41 79 930 32 37";
const PHONE_LINK = "+41799303237";

const EMAIL = "info@muhurtham.ch";

const LATITUDE = 47.21189109662259;
const LONGITUDE = 7.992144904077611;

const GOOGLE_MAPS_URL =
  `https://www.google.com/maps/dir/?api=1&destination=` +
  `${LATITUDE},${LONGITUDE}`;

const GOOGLE_MAPS_EMBED_URL =
  `https://www.google.com/maps?q=${LATITUDE},${LONGITUDE}` +
  `&z=16&output=embed`;

/* =========================================================
   LANGUAGE RESOLVER
========================================================= */

function resolveLanguage(
  pathname: string,
): SupportedLanguage {
  const firstSegment =
    pathname.split("/")[1];

  if (
    firstSegment === "en" ||
    firstSegment === "fr" ||
    firstSegment === "de" ||
    firstSegment === "it"
  ) {
    return firstSegment;
  }

  return "en";
}

/* =========================================================
   SHOWROOM TRANSLATIONS
========================================================= */

const showroomTranslations: Record<
  SupportedLanguage,
  {
    eyebrow: string;
    title: string;
    description: string;
    appointment: string;

    experienceEyebrow: string;
    experienceTitle: string;
    experienceParagraph1: string;
    experienceParagraph2: string;
    experienceParagraph3: string;
    arrangeVisit: string;

    stepInside: string;
    stepTitle: string;
    stepSubtitle: string;
    stepDescription: string;
    visitShowroom: string;
    location: string;

    findUs: string;
    visitMuhurtham: string;

    showroomDetails: string;
    experienceInPerson: string;
    showroomDescription: string;

    address: string;
    phone: string;
    email: string;
    openMaps: string;

    mapTitle: string;
    mapLocation: string;

    appointmentEyebrow: string;
    appointmentTitle1: string;
    appointmentTitle2: string;
    appointmentDescription: string;
    bookAppointment: string;

    since: string;
  }
> = {
  /* =======================================================
     ENGLISH
  ======================================================= */

  en: {
    eyebrow:
      "Muhurtham Collection",

    title:
      "Our Showroom",

    description:
      "A private destination for brides, grooms, and families seeking timeless Indian and Tamil bridal fashion in an intimate setting.",

    appointment:
      "Book a Private Appointment",

    experienceEyebrow:
      "The Muhurtham Experience",

    experienceTitle:
      "A showroom created around your celebration.",

    experienceParagraph1:
      "Muhurtham Collection is an exclusive bridal boutique dedicated to Indian and Tamil wedding fashion. Our showroom brings together carefully selected pieces for the bride, groom, and their families.",

    experienceParagraph2:
      "Every visit is designed to feel personal. From the first consultation to selecting the perfect silhouette, our team takes time to understand your celebration, your style, and the traditions that matter to you.",

    experienceParagraph3:
      "Our collection combines traditional craftsmanship with contemporary elegance, creating a carefully curated experience for meaningful wedding moments.",

    arrangeVisit:
      "Arrange Your Visit",

    stepInside:
      "Step Inside",

    stepTitle:
      "MUHURTHAM",

    stepSubtitle:
      "Collections",

    stepDescription:
      "Discover a carefully curated world of bridal elegance, refined tailoring, and timeless Indian craftsmanship.",

    visitShowroom:
      "Visit Our Showroom",

    location:
      "Dagmersellen · Switzerland",

    findUs:
      "Find Us",

    visitMuhurtham:
      "Visit Muhurtham",

    showroomDetails:
      "Showroom Details",

    experienceInPerson:
      "Experience it in person.",

    showroomDescription:
      "Our showroom offers a personal setting where you can explore our collections, discuss your preferences and find the right look for your celebration.",

    address:
      "Address",

    phone:
      "Phone",

    email:
      "Email",

    openMaps:
      "Open in Google Maps",

    mapTitle:
      "Muhurtham Collection",

    mapLocation:
      "Dagmersellen, Switzerland",

    appointmentEyebrow:
      "Your Muhurtham",

    appointmentTitle1:
      "Your celebration",

    appointmentTitle2:
      "begins here.",

    appointmentDescription:
      "Visit Muhurtham Collection and experience our bridal and groom collections in a private, personal setting.",

    bookAppointment:
      "Book an Appointment",

    since:
      "Since 2020",
  },

  /* =======================================================
     FRENCH
  ======================================================= */

  fr: {
    eyebrow:
      "Collection Muhurtham",

    title:
      "Notre Showroom",

    description:
      "Une destination privée pour les mariées, les mariés et les familles à la recherche d'une mode nuptiale indienne et tamoule intemporelle dans un cadre intime.",

    appointment:
      "Prendre un rendez-vous privé",

    experienceEyebrow:
      "L'expérience Muhurtham",

    experienceTitle:
      "Un showroom imaginé autour de votre célébration.",

    experienceParagraph1:
      "Muhurtham Collection est une boutique nuptiale exclusive dédiée à la mode indienne et tamoule. Notre showroom réunit des pièces soigneusement sélectionnées pour la mariée, le marié et leurs familles.",

    experienceParagraph2:
      "Chaque visite est pensée comme une expérience personnelle. De la première consultation au choix de la silhouette parfaite, notre équipe prend le temps de comprendre votre célébration, votre style et les traditions qui vous tiennent à cœur.",

    experienceParagraph3:
      "Notre collection associe savoir-faire traditionnel et élégance contemporaine afin de créer une expérience soigneusement pensée pour les moments importants de votre mariage.",

    arrangeVisit:
      "Organiser votre visite",

    stepInside:
      "Entrez dans notre univers",

    stepTitle:
      "MUHURTHAM",

    stepSubtitle:
      "Collections",

    stepDescription:
      "Découvrez un univers soigneusement sélectionné d'élégance nuptiale, de confection raffinée et de savoir-faire indien intemporel.",

    visitShowroom:
      "Visiter notre showroom",

    location:
      "Dagmersellen · Suisse",

    findUs:
      "Nous trouver",

    visitMuhurtham:
      "Visiter Muhurtham",

    showroomDetails:
      "Détails du showroom",

    experienceInPerson:
      "Découvrez-le en personne.",

    showroomDescription:
      "Notre showroom vous offre un cadre privé où vous pouvez découvrir nos collections, discuter de vos préférences et trouver le style idéal pour votre célébration.",

    address:
      "Adresse",

    phone:
      "Téléphone",

    email:
      "E-mail",

    openMaps:
      "Ouvrir dans Google Maps",

    mapTitle:
      "Collection Muhurtham",

    mapLocation:
      "Dagmersellen, Suisse",

    appointmentEyebrow:
      "Votre Muhurtham",

    appointmentTitle1:
      "Votre célébration",

    appointmentTitle2:
      "commence ici.",

    appointmentDescription:
      "Visitez Muhurtham Collection et découvrez nos collections pour mariées et mariés dans un cadre privé et personnalisé.",

    bookAppointment:
      "Prendre rendez-vous",

    since:
      "Depuis 2020",
  },

  /* =======================================================
     GERMAN
  ======================================================= */

  de: {
    eyebrow:
      "Muhurtham Kollektion",

    title:
      "Unser Showroom",

    description:
      "Ein privater Ort für Bräute, Bräutigame und Familien, die zeitlose indische und tamilische Brautmode in persönlicher Atmosphäre entdecken möchten.",

    appointment:
      "Private Beratung buchen",

    experienceEyebrow:
      "Das Muhurtham Erlebnis",

    experienceTitle:
      "Ein Showroom, der ganz auf Ihre Feier ausgerichtet ist.",

    experienceParagraph1:
      "Muhurtham Collection ist eine exklusive Boutique für indische und tamilische Hochzeitsmode. Unser Showroom vereint sorgfältig ausgewählte Stücke für Braut, Bräutigam und ihre Familien.",

    experienceParagraph2:
      "Jeder Besuch soll persönlich sein. Von der ersten Beratung bis zur Auswahl der perfekten Silhouette nimmt sich unser Team Zeit, Ihre Feier, Ihren Stil und die Traditionen, die Ihnen wichtig sind, zu verstehen.",

    experienceParagraph3:
      "Unsere Kollektion verbindet traditionelle Handwerkskunst mit zeitgemäßer Eleganz und schafft so ein sorgfältig kuratiertes Erlebnis für besondere Hochzeitsmomente.",

    arrangeVisit:
      "Besuch vereinbaren",

    stepInside:
      "Treten Sie ein",

    stepTitle:
      "MUHURTHAM",

    stepSubtitle:
      "Kollektionen",

    stepDescription:
      "Entdecken Sie eine sorgfältig kuratierte Welt voller Brauteleganz, raffinierter Schneiderei und zeitloser indischer Handwerkskunst.",

    visitShowroom:
      "Unseren Showroom besuchen",

    location:
      "Dagmersellen · Schweiz",

    findUs:
      "So finden Sie uns",

    visitMuhurtham:
      "Muhurtham besuchen",

    showroomDetails:
      "Showroom Details",

    experienceInPerson:
      "Erleben Sie es persönlich.",

    showroomDescription:
      "Unser Showroom bietet Ihnen eine persönliche Atmosphäre, in der Sie unsere Kollektionen entdecken, Ihre Wünsche besprechen und den passenden Look für Ihre Feier finden können.",

    address:
      "Adresse",

    phone:
      "Telefon",

    email:
      "E-Mail",

    openMaps:
      "In Google Maps öffnen",

    mapTitle:
      "Muhurtham Kollektion",

    mapLocation:
      "Dagmersellen, Schweiz",

    appointmentEyebrow:
      "Ihr Muhurtham",

    appointmentTitle1:
      "Ihre Feier",

    appointmentTitle2:
      "beginnt hier.",

    appointmentDescription:
      "Besuchen Sie Muhurtham Collection und erleben Sie unsere Kollektionen für Braut und Bräutigam in einer privaten und persönlichen Atmosphäre.",

    bookAppointment:
      "Termin vereinbaren",

    since:
      "Seit 2020",
  },

  /* =======================================================
     ITALIAN
  ======================================================= */

  it: {
    eyebrow:
      "Collezione Muhurtham",

    title:
      "Il Nostro Showroom",

    description:
      "Una destinazione privata per spose, sposi e famiglie alla ricerca di una moda nuziale indiana e tamil senza tempo, in un ambiente intimo.",

    appointment:
      "Prenota un appuntamento privato",

    experienceEyebrow:
      "L'esperienza Muhurtham",

    experienceTitle:
      "Uno showroom creato intorno alla vostra celebrazione.",

    experienceParagraph1:
      "Muhurtham Collection è una boutique nuziale esclusiva dedicata alla moda indiana e tamil. Il nostro showroom riunisce capi accuratamente selezionati per la sposa, lo sposo e le loro famiglie.",

    experienceParagraph2:
      "Ogni visita è pensata come un'esperienza personale. Dalla prima consulenza alla scelta della silhouette perfetta, il nostro team dedica tempo a comprendere la vostra celebrazione, il vostro stile e le tradizioni che vi stanno a cuore.",

    experienceParagraph3:
      "La nostra collezione unisce l'artigianalità tradizionale all'eleganza contemporanea, creando un'esperienza curata per i momenti più significativi del vostro matrimonio.",

    arrangeVisit:
      "Organizza la tua visita",

    stepInside:
      "Entrate nel nostro mondo",

    stepTitle:
      "MUHURTHAM",

    stepSubtitle:
      "Collezioni",

    stepDescription:
      "Scoprite un mondo accuratamente selezionato di eleganza nuziale, sartoria raffinata e artigianalità indiana senza tempo.",

    visitShowroom:
      "Visita il nostro showroom",

    location:
      "Dagmersellen · Svizzera",

    findUs:
      "Dove trovarci",

    visitMuhurtham:
      "Visita Muhurtham",

    showroomDetails:
      "Dettagli dello showroom",

    experienceInPerson:
      "Vivilo di persona.",

    showroomDescription:
      "Il nostro showroom offre un ambiente personale in cui potrete scoprire le nostre collezioni, parlare delle vostre preferenze e trovare il look perfetto per la vostra celebrazione.",

    address:
      "Indirizzo",

    phone:
      "Telefono",

    email:
      "E-mail",

    openMaps:
      "Apri in Google Maps",

    mapTitle:
      "Collezione Muhurtham",

    mapLocation:
      "Dagmersellen, Svizzera",

    appointmentEyebrow:
      "Il vostro Muhurtham",

    appointmentTitle1:
      "La vostra celebrazione",

    appointmentTitle2:
      "inizia qui.",

    appointmentDescription:
      "Visitate Muhurtham Collection e scoprite le nostre collezioni per sposa e sposo in un ambiente privato e personale.",

    bookAppointment:
      "Prenota un appuntamento",

    since:
      "Dal 2020",
  },
};

/* =========================================================
   PAGE
========================================================= */

function ShowroomPage() {
  const location = useLocation();

  const { i18n } = useTranslation();

  /* ========================================================
     CURRENT LANGUAGE
  ======================================================== */

  const language =
    resolveLanguage(location.pathname);

  const translations =
    showroomTranslations[language];

  /*
   * Use the URL language directly.
   * This prevents the showroom from staying in English
   * when the URL is /ta/, /fr/, /de/ or /it/.
   */

  const fixedT =
    i18n.getFixedT(language);

  /* ========================================================
     SAFE TRANSLATION
  ======================================================== */

  const translate = (
    key: string,
    fallback: string,
  ): string => {
    const value = fixedT(key, {
      defaultValue: "",
    });

    if (
      typeof value === "string" &&
      value.trim() !== "" &&
      value !== key
    ) {
      return value;
    }

    return fallback;
  };

  /* ========================================================
     LANGUAGE-AWARE APPOINTMENT PATH
  ======================================================== */

  const appointmentPath =
    `/${language}/appointment`;

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-ink">

      {/* =========================================================
          HERO
      ========================================================= */}

      <section
        className="
          relative
          overflow-hidden
          border-b
          border-black/5
        "
      >

        <div
          className="
            grid
            min-h-170
            lg:grid-cols-2
          "
        >

          {/* =================================================
              LEFT EDITORIAL PANEL
          ================================================= */}

          <div
            className="
              relative
              flex
              items-center
              px-8
              py-24
              sm:px-12
              lg:px-20
              xl:px-28
            "
          >

            <motion.div
              initial={{
                opacity: 0,
                y: 35,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 1,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="
                relative
                z-10
                max-w-155
              "
            >

              <p
                className="
                  mb-5
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.38em]
                  text-[#95623f]
                "
              >
                {translate(
                  "showroom.eyebrow",
                  translations.eyebrow,
                )}
              </p>

              <h1
                className="
                  font-serif
                  text-6xl
                  leading-[0.95]
                  tracking-[-0.045em]
                  sm:text-7xl
                  lg:text-8xl
                  xl:text-[100px]
                "
              >
                
                    {language === "fr" ? (
                      <>
                        Notre
                        <br />
                        <span className="italic">
                          Showroom
                        </span>
                      </>
                    ) : language === "de" ? (
                      <>
                        Unser
                        <br />
                        <span className="italic">
                          Showroom
                        </span>
                      </>
                    ) : language === "it" ? (
                      <>
                        Il Nostro
                        <br />
                        <span className="italic">
                          Showroom
                        </span>
                      </>
                    ) : (
                      <>
                        Our
                        <br />
                        <span className="italic">
                          Showroom
                        </span>
                      </>
                    )}
                
                )
              </h1>

              <div className="my-9 flex items-center gap-4">

                <span className="h-px w-16 bg-[#a87850]" />

                <span className="h-2 w-2 rotate-45 border border-[#a87850]" />

                <span className="h-px w-16 bg-[#a87850]" />

              </div>

              <p
                className="
                  max-w-127.5
                  font-serif
                  text-lg
                  leading-8
                  text-[#625b54]
                  sm:text-xl
                "
              >
                {translate(
                  "showroom.description",
                  translations.description,
                )}
              </p>

              <Link
                to={appointmentPath}
                className="
                  group
                  mt-9
                  inline-flex
                  items-center
                  gap-8
                  border
                  border-ink
                  px-7
                  py-4
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.28em]
                  transition-all
                  duration-500
                  hover:bg-ink
                  hover:text-white
                "
              >

                <span>
                  {translate(
                    "showroom.appointment",
                    translations.appointment,
                  )}
                </span>

                <ArrowUpRight
                  size={15}
                  strokeWidth={1.2}
                  className="
                    transition-transform
                    duration-500
                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                  "
                />

              </Link>

            </motion.div>

          </div>

          {/* =================================================
              HERO IMAGE
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 1.04,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1.4,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="
              relative
              min-h-125
              overflow-hidden
              lg:min-h-170
            "
          >

            <img
              src="/images/showroom1.png"
              alt={translations.title}
              className="
                h-full
                w-full
                object-cover
                object-center
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-linear-to-r
                from-black/5
                via-transparent
                to-transparent
              "
            />

            <div
              className="
                absolute
                bottom-8
                left-8
                hidden
                sm:block
              "
            >

              <p
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.3em]
                  text-white/90
                "
              >
                {translate(
                  "showroom.experienceEyebrow",
                  translations.experienceEyebrow,
                )}
              </p>

            </div>

          </motion.div>

        </div>

      </section>

      {/* =========================================================
          SHOWROOM STORY
      ========================================================= */}

      <section
        className="
          relative
          overflow-hidden
          px-6
          py-24
          sm:px-10
          sm:py-32
          lg:px-16
          xl:px-24
        "
      >

        <div className="mx-auto max-w-362.5">

          <div
            className="
              grid
              items-center
              gap-14
              lg:grid-cols-[0.82fr_1.18fr]
              lg:gap-20
            "
          >

            <motion.div
              initial={{
                opacity: 0,
                x: -40,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 1,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="relative"
            >

              <div className="aspect-4/5 overflow-hidden">

                <img
                  src="/images/showroom2.png"
                  alt={translations.experienceEyebrow}
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />

              </div>

              <div
                className="
                  absolute
                  -bottom-7
                  -right-5
                  hidden
                  h-28
                  w-28
                  border
                  border-[#a87850]/30
                  bg-[#f8f5ef]
                  sm:block
                "
              >

                <div
                  className="
                    flex
                    h-full
                    flex-col
                    items-center
                    justify-center
                  "
                >

                  <Sparkles
                    size={20}
                    strokeWidth={1}
                    className="mb-3 text-[#9a6844]"
                  />

                  <span
                    className="
                      text-[8px]
                      uppercase
                      tracking-[0.25em]
                      text-[#756d64]
                    "
                  >
                    {translations.since}
                  </span>

                </div>

              </div>

            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 40,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 1,
                delay: 0.1,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="lg:pl-8"
            >

              <p
                className="
                  mb-5
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.35em]
                  text-[#95623f]
                "
              >
                {translate(
                  "showroom.experienceEyebrow",
                  translations.experienceEyebrow,
                )}
              </p>

              <h2
                className="
                  max-w-190
                  font-serif
                  text-4xl
                  leading-[1.05]
                  tracking-[-0.035em]
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                {translations.experienceTitle}
              </h2>

              <div className="my-8 flex items-center gap-3">

                <span className="h-px w-14 bg-[#a87850]" />

                <span className="h-1.5 w-1.5 rotate-45 bg-[#a87850]" />

                <span className="h-px w-14 bg-[#a87850]" />

              </div>

              <div
                className="
                  space-y-6
                  font-serif
                  text-[16px]
                  leading-8
                  text-[#625b54]
                  sm:text-lg
                "
              >

                <p>
                  {translations.experienceParagraph1}
                </p>

                <p>
                  {translations.experienceParagraph2}
                </p>

                <p>
                  {translations.experienceParagraph3}
                </p>

              </div>

              <Link
                to={appointmentPath}
                className="
                  group
                  mt-9
                  inline-flex
                  items-center
                  gap-5
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.3em]
                  text-ink
                "
              >

                <span className="border-b border-ink pb-2">
                  {translations.arrangeVisit}
                </span>

                <ArrowUpRight
                  size={14}
                  strokeWidth={1.2}
                  className="
                    transition-transform
                    duration-500
                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                  "
                />

              </Link>

            </motion.div>

          </div>

        </div>

      </section>

      {/* =========================================================
          SHOWROOM IMAGE FEATURE
      ========================================================= */}

      <section className="px-0 pb-24 sm:pb-32">

        <motion.div
          initial={{
            opacity: 0,
            y: 45,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 1,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="mx-auto w-full"
        >

          <div
            className="
              relative
              min-h-155
              overflow-hidden
              sm:min-h-170
              lg:min-h-190
            "
          >

            <img
              src="/images/showroom3.png"
              alt={translations.stepTitle}
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                object-center
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-linear-to-r
                from-[#f8f5ef]/95
                via-[#f8f5ef]/80
                via-42%
                to-transparent
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-linear-to-t
                from-black/10
                via-transparent
                to-transparent
              "
            />

            <div
              className="
                relative
                z-10
                flex
                min-h-155
                items-center
                px-8
                py-20
                sm:min-h-170
                sm:px-14
                lg:min-h-190
                lg:px-20
                xl:px-28
              "
            >

              <div className="max-w-135">

                <motion.p
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.15,
                  }}
                  className="
                    mb-6
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.42em]
                    text-[#9a633c]
                  "
                >
                  {translations.stepInside}
                </motion.p>

                <motion.div
                  initial={{
                    opacity: 0,
                    scaleX: 0,
                  }}
                  whileInView={{
                    opacity: 1,
                    scaleX: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.25,
                  }}
                  className="
                    mb-8
                    flex
                    origin-left
                    items-center
                    gap-3
                  "
                >

                  <span className="h-px w-20 bg-[#b17b4d]" />

                  <span
                    className="
                      h-2
                      w-2
                      rotate-45
                      border
                      border-[#b17b4d]
                      bg-[#f8f5ef]
                    "
                  />

                  <span className="h-px w-20 bg-[#b17b4d]" />

                </motion.div>

                <motion.h2
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.2,
                    ease: [
                      0.22,
                      1,
                      0.36,
                      1,
                    ],
                  }}
                  className="
                    font-serif
                    text-[48px]
                    leading-[0.92]
                    tracking-[-0.045em]
                    text-ink
                    sm:text-[64px]
                    lg:text-[76px]
                    xl:text-[86px]
                  "
                >
                  {translations.stepTitle}
                </motion.h2>

                <motion.p
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.35,
                  }}
                  className="
                    mt-5
                    text-[12px]
                    font-medium
                    uppercase
                    tracking-[0.48em]
                    text-[#9a633c]
                    sm:text-[13px]
                  "
                >
                  {translations.stepSubtitle}
                </motion.p>

                <motion.div
                  initial={{
                    opacity: 0,
                    scaleX: 0,
                  }}
                  whileInView={{
                    opacity: 1,
                    scaleX: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.45,
                  }}
                  className="
                    mb-7
                    mt-7
                    h-px
                    w-10
                    origin-left
                    bg-[#b17b4d]
                  "
                />

                <motion.p
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.45,
                  }}
                  className="
                    max-w-110
                    font-serif
                    text-[16px]
                    leading-7
                    text-[#514b45]
                    sm:text-[18px]
                    sm:leading-8
                  "
                >
                  {translations.stepDescription}
                </motion.p>

                <motion.a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.6,
                  }}
                  className="
                    group
                    mt-9
                    inline-flex
                    items-center
                    gap-7
                    border
                    border-[#ebb57f]
                    bg-[#f3c597]
                    px-7
                    py-4
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.3em]
                    text-white
                    transition-all
                    duration-500
                    hover:bg-[#9a633c]
                    hover:text-white
                    sm:px-8
                    sm:py-5
                  "
                >

                  <span>
                    {translations.visitShowroom}
                  </span>

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.2}
                    className="
                      transition-transform
                      duration-500
                      group-hover:translate-x-1
                      group-hover:-translate-y-1
                    "
                  />

                </motion.a>

              </div>

            </div>

            <div
              className="
                pointer-events-none
                absolute
                inset-5
                border
                border-white/20
                sm:inset-7
                lg:inset-9
              "
            />

            <div
              className="
                absolute
                bottom-7
                right-8
                z-10
                hidden
                text-right
                sm:block
                lg:right-12
              "
            >

              <p
                className="
                  text-[8px]
                  uppercase
                  tracking-[0.3em]
                  text-white/80
                "
              >
                {translations.location}
              </p>

            </div>

          </div>

        </motion.div>

      </section>

      {/* =========================================================
          SHOWROOM INFORMATION
      ========================================================= */}

      <section
        className="
          bg-[#fbfaf7]
          px-6
          py-20
          sm:px-10
          lg:px-16
          xl:px-24
        "
      >

        <div className="mx-auto max-w-345">

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
            }}
            className="mb-14 text-center"
          >

            <p
              className="
                mb-5
                text-[10px]
                uppercase
                tracking-[0.38em]
                text-[#9b7654]
              "
            >
              {translations.findUs}
            </p>

            <h2
              className="
                luxury-heading
                text-4xl
                sm:text-5xl
                lg:text-6xl
              "
            >
              {translations.visitMuhurtham}
            </h2>

            <div
              className="
                mx-auto
                mt-7
                flex
                items-center
                justify-center
                gap-3
              "
            >

              <span className="h-px w-14 bg-[#b89a7d]" />

              <span className="h-2 w-2 rotate-45 border border-[#b89a7d]" />

              <span className="h-px w-14 bg-[#b89a7d]" />

            </div>

          </motion.div>

          <div
            className="
              grid
              overflow-hidden
              border
              border-black/10
              bg-white
              lg:grid-cols-[0.8fr_1.2fr]
            "
          >

            {/* =================================================
                CONTACT DETAILS
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                x: -25,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.8,
              }}
              className="
                flex
                flex-col
                justify-center
                p-8
                sm:p-12
                lg:p-14
                xl:p-16
              "
            >

              <p
                className="
                  mb-4
                  text-[10px]
                  uppercase
                  tracking-[0.32em]
                  text-[#9b7654]
                "
              >
                {translations.showroomDetails}
              </p>

              <h3
                className="
                  luxury-heading
                  text-3xl
                  sm:text-4xl
                "
              >
                {translations.experienceInPerson}
              </h3>

              <p
                className="
                  mt-6
                  max-w-md
                  font-serif
                  text-base
                  leading-7
                  text-[#68615a]
                "
              >
                {translations.showroomDescription}
              </p>

              {/* CONTACT ITEMS */}

              <div className="mt-10 space-y-7">

                {/* ADDRESS */}

                <div className="flex items-start gap-5">

                  <div
                    className="
                      group
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      border
                      border-[#b89a7d]/40
                      text-[#8e6848]
                      transition-all
                      duration-300
                      hover:border-[#74533C]/60
                      hover:bg-[#FBF8F3]
                    "
                  >

                    <MapPin
                      size={19}
                      strokeWidth={1.3}
                      className="
                        transition-transform
                        duration-300
                        ease-out
                        group-hover:scale-125
                      "
                    />

                  </div>

                  <div>

                    <p
                      className="
                        mb-1
                        text-[10px]
                        uppercase
                        tracking-[0.25em]
                        text-[#8f7a68]
                      "
                    >
                      {translations.address}
                    </p>

                    <p
                      className="
                        max-w-sm
                        text-sm
                        leading-6
                        text-[#2c2824]
                      "
                    >
                      {SHOWROOM_ADDRESS}
                    </p>

                  </div>

                </div>

                {/* PHONE */}

                <div className="flex items-start gap-5">

                  <div
                    className="
                      group
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      border
                      border-[#b89a7d]/40
                      text-[#8e6848]
                      transition-all
                      duration-300
                      hover:border-[#74533C]/60
                      hover:bg-[#FBF8F3]
                    "
                  >

                    <Phone
                      size={18}
                      strokeWidth={1.3}
                      className="
                        transition-transform
                        duration-300
                        ease-out
                        group-hover:scale-125
                      "
                    />

                  </div>

                  <div>

                    <p
                      className="
                        mb-1
                        text-[10px]
                        uppercase
                        tracking-[0.25em]
                        text-[#8f7a68]
                      "
                    >
                      {translations.phone}
                    </p>

                    <a
                      href={`tel:${PHONE_LINK}`}
                      className="
                        text-sm
                        text-[#2c2824]
                        transition-colors
                        hover:text-[#9b7654]
                      "
                    >
                      {PHONE_DISPLAY}
                    </a>

                  </div>

                </div>

                {/* EMAIL */}

                <div className="flex items-start gap-5">

                  <div
                    className="
                      group
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      border
                      border-[#b89a7d]/40
                      text-[#8e6848]
                      transition-all
                      duration-300
                      hover:border-[#74533C]/60
                      hover:bg-[#FBF8F3]
                    "
                  >

                    <Mail
                      size={18}
                      strokeWidth={1.3}
                      className="
                        transition-transform
                        duration-300
                        ease-out
                        group-hover:scale-125
                      "
                    />

                  </div>

                  <div>

                    <p
                      className="
                        mb-1
                        text-[10px]
                        uppercase
                        tracking-[0.25em]
                        text-[#8f7a68]
                      "
                    >
                      {translations.email}
                    </p>

                    <a
                      href={`mailto:${EMAIL}`}
                      className="
                        text-sm
                        text-[#2c2824]
                        transition-colors
                        hover:text-[#9b7654]
                      "
                    >
                      {EMAIL}
                    </a>

                  </div>

                </div>

              </div>

              {/* GOOGLE MAPS */}

              <div className="mt-10">

                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-4
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.25em]
                    text-[#765536]
                  "
                >

                  {translations.openMaps}

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.4}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                      group-hover:-translate-y-1
                    "
                  />

                </a>

              </div>

            </motion.div>

            {/* =================================================
                MAP
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                x: 25,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.8,
              }}
              className="
                relative
                min-h-105
                border-t
                border-black/10
                lg:min-h-140
                lg:border-l
                lg:border-t-0
              "
            >

              <iframe
                title={
                  translations.mapTitle
                }
                src={GOOGLE_MAPS_EMBED_URL}
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  border-0
                "
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  left-5
                  top-5
                  bg-white/95
                  px-5
                  py-4
                  shadow-sm
                "
              >

                <div className="flex items-center gap-3">

                  <MapPin
                    size={17}
                    strokeWidth={1.4}
                    className="text-[#8e6848]"
                  />

                  <div>

                    <p
                      className="
                        text-[9px]
                        uppercase
                        tracking-[0.22em]
                        text-[#806b58]
                      "
                    >
                      {translations.mapTitle}
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-[#27221e]
                      "
                    >
                      {translations.mapLocation}
                    </p>

                  </div>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </section>

      {/* =========================================================
          APPOINTMENT CTA
      ========================================================= */}

      <section
        className="
          bg-ink
          px-6
          py-24
          text-white
          sm:px-10
          sm:py-32
        "
      >

        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 1,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="
            mx-auto
            max-w-212.5
            text-center
          "
        >

          <p
            className="
              mb-5
              text-[#c49a78]!
              text-[9px]
              uppercase
              tracking-[0.4em]
            "
          >
            {translations.appointmentEyebrow}
          </p>

          <h2
            className="
              font-serif
              text-white!
              text-5xl
              leading-[1.05]
              tracking-[-0.04em]
              sm:text-6xl
              lg:text-7xl
            "
          >

            {translations.appointmentTitle1}

            <br />

            <span className="italic text-white!">
              {translations.appointmentTitle2}
            </span>

          </h2>

          <div
            className="
              mx-auto
              my-8
              flex
              items-center
              justify-center
              gap-3
            "
          >

            <span className="h-px w-16 bg-[#c49a78]/80" />

            <span className="h-2 w-2 rotate-45 border border-[#c49a78]" />

            <span className="h-px w-16 bg-[#c49a78]/80" />

          </div>

          <p
            className="
              mx-auto
              max-w-155
              font-serif
              text-white/75!
              text-base
              leading-7
              sm:text-lg
            "
          >
            {translations.appointmentDescription}
          </p>

          <Link
            to={appointmentPath}
            className="
              group
              mt-9
              inline-flex
              items-center
              justify-center
              gap-7
              border
              border-white/50
              px-8
              py-4
              text-[10px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-white
              transition-all
              duration-500
              hover:bg-white
              hover:text-ink
            "
          >

            <span>
              {translate(
                "common.bookAppointment",
                translations.bookAppointment,
              )}
            </span>

            <ArrowUpRight
              size={15}
              strokeWidth={1.2}
              className="
                transition-transform
                duration-500
                group-hover:translate-x-1
                group-hover:-translate-y-1
              "
            />

          </Link>

        </motion.div>

      </section>

    </main>
  );
}

export default ShowroomPage;