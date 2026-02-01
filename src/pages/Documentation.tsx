import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ShopifyConnectionStatus = "connected" | "disconnected";

export function DocumentationPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Mock Shopify connection status - in real app, this would come from API
  const [shopifyStatus] = useState<ShopifyConnectionStatus>("connected");

  const validateForm = (): boolean => {
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: t("support.validation.emailRequired"),
      });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        variant: "destructive",
        title: t("support.validation.emailInvalid"),
      });
      return false;
    }
    
    if (!comment.trim()) {
      toast({
        variant: "destructive",
        title: t("support.validation.commentRequired"),
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In real app, this would send to an edge function
    console.log("Support inquiry:", { email, comment, shopifyStatus });
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    toast({
      title: t("support.form.success"),
    });
    
    // Reset form after delay
    setTimeout(() => {
      setEmail("");
      setComment("");
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gradient-primary">{t("support.title")}</h1>
        <p className="text-muted-foreground">{t("support.subtitle")}</p>
      </div>

      {/* Shopify Connection Status Card */}
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              shopifyStatus === "connected" 
                ? "bg-green-500/20 text-green-600 dark:text-green-400" 
                : "bg-red-500/20 text-red-600 dark:text-red-400"
            }`}>
              {shopifyStatus === "connected" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{t("support.shopifyConnection.title")}</h3>
              <p className="text-sm text-muted-foreground">
                {shopifyStatus === "connected" 
                  ? t("support.shopifyConnection.connected")
                  : t("support.shopifyConnection.disconnected")
                }
              </p>
            </div>
          </div>
          <Badge variant={shopifyStatus === "connected" ? "default" : "destructive"}>
            {shopifyStatus === "connected" 
              ? t("support.shopifyConnection.connected")
              : t("support.shopifyConnection.disconnected")
            }
          </Badge>
        </div>
      </Card>

      {/* Contact Form */}
      <Card className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Mail className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">{t("support.form.commentLabel")}</h2>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold">{t("support.form.success")}</h3>
            <p className="text-muted-foreground">
              We'll review your inquiry and get back to you as soon as possible.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">{t("support.form.emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("support.form.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="max-w-md"
              />
            </div>

            {/* Comment Field */}
            <div className="space-y-2">
              <Label htmlFor="comment">{t("support.form.commentLabel")}</Label>
              <Textarea
                id="comment"
                placeholder={t("support.form.commentPlaceholder")}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isSubmitting}
                rows={6}
                className="resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    {t("support.form.submitting")}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t("support.form.submit")}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Additional Help */}
      <Card className="glass-card p-6">
        <h3 className="font-semibold mb-3">Documentation</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Setup Guide: Learn how to configure your Amazon MCF connections</p>
          <p>• Product Mapping: Understand how to link Shopify products to Amazon SKUs</p>
          <p>• Troubleshooting: Common issues and their solutions</p>
        </div>
      </Card>
    </div>
  );
}
