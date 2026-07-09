import Link from "next/link";
import { ArrowLeft, Sparkles, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30 selection:text-primary relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="absolute top-0 w-full z-50 p-6">
        <Link href="/" className="inline-flex items-center gap-2 group text-white/70 hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(184,255,87,0.3)]">
              <Sparkles className="w-6 h-6 text-surface" />
            </div>
            <h1 className="font-heading text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-white/60">Log in to manage your Google Business Profile.</p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-white/10 shadow-2xl">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input 
                    type="email" 
                    placeholder="john@company.com"
                    className="w-full bg-surface border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-white/70">Password</label>
                  <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-surface border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 mt-4 rounded-xl bg-primary text-surface font-semibold text-lg hover:bg-[#a6eb4f] transition-all hover:shadow-[0_0_20px_rgba(184,255,87,0.3)] flex items-center justify-center gap-2 group"
              >
                Log In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-white/30 text-sm">or</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <button 
                type="button"
                className="w-full py-3.5 rounded-xl border border-white/20 bg-white/5 text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </form>
          </div>

          <p className="text-center text-white/40 text-sm mt-8">
            Don't have an account? <Link href="/signup" className="text-primary hover:underline">Get early access</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
