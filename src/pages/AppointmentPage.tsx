import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Check,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

/* ============================================================
   SUPPORTED LANGUAGES
============================================================ */

const supportedLanguages = [
  "en",
  "fr",
  "de",
  "it",
] as const;

type SupportedLanguage =
  (typeof supportedLanguages)[number];

/* ============================================================
   SERVICE TYPE
============================================================ */

type Service = {
  id: "bridal" | "groom" | "bridal-groom" | "fitting";
};

/* ============================================================
   SERVICES
============================================================ */

const services: Service[] = [
  {
    id: "bridal",
  },
  {
    id: "groom",
  },
  {
    id: "bridal-groom",
  },
  {
    id: "fitting",
  },
];

/* ============================================================
   TIME SLOTS
============================================================ */

const timeSlots = [
  "10:00 AM",
  "11:30 AM",
  "1:00 PM",
  "2:30 PM",
  "3:30 PM",
  "5:00 PM",
];

/* ============================================================
   WEEK DAYS
============================================================ */

const weekDays = [
  {
    key: "mon",
    en: "MON",
    fr: "LUN",
    de: "MO",
    it: "LUN",
  },
  {
    key: "tue",
    en: "TUE",
    fr: "MAR",
    de: "DI",
    it: "MAR",
  },
  {
    key: "wed",
    en: "WED",
    fr: "MER",
    de: "MI",
    it: "MER",
  },
  {
    key: "thu",
    en: "THU",
    fr: "JEU",
    de: "DO",
    it: "GIO",
  },
  {
    key: "fri",
    en: "FRI",
    fr: "VEN",
    de: "FR",
    it: "VEN",
  },
  {
    key: "sat",
    en: "SAT",
    fr: "SAM",
    de: "SA",
    it: "SAB",
  },
  {
    key: "sun",
    en: "SUN",
    fr: "DIM",
    de: "SO",
    it: "DOM",
  },
];

/* ============================================================
   TRANSLATION TYPE
============================================================ */

type TranslationDictionary = {
  [key: string]: string;
};

/* ============================================================
   COMPLETE APPOINTMENT TRANSLATIONS
============================================================ */

const appointmentTranslations: Record<
  SupportedLanguage,
  TranslationDictionary
