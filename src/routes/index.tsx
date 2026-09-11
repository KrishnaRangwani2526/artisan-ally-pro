import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Mic, Camera, Upload } from "lucide-react";
import { useApp } from "@/lib/store";
import { LANGUAGES } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/demo-data";
import type { LangCode } from "@/lib/types";
import { ActionButton, Field, inputClass, VoiceButton } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kalaa Setu — Your business, your digital shop, your growth partner" },
      {
        name: "description",
        content:
          "Set up your artisan business in minutes: choose your language, add products by voice or photo, and get your own online store.",
      },
      { property: "og:title", content: "Kalaa Setu — Set up your digital business" },
      {
        property: "og:description",
        content: "Language, business details, products and goals — a guided setup for rural artisans and micro-businesses.",
      },
    ],
  }),
  component: Onboarding,
});

const BUSINESS_TYPES = ["Artisan", "Farmer", "Manufacturer", "Retailer", "Service Provider", "Other"];
const GOALS = [
  "Sell locally",
  "Sell online",
  "Find B2B buyers",
  "Get better pricing",
  "Get financial support",
  "Promote my business",
  "Learn digital business",
];

function Onboarding() {
  const { state, update } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [biz, setBiz] = useState(state.business);
  const [goals, setGoals] = useState<string[]>(state.business.goals);
  const [firstProduct, setFirstProduct] = useState({ name: "", note: "", photo: false });

  const set = (patch: Partial<typeof biz>) => setBiz((b) => ({ ...b, ...patch }));
  const next = () => setStep((s) => s + 1);

  const finish = () => {
    update({ onboarded: true, business: { ...biz, goals } });
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="page-glow min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-10">
        {step > 0 ? (
          <div className="flex items-center gap-1.5 pt-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <span
                key={i}
                className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-surface-2")}
              />
            ))}
          </div>
        ) : null}

        {step === 0 && (
          <div className="flex flex-1 flex-col justify-center py-16">
            <span className="grid size-16 place-items-center rounded-3xl bg-primary font-mono text-xl font-bold text-primary-foreground">
              KS
            </span>
            <p className="mt-6 font-mono text-[12px] font-bold tracking-[0.18em] text-accent uppercase">
              Kalaa Setu · कला सेतु
            </p>
            <h1 className="mt-3 text-[34px] leading-[1.1] font-bold tracking-tight">
              Your business.
              <br />
              Your digital shop.
              <br />
              <span className="text-primary">Your growth partner.</span>
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              Tell us about your work. We will build your catalogue, set fair prices, make your
              advertisements and give you your own online store.
            </p>
            <div className="mt-8 space-y-3">
              <ActionButton onClick={next} className="w-full">
                Get Started
              </ActionButton>
              <ActionButton
                variant="soft"
                className="w-full"
                onClick={() => {
                  update({ onboarded: true });
                  navigate({ to: "/dashboard" });
                }}
              >
                I already have an account
              </ActionButton>
            </div>
          </div>
        )}

        {step === 1 && (
          <Step title="Choose your language" sub="आप जो भाषा समझते हैं वही चुनें">
            <div className="grid grid-cols-2 gap-2.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => set({ language: l.code as LangCode })}
                  className={cn("frost-tile p-4 text-left", biz.language === l.code && "ring-2 ring-primary")}
                >
                  <span className="block text-[17px] font-semibold">{l.native}</span>
                  <span className="block text-[12px] text-muted-foreground">{l.label}</span>
                </button>
              ))}
            </div>
            <ActionButton onClick={next} className="mt-6 w-full">
              Continue <ArrowRight className="ml-1 inline size-4" />
            </ActionButton>
          </Step>
        )}

        {step === 2 && (
          <Step title="What kind of work do you do?" sub="Pick the closest one">
            <div className="grid grid-cols-2 gap-2.5">
              {BUSINESS_TYPES.map((typeName) => (
                <button
                  key={typeName}
                  onClick={() => set({ type: typeName })}
                  className={cn("frost-tile p-4 text-left", biz.type === typeName && "ring-2 ring-primary")}
                >
                  <span className="text-[15px] font-semibold">{typeName}</span>
                </button>
              ))}
            </div>
            <ActionButton onClick={next} className="mt-6 w-full">
              Continue
            </ActionButton>
          </Step>
        )}

        {step === 3 && (
          <Step title="Your business details" sub="We use these to find local buyers and schemes for you">
            <div className="space-y-3">
              <VoiceButton
                label="🎙️ Tell us about your business"
                lang={biz.language}
                onResult={(text) => set({ about: text })}
              />
              {biz.about ? (
                <p className="frost-tile p-3 text-[13px] text-muted-foreground">{biz.about}</p>
              ) : null}
              <Field label="Business name">
                <input className={inputClass} value={biz.name} onChange={(e) => set({ name: e.target.value })} />
              </Field>
              <Field label="Owner name">
                <input className={inputClass} value={biz.owner} onChange={(e) => set({ owner: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Village">
                  <input className={inputClass} value={biz.village} onChange={(e) => set({ village: e.target.value })} />
                </Field>
                <Field label="Block">
                  <input className={inputClass} value={biz.block} onChange={(e) => set({ block: e.target.value })} />
                </Field>
                <Field label="District">
                  <input className={inputClass} value={biz.district} onChange={(e) => set({ district: e.target.value })} />
                </Field>
                <Field label="State">
                  <input className={inputClass} value={biz.state} onChange={(e) => set({ state: e.target.value })} />
                </Field>
                <Field label="PIN code">
                  <input className={inputClass} value={biz.pin} onChange={(e) => set({ pin: e.target.value })} />
                </Field>
                <Field label="Category">
                  <select className={inputClass} value={biz.category} onChange={(e) => set({ category: e.target.value })}>
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
            <ActionButton onClick={next} className="mt-6 w-full">
              Continue
            </ActionButton>
          </Step>
        )}

        {step === 4 && (
          <Step title="Add your first product" sub="A photo and a few words is enough — you can add more later">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFirstProduct((p) => ({ ...p, photo: true }))}
                className="frost-tile flex flex-col items-center gap-2 p-6 text-[14px] font-semibold"
              >
                <Camera className="size-6 text-primary" /> Take Photo
              </button>
              <button
                onClick={() => setFirstProduct((p) => ({ ...p, photo: true }))}
                className="frost-tile flex flex-col items-center gap-2 p-6 text-[14px] font-semibold"
              >
                <Upload className="size-6 text-primary" /> Upload Photo
              </button>
            </div>
            {firstProduct.photo ? (
              <p className="mt-3 rounded-2xl bg-good-soft px-4 py-2.5 text-[13px] font-semibold text-good">
                <Check className="mr-1 inline size-4" /> Photo added — AI will clean it up for you later
              </p>
            ) : null}
            <div className="mt-4 space-y-3">
              <Field label="Product name">
                <input
                  className={inputClass}
                  placeholder="e.g. Handwoven cotton shawl"
                  value={firstProduct.name}
                  onChange={(e) => setFirstProduct((p) => ({ ...p, name: e.target.value }))}
                />
              </Field>
              <VoiceButton
                label="🎙️ Record voice description"
                lang={biz.language}
                onResult={(text) => setFirstProduct((p) => ({ ...p, note: text }))}
              />
              {firstProduct.note ? (
                <p className="frost-tile p-3 text-[13px] text-muted-foreground">{firstProduct.note}</p>
              ) : null}
            </div>
            <ActionButton onClick={next} className="mt-6 w-full">
              Continue
            </ActionButton>
            <button onClick={next} className="mt-3 w-full text-[13px] font-semibold text-muted-foreground">
              Skip for now
            </button>
          </Step>
        )}

        {step === 5 && (
          <Step title="What do you want most?" sub="Choose as many as you like">
            <div className="space-y-2.5">
              {GOALS.map((g) => {
                const on = goals.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => setGoals((s) => (on ? s.filter((x) => x !== g) : [...s, g]))}
                    className={cn(
                      "frost-tile flex w-full items-center justify-between p-4 text-left text-[15px] font-semibold",
                      on && "ring-2 ring-primary",
                    )}
                  >
                    {g}
                    {on ? <Check className="size-5 text-primary" /> : null}
                  </button>
                );
              })}
            </div>
            <ActionButton onClick={next} className="mt-6 w-full">
              Finish setup
            </ActionButton>
          </Step>
        )}

        {step === 6 && (
          <div className="flex flex-1 flex-col justify-center py-12">
            <span className="grid size-16 place-items-center rounded-3xl bg-good-soft text-3xl">🎉</span>
            <h1 className="mt-6 text-[30px] leading-tight font-bold tracking-tight">
              Your Digital Business is Ready!
            </h1>
            <div className="frost-card mt-6 p-5">
              <p className="font-mono text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                Your business profile
              </p>
              <p className="mt-2 text-[20px] font-bold">{biz.name}</p>
              <p className="text-[13px] text-muted-foreground">
                {biz.type} · {biz.category}
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {biz.village}, {biz.block}, {biz.district}, {biz.state} — {biz.pin}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {goals.map((g) => (
                  <span key={g} className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-primary">
                    {g}
                  </span>
                ))}
              </div>
              <p className="mt-3 rounded-2xl bg-surface-2 p-3 text-[13px] leading-relaxed text-muted-foreground">
                {biz.about}
              </p>
            </div>
            <ActionButton onClick={finish} className="mt-6 w-full">
              Open My Dashboard <ArrowRight className="ml-1 inline size-4" />
            </ActionButton>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-muted-foreground">
              <Mic className="size-3.5" /> You can change any of this later by voice
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Step({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="flex-1 pt-8">
      <h1 className="text-[26px] leading-tight font-bold tracking-tight">{title}</h1>
      <p className="mt-1.5 mb-6 text-[14px] text-muted-foreground">{sub}</p>
      {children}
    </div>
  );
}
