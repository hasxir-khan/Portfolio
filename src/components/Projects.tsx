import React, { useState } from 'react';
import { PROJECTS } from '../constants/portfolioData.ts';
import { Clock, Lock, ArrowUpRight, Sparkles, AlertCircle } from 'lucide-react';

export const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = [
    'All',
    'Full-Stack Web Development',
    'AI Development',
    'Custom Digital Solutions',
  ];

  const filteredProjects =
    activeFilter === 'All'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="py-20 sm:py-28 border-b border-[#242424] bg-[#090909]">
      <div className="site-container">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 pb-5 border-b border-[#1A1A1A]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#888888] font-heading">
              Case Studies &amp; Architecture
            </span>
            <h2 className="mt-1.5 text-[clamp(2rem,3vw,2.5rem)] font-semibold font-heading text-white tracking-tight">
              Selected Work &amp; Projects
            </h2>
          </div>
          <div className="text-xs text-[#737373] font-medium font-heading">
            Status: In Development / Private Client Handover
          </div>
        </div>

        {/* Introduction Narrative */}
        <p className="text-[16px] sm:text-[17px] text-[#A3A3A3] max-w-3xl mb-8 leading-[1.7] font-normal">
          I work on a range of web applications, AI-powered products, and custom digital solutions. More projects and public demonstrations will be added as they become available.
        </p>

        {/* Filter Tabs — Clean Inter font-medium */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10" role="tablist">
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeFilter === cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`px-3.5 py-1.5 text-[13px] font-medium rounded-md transition-all duration-200 ease-out cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 ${
                activeFilter === cat
                  ? 'bg-[#E5E5E5] text-black font-semibold shadow-sm'
                  : 'bg-[#141414] text-[#A3A3A3] hover:text-white hover:bg-[#1A1A1A] hover:border-[#383838] border border-[#242424]'
              }`}
            >
              {cat === 'All' ? `All (${PROJECTS.length})` : cat}
            </button>
          ))}
        </div>

        {/* Professional Product Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              className="group bg-[#111111] border border-[#202020] hover:border-[#383838] hover:-translate-y-1 transition-all duration-200 ease-out rounded-lg p-7 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md hover:shadow-black/40 overflow-hidden"
            >
              <div>
                {/* Top Status & Visibility Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-[#1A1A1A]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#161616] text-[#737373] border border-[#262626] group-hover:border-[#333333] transition-colors duration-200">
                      0{idx + 1}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#1A1813] border border-amber-900/40 text-xs font-medium text-amber-300">
                      <Clock className="w-3 h-3" />
                      <span>{project.status}</span>
                    </span>
                  </div>

                  {project.isPrivateClient ? (
                    <span className="inline-flex items-center gap-1 text-xs text-[#737373]">
                      <Lock className="w-3 h-3" />
                      <span>Private Client Handover</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                      <Sparkles className="w-3 h-3" />
                      <span>HasDevs R&amp;D</span>
                    </span>
                  )}
                </div>

                <div className="text-xs uppercase tracking-wider text-[#737373] mb-1.5 font-medium">
                  {project.category}
                </div>

                <h3 className="text-[clamp(1.2rem,1.8vw,1.45rem)] font-semibold font-heading text-white group-hover:text-emerald-400/90 transition-colors duration-200">
                  {project.title}
                </h3>

                <p className="mt-2.5 text-[15px] text-[#A3A3A3] leading-relaxed font-normal">
                  {project.description}
                </p>

                {/* Key Deliverable Specifications */}
                <div className="mt-6 pt-5 border-t border-[#1A1A1A]">
                  <span className="text-xs uppercase tracking-wider text-[#737373] block mb-2.5 font-medium">
                    Core Architectural Deliverables:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {project.features.map((feat) => (
                      <li key={feat} className="text-xs text-[#CCCCCC] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#444444] group-hover:bg-emerald-400/80 transition-colors duration-200"></span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Tech Stack Tags & Handover Guarantee */}
              <div className="mt-8 pt-5 border-t border-[#1A1A1A]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-xs text-[#A3A3A3] hover:text-white bg-[#161616] hover:bg-[#1C1C1C] border border-[#242424] hover:border-[#383838] rounded-sm transition-all duration-150 cursor-default select-none"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs text-[#666666]">
                    Full Source Code Handover
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Public Demonstrations & Coming Soon Studio Panel */}
        <div className="mt-12 p-7 bg-[#111111] border border-[#202020] rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Open-Source Demonstrations In Preparation</span>
              </div>
              <h3 className="text-base font-semibold font-heading text-white">
                Public Playgrounds &amp; Client Confidentiality Standards
              </h3>
              <p className="text-xs sm:text-sm text-[#888888] leading-relaxed font-normal">
                In adherence with non-disclosure and client confidentiality agreements, client production codebases remain private. Self-contained public interactive playgrounds, sandbox repositories, and demonstration builds will be linked directly here upon release.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold tracking-wide text-black bg-[#E5E5E5] hover:bg-white hover:shadow-lg hover:shadow-white/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] rounded transition-all duration-200 ease-out shrink-0 font-heading cursor-pointer"
            >
              <span>Commission Custom Project</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