> = {
  /* ==========================================================
     ENGLISH
  ========================================================== */

  en: {
    "header.eyebrow": "Your Muhurtham",
    "header.titleLine1": "Book Your",
    "header.titleLine2": "Visit",
    "header.subtitle":
      "Reserve a dedicated time in our showroom.",

    "progress.step": "Step",
    "progress.of": "of",

    "step1.eyebrow": "Step One",
    "step1.title": "Select Service",

    "step2.eyebrow": "Step Two",
    "step2.title": "Select Date & Time",

    "step3.eyebrow": "Step Three",
    "step3.title": "Your Details",

    "services.bridal.label": "BRIDAL",
    "services.bridal.title": "Bridal Consultation",
    "services.bridal.description":
      "A personalised exploration of our bridal lehenga collections, styling and wedding requirements.",

    "services.groom.label": "GROOM",
    "services.groom.title": "Groom Consultation",
    "services.groom.description":
      "Discover refined sherwanis, ceremonial tailoring and styling options for the modern groom.",

    "services.bridal-groom.label": "BRIDAL & GROOM",
    "services.bridal-groom.title":
      "Bridal & Groom Consultation",
    "services.bridal-groom.description":
      "A complete consultation for both bride and groom, thoughtfully curated for your celebration.",

    "services.fitting.label": "PRIVATE",
    "services.fitting.title": "Private Appointment",
    "services.fitting.description":
      "Private fitting, alterations and final adjustments for an existing Muhurtham Collection outfit.",

    "calendar.previousMonth": "Previous month",
    "calendar.nextMonth": "Next month",
    "calendar.closed": "Closed",

    "calendar.legend.selected": "Selected",
    "calendar.legend.available": "Available",
    "calendar.legend.unavailable": "Unavailable",

    "time.available": "Available Times",

    "selection.title": "Your Selection",
    "selection.selectDate": "Select a date",

    "form.fullName.label": "Full Name",
    "form.fullName.placeholder": "Enter your full name",

    "form.email.label": "Email Address",
    "form.email.placeholder": "you@example.com",

    "form.phone.label": "Phone Number",
    "form.phone.placeholder": "+41 79 930 32 37",

    "form.message.label": "Additional Requirements",
    "form.message.placeholder":
      "Tell us anything you'd like us to prepare for your visit...",

    "summary.title": "Appointment Summary",
    "summary.service": "Service",
    "summary.date": "Date",
    "summary.time": "Time",

    "navigation.back": "Back",
    "navigation.next": "Next Step",
    "navigation.confirm": "Confirm Booking",

    "image.privateAtelier": "Private Atelier",
    "image.cardTitleLine1": "The Private",
    "image.cardTitleLine2": "Atelier",
    "image.cardDescription":
      "Experience a curated, one-on-one consultation with our bridal stylists in a serene and luxurious setting.",
    "image.mobileDescription":
      "A personalised consultation designed around your celebration.",

    "images.mainAlt":
      "Muhurtham Collection bridal appointment showroom",
    "images.mobileAlt":
      "Muhurtham Collection private bridal consultation",

    "bottom.titleLine1": "Your celebration begins",
    "bottom.titleLine2": "with a conversation.",
    "bottom.description":
      "Visit us at our showroom in Dagmersellen, Switzerland, and discover a thoughtfully curated world of Indian and Tamil bridal elegance.",

    "confirmation.eyebrow": "Appointment Requested",
    "confirmation.titleLine1": "We look forward",
    "confirmation.titleLine2": "to welcoming you.",
    "confirmation.message":
      "Thank you, {{name}}. Your appointment request has been received. Our team will contact you shortly to confirm your private consultation.",
  },

  /* ==========================================================
     FRENCH
  ========================================================== */

  fr: {
    "header.eyebrow": "Votre Muhurtham",
    "header.titleLine1": "Réservez",
    "header.titleLine2": "votre visite",
    "header.subtitle":
      "Réservez un moment privilégié dans notre showroom.",

    "progress.step": "Étape",
    "progress.of": "sur",

    "step1.eyebrow": "Première étape",
    "step1.title": "Choisissez un service",

    "step2.eyebrow": "Deuxième étape",
    "step2.title": "Choisissez la date et l'heure",

    "step3.eyebrow": "Troisième étape",
    "step3.title": "Vos coordonnées",

    "services.bridal.label": "MARIÉE",
    "services.bridal.title": "Consultation nuptiale",
    "services.bridal.description":
      "Une découverte personnalisée de nos collections de lehengas de mariée, du stylisme et de vos besoins pour le mariage.",

    "services.groom.label": "MARIÉ",
    "services.groom.title": "Consultation du marié",
    "services.groom.description":
      "Découvrez nos sherwanis raffinés, notre confection cérémonielle et nos possibilités de stylisme pour le marié moderne.",

    "services.bridal-groom.label": "MARIÉE & MARIÉ",
    "services.bridal-groom.title":
      "Consultation mariée & marié",
    "services.bridal-groom.description":
      "Une consultation complète pour la mariée et le marié, pensée avec soin pour votre célébration.",

    "services.fitting.label": "PRIVÉ",
    "services.fitting.title": "Rendez-vous privé",
    "services.fitting.description":
      "Essayage privé, retouches et ajustements finaux pour une tenue existante de la Collection Muhurtham.",

    "calendar.previousMonth": "Mois précédent",
    "calendar.nextMonth": "Mois suivant",
    "calendar.closed": "Fermé",

    "calendar.legend.selected": "Sélectionné",
    "calendar.legend.available": "Disponible",
    "calendar.legend.unavailable": "Indisponible",

    "time.available": "Horaires disponibles",

    "selection.title": "Votre sélection",
    "selection.selectDate": "Choisissez une date",

    "form.fullName.label": "Nom complet",
    "form.fullName.placeholder":
      "Entrez votre nom complet",

    "form.email.label": "Adresse e-mail",
    "form.email.placeholder":
      "vous@exemple.com",

    "form.phone.label": "Numéro de téléphone",
    "form.phone.placeholder":
      "+41 79 930 32 37",

    "form.message.label": "Demandes supplémentaires",
    "form.message.placeholder":
      "Indiquez-nous tout ce que vous souhaitez que nous préparions pour votre visite...",

    "summary.title": "Résumé du rendez-vous",
    "summary.service": "Service",
    "summary.date": "Date",
    "summary.time": "Heure",

    "navigation.back": "Retour",
    "navigation.next": "Étape suivante",
    "navigation.confirm": "Confirmer le rendez-vous",

    "image.privateAtelier": "Atelier privé",
    "image.cardTitleLine1": "L'Atelier",
    "image.cardTitleLine2": "Privé",
    "image.cardDescription":
      "Profitez d'une consultation personnalisée avec nos stylistes dans un cadre calme et luxueux.",
    "image.mobileDescription":
      "Une consultation personnalisée pensée autour de votre célébration.",

    "images.mainAlt":
      "Showroom de la Collection Muhurtham pour rendez-vous nuptial",
    "images.mobileAlt":
      "Consultation nuptiale privée de la Collection Muhurtham",

    "bottom.titleLine1":
      "Votre célébration commence",
    "bottom.titleLine2":
      "par une conversation.",
    "bottom.description":
      "Rendez-nous visite dans notre showroom à Dagmersellen, en Suisse, et découvrez un univers soigneusement sélectionné dédié à l'élégance nuptiale indienne et tamoule.",

    "confirmation.eyebrow":
      "Demande de rendez-vous reçue",
    "confirmation.titleLine1":
      "Nous avons hâte",
    "confirmation.titleLine2":
      "de vous accueillir.",
    "confirmation.message":
      "Merci, {{name}}. Votre demande de rendez-vous a bien été reçue. Notre équipe vous contactera prochainement pour confirmer votre consultation privée.",
  },

  /* ==========================================================
     GERMAN
  ========================================================== */

  de: {
    "header.eyebrow": "Ihr Muhurtham",
    "header.titleLine1": "Buchen Sie",
    "header.titleLine2": "Ihren Besuch",
    "header.subtitle":
      "Reservieren Sie eine persönliche Zeit in unserem Showroom.",

    "progress.step": "Schritt",
    "progress.of": "von",

    "step1.eyebrow": "Erster Schritt",
    "step1.title": "Service auswählen",

    "step2.eyebrow": "Zweiter Schritt",
    "step2.title": "Datum & Uhrzeit auswählen",

    "step3.eyebrow": "Dritter Schritt",
    "step3.title": "Ihre Angaben",

    "services.bridal.label": "BRAUT",
    "services.bridal.title": "Brautberatung",
    "services.bridal.description":
      "Eine persönliche Beratung zu unseren Braut-Lehenga-Kollektionen, Styling-Möglichkeiten und Ihren Wünschen für die Hochzeit.",

    "services.groom.label": "BRÄUTIGAM",
    "services.groom.title": "Bräutigam-Beratung",
    "services.groom.description":
      "Entdecken Sie elegante Sherwanis, festliche Schneiderei und Styling-Möglichkeiten für den modernen Bräutigam.",

    "services.bridal-groom.label": "BRAUT & BRÄUTIGAM",
    "services.bridal-groom.title":
      "Beratung für Braut & Bräutigam",
    "services.bridal-groom.description":
      "Eine umfassende Beratung für Braut und Bräutigam, sorgfältig auf Ihre Feier abgestimmt.",

    "services.fitting.label": "PRIVAT",
    "services.fitting.title": "Privater Termin",
    "services.fitting.description":
      "Private Anprobe, Änderungen und letzte Anpassungen für ein bestehendes Outfit der Muhurtham Kollektion.",

    "calendar.previousMonth": "Vorheriger Monat",
    "calendar.nextMonth": "Nächster Monat",
    "calendar.closed": "Geschlossen",

    "calendar.legend.selected": "Ausgewählt",
    "calendar.legend.available": "Verfügbar",
    "calendar.legend.unavailable": "Nicht verfügbar",

    "time.available": "Verfügbare Zeiten",

    "selection.title": "Ihre Auswahl",
    "selection.selectDate": "Datum auswählen",

    "form.fullName.label": "Vollständiger Name",
    "form.fullName.placeholder":
      "Geben Sie Ihren vollständigen Namen ein",

    "form.email.label": "E-Mail-Adresse",
    "form.email.placeholder":
      "sie@beispiel.com",

    "form.phone.label": "Telefonnummer",
    "form.phone.placeholder":
      "+41 79 930 32 37",

    "form.message.label": "Zusätzliche Wünsche",
    "form.message.placeholder":
      "Teilen Sie uns mit, was wir für Ihren Besuch vorbereiten dürfen...",

    "summary.title": "Terminübersicht",
    "summary.service": "Service",
    "summary.date": "Datum",
    "summary.time": "Uhrzeit",

    "navigation.back": "Zurück",
    "navigation.next": "Nächster Schritt",
    "navigation.confirm": "Termin bestätigen",

    "image.privateAtelier": "Privates Atelier",
    "image.cardTitleLine1": "Das Private",
    "image.cardTitleLine2": "Atelier",
    "image.cardDescription":
      "Erleben Sie eine persönliche Beratung mit unseren Brautstylisten in einer ruhigen und luxuriösen Atmosphäre.",
    "image.mobileDescription":
      "Eine persönliche Beratung, die ganz auf Ihre Feier abgestimmt ist.",

    "images.mainAlt":
      "Muhurtham Kollektion Showroom für Brautberatung",
    "images.mobileAlt":
      "Private Brautberatung der Muhurtham Kollektion",

    "bottom.titleLine1":
      "Ihre Feier beginnt",
    "bottom.titleLine2":
      "mit einem Gespräch.",
    "bottom.description":
      "Besuchen Sie unseren Showroom in Dagmersellen, Schweiz, und entdecken Sie eine sorgfältig kuratierte Welt indischer und tamilischer Brautmode.",

    "confirmation.eyebrow":
      "Terminanfrage erhalten",
    "confirmation.titleLine1":
      "Wir freuen uns darauf,",
    "confirmation.titleLine2":
      "Sie willkommen zu heißen.",
    "confirmation.message":
      "Vielen Dank, {{name}}. Ihre Terminanfrage wurde erhalten. Unser Team wird sich in Kürze mit Ihnen in Verbindung setzen, um Ihre persönliche Beratung zu bestätigen.",
  },

  /* ==========================================================
     ITALIAN
  ========================================================== */

  it: {
    "header.eyebrow": "Il vostro Muhurtham",
    "header.titleLine1": "Prenota",
    "header.titleLine2": "la vostra visita",
    "header.subtitle":
      "Prenotate un momento dedicato nel nostro showroom.",

    "progress.step": "Passo",
    "progress.of": "di",

    "step1.eyebrow": "Primo passo",
    "step1.title": "Seleziona il servizio",

    "step2.eyebrow": "Secondo passo",
    "step2.title": "Seleziona data e ora",

    "step3.eyebrow": "Terzo passo",
    "step3.title": "I vostri dati",

    "services.bridal.label": "SPOSA",
    "services.bridal.title": "Consulenza sposa",
    "services.bridal.description":
      "Una scoperta personalizzata delle nostre collezioni di lehenga da sposa, dello styling e delle esigenze per il vostro matrimonio.",

    "services.groom.label": "SPOSO",
    "services.groom.title": "Consulenza sposo",
    "services.groom.description":
      "Scoprite sherwani raffinati, sartoria cerimoniale e soluzioni di styling pensate per lo sposo moderno.",

    "services.bridal-groom.label": "SPOSA & SPOSO",
    "services.bridal-groom.title":
      "Consulenza sposa e sposo",
    "services.bridal-groom.description":
      "Una consulenza completa per sposa e sposo, curata con attenzione per la vostra celebrazione.",

    "services.fitting.label": "PRIVATO",
    "services.fitting.title": "Appuntamento privato",
    "services.fitting.description":
      "Prova privata, modifiche e regolazioni finali per un outfit esistente della Collezione Muhurtham.",

    "calendar.previousMonth": "Mese precedente",
    "calendar.nextMonth": "Mese successivo",
    "calendar.closed": "Chiuso",

    "calendar.legend.selected": "Selezionato",
    "calendar.legend.available": "Disponibile",
    "calendar.legend.unavailable": "Non disponibile",

    "time.available": "Orari disponibili",

    "selection.title": "La vostra selezione",
    "selection.selectDate": "Seleziona una data",

    "form.fullName.label": "Nome completo",
    "form.fullName.placeholder":
      "Inserite il vostro nome completo",

    "form.email.label": "Indirizzo e-mail",
    "form.email.placeholder":
      "voi@esempio.com",

    "form.phone.label": "Numero di telefono",
    "form.phone.placeholder":
      "+41 79 930 32 37",

    "form.message.label": "Richieste aggiuntive",
    "form.message.placeholder":
      "Indicateci qualsiasi cosa desideriate che prepariamo per la vostra visita...",

    "summary.title": "Riepilogo appuntamento",
    "summary.service": "Servizio",
    "summary.date": "Data",
    "summary.time": "Ora",

    "navigation.back": "Indietro",
    "navigation.next": "Passo successivo",
    "navigation.confirm": "Conferma appuntamento",

    "image.privateAtelier": "Atelier privato",
    "image.cardTitleLine1": "L'Atelier",
    "image.cardTitleLine2": "Privato",
    "image.cardDescription":
      "Vivete una consulenza personalizzata con i nostri stylist in un ambiente tranquillo e lussuoso.",
    "image.mobileDescription":
      "Una consulenza personalizzata pensata intorno alla vostra celebrazione.",

    "images.mainAlt":
      "Showroom della Collezione Muhurtham per appuntamenti da sposa",
    "images.mobileAlt":
      "Consulenza privata da sposa della Collezione Muhurtham",

    "bottom.titleLine1":
      "La vostra celebrazione inizia",
    "bottom.titleLine2":
      "con una conversazione.",
    "bottom.description":
      "Venite a trovarci nel nostro showroom a Dagmersellen, in Svizzera, e scoprite un mondo accuratamente curato di eleganza nuziale indiana e tamil.",

    "confirmation.eyebrow":
      "Richiesta di appuntamento ricevuta",
    "confirmation.titleLine1":
      "Non vediamo l'ora",
    "confirmation.titleLine2":
      "di darvi il benvenuto.",
    "confirmation.message":
      "Grazie, {{name}}. La vostra richiesta di appuntamento è stata ricevuta. Il nostro team vi contatterà a breve per confermare la vostra consulenza privata.",
  },
};

