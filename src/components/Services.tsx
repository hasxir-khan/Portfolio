import React from 'react';
import { SERVICES } from '../constants/portfolioData.ts';
import { ArrowUpRight, Check, Sparkles } from 'lucide-react';

export const Services: React.FC = () => {
  const scrollToContact = (serviceTitle: string) => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.dispatchEvent(
        new CustomEvent('select-service', { detail: { service: serviceTitle } })
      );
    }
  };

  return (
    <section id="services" className="py-20 sm:py-28 border-b border-[#242424] bg-[#090909]">
      <div className="site-container">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-12 pb-5 border-b border-[#1A1A1A]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#888888] font-heading">
              Capabilities &amp; Scope
            </span>
            <h2 className="mt-1.5 text-[clamp(2rem,3vw,2.5rem)] font-semibold font-heading text-white tracking-tight">
              Services
            </h2>
          </div>
          <div className="text-xs text-[#737373] font-medium font-heading">
            Tailored Scope &bull; Custom Quotations
          </div>
        </div>

        {/* 4 Minimal Studio Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="bg-[#111111] border border-[#202020] hover:border-[#383838] hover:-translate-y-1 transition-all duration-200 ease-out rounded-lg p-7 sm:p-8 flex flex-col justify-between group shadow-sm hover:shadow-md hover:shadow-black/40"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#1A1A1A]">
                  <span className="font-mono text-xs font-semibold text-white px-2.5 py-1 rounded bg-[#161616] border border-[#262626] group-hover:border-[#3A3A3A] group-hover:scale-105 transition-all duration-200 ease-out">
                    {srv.number}
                  </span>
                  <span className="text-xs text-[#737373]">
                    Full-Lifecycle Service
                  </span>
                </div>

                <h3 className="mt-5 text-[clamp(1.2rem,1.8vw,1.45rem)] font-semibold font-heading text-white group-hover:text-emerald-400/90 transition-colors duration-200">
                  {srv.title}
                </h3>

                <p className="mt-2.5 text-[15px] text-[#A3A3A3] leading-relaxed font-normal">
                  {srv.summary}
                </p>

                {/* Features List */}
                <div className="mt-6 pt-5 border-t border-[#1A1A1A]">
                  <div className="text-xs uppercase tracking-wider text-[#737373] mb-3.5 font-medium">
                    Deliverable Scope:
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {srv.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-[13px] text-[#CCCCCC]">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200 ease-out" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Inquire Action */}
              <div className="mt-8 pt-5 border-t border-[#1A1A1A] flex items-center justify-between">
                <span className="text-xs text-[#737373]">
                  Custom Project Scope
                </span>
                <button
                  type="button"
                  onClick={() => scrollToContact(srv.title)}
                  className="group/btn inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#161616] hover:bg-white hover:text-black hover:border-white hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 border border-[#282828] rounded transition-all duration-200 ease-out font-heading cursor-pointer"
                >
                  <span>Inquire for {srv.number}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Studio Quotation Philosophy Banner */}
        <div className="mt-12 p-6 bg-[#111111] border border-[#202020] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3 h-3" />
              <span>Transparent Project Quotations</span>
            </div>
            <h3 className="text-base font-semibold font-heading text-white">
              No Arbitrary Pricing Packages &bull; Tailored to Exact Specifications
            </h3>
            <p className="text-xs text-[#888888] leading-relaxed font-normal">
              Every digital solution has unique technical requirements, architectural scope, and delivery timelines. I provide honest, milestone-based quotations tailored to your exact product goals.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold tracking-wide text-black bg-[#E5E5E5] hover:bg-white hover:shadow-lg hover:shadow-white/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] transition-all duration-200 ease-out rounded shrink-0 font-heading cursor-pointer"
          >
            <span>Request Project Quote</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>


      </div>
    </section>
  );
};
