import Link from "next/link";
import { ArrowLeft, Sparkles, Mail, User, Building, ArrowRight } from "lucide-react";

export default function SignupPage() {
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
            <h1 className="font-heading text-3xl font-bold mb-2">Get Early Access</h1>
            <p className="text-white/60">Join the waitlist to automate your Google Business Profile when we launch.</p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-white/10 shadow-2xl">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-surface border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
              
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
                <label className="block text-sm font-medium text-white/70 mb-2">Company Name</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input 
                    type="text" 
                    placeholder="Acme Local"
                    className="w-full bg-surface border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 mt-4 rounded-xl bg-primary text-surface font-semibold text-lg hover:bg-[#a6eb4f] transition-all hover:shadow-[0_0_20px_rgba(184,255,87,0.3)] flex items-center justify-center gap-2 group"
              >
                Join Waitlist
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          <p className="text-center text-white/40 text-sm mt-8">
            Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
