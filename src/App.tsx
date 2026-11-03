/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { About } from './components/About.tsx';
import { Skills } from './components/Skills.tsx';
import { Services } from './components/Services.tsx';
import { Projects } from './components/Projects.tsx';
import { ClientExperience } from './components/ClientExperience.tsx';
import { Education } from './components/Education.tsx';
import { DeliveryProcess } from './components/DeliveryProcess.tsx';
import { Contact } from './components/Contact.tsx';
import { Footer } from './components/Footer.tsx';
import { ChatbotWidget } from './components/ChatbotWidget.tsx';

export default function App() {
  return (
    <div className="min-h-screen bg-[#090909] text-[#FFFFFF] flex flex-col font-sans selection:bg-[#292929] selection:text-[#FFFFFF]">
      {/* Sticky Top Navigation */}
      <Navbar />

      {/* Main Landmarks */}
      <main id="main-content" className="flex-1">
        {/* Section B: Hero */}
        <Hero />

        {/* Section C: About Me */}
        <About />

        {/* Section D: Technical Skills */}
        <Skills />

        {/* Section E: Services */}
        <Services />

        {/* Section F: Projects */}
        <Projects />

        {/* Section G: Client Experience */}
        <ClientExperience />

        {/* Section H: Education & Continuous Learning */}
        <Education />

        {/* Section I: Project Delivery & Client Policy */}
        <DeliveryProcess />

        {/* Section J: Hire Me / Contact Form */}
        <Contact />
      </main>

      {/* Section L: Footer */}
      <Footer />

      {/* HasDevs AI Virtual Assistant Widget */}
      <ChatbotWidget />
    </div>
  );
}
