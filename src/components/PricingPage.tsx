import React, { useState } from 'react';
import { 
  CreditCard, 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  AlertCircle, 
  Info, 
  ArrowRight,
  HelpCircle,
  Clock,
  Layers,
  HeartHandshake,
  CheckCircle2,
  ExternalLink,
  Lock,
  Loader2
} from 'lucide-react';
import { AppTab, UserUsageState, CheckoutSessionResult } from '../types';
import { createCheckoutSession } from '../services/api';
import { AdBanner } from './AdBanner';

interface PricingPageProps {
  setActiveTab: (tab: AppTab) => void;
  onOpenSetup: () => void;
  usage?: UserUsageState;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  setActiveTab,
  onOpenSetup,
  usage,
}) => {
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'creator-pro' | 'business'>('creator-pro');
  const [selectedPlanTitle, setSelectedPlanTitle] = useState('Creator Pro');
  const [selectedPlanPrice, setSelectedPlanPrice] = useState('$9.99');
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<CheckoutSessionResult | null>(null);

  const plans = [
    {
      id: 'free' as const,
      name: 'Free',
      tagline: 'Ideal for getting started and individual creators',
      price: '$0',
      period: 'per month',
      limitHighlight: '5 Real AI Generations / Day',
      badge: 'Active Free Tier',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      buttonText: 'Current Plan (5 Daily Real AI)',
      buttonVariant: 'active',
      highlight: false,
      features: [
        '5 real AI generations per day (server enforced)',
        'Unlimited Demo Mode (unlimited test scripts & plans)',
        'AI Video Script Generator (YouTube, TikTok, Reels, FB)',
        'YouTube Assistant (High CTR Titles, SEO Descriptions, Tags)',
        'Social Media Caption & Hashtag Vault',
        'AI Video Planner (Scene-by-scene storyboard)',
        'Content & Business Opportunity Hub',
        'One-click copy & markdown formatting',
        'Local browser saved generations history',
      ],
    },
    {
      id: 'creator-pro' as const,
      name: 'Creator Pro',
      tagline: 'Built for high-volume and full-time creators',
      price: '$9.99',
      period: 'per month',
      limitHighlight: 'Up to 100 AI Generations / Month',
      badge: 'Most Popular',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      buttonText: 'Upgrade to Creator Pro',
      buttonVariant: 'upgrade',
      highlight: true,
      features: [
        'Up to 100 real AI generations per month',
        'Everything included in the Free tier',
        'Unlimited Demo Mode without limits',
        'Priority server queue & lowest generation latency',
        'Custom tone & brand voice memory settings',
        'Export scripts directly to teleprompter format',
        'Multi-scene batch video planner export',
        'Early access to new video models',
      ],
    },
    {
      id: 'business' as const,
      name: 'Business',
      tagline: 'For content agencies, studios, and marketing teams',
      price: '$19.99',
      period: 'per month',
      limitHighlight: 'Up to 300 AI Generations / Month',
      badge: 'Agency & Scale',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      buttonText: 'Upgrade to Business',
      buttonVariant: 'upgrade',
      highlight: false,
      features: [
        'Up to 300 real AI generations per month',
        'Everything included in Creator Pro',
        'Team collaboration & shared generation repository',
        'Multi-channel brand profile management',
        'Social media auto-publishing scheduling webhook prep',
        'Advanced YouTube keyword search volume metrics',
        'White-label client presentation reports',
        'Priority 24/7 technical assistance',
      ],
    },
  ];

  const handleOpenUpgradeModal = async (planKey: 'creator-pro' | 'business', planTitle: string, priceStr: string) => {
    setSelectedPlan(planKey);
    setSelectedPlanTitle(planTitle);
    setSelectedPlanPrice(priceStr);
    setCheckoutModalOpen(true);
    setLoadingCheckout(true);
    setCheckoutResult(null);

    try {
      const res = await createCheckoutSession(planKey);
      setCheckoutResult(res);
    } catch (err: any) {
      setCheckoutResult({
        configured: false,
        message: err?.message || 'Failed to initiate payment handshake.',
        plan: planTitle,
      });
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          <CreditCard size={14} />
          <span>CreatorAI Plans &amp; Subscriptions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Simple, Predictable Monetization Plans
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Start 100% free with 5 real AI generations daily. Scale to Creator Pro or Business as your audience grows.
        </p>
      </div>

      {/* Live Quota & Payment Integrity Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-purple-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
            <ShieldCheck size={20} />
          </div>
          <div className="text-xs sm:text-sm">
            <h4 className="font-bold text-white flex flex-wrap items-center gap-2">
              <span>Current Account Status: Free Plan</span>
              {usage && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {usage.dailyRemaining} / {usage.dailyLimit} real AI generations left today
                </span>
              )}
            </h4>
            <p className="text-slate-300 mt-1 leading-relaxed">
              In accordance with payment security rules, <strong>no simulated or unverified subscriptions are claimed</strong>. Subscriptions require confirmation from a live payment gateway (Stripe). Unlimited Demo Mode remains completely free for testing.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('script-generator')}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider shrink-0 cursor-pointer min-h-[40px]"
        >
          Open Generator
        </button>
      </div>

      {/* Pricing Cards Grid (Requirements 1, 2, 3, 4) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
              plan.highlight
                ? 'bg-gradient-to-b from-purple-950/40 via-slate-900 to-slate-900 border-2 border-purple-500 shadow-2xl shadow-purple-950/40'
                : 'bg-slate-900/90 border border-slate-800'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1">
                <Sparkles size={11} />
                <span>Recommended Tier</span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-black text-white">{plan.name}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${plan.badgeColor}`}>
                  {plan.badge}
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-4 min-h-[32px]">
                {plan.tagline}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-4xl sm:text-5xl font-black text-white">{plan.price}</span>
                <span className="text-xs text-slate-400 font-medium">{plan.period}</span>
              </div>

              {/* Quota Highlight Badge */}
              <div className="mb-6 pb-5 border-b border-slate-800">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-purple-300 border border-purple-500/20">
                  <Zap size={13} className="text-amber-400 fill-amber-400" />
                  {plan.limitHighlight}
                </span>
              </div>

              {/* Feature List */}
              <div className="space-y-3 mb-8">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Plan Capabilities:
                </p>
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check size={16} className="text-purple-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons (Requirement 4) */}
            <div>
              {plan.buttonVariant === 'active' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('script-generator')}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600/20 text-emerald-300 font-bold text-sm border border-emerald-500/40 hover:bg-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                >
                  <Check size={16} />
                  <span>Start Creating (Free Active)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOpenUpgradeModal(plan.id as 'creator-pro' | 'business', plan.name, plan.price)}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px] ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-950/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                  }`}
                >
                  <CreditCard size={16} />
                  <span>{plan.buttonText}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reserved Advertising / Sponsorship Space (Requirement 5) */}
      <AdBanner placement="dashboard" />

      {/* Feature Comparison Matrix */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers size={18} className="text-purple-400" />
          Plan Limits &amp; Tier Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3 font-bold">Plan Details</th>
                <th className="py-3 px-3 font-bold text-emerald-400">Free ($0/mo)</th>
                <th className="py-3 px-3 font-bold text-purple-400">Creator Pro ($9.99/mo)</th>
                <th className="py-3 px-3 font-bold text-blue-400">Business ($19.99/mo)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 px-3 font-medium">Monthly AI Quota</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">5 per day (~150/mo)</td>
                <td className="py-3 px-3 text-purple-300 font-bold">100 / month</td>
                <td className="py-3 px-3 text-blue-300 font-bold">300 / month</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium">Demo Mode (No API required)</td>
                <td className="py-3 px-3 text-emerald-400">✓ Unlimited</td>
                <td className="py-3 px-3">✓ Unlimited</td>
                <td className="py-3 px-3">✓ Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium">AI Video Script Generator</td>
                <td className="py-3 px-3 text-emerald-400">✓ Full Access</td>
                <td className="py-3 px-3">✓ Priority Speed</td>
                <td className="py-3 px-3">✓ Priority Speed</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium">YouTube SEO &amp; Tag Assistant</td>
                <td className="py-3 px-3 text-emerald-400">✓ Full Access</td>
                <td className="py-3 px-3">✓ Custom Voice Memory</td>
                <td className="py-3 px-3">✓ Multi-Channel Keyword Search</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium">Video Planner Storyboarding</td>
                <td className="py-3 px-3 text-emerald-400">✓ Full Access</td>
                <td className="py-3 px-3">✓ Multi-Scene Export</td>
                <td className="py-3 px-3">✓ Multi-Scene Export</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium">Payment Provider Status</td>
                <td className="py-3 px-3 text-emerald-400">Not Needed ($0)</td>
                <td className="py-3 px-3 text-amber-400 font-semibold">Stripe Handshake Ready</td>
                <td className="py-3 px-3 text-amber-400 font-semibold">Stripe Handshake Ready</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle size={18} className="text-blue-400" />
          Billing &amp; Monetization FAQ
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-white text-sm">How do daily limits work on the Free plan?</h4>
            <p className="text-slate-400 leading-relaxed">
              Every user receives 5 free real AI content generations every 24 hours (resetting at 00:00 UTC). When your daily limit is reached, you can continue generating unlimited sample scripts with our built-in Demo Mode at zero cost!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-white text-sm">Will I be charged for clicking Upgrade?</h4>
            <p className="text-slate-400 leading-relaxed">
              No. In strict compliance with financial integrity, no charge will occur unless an official payment gateway (such as Stripe) is configured with live keys. We never simulate fake charges or fake receipts.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-white text-sm">Are API keys and payment secrets safe?</h4>
            <p className="text-slate-400 leading-relaxed">
              Yes. All AI API calls and payment operations run exclusively on the secure Node.js backend. Secret keys are never exposed in client browser bundles.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-white text-sm">Can I test all features without paying?</h4>
            <p className="text-slate-400 leading-relaxed">
              Yes! All 5 generator tools, the complete UI, Demo Mode, and the Free plan are available for development and testing without providing any payment information.
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Checkout Handshake Modal (Requirement 4) */}
      {checkoutModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setCheckoutModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Upgrade to {selectedPlanTitle} ({selectedPlanPrice}/mo)
                  </h3>
                  <p className="text-xs text-slate-400">Payment Gateway Verification Handshake</p>
                </div>
              </div>
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {loadingCheckout ? (
              <div className="py-8 text-center space-y-3">
                <Loader2 size={32} className="mx-auto text-purple-400 animate-spin" />
                <p className="text-xs text-slate-300">Checking server payment gateway status...</p>
              </div>
            ) : checkoutResult?.configured ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <span>Stripe integration detected on server. Ready to process checkout session.</span>
                </div>
                <a
                  href={checkoutResult.checkoutUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>Proceed to Stripe Checkout</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300 text-sm">
                    <AlertCircle size={16} />
                    <span>Payment Provider Awaiting Setup</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {checkoutResult?.message || 'Stripe API keys are not yet configured on the server.'}
                  </p>
                </div>

                {/* Developer Instructions for Going Live */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-2.5">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <Lock size={13} className="text-purple-400" />
                    <span>Required Backend Environment Setup for Stripe:</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-400 font-mono text-[11px]">
                    <li>• <code className="text-purple-300">STRIPE_SECRET_KEY</code> (sk_test_... or sk_live_...)</li>
                    <li>• <code className="text-purple-300">STRIPE_WEBHOOK_SECRET</code> (whsec_...)</li>
                    <li>• <code className="text-purple-300">STRIPE_PRICE_ID_PRO</code> (for $9.99/mo plan)</li>
                  </ul>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Free developer test mode keys from Stripe Dashboard work immediately with zero financial fees during testing.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  <span>Your Free Plan remains 100% active with 5 daily real AI generations!</span>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer min-h-[40px]"
                  >
                    Got It &amp; Keep Creating
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
