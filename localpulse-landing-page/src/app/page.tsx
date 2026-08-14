import Link from "next/link";
import { ArrowRight, Lock, RefreshCw, Sparkles, Send, CheckCircle2, MessageSquare, ShieldAlert, Calendar, Zap, BarChart3, Building2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden selection:bg-primary/30 selection:text-primary">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-panel border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-surface" />
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight">LocalPulse</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Login
            </Link>
            <Link 
              href="/signup" 
              className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow relative z-10 pt-20">
        {/* Hero Section */}
        <section className="pt-32 pb-24 md:pt-40 md:pb-32 px-6">
          <div className="container mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Google API Verified
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.15] max-w-4xl mx-auto">
              Get more customers from Google. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Without lifting a finger.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
              LocalPulse reads your Google reviews, writes posts in your voice, and keeps your profile active — so you can focus on running your business. <strong className="text-white font-semibold block mt-2">AI creates. You approve.</strong>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Link 
                href="/signup" 
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-surface font-semibold text-lg hover:bg-[#a6eb4f] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(184,255,87,0.3)] flex items-center justify-center gap-2 group"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#how-it-works" 
                className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel border-white/10 font-semibold text-lg hover:bg-white/5 transition-all flex items-center justify-center"
              >
                See How It Works
              </Link>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs md:text-sm text-white/40 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> No credit card required</span>
              <span className="hidden sm:inline">&bull;</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Setup in 5 minutes</span>
              <span className="hidden sm:inline">&bull;</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Cancel anytime</span>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-8 px-6 bg-surface/30 border-y border-white/5">
          <div className="container mx-auto max-w-5xl text-center">
            <p className="text-sm font-medium text-white/50 uppercase tracking-widest mb-6">
              Built for Indian local businesses
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-70">
              <div className="flex items-center gap-2 font-heading font-semibold text-lg text-white/80">
                <span className="text-2xl">🍽️</span> Restaurants
              </div>
              <div className="flex items-center gap-2 font-heading font-semibold text-lg text-white/80">
                <span className="text-2xl">💇‍♀️</span> Salons
              </div>
              <div className="flex items-center gap-2 font-heading font-semibold text-lg text-white/80">
                <span className="text-2xl">⚕️</span> Clinics
              </div>
              <div className="flex items-center gap-2 font-heading font-semibold text-lg text-white/80">
                <span className="text-2xl">🏋️</span> Gyms
              </div>
              <div className="flex items-center gap-2 font-heading font-semibold text-lg text-white/80">
                <span className="text-2xl">🦷</span> Dental
              </div>
              <div className="flex items-center gap-2 font-heading font-semibold text-lg text-white/80">
                <span className="text-2xl">🛍️</span> Retail
              </div>
              <div className="flex items-center gap-2 font-heading font-semibold text-lg text-white/80">
                <span className="text-2xl">🏨</span> Hotels
              </div>
              <div className="flex items-center gap-2 font-heading font-semibold text-lg text-white/80">
                <span className="text-2xl">📐</span> Architects
              </div>
              <div className="flex items-center gap-2 font-heading font-semibold text-lg text-white/80">
                <span className="text-2xl">🚘</span> Workshops
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="pt-16 pb-24 px-6 bg-surface/50 border-y border-white/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">Your Google profile. On autopilot. <span className="text-primary">Always in your control.</span></h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">AI creates. You approve. Google sees an active, responsive business.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="glass-panel p-8 rounded-3xl hover-glow group h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                  <Lock className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Secure GBP Connection</h3>
                <p className="text-white/70 leading-relaxed flex-grow">
                  1-click Google OAuth. We connect directly to your Google Business Profile — no passwords, no hassle. Your data stays encrypted and private.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-panel p-8 rounded-3xl hover-glow group h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
                  <RefreshCw className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Reviews Synced Every 2 Hours</h3>
                <p className="text-white/70 leading-relaxed flex-grow">
                  Never miss a new review. LocalPulse automatically pulls your latest Google reviews and classifies them — positive, complaint, or reputation risk.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-panel p-8 rounded-3xl hover-glow group h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                  <BarChart3 className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Customer Voice Intelligence</h3>
                <p className="text-white/70 leading-relaxed flex-grow">
                  AI reads all your reviews and tells you exactly what customers love and what needs attention — so you know where to improve and what to promote.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="glass-panel p-8 rounded-3xl hover-glow group h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors">
                  <Send className="w-7 h-7 text-orange-400" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Reviews Become Posts Automatically</h3>
                <p className="text-white/70 leading-relaxed flex-grow">
                  Your 5-star reviews are automatically turned into ready-to-publish Google posts. You approve in one tap. We publish. Your profile stays active every week.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="glass-panel p-8 rounded-3xl hover-glow group h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                  <MessageSquare className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">AI-Drafted Review Replies</h3>
                <p className="text-white/70 leading-relaxed flex-grow">
                  Every new review gets a personalised AI reply in your brand voice — warm, professional, funny, or Hinglish. You approve before anything goes to Google.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="glass-panel p-8 rounded-3xl hover-glow group h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20 group-hover:bg-red-500/20 transition-colors">
                  <ShieldAlert className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Reputation Risk Alerts</h3>
                <p className="text-white/70 leading-relaxed flex-grow">
                  When a review contains a billing dispute, legal threat, or serious complaint, LocalPulse flags it immediately and recommends a careful manual response — never a blind auto-reply.
                </p>
              </div>

              {/* Feature 7 */}
              <div className="glass-panel p-8 rounded-3xl hover-glow group h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 border border-yellow-500/20 group-hover:bg-yellow-500/20 transition-colors">
                  <Calendar className="w-7 h-7 text-yellow-400" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Festival Posts Auto-Drafted</h3>
                <p className="text-white/70 leading-relaxed flex-grow">
                  Diwali, Eid, Christmas, Independence Day — LocalPulse auto-generates festive posts 5 days before every major Indian occasion. Tailored to your business category and brand voice.
                </p>
              </div>

              {/* Feature 8 */}
              <div className="glass-panel p-8 rounded-3xl hover-glow group h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
                  <Zap className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Daily AI Recommendations</h3>
                <p className="text-white/70 leading-relaxed flex-grow">
                  Every time you open your dashboard, LocalPulse tells you exactly what to do next — which reviews need replies, when to post, and what your customers are saying about your business this week.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-32 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-20">
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">Four steps to autopilot</h2>
              <p className="text-white/60 text-lg">AI creates. You approve. It's that simple.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-white/10 via-white/20 to-white/10"></div>
              
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center mb-8 relative z-10 border-primary/30 shadow-[0_0_30px_rgba(184,255,87,0.15)]">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-heading font-bold text-2xl text-primary">
                    1
                  </div>
                </div>
                <h3 className="font-heading text-xl font-bold mb-4">Connect your Google profile</h3>
                <p className="text-white/70 text-sm">Link your account securely with 1-click OAuth integration.</p>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center mb-8 relative z-10 border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center font-heading font-bold text-2xl text-purple-400">
                    2
                  </div>
                </div>
                <h3 className="font-heading text-xl font-bold mb-4">AI reads your reviews and writes posts</h3>
                <p className="text-white/70 text-sm">AI reads your reviews and writes engaging posts in your voice.</p>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center mb-8 relative z-10 border-primary/30 shadow-[0_0_30px_rgba(184,255,87,0.15)]">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-heading font-bold text-2xl text-primary">
                    3
                  </div>
                </div>
                <h3 className="font-heading text-xl font-bold mb-4">You approve in one tap</h3>
                <p className="text-white/70 text-sm">Review what the AI created. Edit if needed, or just approve.</p>
              </div>

              {/* Step 4 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center mb-8 relative z-10 border-secondary/30 shadow-[0_0_30px_rgba(0,255,255,0.15)]">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center font-heading font-bold text-2xl text-secondary">
                    4
                  </div>
                </div>
                <h3 className="font-heading text-xl font-bold mb-4">Published automatically</h3>
                <p className="text-white/70 text-sm">Approved posts are sent straight to your Google Business Profile.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Agency Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-surface to-surface/50 border-t border-white/5 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full max-h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-8">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">Running a local SEO agency?</h2>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              Manage all your clients from one dashboard. White-label ready. Flat pricing — not per location.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/signup" 
                className="px-8 py-4 rounded-full bg-primary text-surface font-semibold text-lg hover:bg-[#a6eb4f] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(184,255,87,0.3)]"
              >
                Explore Agency Plans
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 px-6 border-t border-white/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">Simple, honest pricing</h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">No hidden fees. No per-location charges that kill your margins.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-10">
              {/* Starter Plan */}
              <div className="glass-panel p-8 rounded-3xl h-full flex flex-col hover-glow group border-white/10">
                <div className="mb-6">
                  <h3 className="font-heading text-2xl font-bold mb-2">Starter</h3>
                  <p className="text-white/60 text-sm h-10">Perfect for individual business owners</p>
                </div>
                <div className="mb-8">
                  <span className="font-heading text-5xl font-bold">₹2,999</span>
                  <span className="text-white/50 ml-2">/ month</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">1 Google Business Profile</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">Automated review syncing</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">AI post generation from reviews</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">Seasonal festival posts</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">AI review reply drafts</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">Post approval queue</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">30 posts per month</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">Email notifications</span></li>
                </ul>
                <div>
                  <Link href="/signup" className="block w-full py-3.5 rounded-xl border border-white/20 text-center font-semibold hover:bg-white/5 transition-colors">
                    Get Started Free
                  </Link>
                  <p className="text-center text-white/40 text-xs mt-3">14-day free trial. No card needed.</p>
                </div>
              </div>

              {/* Agency Plan */}
              <div className="glass-panel p-8 rounded-3xl h-full flex flex-col relative border-primary/50 shadow-[0_0_30px_rgba(184,255,87,0.1)] md:-mt-4 md:mb-4 bg-surface/80">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-surface px-4 py-1 rounded-full text-sm font-bold tracking-wide w-max">
                  Most Popular
                </div>
                <div className="mb-6">
                  <h3 className="font-heading text-2xl font-bold mb-2">Agency</h3>
                  <p className="text-white/60 text-sm h-10">For freelancers and agencies managing multiple clients</p>
                </div>
                <div className="mb-8">
                  <span className="font-heading text-5xl font-bold">₹9,999</span>
                  <span className="text-white/50 ml-2">/ month</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">Up to 10 Google Business Profiles</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">Everything in Starter</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">Unified client dashboard</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">Bulk post approval</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">Client-level automation controls</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">100 posts per month</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">Priority support</span></li>
                </ul>
                <div>
                  <Link href="/signup" className="block w-full py-3.5 rounded-xl bg-primary text-surface text-center font-semibold hover:bg-[#a6eb4f] transition-colors hover:shadow-[0_0_20px_rgba(184,255,87,0.2)]">
                    Start Agency Trial
                  </Link>
                  <p className="text-center text-white/40 text-xs mt-3">14-day free trial. No card needed.</p>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="glass-panel p-8 rounded-3xl h-full flex flex-col hover-glow group border-white/10">
                <div className="mb-6">
                  <h3 className="font-heading text-2xl font-bold mb-2">Enterprise</h3>
                  <p className="text-white/60 text-sm h-10">For larger agencies and franchise businesses</p>
                </div>
                <div className="mb-8">
                  <span className="font-heading text-4xl font-bold h-12 flex items-center">Custom</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">Unlimited Google Business Profiles</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">Everything in Agency</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">White-label dashboard</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">Custom branding</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">Dedicated account manager</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-white/70">SLA support</span></li>
                </ul>
                <div>
                  <a href="mailto:localpulse.support@gmail.com" className="block w-full py-3.5 rounded-xl border border-white/20 text-center font-semibold hover:bg-white/5 transition-colors">
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
            
            <p className="text-center text-white/40 text-sm">
              All plans include a 14-day free trial. Cancel anytime. No questions asked.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-white/5 py-12 px-6">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold text-xl">LocalPulse</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-white/60">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <a href="mailto:localpulse.support@gmail.com" className="hover:text-primary transition-colors">Contact Support</a>
          </div>
          
          <div className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} LocalPulse. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
