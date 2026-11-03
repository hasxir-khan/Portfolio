import React from 'react';
import { EDUCATION_DATA } from '../constants/portfolioData.ts';
import { GraduationCap, Compass, BookOpen } from 'lucide-react';

export const Education: React.FC = () => {
  return (
    <section id="education" className="py-20 sm:py-28 border-b border-[#242424] bg-[#090909]">
      <div className="site-container">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-12 pb-5 border-b border-[#1A1A1A]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#888888] font-heading">
              Foundations &amp; Self-Direction
            </span>
            <h2 className="mt-1.5 text-[clamp(2rem,3vw,2.5rem)] font-semibold font-heading text-white tracking-tight">
              Education
            </h2>
          </div>
          <div className="text-xs text-[#737373] font-medium font-heading">
            Computer Science &bull; Continuous Learning
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Formal Academic Grounding Column — Strictly "BS Computer Science" without any semester mention */}
          <div className="lg:col-span-5 bg-[#111111] border border-[#202020] rounded-lg p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 pb-4 mb-5 border-b border-[#1A1A1A]">
                <div className="p-2 rounded bg-[#161616] text-emerald-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#737373] font-medium">
                    Formal Education
                  </span>
                  <h3 className="text-base font-semibold font-heading text-white">
                    Academic Studies
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4.5 bg-[#141414] border border-[#202020] rounded-md">
                  <div className="text-lg sm:text-xl font-semibold font-heading text-white">
                    {EDUCATION_DATA.degree}
                  </div>
                </div>

                <p className="text-sm text-[#888888] leading-relaxed font-normal">
                  {EDUCATION_DATA.description}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#1A1A1A] text-xs text-[#555555]">
              Core foundational studies in data structures, algorithms, and computational theory.
            </div>
          </div>

          {/* Continuous Self-Taught Ecosystem Column */}
          <div className="lg:col-span-7 bg-[#111111] border border-[#202020] rounded-lg p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 pb-4 mb-5 border-b border-[#1A1A1A]">
                <div className="p-2 rounded bg-[#161616] text-[#E5E5E5]">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#737373] font-medium">
                    Self-Taught Development
                  </span>
                  <h3 className="text-base font-semibold font-heading text-white">
                    Continuous Learning
                  </h3>
                </div>
              </div>

              <div className="p-4 bg-[#141414] border-l-2 border-[#444444] rounded-r mb-6 text-sm text-[#CCCCCC] leading-relaxed font-normal">
                &ldquo;{EDUCATION_DATA.selfTaughtStatement}&rdquo;
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-[#737373] mb-3 flex items-center gap-1.5 font-medium">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Primary Documentation &amp; Learning Resources:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {EDUCATION_DATA.learningResources.map((res) => (
                    <div
                      key={res.name}
                      className="p-3 bg-[#151515] border border-[#202020] rounded hover:border-[#303030] transition-colors"
                    >
                      <div className="text-xs font-semibold text-white font-heading">
                        {res.name}
                      </div>
                      <div className="text-[11px] text-[#737373] mt-0.5 font-normal">
                        {res.category}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#1A1A1A] text-xs text-[#555555]">
              Platforms and documentation ecosystems utilized strictly as continuous learning resources.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
