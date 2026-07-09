import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30 selection:text-primary">
      {/* Header */}
      <header className="sticky top-0 w-full z-50 glass-panel border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft className="w-5 h-5 text-white/70 group-hover:text-primary transition-colors" />
            <span className="text-white/70 group-hover:text-primary transition-colors font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold text-xl">LocalPulse</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow py-20 px-6 relative z-10">
        <div className="container mx-auto max-w-4xl glass-panel p-8 md:p-12 rounded-3xl">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-white/50 mb-12">Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-white/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using LocalPulse, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by these terms, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <p>
                LocalPulse is a software-as-a-service (SaaS) application that integrates with the Google Business Profile API. 
                Our service allows users to automatically sync Google Reviews, extract insights using AI, and generate Google Posts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Google API Integration</h2>
              <p className="mb-2">By using our service, you acknowledge and agree that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are authorizing LocalPulse to access your Google Business Profile data on your behalf.</li>
                <li>Your use of the Google Business Profile integration is also subject to Google's Terms of Service.</li>
                <li>You have the legal right and authority to manage the Google Business Profile locations you connect to our service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. User Responsibilities</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or devices. 
                You agree to accept responsibility for all activities that occur under your account or password.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Modifications to Service</h2>
              <p>
                LocalPulse reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, 
                the Service (or any part thereof) with or without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Contact Information</h2>
              <p>
                Questions about the Terms of Service should be sent to us at: <br />
                <a href="mailto:localpulse.support@gmail.com" className="text-primary hover:underline mt-2 inline-block">localpulse.support@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-white/40 text-sm">
        &copy; {new Date().getFullYear()} LocalPulse. All rights reserved.
      </footer>
    </div>
  );
}
