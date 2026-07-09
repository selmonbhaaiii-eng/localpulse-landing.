import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function PrivacyPolicy() {
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
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-white/50 mb-12">Last Updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-white/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p>
                Welcome to LocalPulse. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you as to how we look after your personal data when you visit our website 
                and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Data We Collect</h2>
              <p className="mb-2">When you connect your Google Business Profile to LocalPulse, we collect the following:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>OAuth Tokens:</strong> We store secure OAuth access and refresh tokens to communicate with the Google APIs on your behalf. We do not store your Google password.</li>
                <li><strong>Profile Information:</strong> Basic information regarding your connected Google Business Profile locations.</li>
                <li><strong>Reviews Data:</strong> We fetch and store reviews publicly available on your Google Business Profile to provide AI analysis.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Data</h2>
              <p className="mb-2">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, operate, and maintain the LocalPulse service.</li>
                <li>Automatically sync your latest Google Reviews.</li>
                <li>Analyze review data using Artificial Intelligence to extract insights.</li>
                <li>Automatically generate and publish Google Posts to your profile on your behalf (only when explicitly enabled by you).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Google API Services User Data Policy</h2>
              <p>
                LocalPulse's use and transfer to any other app of information received from Google APIs will adhere to 
                the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer" className="text-primary hover:underline">Google API Services User Data Policy</a>, including the Limited Use requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
                used, or accessed in an unauthorized way, altered, or disclosed. Your data is encrypted at rest and in transit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at: <br />
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
