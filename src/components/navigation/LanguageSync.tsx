import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import i18n, {
  supportedLanguages,
  type LanguageCode,
} from "../../i18n";

function LanguageSync() {
  const location = useLocation();

  useEffect(() => {
    const firstSegment = location.pathname.split("/")[1];

    const language: LanguageCode =
      firstSegment in supportedLanguages
        ? (firstSegment as LanguageCode)
        : "en";

    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }

    document.documentElement.lang = language;
  }, [location.pathname]);

  return null;
}

export default LanguageSync;