/* ============================================================
   DATE HELPERS
============================================================ */

function normalizeDate(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
}

function isSameDay(
  date1: Date | null,
  date2: Date,
) {
  if (!date1) {
    return false;
  }

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function getCalendarDays(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const firstDay = new Date(
    year,
    monthIndex,
    1,
  );

  const mondayIndex =
    firstDay.getDay() === 0
      ? 6
      : firstDay.getDay() - 1;

  const daysInMonth = new Date(
    year,
    monthIndex + 1,
    0,
  ).getDate();

  const previousMonthDays = new Date(
    year,
    monthIndex,
    0,
  ).getDate();

  const days: {
    date: Date;
    currentMonth: boolean;
  }[] = [];

  for (
    let i = mondayIndex - 1;
    i >= 0;
    i--
  ) {
    days.push({
      date: new Date(
        year,
        monthIndex - 1,
        previousMonthDays - i,
      ),
      currentMonth: false,
    });
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    days.push({
      date: new Date(
        year,
        monthIndex,
        day,
      ),
      currentMonth: true,
    });
  }

  let nextDay = 1;

  while (days.length < 42) {
    days.push({
      date: new Date(
        year,
        monthIndex + 1,
        nextDay,
      ),
      currentMonth: false,
    });

    nextDay++;
  }

  return days;
}

/* ============================================================
   PAGE
============================================================ */

function AppointmentPage() {
  const location = useLocation();
  const { i18n } = useTranslation();

  /* ==========================================================
     LANGUAGE FROM URL
  ========================================================== */

  const pathnameParts =
    location.pathname.split("/");

  const pathLanguage =
    pathnameParts[1];

  const language: SupportedLanguage =
    supportedLanguages.includes(
      pathLanguage as SupportedLanguage,
    )
      ? (pathLanguage as SupportedLanguage)
      : "en";

  /* ==========================================================
     KEEP I18NEXT IN SYNC WITH URL
  ========================================================== */

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  /* ==========================================================
     GUARANTEED TRANSLATION HELPER
  ========================================================== */

  const text = (
    key: string,
    fallback = "",
  ): string => {
    return (
      appointmentTranslations[language][key] ??
      fallback
    );
  };

  /* ==========================================================
     LOCALE
  ========================================================== */

  const localeMap: Record<
    SupportedLanguage,
    string
  > = {
    en: "en-US",
    fr: "fr-FR",
    de: "de-DE",
    it: "it-IT",
  };

  const locale = localeMap[language];

  /* ==========================================================
     BRAND
  ========================================================== */

  const brandName: Record<
    SupportedLanguage,
    string
  > = {
    en: "Muhurtham Collection",
    fr: "Collection Muhurtham",
    de: "Muhurtham Kollektion",
    it: "Collezione Muhurtham",
  };

  const shortBrandName: Record<
    SupportedLanguage,
    string
  > = {
    en: "Muhurtham",
    fr: "Muhurtham",
    de: "Muhurtham",
    it: "Muhurtham",
  };

  /* ==========================================================
     TODAY
  ========================================================== */

  const today = normalizeDate(
    new Date(),
  );

  /* ==========================================================
     STATE
  ========================================================== */

  const [step, setStep] =
    useState<number>(1);

  const [
    selectedService,
    setSelectedService,
  ] = useState<string>("bridal");

  const [
    calendarMonth,
    setCalendarMonth,
  ] = useState<Date>(
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    ),
  );

  const [
    selectedDate,
    setSelectedDate,
  ] = useState<Date | null>(null);

  const [
    selectedTime,
    setSelectedTime,
  ] = useState<string>(
    "10:00 AM",
  );

  const [
    formData,
    setFormData,
  ] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [
    confirmed,
    setConfirmed,
  ] = useState<boolean>(false);

  /* ==========================================================
     SELECTED SERVICE
  ========================================================== */

  const selectedServiceData =
    services.find(
      (service) =>
        service.id === selectedService,
    );

  /* ==========================================================
     CALENDAR
  ========================================================== */

  const calendarDays =
    getCalendarDays(calendarMonth);

  const monthName =
    calendarMonth.toLocaleDateString(
      locale,
      {
        month: "long",
      },
    );

  const yearName =
    calendarMonth.getFullYear();

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const canContinueStepThree =
    formData.fullName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim() !== "";

  /* ==========================================================
     CURRENT MONTH
  ========================================================== */

  const isCurrentMonth =
    calendarMonth.getFullYear() ===
      today.getFullYear() &&
    calendarMonth.getMonth() ===
      today.getMonth();

  /* ==========================================================
     PREVIOUS MONTH
  ========================================================== */

  const previousMonth = () => {
    if (isCurrentMonth) {
      return;
    }

    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() - 1,
        1,
      ),
    );
  };

  /* ==========================================================
     NEXT MONTH
  ========================================================== */

  const nextMonth = () => {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + 1,
        1,
      ),
    );
  };

  /* ==========================================================
     DATE AVAILABILITY
  ========================================================== */

  const isDateAvailable = (
    date: Date,
  ) => {
    const normalized =
      normalizeDate(date);

    if (normalized < today) {
      return false;
    }

    /*
     * Sunday is closed.
     */
    if (date.getDay() === 0) {
      return false;
    }

    return true;
  };

  /* ==========================================================
     NEXT STEP
  ========================================================== */

  const goNext = () => {
    if (
      step === 1 &&
      selectedService
    ) {
      setStep(2);
      return;
    }

    if (
      step === 2 &&
      selectedDate &&
      selectedTime
    ) {
      setStep(3);
      return;
    }

    if (
      step === 3 &&
      canContinueStepThree
    ) {
      setConfirmed(true);
    }
  };

  /* ==========================================================
     BACK
  ========================================================== */

  const goBack = () => {
    if (step > 1) {
      setStep(
        (current) => current - 1,
      );
    }
  };

  /* ==========================================================
     UPDATE FORM
  ========================================================== */

  const updateField = (
    field: keyof typeof formData,
    value: string,
  ) => {
    setFormData(
      (current) => ({
        ...current,
        [field]: value,
      }),
    );
  };

  /* ==========================================================
     SERVICE TITLE
  ========================================================== */

  const getServiceTitle = (
    serviceId: string,
  ) => {
    return text(
      `services.${serviceId}.title`,
    );
  };

  /* ==========================================================
     SERVICE DESCRIPTION
  ========================================================== */

  const getServiceDescription = (
    serviceId: string,
  ) => {
    return text(
      `services.${serviceId}.description`,
    );
  };

  /* ==========================================================
     SERVICE LABEL
  ========================================================== */

  const getServiceLabel = (
    serviceId: string,
  ) => {
    return text(
      `services.${serviceId}.label`,
    );
  };

  /* ==========================================================
     CONFIRMATION
  ========================================================== */

  if (confirmed) {
    return (
      <main className="min-h-screen bg-[#f7f3ed] text-[#171514]">
        <section className="flex min-h-screen items-center justify-center px-6 py-20">
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="w-full max-w-190 text-center"
          >
            {/* SUCCESS ICON */}

            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#9b7045]">
              <Check
                size={27}
                strokeWidth={1.4}
                className="text-[#8d6139]"
              />
            </div>

            {/* EYEBROW */}

            <p className="mb-5 text-[10px] uppercase tracking-[0.42em] text-[#946a43]">
              {text(
                "confirmation.eyebrow",
              )}
            </p>

            {/* TITLE */}

            <h1 className="font-serif text-5xl leading-[0.95] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
              {text(
                "confirmation.titleLine1",
              )}
              <br />

              <span className="italic">
                {text(
                  "confirmation.titleLine2",
                )}
              </span>
            </h1>

            {/* DIVIDER */}

            <div className="mx-auto my-8 flex items-center justify-center gap-3">
              <span className="h-px w-14 bg-[#a47b52]" />

              <span className="h-1.5 w-1.5 rotate-45 border border-[#a47b52]" />

              <span className="h-px w-14 bg-[#a47b52]" />
            </div>

            {/* MESSAGE */}

            <p className="mx-auto max-w-140 font-serif text-base leading-7 text-[#625b54] sm:text-lg">
              {text(
                "confirmation.message",
              ).replace(
                "{{name}}",
                formData.fullName,
              )}
            </p>

            {/* SUMMARY */}

            <div className="mx-auto mt-10 max-w-125 border border-[#d8cec1] bg-[#fbf9f5] p-7 text-left">
              <p className="mb-5 text-[9px] uppercase tracking-[0.3em] text-[#946a43]">
                {text(
                  "summary.title",
                )}
              </p>

              <div className="space-y-4 text-sm">
                {/* SERVICE */}

                <div className="flex justify-between gap-5 border-b border-[#e4ddd4] pb-3">
                  <span className="text-[#817970]">
                    {text(
                      "summary.service",
                    )}
                  </span>

                  <span className="text-right">
                    {selectedServiceData
                      ? getServiceTitle(
                          selectedServiceData.id,
                        )
                      : ""}
                  </span>
                </div>

                {/* DATE */}

                <div className="flex justify-between gap-5 border-b border-[#e4ddd4] pb-3">
                  <span className="text-[#817970]">
                    {text(
                      "summary.date",
                    )}
                  </span>

                  <span>
                    {selectedDate
                      ? selectedDate.toLocaleDateString(
                          locale,
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )
                      : ""}
                  </span>
                </div>

                {/* TIME */}

                <div className="flex justify-between gap-5">
                  <span className="text-[#817970]">
                    {text(
                      "summary.time",
                    )}
                  </span>

                  <span>
                    {selectedTime}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    );
  }

  /* ============================================================
     MAIN PAGE
  ============================================================ */

  return (
    <main className="min-h-screen bg-[#f7f3ed] text-[#171514]">
      <section className="px-4 py-8 sm:px-8 sm:py-12 lg:px-12 xl:px-20">
        <div className="mx-auto grid max-w-375 overflow-hidden border border-[#ddd4ca] bg-ivory lg:grid-cols-[46%_54%]">

          {/* =====================================================
              LEFT IMAGE
          ===================================================== */}

          <div className="relative hidden min-h-212.5 overflow-hidden lg:block">
            <img
              src="/images/appointment1.png"
              alt={text(
                "images.mainAlt",
              )}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/10" />

            {/* BRAND */}

            <div className="absolute left-8 top-8">
              <p className="text-[9px] uppercase tracking-[0.42em] text-white">
                {brandName[language]}
              </p>
            </div>

            {/* VERTICAL LABEL */}

            <div className="absolute left-7 top-1/2 -translate-y-1/2">
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-white/70" />

                <span className="-rotate-90 whitespace-nowrap text-[8px] uppercase tracking-[0.45em] text-white">
                  {text(
                    "image.privateAtelier",
                  )}
                </span>
              </div>
            </div>

            {/* IMAGE CARD */}

            <motion.div
              initial={{
                opacity: 0,
                x: -25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.9,
                delay: 0.25,
              }}
              className="absolute bottom-8 right-7 max-w-82.5 border border-white/40 bg-[#f4f1ec]/95 p-7 backdrop-blur-sm xl:bottom-10 xl:right-10"
            >
              <p className="mb-3 font-serif text-2xl leading-tight">
                {text(
                  "image.cardTitleLine1",
                )}
                <br />

                <span className="italic">
                  {text(
                    "image.cardTitleLine2",
                  )}
                </span>
              </p>

              <p className="font-sans text-sm leading-6 text-[#5d5751]">
                {text(
                  "image.cardDescription",
                )}
              </p>
            </motion.div>
          </div>

          {/* =====================================================
              RIGHT PANEL
          ===================================================== */}

          <div className="flex min-h-212.5 flex-col px-7 py-10 sm:px-10 sm:py-12 lg:px-14 xl:px-20">

            {/* HEADER */}

            <div>
              <p className="mb-4 text-[9px] uppercase tracking-[0.4em] text-[#936943]">
                {text(
                  "header.eyebrow",
                )}
              </p>

              <h1 className="max-w-125 font-serif text-5xl leading-[0.9] tracking-[-0.04em] sm:text-6xl xl:text-[76px]">
                {text(
                  "header.titleLine1",
                )}

                <br />

                <span className="italic">
                  {text(
                    "header.titleLine2",
                  )}
                </span>
              </h1>

              <p className="mt-6 font-serif text-base text-[#665f58] sm:text-lg">
                {text(
                  "header.subtitle",
                )}
              </p>
            </div>

            {/* PROGRESS */}

            <div className="mt-10">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-[#c9b7a3]">
                  <motion.div
                    animate={{
                      width:
                        step === 1
                          ? "33%"
                          : step === 2
                          ? "66%"
                          : "100%",
                    }}
                    transition={{
                      duration: 0.5,
                    }}
                    className="h-full bg-[#8c6038]"
                  />
                </div>

                <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.28em] text-[#5f564e]">
                  {text(
                    "progress.step",
                  )}{" "}
                  {step}{" "}
                  {text(
                    "progress.of",
                  )}{" "}
                  3
                </span>
              </div>
            </div>

            {/* CONTENT */}

            <div className="relative mt-12 flex-1">
              <AnimatePresence mode="wait">

                {/* =================================================
                    STEP 1
                ================================================= */}

                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{
                      opacity: 0,
                      x: 25,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -25,
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                  >
                    <div className="mb-8">
                      <p className="mb-2 text-[9px] uppercase tracking-[0.3em] text-[#916841]">
                        {text(
                          "step1.eyebrow",
                        )}
                      </p>

                      <h2 className="font-serif text-3xl sm:text-4xl">
                        {text(
                          "step1.title",
                        )}
                      </h2>
                    </div>

                    {/* =================================================
                        SERVICE CARDS
                    ================================================= */}

                    <div className="space-y-4">
                      {services.map(
                        (service) => {
                          const active =
                            selectedService ===
                            service.id;

                          return (
                            <motion.button
                              key={service.id}
                              type="button"
                              onClick={() =>
                                setSelectedService(
                                  service.id,
                                )
                              }
                              whileHover={{
                                scale: 1.025,
                                backgroundColor:
                                  "#F0E1CF",
                                borderColor:
                                  "#9A6A3F",
                              }}
                              whileTap={{
                                scale: 0.995,
                              }}
                              transition={{
                                duration: 0.3,
                                ease: "easeOut",
                              }}
                              className={`group relative w-full select-none overflow-hidden border p-5 text-left sm:p-6 ${
                                active
                                  ? "border-[#8d6038] bg-[#f3e9dc]"
                                  : "border-[#d9d0c6] bg-transparent"
                              }`}
                            >
                              {/* SUBTLE HOVER OVERLAY */}

                              <motion.span
                                initial={{
                                  opacity: 0,
                                }}
                                whileHover={{
                                  opacity: 1,
                                }}
                                transition={{
                                  duration: 0.3,
                                }}
                                className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#b98b61]/8 via-transparent to-[#b98b61]/5"
                              />

                              <div className="relative z-10 flex items-start justify-between gap-5">

                                {/* CONTENT */}

                                <div>
                                  <div className="mb-2 flex items-center gap-3">
                                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#80644c] transition-colors duration-300 group-hover:text-[#6f472c]">
                                      {getServiceLabel(
                                        service.id,
                                      )}
                                    </span>

                                    {active && (
                                      <motion.span
                                        initial={{
                                          scale: 0,
                                          opacity: 0,
                                        }}
                                        animate={{
                                          scale: 1,
                                          opacity: 1,
                                        }}
                                        className="h-1.5 w-1.5 rounded-full bg-[#8d6038]"
                                      />
                                    )}
                                  </div>

                                  {/* TITLE */}

                                  <motion.h3
                                    animate={{
                                      color: active
                                        ? "#68472E"
                                        : "#171514",
                                    }}
                                    whileHover={{
                                      color: "#6F472C",
                                      fontWeight: 500,
                                    }}
                                    transition={{
                                      duration: 0.25,
                                    }}
                                    className={`font-serif text-xl transition-all duration-300 sm:text-2xl ${
                                      active
                                        ? "font-medium"
                                        : "font-normal"
                                    }`}
                                  >
                                    {getServiceTitle(
                                      service.id,
                                    )}
                                  </motion.h3>

                                  {/* DESCRIPTION */}

                                  <p className="mt-2 max-w-142.5 text-sm leading-6 text-[#69615a] transition-colors duration-300 group-hover:text-[#5f4a38]">
                                    {getServiceDescription(
                                      service.id,
                                    )}
                                  </p>
                                </div>

                                {/* CHECK CIRCLE */}

                                <motion.div
                                  animate={{
                                    scale: active
                                      ? 1.05
                                      : 1,
                                    backgroundColor:
                                      active
                                        ? "#8d6038"
                                        : "rgba(0,0,0,0)",
                                    borderColor:
                                      active
                                        ? "#8d6038"
                                        : "#b9aaa0",
                                  }}
                                  whileHover={{
                                    scale: 1.16,
                                    backgroundColor:
                                      "#8d6038",
                                    borderColor:
                                      "#8d6038",
                                    color: "#ffffff",
                                  }}
                                  transition={{
                                    duration: 0.3,
                                    ease: "easeOut",
                                  }}
                                  className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                                    active
                                      ? "text-white"
                                      : "text-transparent"
                                  }`}
                                >
                                  <Check
                                    size={13}
                                    strokeWidth={1.8}
                                  />
                                </motion.div>
                              </div>
                            </motion.button>
                          );
                        },
                      )}
                    </div>
                  </motion.div>
                )}

                {/* =================================================
                    STEP 2
                ================================================= */}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{
                      opacity: 0,
                      x: 25,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -25,
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                  >
                    <div className="mb-8">
                      <p className="mb-2 text-[9px] uppercase tracking-[0.3em] text-[#916841]">
                        {text(
                          "step2.eyebrow",
                        )}
                      </p>

                      <h2 className="font-serif text-3xl sm:text-4xl">
                        {text(
                          "step2.title",
                        )}
                      </h2>
                    </div>

                    {/* CALENDAR */}

                    <div className="border border-[#d8cec4] bg-ivory p-5 sm:p-7">

                      {/* CALENDAR HEADER */}

                      <div className="mb-7 flex items-center justify-between border-b border-[#ded5cc] pb-5">
                        <div className="flex items-center gap-3">
                          <CalendarDays
                            size={17}
                            strokeWidth={1.3}
                            className="text-[#8c6039]"
                          />

                          <div>
                            <p className="font-serif text-2xl capitalize">
                              {monthName}
                            </p>

                            <p className="mt-0.5 text-[8px] uppercase tracking-[0.25em] text-[#92867c]">
                              {yearName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={
                              previousMonth
                            }
                            disabled={
                              isCurrentMonth
                            }
                            aria-label={text(
                              "calendar.previousMonth",
                            )}
                            title={text(
                              "calendar.previousMonth",
                            )}
                            className={`flex h-9 w-9 items-center justify-center border transition-all ${
                              isCurrentMonth
                                ? "cursor-not-allowed border-[#e4ddd5] text-[#c7beb5]"
                                : "border-[#d5c9be] text-[#544b44] hover:border-[#936943] hover:text-[#936943]"
                            }`}
                          >
                            <ChevronLeft
                              size={16}
                              strokeWidth={1.3}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={
                              nextMonth
                            }
                            aria-label={text(
                              "calendar.nextMonth",
                            )}
                            title={text(
                              "calendar.nextMonth",
                            )}
                            className="flex h-9 w-9 items-center justify-center border border-[#d5c9be] text-[#544b44] transition-all hover:border-[#936943] hover:text-[#936943]"
                          >
                            <ChevronRight
                              size={16}
                              strokeWidth={1.3}
                            />
                          </button>
                        </div>
                      </div>

                      {/* WEEK DAYS */}

                      <div className="mb-2 grid grid-cols-7">
                        {weekDays.map(
                          (day) => (
                            <div
                              key={day.key}
                              className="py-2 text-center text-[8px] uppercase tracking-[0.18em] text-[#92867c]"
                            >
                              {day[language]}
                            </div>
                          ),
                        )}
                      </div>

                      {/* DAYS */}

                      <div className="grid grid-cols-7 border-l border-t border-[#e1d9d1]">
                        {calendarDays.map(
                          (
                            {
                              date,
                              currentMonth,
                            },
                            index,
                          ) => {
                            const available =
                              isDateAvailable(
                                date,
                              );

                            const selected =
                              isSameDay(
                                selectedDate,
                                date,
                              );

                            const todayDate =
                              isSameDay(
                                today,
                                date,
                              );

                            return (
                              <button
                                key={`${date.toISOString()}-${index}`}
                                type="button"
                                disabled={
                                  !currentMonth ||
                                  !available
                                }
                                onClick={() => {
                                  if (
                                    available
                                  ) {
                                    setSelectedDate(
                                      date,
                                    );
                                  }
                                }}
                                className={`relative flex aspect-square min-h-13 items-center justify-center border-b border-r border-[#e1d9d1] transition-all duration-200 sm:min-h-15.5 ${
                                  !currentMonth
                                    ? "cursor-default bg-[#f7f4ef] text-[#d1c9c1]"
                                    : !available
                                    ? "cursor-not-allowed bg-[#f8f5f1] text-[#c7beb6]"
                                    : selected
                                    ? "bg-[#eadcca] text-[#6f4c2f]"
                                    : "bg-ivory text-[#2d2926] hover:bg-[#f1e8de]"
                                }`}
                              >
                                <span
                                  className={`font-serif text-base sm:text-lg ${
                                    selected
                                      ? "font-medium"
                                      : ""
                                  }`}
                                >
                                  {date.getDate()}
                                </span>

                                {todayDate &&
                                  currentMonth &&
                                  !selected && (
                                    <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-[#936943]" />
                                  )}

                                {date.getDay() ===
                                  0 &&
                                  currentMonth && (
                                    <span className="absolute bottom-1 text-[6px] uppercase tracking-wider text-[#b2a69d]">
                                      {text(
                                        "calendar.closed",
                                      )}
                                    </span>
                                  )}
                              </button>
                            );
                          },
                        )}
                      </div>

                      {/* LEGEND */}

                      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#ded5cc] pt-4">

                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 bg-[#eadcca]" />

                          <span className="text-[8px] uppercase tracking-[0.15em] text-[#81776f]">
                            {text(
                              "calendar.legend.selected",
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 border border-[#d5c9be] bg-ivory" />

                          <span className="text-[8px] uppercase tracking-[0.15em] text-[#81776f]">
                            {text(
                              "calendar.legend.available",
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 bg-[#eee9e4]" />

                          <span className="text-[8px] uppercase tracking-[0.15em] text-[#a0968e]">
                            {text(
                              "calendar.legend.unavailable",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* TIME */}

                    {selectedDate && (
                      <div className="mt-8">
                        <div className="mb-4 flex items-center gap-2">
                          <Clock3
                            size={15}
                            strokeWidth={1.4}
                            className="text-[#8c6039]"
                          />

                          <p className="text-[9px] uppercase tracking-[0.28em] text-[#625950]">
                            {text(
                              "time.available",
                            )}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {timeSlots.map(
                            (time) => {
                              const active =
                                selectedTime ===
                                time;

                              return (
                                <button
                                  key={time}
                                  type="button"
                                  onClick={() =>
                                    setSelectedTime(
                                      time,
                                    )
                                  }
                                  className={`border px-4 py-4 text-sm transition-all duration-300 ${
                                    active
                                      ? "border-[#8c6039] bg-[#f1e5d7] text-[#68472e]"
                                      : "border-[#d8cec4] hover:border-[#a78668]"
                                  }`}
                                >
                                  {time}
                                </button>
                              );
                            },
                          )}
                        </div>
                      </div>
                    )}

                    {/* SELECTION */}

                    <div className="mt-8 border-t border-[#ded5cc] pt-5">
                      <p className="text-[9px] uppercase tracking-[0.25em] text-[#8c6a4d]">
                        {text(
                          "selection.title",
                        )}
                      </p>

                      <p className="mt-2 font-serif text-lg">
                        {selectedDate
                          ? selectedDate.toLocaleDateString(
                              locale,
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )
                          : text(
                              "selection.selectDate",
                            )}

                        {selectedDate && (
                          <>
                            {" "}
                            ·{" "}
                            {selectedTime}
                          </>
                        )}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* =================================================
                    STEP 3
                ================================================= */}

                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{
                      opacity: 0,
                      x: 25,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -25,
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                  >
                    <div className="mb-8">
                      <p className="mb-2 text-[9px] uppercase tracking-[0.3em] text-[#916841]">
                        {text(
                          "step3.eyebrow",
                        )}
                      </p>

                      <h2 className="font-serif text-3xl sm:text-4xl">
                        {text(
                          "step3.title",
                        )}
                      </h2>
                    </div>

                    <div className="space-y-7">

                      {/* FULL NAME */}

                      <div>
                        <label
                          htmlFor="fullName"
                          className="mb-2 block text-[9px] uppercase tracking-[0.27em] text-[#4f4842]"
                        >
                          {text(
                            "form.fullName.label",
                          )}
                        </label>

                        <input
                          id="fullName"
                          type="text"
                          value={
                            formData.fullName
                          }
                          onChange={(
                            event,
                          ) =>
                            updateField(
                              "fullName",
                              event.target
                                .value,
                            )
                          }
                          placeholder={text(
                            "form.fullName.placeholder",
                          )}
                          className="w-full border-0 border-b border-[#cfc4b9] bg-transparent px-0 py-3 font-serif text-base outline-none placeholder:text-[#a59a91] focus:border-[#8c6039]"
                        />
                      </div>

                      {/* EMAIL */}

                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block text-[9px] uppercase tracking-[0.27em] text-[#4f4842]"
                        >
                          {text(
                            "form.email.label",
                          )}
                        </label>

                        <input
                          id="email"
                          type="email"
                          value={
                            formData.email
                          }
                          onChange={(
                            event,
                          ) =>
                            updateField(
                              "email",
                              event.target
                                .value,
                            )
                          }
                          placeholder={text(
                            "form.email.placeholder",
                          )}
                          className="w-full border-0 border-b border-[#cfc4b9] bg-transparent px-0 py-3 font-serif text-base outline-none placeholder:text-[#a59a91] focus:border-[#8c6039]"
                        />
                      </div>

                      {/* PHONE */}

                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-2 block text-[9px] uppercase tracking-[0.27em] text-[#4f4842]"
                        >
                          {text(
                            "form.phone.label",
                          )}
                        </label>

                        <input
                          id="phone"
                          type="tel"
                          value={
                            formData.phone
                          }
                          onChange={(
                            event,
                          ) =>
                            updateField(
                              "phone",
                              event.target
                                .value,
                            )
                          }
                          placeholder={text(
                            "form.phone.placeholder",
                          )}
                          className="w-full border-0 border-b border-[#cfc4b9] bg-transparent px-0 py-3 font-serif text-base outline-none placeholder:text-[#a59a91] focus:border-[#8c6039]"
                        />
                      </div>

                      {/* MESSAGE */}

                      <div>
                        <label
                          htmlFor="message"
                          className="mb-2 block text-[9px] uppercase tracking-[0.27em] text-[#4f4842]"
                        >
                          {text(
                            "form.message.label",
                          )}
                        </label>

                        <textarea
                          id="message"
                          value={
                            formData.message
                          }
                          onChange={(
                            event,
                          ) =>
                            updateField(
                              "message",
                              event.target
                                .value,
                            )
                          }
                          placeholder={text(
                            "form.message.placeholder",
                          )}
                          rows={3}
                          className="w-full resize-none border-0 border-b border-[#cfc4b9] bg-transparent px-0 py-3 font-serif text-base outline-none placeholder:text-[#a59a91] focus:border-[#8c6039]"
                        />
                      </div>
                    </div>

                    {/* SUMMARY */}

                    <div className="mt-8 border border-[#ddd3c9] bg-[#f6f0e8] p-5">
                      <p className="mb-4 text-[9px] uppercase tracking-[0.28em] text-[#8c6546]">
                        {text(
                          "summary.title",
                        )}
                      </p>

                      <div className="grid gap-3 text-sm sm:grid-cols-3">

                        {/* SERVICE */}

                        <div>
                          <span className="block text-[8px] uppercase tracking-[0.2em] text-[#91857b]">
                            {text(
                              "summary.service",
                            )}
                          </span>

                          <span className="mt-1 block font-serif">
                            {selectedServiceData
                              ? getServiceTitle(
                                  selectedServiceData.id,
                                )
                              : ""}
                          </span>
                        </div>

                        {/* DATE */}

                        <div>
                          <span className="block text-[8px] uppercase tracking-[0.2em] text-[#91857b]">
                            {text(
                              "summary.date",
                            )}
                          </span>

                          <span className="mt-1 block font-serif">
                            {selectedDate
                              ? selectedDate.toLocaleDateString(
                                  locale,
                                  {
                                    day: "numeric",
                                    month: "short",
                                  },
                                )
                              : ""}
                          </span>
                        </div>

                        {/* TIME */}

                        <div>
                          <span className="block text-[8px] uppercase tracking-[0.2em] text-[#91857b]">
                            {text(
                              "summary.time",
                            )}
                          </span>

                          <span className="mt-1 block font-serif">
                            {selectedTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* =================================================
                NAVIGATION
            ================================================= */}

            <div className="mt-10 flex items-center justify-between border-t border-[#ded5cc] pt-7">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.28em] text-[#403a35] transition-colors hover:text-[#8b603a]"
                >
                  <ArrowLeft
                    size={14}
                    strokeWidth={1.3}
                    className="transition-transform group-hover:-translate-x-1"
                  />

                  {text(
                    "navigation.back",
                  )}
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={goNext}
                disabled={
                  (step === 2 &&
                    !selectedDate) ||
                  (step === 3 &&
                    !canContinueStepThree)
                }
                className={`group flex items-center gap-5 px-7 py-4 text-[9px] uppercase tracking-[0.27em] transition-all duration-300 ${
                  (step === 2 &&
                    !selectedDate) ||
                  (step === 3 &&
                    !canContinueStepThree)
                    ? "cursor-not-allowed bg-[#c9c1ba] text-white/70"
                    : "bg-[#171514] text-white hover:bg-[#8b603a]"
                }`}
              >
                {step === 3
                  ? text(
                      "navigation.confirm",
                    )
                  : text(
                      "navigation.next",
                    )}

                {step === 3 ? (
                  <Check
                    size={15}
                    strokeWidth={1.5}
                  />
                ) : (
                  <ArrowRight
                    size={15}
                    strokeWidth={1.5}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MOBILE IMAGE
      ========================================================= */}

      <section className="px-4 pb-10 sm:px-8 lg:hidden">
        <div className="relative h-120 overflow-hidden">
          <img
            src="/images/appointment1.png"
            alt={text(
              "images.mobileAlt",
            )}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/10" />

          <div className="absolute bottom-5 left-5 right-5 border border-white/40 bg-[#f4f1ec]/95 p-6 backdrop-blur-sm">
            <p className="font-serif text-2xl">
              {text(
                "image.cardTitleLine1",
              )}{" "}

              <span className="italic">
                {text(
                  "image.cardTitleLine2",
                )}
              </span>
            </p>

            <p className="mt-2 text-sm leading-6 text-[#5d5751]">
              {text(
                "image.mobileDescription",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          BOTTOM MESSAGE
      ========================================================= */}

      <section className="border-t border-[#ded5cc] bg-[#f1ece5] px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-225 text-center">
          <p className="mb-4 text-[9px] uppercase tracking-[0.4em] text-[#936943]">
            {shortBrandName[language]}
          </p>

          <h2 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            {text(
              "bottom.titleLine1",
            )}

            <br />

            <span className="italic">
              {text(
                "bottom.titleLine2",
              )}
            </span>
          </h2>

          <div className="mx-auto my-7 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[#a37a51]" />

            <span className="h-1.5 w-1.5 rotate-45 border border-[#a37a51]" />

            <span className="h-px w-12 bg-[#a37a51]" />
          </div>

          <p className="mx-auto max-w-162.5 font-serif text-base leading-7 text-[#696159]">
            {text(
              "bottom.description",
            )}
          </p>
        </div>
      </section>
    </main>
  );
}

export default AppointmentPage;