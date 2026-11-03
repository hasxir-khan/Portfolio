import React from 'react';
import { SKILL_CATEGORIES } from '../constants/portfolioData.ts';
import { TechLogo } from './TechLogo.tsx';
import { Code, Server, Database, Sparkles, Bot, Wrench, ShieldCheck } from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
  frontend: Code,
  backend: Server,
  databases: Database,
  'ai-apis': Sparkles,
  'ai-dev': Bot,
  tools: Wrench,
};

export const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-20 sm:py-28 border-b border-[#242424] bg-[#090909]">
      <div className="site-container">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-12 pb-5 border-b border-[#1A1A1A]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#888888] font-heading">
              Technical Stack &amp; Tools
            </span>
            <h2 className="mt-1.5 text-[clamp(2rem,3vw,2.5rem)] font-semibold font-heading text-white tracking-tight">
              Skills &amp; Technologies
            </h2>
          </div>
          <div className="text-xs text-[#737373] font-medium font-heading">
            25 Core Technologies &bull; 5 AI Capabilities &bull; Active Ecosystem
          </div>
        </div>

        {/* Structured Technical Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {SKILL_CATEGORIES.map((cat, idx) => {
            const Icon = categoryIcons[cat.id] || Code;
            const indexStr = `0${idx + 1}`.slice(-2);

            return (
              <div
                key={cat.id}
                className="bg-[#111111] border border-[#202020] hover:border-[#383838] hover:-translate-y-1 transition-all duration-200 ease-out rounded-lg p-6 sm:p-7 flex flex-col justify-between group shadow-sm hover:shadow-md hover:shadow-black/40"
              >
                <div>
                  {/* Category Top Bar */}
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#1A1A1A]">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded bg-[#161616] text-[#E5E5E5] group-hover:text-emerald-400 group-hover:scale-105 transition-all duration-200 ease-out">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-[15.5px] font-semibold font-heading text-white">
                        {cat.category}
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-[#555555]">
                      {indexStr}
                    </span>
                  </div>

                  <p className="text-[13px] text-[#888888] mb-5 leading-relaxed font-normal">
                    {cat.description}
                  </p>

                  {/* Brand Logos alongside Technology Names */}
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((skill) => (
                      <div
                        key={skill}
                        tabIndex={0}
                        role="note"
                        aria-label={`${skill} technology`}
                        title={`${skill} • Verified technology in HasDevs production stack`}
                        className="group/tile flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#E5E5E5] bg-[#151515] hover:bg-[#1A1A1A] border border-[#242424] hover:border-[#3E3E3E] rounded-md transition-all duration-200 ease-out cursor-default select-none hover:-translate-y-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
                      >
                        <div className="shrink-0 transition-transform duration-200 ease-out group-hover/tile:scale-110">
                          <TechLogo name={skill} size={15} />
                        </div>
                        <span className="text-xs tracking-tight text-white transition-colors">
                          {skill}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#1A1A1A] flex items-center justify-between text-xs text-[#555555]">
                  <span>{cat.id === 'ai-dev' ? `${cat.items.length} Capabilities` : `${cat.items.length} Technologies`}</span>
                  <span>Active Workflow</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Policy Disclaimer */}
        <div className="mt-10 p-5 bg-[#111111] border border-[#202020] rounded-md flex items-start gap-3.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-[#A3A3A3] space-y-1">
            <span className="text-white font-semibold block font-heading">
              Authentic Brand Verification
            </span>
            <p className="leading-relaxed font-normal">
              Every displayed mark corresponds to a verified framework, model API, database, or engineering tool actively used in client projects and software architecture. No artificial skill percentages, fake progress bars, or commercial affiliations are claimed.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
