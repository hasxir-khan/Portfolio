import React from 'react';
import { PROCESS_STEPS } from '../constants/portfolioData.ts';
import { ShieldAlert, CreditCard, Key, ArrowRight } from 'lucide-react';

export const DeliveryProcess: React.FC = () => {
  const infraItems = [
    'Domain registration and annual renewal charges',
    'Cloud server, VPS, and hosting recurring fees',
    'Database hosting, compute, and storage usage',
    'Premium AI API subscriptions and model tokens',
    'Paid third-party integrations and commercial SDKs',
    'Any additional external infrastructure tools',
  ];

  return (
    <section id="process" className="py-20 sm:py-28 border-b border-[#242424] bg-[#090909]">
      <div className="site-container">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-12 pb-5 border-b border-[#1A1A1A]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#888888] font-heading">
              Methodology &amp; Client Policies
            </span>
            <h2 className="mt-1.5 text-[clamp(2rem,3vw,2.5rem)] font-semibold font-heading text-white tracking-tight">
              Development Process
            </h2>
          </div>
          <div className="text-xs text-[#737373] font-medium font-heading">
            5-Phase Lifecycle &bull; Source Code Handover
          </div>
        </div>

        {/* 5-Step Numbered Development-Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {PROCESS_STEPS.map((step, idx) => (
            <div
              key={step.number}
              className="bg-[#111111] border border-[#202020] hover:border-[#333333] transition-colors rounded-lg p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1A1A1A]">
                  <span className="font-mono text-xs font-semibold text-white px-2 py-0.5 rounded bg-[#161616] border border-[#262626]">
                    Phase {step.number}
                  </span>
                  {idx < 4 && (
                    <ArrowRight className="hidden lg:block w-3.5 h-3.5 text-[#444444]" />
                  )}
                </div>

                <h3 className="text-base font-semibold font-heading text-white mb-2">
                  {step.title}
                </h3>

                <p className="text-xs text-[#888888] leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#1A1A1A]">
                <div className="text-[11px] uppercase tracking-wider text-[#666666] font-medium">
                  Deliverable:
                </div>
                <div className="text-xs text-[#CCCCCC] mt-0.5 font-medium">
                  {step.deliverable}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Studio Client Payment & Infrastructure Policy */}
        <div className="bg-[#111111] border-2 border-[#222222] rounded-lg p-7 sm:p-9 relative">
          <div className="max-w-4xl space-y-5">
            
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 font-heading">
              <ShieldAlert className="w-4 h-4" />
              <span>Transparent Client Infrastructure Policy</span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold font-heading text-white">
              Client Payment &amp; Third-Party Expense Separation
            </h3>

            <p className="text-sm sm:text-base text-[#CCCCCC] leading-relaxed font-normal">
              HasDevs offers development, hosting assistance, and deployment services. 
              <span className="text-white font-medium"> The developer&apos;s service fee and infrastructure expenses are strictly separate.</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-[#1A1A1A]">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-white mb-3.5 flex items-center gap-2 font-semibold font-heading">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Third-Party Expenses Paid by Client:</span>
                </h4>
                <ul className="space-y-2.5">
                  {infraItems.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-xs text-[#A3A3A3] font-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4 bg-[#141414] p-5 rounded-md border border-[#202020]">
                <div>
                  <h4 className="text-sm font-semibold font-heading text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <span>Client Account Ownership Model</span>
                  </h4>
                  <p className="text-xs text-[#888888] mt-1.5 leading-relaxed font-normal">
                    Whenever possible, infrastructure accounts (cloud consoles, database clusters, domain registrars, API keys) are created in the client&apos;s direct ownership. You maintain full operational control and permanent ownership of your production environment.
                  </p>
                </div>

                <div className="text-xs text-[#CCCCCC] bg-[#0E0E0E] p-3 rounded border border-[#202020] leading-relaxed font-normal">
                  These expenses are not paid by the developer and are not automatically included in the development fee. Estimated operating costs are clarified prior to project commencement.
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
