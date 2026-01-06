import React from "react";
import HeroSection from "@/components/Home/HeroSection";
import AboutSection from "@/components/Home/AboutSection";
import TechStackSection from "@/components/Home/TechStackSection";
import AudienceSection from "@/components/Home/AudienceSection";
import AgendaSection from "@/components/Home/AgendaSection";
import SpeakerSection from "@/components/Home/SpeakerSection";
import BenefitsSection from "@/components/Home/BenefitsSection";
import TestimonialSection from "@/components/Home/TestimonialSection";
import FAQSection from "@/components/Home/FAQSection";
import CTASection from "@/components/Home/CTASection";

export default function HomePage() {
    return (
        <main className="w-full overflow-x-hidden bg-gray-50">
            <HeroSection />
            <AboutSection />
            <TechStackSection />
            <AudienceSection />
            <AgendaSection />
            <SpeakerSection />
            <BenefitsSection />
            <TestimonialSection />
            <FAQSection />
            <CTASection />
        </main>
    );
}
