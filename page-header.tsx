import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/language-context";

interface PageHeaderProps {
  title: string;
  titleAr?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export function PageHeader({ title, titleAr, showBack = true, onBack }: PageHeaderProps) {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/");
    }
  };

  const displayTitle = isRTL && titleAr ? titleAr : title;
  const BackIcon = isRTL ? ChevronRight : ChevronLeft;

  return (
    <div 
      className="sticky top-0 z-50 bg-background border-b border-border py-3 px-4"
      style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="relative flex items-center justify-center">
        {showBack && (
          <button
            onClick={handleBack}
            className={`absolute ${isRTL ? "right-0" : "left-0"} p-1 rounded-full hover:bg-muted transition-colors`}
            data-testid="button-back"
          >
            <BackIcon className="w-6 h-6 text-primary" />
          </button>
        )}
        <h1 
          className="text-lg font-bold text-primary"
          data-testid="text-page-title"
        >
          {displayTitle}
        </h1>
      </div>
    </div>
  );
}
