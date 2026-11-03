import React from 'react';
import { Globe2, ShieldCheck, MessageSquare, GitBranch, Quote } from 'lucide-react';
import { BRAND } from '../constants/portfolioData.ts';

export const ClientExperience: React.FC = () => {
  const pillars = [
    {
      number: '01',
      title: 'Requirement-Driven Alignment',
      description:
        'Focusing on your core objectives first — ensuring every architectural decision and line of code directly serves your functional scope.',
      icon: ShieldCheck,
    },
    {
      number: '02',
      title: 'Clear & Direct Communication',
      description:
        'Transparent milestone updates throughout the development lifecycle without unnecessary technical jargon or obfuscation.',
      icon: MessageSquare,
    },
    {
      number: '03',
      title: 'Source-Code Handover',
      description:
        'Full delivery of well-documented Git repositories, environment configurations, and setup guides for unconstrained ownership.',
      icon: GitBranch,
    },
  ];

  return (
    <section id="experience" className="py-20 sm:py-28 border-b border-[#242424] bg-[#090909]">
      <div className="site-container">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-12 pb-5 border-b border-[#1A1A1A]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#888888] font-heading">
              Track Record &amp; Communication
            </span>
            <h2 className="mt-1.5 text-[clamp(2rem,3vw,2.5rem)] font-semibold font-heading text-white tracking-tight">
              Working With Clients Worldwide
            </h2>
          </div>
          <div className="text-xs text-[#737373] font-medium font-heading">
            13 International Engagements
          </div>
        </div>

        {/* Studio Metric Spotlight Box */}
        <div className="bg-[#111111] border border-[#202020] rounded-lg p-7 sm:p-9 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 flex items-center gap-6 border-b lg:border-b-0 lg:border-r border-[#1A1A1A] pb-6 lg:pb-0 lg:pr-8">
              <div className="p-4 rounded bg-[#161616] border border-[#242424] text-white">
                <Globe2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <div className="text-5xl sm:text-6xl font-semibold font-heading text-white tracking-tight">
                  {BRAND.clientCount}
                </div>
                <div className="text-xs uppercase tracking-wider text-[#888888] mt-1 font-medium font-heading">
                  Clients Worldwide
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-3">
              <p className="text-base sm:text-lg text-[#E5E5E5] leading-relaxed font-normal">
                I&apos;ve worked with clients from different locations, helping turn their ideas and requirements into practical digital solutions.
              </p>
              <p className="text-sm text-[#888888] leading-relaxed font-normal">
                My focus is understanding the project requirements, communicating clearly, and delivering useful software with source-code handover.
              </p>
            </div>

          </div>
        </div>

        {/* 3 Studio Collaboration Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.number}
                className="bg-[#111111] border border-[#202020] rounded-lg p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#1A1A1A]">
                    <span className="font-mono text-xs font-semibold text-white px-2 py-0.5 rounded bg-[#161616] border border-[#262626]">
                      {pillar.number}
                    </span>
                    <Icon className="w-4 h-4 text-[#737373]" />
                  </div>

                  <h3 className="text-base font-semibold font-heading text-white mb-2">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-[#888888] leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Genuine Testimonials Future Accommodation Slot */}
        <div className="p-6 bg-[#0E0E0E] border border-dashed border-[#202020] rounded-lg text-center max-w-2xl mx-auto">
          <Quote className="w-5 h-5 text-[#444444] mx-auto mb-2" />
          <h4 className="text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold font-heading">
            Client Testimonials &amp; Case Studies
          </h4>
          <p className="text-xs text-[#666666] mt-1 leading-relaxed font-normal">
            Genuine verified case studies and client feedback will be featured here upon client authorization. No synthetic reviews or fabricated star ratings are used.
          </p>
        </div>

      </div>
    </section>
  );
};
