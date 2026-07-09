import Link from "next/link";
import { ArrowRight, Lock, RefreshCw, Sparkles, Send, CheckCircle2 } from "lucide-react";

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
            <h1 className="font-heading text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Automate your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Google Business Profile
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
              Connect your GBP in seconds. Automatically sync reviews, extract AI insights, and turn 5-star reviews into engaging Google Posts on autopilot.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 bg-surface/50 border-y border-white/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">Everything you need to grow</h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">Powerful features designed to put your local SEO on autopilot while keeping your data perfectly secure.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="glass-panel p-8 rounded-3xl hover-glow group">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 border border-secondary/20 group-hover:bg-secondary/20 transition-colors">
                  <Lock className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Secure GBP Connection</h3>
                <p className="text-white/70 leading-relaxed">
                  1-click OAuth integration. We never store your passwords, just secure tokens to manage your profile.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-panel p-8 rounded-3xl hover-glow group">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <RefreshCw className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Automated Review Syncing</h3>
                <p className="text-white/70 leading-relaxed">
                  Our system fetches new Google Reviews every 2 hours so your dashboard is always up to date.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-panel p-8 rounded-3xl hover-glow group">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                  <Sparkles className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">AI Phrase Extraction</h3>
                <p className="text-white/70 leading-relaxed">
                  We scan your reviews using AI to detect pain points, trends, and glowing praise automatically.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="glass-panel p-8 rounded-3xl hover-glow group">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors">
                  <Send className="w-7 h-7 text-orange-400" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Auto-Generate Google Posts</h3>
                <p className="text-white/70 leading-relaxed">
                  Turn your best 5-star reviews into beautiful, automated Google Posts to drive more local traffic.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-32 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-20">
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">Three steps to autopilot</h2>
              <p className="text-white/60 text-lg">Set it up once and let our AI do the heavy lifting.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-white/10 via-white/20 to-white/10"></div>
              
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center mb-8 relative z-10 border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-heading font-bold text-2xl">
                    1
                  </div>
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Connect</h3>
                <p className="text-white/70">Link your Google account securely with 1-click OAuth integration.</p>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center mb-8 relative z-10 border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-heading font-bold text-2xl">
                    2
                  </div>
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Sync</h3>
                <p className="text-white/70">Watch your past and future reviews flow into a beautiful dashboard.</p>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center mb-8 relative z-10 border-primary/30 shadow-[0_0_30px_rgba(184,255,87,0.15)]">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-heading font-bold text-2xl text-primary">
                    3
                  </div>
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Grow</h3>
                <p className="text-white/70">Let our AI manage your local SEO by generating engaging posts.</p>
              </div>
            </div>
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
