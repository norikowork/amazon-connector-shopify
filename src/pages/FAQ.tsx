import React from "react";
import { useTranslation } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, BookOpen, Truck, DollarSign, Settings } from "lucide-react";

interface FAQPageProps {
  onGoToSettings?: () => void;
}

export function FAQPage({ onGoToSettings }: FAQPageProps) {
  const { t } = useTranslation();

  const categoryIcons: Record<string, React.ReactNode> = {
    gettingStarted: <Settings className="h-5 w-5" />,
    productMapping: <BookOpen className="h-5 w-5" />,
    shipping: <Truck className="h-5 w-5" />,
    billing: <DollarSign className="h-5 w-5" />,
  };

  // Group FAQ questions by category
  const faqCategories = [
    {
      id: "gettingStarted",
      questions: ["q1", "q2"]
    },
    {
      id: "productMapping",
      questions: ["q3", "q5"]
    },
    {
      id: "shipping",
      questions: ["q4", "q6", "q7", "q11"]
    },
    {
      id: "billing",
      questions: ["q8", "q9", "q10"]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gradient-primary">{t("faq.title")}</h1>
        </div>
        <p className="text-muted-foreground">{t("faq.subtitle")}</p>
      </div>

      {/* FAQ Content */}
      <div className="space-y-6">
        {faqCategories.map((category) => (
          <Card key={category.id} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {categoryIcons[category.id]}
              </div>
              <h2 className="text-xl font-semibold">{t(`faq.categories.${category.id}`)}</h2>
            </div>

            <Accordion type="multiple" className="space-y-3">
              {category.questions.map((qKey) => (
                <AccordionItem 
                  key={qKey} 
                  value={qKey}
                  className="border rounded-lg px-4 data-[state=open]:bg-muted/50"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <span className="text-left font-medium">{t(`faq.questions.${qKey}.question`)}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-0 text-muted-foreground">
                    {t(`faq.questions.${qKey}.answer`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <Card className="glass-card p-6">
        <h3 className="font-semibold mb-4">Related Pages</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={onGoToSettings}>
            {t("nav.settings")}
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">
            {t("nav.products")}
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">
            {t("nav.shipments")}
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">
            {t("nav.billing")}
          </Badge>
        </div>
      </Card>

      {/* Still Need Help */}
      <Card className="glass-card p-6 bg-gradient-to-r from-primary/5 to-violet-500/5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/20 text-primary">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Badge 
              variant="default" 
              className="cursor-pointer hover:opacity-90"
              onClick={() => window.location.hash = "support"}
            >
              Visit Support Page
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
