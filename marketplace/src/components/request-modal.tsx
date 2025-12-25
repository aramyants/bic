'use client';

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { MessageCircle, PhoneCall, Send, X } from "lucide-react";

import { ContactForm, type ContactFormContext } from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RequestContext = ContactFormContext & {
  prefillMessage?: string;
};

type RequestModalContextValue = {
  open: (context?: RequestContext) => void;
  close: () => void;
};

let requestModalStore: { current: RequestModalContextValue } = {
  current: { open: (_?: RequestContext) => {}, close: () => {} },
};

if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestModalStore = ((window as any).__REQUEST_MODAL_CONTEXT ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((window as any).__REQUEST_MODAL_CONTEXT = requestModalStore)) as { current: RequestModalContextValue };
}

export const useRequestModal = () => ({
  open: (ctx?: RequestContext) => requestModalStore.current.open(ctx),
  close: () => requestModalStore.current.close(),
});

type RequestModalProviderProps = {
  children: ReactNode;
  telegramUsername?: string | null;
  telegramContactLink?: string | null;
};

export function RequestModalProvider({
  children,
  telegramUsername,
  telegramContactLink,
}: RequestModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"call" | "telegram">("call");
  const [context, setContext] = useState<RequestContext | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [hasAutoOpenedTg, setHasAutoOpenedTg] = useState(false);
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);

  useEffect(() => {
    requestModalStore.current = {
      open: (ctx?: RequestContext) => {
        setContext({
          ...(ctx ?? {}),
          pageUrl: ctx?.pageUrl ?? (typeof window !== "undefined" ? window.location.href : undefined),
        });
        setIsOpen(true);
      },
      close: () => setIsOpen(false),
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setActiveTab("call");
    }
  }, [isOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const webApp = (window as any).Telegram?.WebApp;
    if (webApp) {
      setIsTelegramWebApp(true);
    }
  }, []);

  const handleSubmitted = () => {
    setIsOpen(false);
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 3600);
  };

  const resolvedTelegramUsername = telegramUsername?.trim();
  const resolvedTelegramFallbackLink = telegramContactLink?.trim();

  const telegramMessage = useMemo(() => {
    const base =
      context?.prefillMessage ||
      (context?.vehicleTitle
        ? `Здравствуйте! Я просматривал ${context.vehicleTitle}. Помогите, пожалуйста, с выбором!`
        : "Здравствуйте! Я просматривал ваши автомобили, помогите, пожалуйста, с выбором!");
    if (context?.pageUrl) {
      return `${base} ${context.pageUrl}`;
    }
    return base;
  }, [context]);

  const telegramUrl = useMemo(() => {
    const base =
      resolvedTelegramFallbackLink ||
      (resolvedTelegramUsername ? `https://t.me/${resolvedTelegramUsername.replace(/^@/, "")}` : undefined);
    if (!base) return undefined;
    const separator = base.includes("?") ? "&" : "?";
    return `${base}${separator}text=${encodeURIComponent(telegramMessage)}`;
  }, [telegramMessage, resolvedTelegramUsername, resolvedTelegramFallbackLink]);

  const openTelegramUrl = (url: string) => {
    if (typeof window === "undefined") return;
    const webApp = (window as any).Telegram?.WebApp;
    if (webApp?.openTelegramLink) {
      webApp.openTelegramLink(url);
      return;
    }
    if (webApp?.openLink) {
      webApp.openLink(url, { try_instant_view: false });
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // auto-open Telegram when the tab is selected
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      return;
    }
    if (isTelegramWebApp) {
      return;
    }
    if (activeTab === "telegram" && telegramUrl && !hasAutoOpenedTg) {
      setHasAutoOpenedTg(true);
      openTelegramUrl(telegramUrl);
    }
  }, [activeTab, telegramUrl, hasAutoOpenedTg, isTelegramWebApp]);

  return (
    <>
      {children}
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div className="relative z-10 w-full max-w-[540px] overflow-hidden rounded-3xl border border-white/15 bg-[#0f0f10]/95 text-white shadow-2xl shadow-black/40 max-h-[min(92vh,720px)]">
            <style jsx>{`
              .custom-scroll::-webkit-scrollbar {
                width: 8px;
              }
              .custom-scroll::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.06);
                border-radius: 999px;
              }
              .custom-scroll::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #ff3b3b, #b31217);
                border-radius: 999px;
                border: 1px solid rgba(0, 0, 0, 0.4);
              }
              .custom-scroll {
                scrollbar-color: #ff3b3b rgba(255, 255, 255, 0.08);
              }
            `}</style>
            <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Мы готовы помочь с выбором авто</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-white/30 hover:text-white"
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="grid grid-cols-2 gap-2 border-b border-white/10 bg-black/40 px-6 py-3 text-sm">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("call");
                  setHasAutoOpenedTg(false);
                }}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-2xl px-3 py-2 font-semibold transition",
                  activeTab === "call"
                    ? "bg-brand-primary text-white shadow-[0_10px_40px_-12px_rgba(255,65,65,0.6)]"
                    : "bg-white/5 text-white/70 hover:bg-white/10",
                )}
              >
                <PhoneCall className="h-4 w-4" />
                Заказать звонок
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("telegram");
                  setHasAutoOpenedTg(false);
                  if (telegramUrl) {
                    openTelegramUrl(telegramUrl);
                  }
                }}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-2xl px-3 py-2 font-semibold transition",
                  activeTab === "telegram"
                    ? "bg-white text-black"
                    : "bg-white/5 text-white/70 hover:bg-white/10",
                )}
              >
                <MessageCircle className="h-4 w-4" />
                Написать нам
              </button>
            </div>

            <div
              className="px-6 py-5 overflow-y-auto custom-scroll"
              style={{
                maxHeight: "calc(90vh - 120px)",
                scrollbarWidth: "thin",
              }}
            >
              {activeTab === "call" ? (
                <div className="space-y-4">
                  <p className="text-sm text-white/70">
                    Оставьте телефон — менеджер свяжется в рабочее время и подберёт авто под ваши критерии.
                  </p>
                  <ContactForm
                    context={context ?? undefined}
                    onSubmitted={handleSubmitted}
                    defaultMessage={context?.prefillMessage}
                    className="border-white/12 bg-white/5"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-white/70">
                    Откроется Telegram с готовым текстом. Добавьте детали и отправьте, чтобы мы быстрее ответили.
                  </p>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                    <div className="space-y-2">
                      <p className="font-semibold text-white">Черновик сообщения</p>
                      <p className="whitespace-pre-line rounded-xl bg-black/30 p-3 text-white/80">{telegramMessage}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="lg"
                    className="w-full"
                    disabled={!telegramUrl}
                    onClick={() => {
                      if (telegramUrl) {
                        openTelegramUrl(telegramUrl);
                      }
                    }}
                  >
                    Открыть в Telegram
                  </Button>
                  {!telegramUrl ? (
                    <p className="text-xs text-amber-200">
                      Укажите NEXT_PUBLIC_TELEGRAM_BOT_USERNAME или NEXT_PUBLIC_TELEGRAM_CONTACT_LINK в .env, чтобы включить ссылку.
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {showToast ? (
        <div className="fixed bottom-6 left-1/2 z-50 w-[90%] max-w-[420px] -translate-x-1/2 rounded-2xl border border-white/10 bg-white text-sm text-black shadow-xl shadow-black/20">
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              ✓
            </span>
            <div className="flex-1">
              <p className="font-semibold">Спасибо! Мы скоро с вами свяжемся.</p>
              <p className="text-xs text-black/60">Ответим в рабочее время или как только освободится менеджер.</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export const RequestModalLauncher: React.FC<{
  children: ReactNode;
  context?: RequestContext;
  asChild?: boolean;
}> = ({ children, context }) => {
  return (
    <button type="button" onClick={() => requestModalStore.current.open(context)} className="contents">
      {children}
    </button>
  );
};
