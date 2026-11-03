import React from 'react';
import { Check, Globe, Sparkles, Cpu, Code2, KeyRound } from 'lucide-react';
import { BRAND } from '../constants/portfolioData.ts';

export const About: React.FC = () => {
  const verifiedFacts = [
    {
      index: '01',
      title: '13 Clients Worldwide',
      desc: 'Collaborated with clients from various regions to build tailored digital solutions.',
      icon: Globe,
    },
    {
      index: '02',
      title: 'AI-Assisted Development',
      desc: 'Using AI as a technical partner to explore stacks and accelerate execution.',
      icon: Sparkles,
    },
    {
      index: '03',
      title: 'Full-Stack & AI Solutions',
      desc: 'Bridging responsive web apps with intelligent model pipelines and chatbots.',
      icon: Cpu,
    },
    {
      index: '04',
      title: 'Custom Project Development',
      desc: 'Every architecture is designed to suit the client’s exact functional scope.',
      icon: Code2,
    },
    {
      index: '05',
      title: 'Source-Code Handover',
      desc: 'Complete handover of repositories, environment configs, and documentation.',
      icon: KeyRound,
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 border-b border-[#242424] bg-[#090909]">
      <div className="site-container">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-12 pb-5 border-b border-[#1A1A1A]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#888888] font-heading">
              Studio Background
            </span>
            <h2 className="mt-1.5 text-[clamp(2rem,3vw,2.5rem)] font-semibold font-heading text-white tracking-tight">
              About Me
            </h2>
          </div>
          <div className="text-xs text-[#737373] font-medium font-heading">
            Hashir Khan &bull; HasDevs
          </div>
        </div>

        {/* Split Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-14 items-start">
          
          {/* Left Column: Editorial Statement & Cohesive Narrative */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* Elegant Editorial Statement — Subtle & Balanced */}
            <div className="p-5 bg-[#121212] border-l-2 border-[#E5E5E5] rounded-r-md">
              <p className="text-[16.5px] sm:text-[18px] font-medium font-heading text-[#EEEEEE] leading-[1.65]">
                &ldquo;{BRAND.secondaryStatement}&rdquo;
              </p>
            </div>

            {/* Cohesive Narrative Paragraphs — 16-17.5px with comfortable leading */}
            <div className="space-y-4 text-[#A3A3A3] text-[16px] sm:text-[17px] leading-[1.7] max-w-2xl font-normal">
              <p>
                I&apos;m Hashir Khan, founder of HasDevs and an AI &amp; Web Application Developer. I build modern web applications, AI-powered solutions, chatbots, and intelligent personal AI agents.
              </p>
              <p>
                I combine technical knowledge, problem-solving, and AI as a development partner to build clean, functional, and reliable digital products.
              </p>
              <p className="text-white font-medium font-heading">
                Turning ideas into technology that works.
              </p>
              <p>
                Collaborating with 13 clients worldwide, I have built tailored web applications and custom software solutions — always delivering clean architectures and 100% complete source-code ownership with comprehensive handover.
              </p>
            </div>

            {/* Tagline Indicator */}
            <div className="pt-2 text-sm text-[#888888]">
              Studio Focus: <span className="text-white font-medium font-heading">{BRAND.tagline}</span>
            </div>
          </div>

          {/* Right Column: Studio Verification Ledger */}
          <div className="lg:col-span-5 bg-[#111111] border border-[#222222] rounded-lg p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-3.5">
              <span className="text-xs uppercase tracking-wider text-white font-semibold font-heading">
                Verified Capabilities
              </span>
              <span className="text-xs text-[#737373]">
                5 Core Pillars
              </span>
            </div>

            <div className="space-y-3">
              {verifiedFacts.map((fact) => {
                const Icon = fact.icon;
                return (
                  <div
                    key={fact.index}
                    className="p-3.5 bg-[#141414] border border-[#202020] hover:border-[#333333] transition-colors rounded-md flex items-start gap-3.5"
                  >
                    <div className="p-2 rounded bg-[#0E0E0E] text-[#E5E5E5] shrink-0 mt-0.5 border border-[#1E1E1E]">
                      <Icon className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-[14.5px] font-semibold text-white font-heading">
                        {fact.title}
                      </h3>
                      <p className="text-[12.5px] text-[#9E9E9E] mt-1 leading-relaxed font-normal">
                        {fact.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between text-xs text-[#737373]">
              <span className="flex items-center gap-1.5 text-white font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Fabricated Claims</span>
              </span>
              <span>100% Truthful</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
