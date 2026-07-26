'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import IntroBanner from '@/components/IntroBanner';
import WelcomeBanner from '@/components/WelcomeBanner';
import CarrierSection from '@/components/CarrierSection';
import PlansSection from '@/components/PlansSection';
import FeaturesSection from '@/components/FeaturesSection';
import AboutSection from '@/components/AboutSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import VisitorTracker from '@/components/VisitorTracker';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-gray-100" style={{ backgroundColor: '#0f172a', background: '#0f172a', color: '#f1f5f9' }}>
      <VisitorTracker />
      {/* WelcomeBanner tạm thời tắt để web có nền trắng */}
      {/* <WelcomeBanner /> */}
      <Header />
      <Hero />
      <CarrierSection />
      <PlansSection />
      <FeaturesSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      <ChatWidget />
    </main>
  );
}
