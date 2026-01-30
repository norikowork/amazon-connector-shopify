import { useState, useEffect } from "react";
import { initLocale, useTranslation } from "@/lib/i18n";
import { SettingsPage } from "./Settings";
import { ProductsPage } from "./Products";
import { ShipmentsPage } from "./Shipments";
import { BillingPage } from "./Billing";
import { FAQPage } from "./FAQ";
import { SupportPage } from "./Support";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { 
  Settings, 
  Package, 
  Truck, 
  DollarSign, 
  Menu,
  X,
  ShoppingBag,
  HelpCircle,
  CircleHelp
} from "lucide-react";
import { Card } from "@/components/ui/card";

type Page = "onboarding" | "settings" | "products" | "shipments" | "faq" | "billing" | "support";

export default function Index() {
  const [currentPage, setCurrentPage] = useState<Page>("settings");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    initLocale();
  }, []);

  const navigation = [
    { id: "settings" as Page, label: t("nav.settings"), icon: Settings },
    { id: "products" as Page, label: t("nav.products"), icon: Package },
    { id: "shipments" as Page, label: t("nav.shipments"), icon: Truck },
    { id: "faq" as Page, label: t("nav.faq"), icon: CircleHelp },
    { id: "billing" as Page, label: t("nav.billing"), icon: DollarSign },
    { id: "support" as Page, label: t("nav.support"), icon: HelpCircle },
  ];

  const renderPage = () => {
    const pageProps = { onGoToSettings: () => setCurrentPage("settings") };
    switch (currentPage) {
      case "settings":
        return <SettingsPage />;
      case "products":
        return <ProductsPage {...pageProps} />;
      case "shipments":
        return <ShipmentsPage {...pageProps} />;
      case "faq":
        return <FAQPage {...pageProps} />;
      case "billing":
        return <BillingPage {...pageProps} />;
      case "support":
        return <SupportPage {...pageProps} />;
      default:
        return <SettingsPage />;
    }
  };

  const renderOnboarding = () => (
    <div className="min-h-screen bg-gradient-page flex items-center justify-center p-4">
      <Card className="glass-card max-w-2xl w-full p-8 space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-fuchsia-500 shadow-lg shadow-primary/25">
            <ShoppingBag className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient-primary">{t("onboarding.welcome.title")}</h1>
          <p className="text-xl text-muted-foreground">{t("onboarding.welcome.subtitle")}</p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">{t("onboarding.steps.title")}</h2>
          
          <div className="space-y-4">
            <div className="glass-card p-4 rounded-xl hover-lift">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white flex items-center justify-center font-bold shadow-md">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t("onboarding.steps.step1.title")}</h3>
                  <p className="text-muted-foreground">{t("onboarding.steps.step1.description")}</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl hover-lift">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center font-bold shadow-md">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t("onboarding.steps.step2.title")}</h3>
                  <p className="text-muted-foreground">{t("onboarding.steps.step2.description")}</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl hover-lift">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white flex items-center justify-center font-bold shadow-md">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t("onboarding.steps.step3.title")}</h3>
                  <p className="text-muted-foreground">{t("onboarding.steps.step3.description")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={() => setOnboardingComplete(true)}
            className="text-lg px-8"
          >
            {t("onboarding.welcome.nextStep")} →
          </Button>
        </div>
      </Card>
    </div>
  );

  if (!onboardingComplete) {
    return renderOnboarding();
  }

  return (
    <div className="min-h-screen bg-gradient-page">
      <header className="sticky top-0 z-50 glass-header">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="font-bold text-gradient-primary">{t("common.appNameDisplay")}</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  onClick={() => setCurrentPage(item.id)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center space-x-2">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden border-b glass">
          <nav className="container py-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
      )}

      <main className="container py-6 animate-fade-in">
        {renderPage()}
      </main>

      <footer className="border-t glass-header py-6 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="font-medium text-gradient-primary">{t("common.appNameDisplay")}</p>
          <p className="mt-1">© 2026 Rational Ventures. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}