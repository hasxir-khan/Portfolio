import React, { useState } from 'react';
import { ArrowUpRight, ArrowDown, Terminal, Sparkles, Check, Copy, Code2, Cpu } from 'lucide-react';
import { BRAND } from '../constants/portfolioData.ts';

export const Hero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'agent' | 'stack'>('architecture');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyCode = () => {
    const code = `// HasDevs Studio — Production Architecture Pipeline
export const studioPipeline: StudioDelivery = {
  developer: "Hashir Khan",
  title: "AI & Web Application Developer",
  methodology: "AI-Assisted Full-Stack Engineering",
  deliverables: [
    "Full-Stack Web Applications",
    "Autonomous AI Agents & Chatbots",
    "Complete Source-Code Handover"
  ],
  trackRecord: "13 Clients Worldwide",
  codeOwnership: "100% Client-Owned"
};`;
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <section id="home" className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[#242424] bg-[#090909]">
      <div className="site-container">
        
        {/* Two-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-14 items-center">
          
          {/* Left Column: Heading, Intro, CTAs, Trust Statement */}
          <div className="lg:col-span-7 space-y-7">
            
            {/* Availability Indicator */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#121212] border border-[#242424] text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[#A3A3A3] text-xs font-medium">
                Available for Select Client Projects
              </span>
            </div>

            {/* Refined Manrope Heading (Weight ~600, Clamp 52-68px on Desktop) */}
            <div className="space-y-3">
              <div className="text-xs font-medium uppercase tracking-wider text-[#888888]">
                {BRAND.owner} &bull; <span className="text-[#C5C5C5]">{BRAND.title}</span>
              </div>
              <h1 className="text-[clamp(2.5rem,4.2vw+0.5rem,4.125rem)] font-semibold font-heading text-white tracking-[-0.025em] leading-[1.1] max-w-2xl lg:max-w-none xl:max-w-3xl">
                Building Digital Solutions With Code, Creativity &amp; AI.
              </h1>
            </div>

            {/* Shorter, Elegant, Comfortably Readable Supporting Description */}
            <p className="text-[16px] sm:text-[17.5px] text-[#A3A3A3] leading-[1.7] max-w-xl font-normal">
              I&apos;m <span className="text-white font-medium">{BRAND.owner}</span>, founder of <span className="text-white font-medium">{BRAND.name}</span>. I build modern web applications and AI-powered solutions by combining technical knowledge, problem-solving, and AI as a development partner.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => scrollTo('contact')}
                className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold tracking-wide text-black bg-[#E5E5E5] hover:bg-white hover:shadow-lg hover:shadow-white/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] transition-all duration-200 ease-out rounded shadow-sm font-heading cursor-pointer"
              >
                <span>Let&apos;s Work Together</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                type="button"
                onClick={() => scrollTo('projects')}
                className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium tracking-wide text-[#E5E5E5] bg-[#141414] hover:bg-[#1A1A1A] border border-[#262626] hover:border-[#444444] hover:text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909] transition-all duration-200 ease-out rounded font-heading cursor-pointer"
              >
                <span>Explore My Work</span>
                <ArrowDown className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-y-0.5" />
              </button>
            </div>


            {/* Small Professional Trust Statement */}
            <div className="pt-4 border-t border-[#1C1C1C] flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-[#888888]">
              <div className="flex items-center gap-1.5 text-white font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{BRAND.clientCount} Clients Worldwide</span>
              </div>
              <div className="text-[#383838]">&bull;</div>
              <div>Full-Stack &amp; AI Integration</div>
              <div className="text-[#383838]">&bull;</div>
              <div className="text-[#C5C5C5]">100% Source-Code Handover</div>
            </div>

          </div>

          {/* Right Column: Sophisticated Developer-Studio Visual Composition */}
          <div className="lg:col-span-5">
            <div className="bg-[#111111] border border-[#242424] rounded-lg shadow-2xl overflow-hidden">
              
              {/* Window Title Bar */}
              <div className="px-4 py-3 bg-[#151515] border-b border-[#242424] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2C2C2C]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2C2C2C]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2C2C2C]"></div>
                  <span className="ml-2 font-mono text-xs text-[#666666] tracking-wider">
                    hasdevs-studio
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[#0A0A0A] border border-[#222222] text-emerald-400">
                    DEVELOPMENT WORKFLOW
                  </span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="p-1 text-[#666666] hover:text-white transition-colors"
                    title="Copy snippet"
                    aria-label="Copy snippet"
                  >
                    {copiedSnippet ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Code Tab Switcher */}
              <div className="flex border-b border-[#222222] bg-[#0E0E0E] text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab('architecture')}
                  className={`px-4 py-2 flex items-center gap-1.5 border-r border-[#222222] transition-colors ${
                    activeTab === 'architecture'
                      ? 'bg-[#151515] text-white font-medium border-t-2 border-t-white'
                      : 'text-[#666666] hover:text-[#A3A3A3]'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>pipeline.ts</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('agent')}
                  className={`px-4 py-2 flex items-center gap-1.5 border-r border-[#222222] transition-colors ${
                    activeTab === 'agent'
                      ? 'bg-[#151515] text-white font-medium border-t-2 border-t-white'
                      : 'text-[#666666] hover:text-[#A3A3A3]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>agent_router.py</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('stack')}
                  className={`px-4 py-2 flex items-center gap-1.5 transition-colors ${
                    activeTab === 'stack'
                      ? 'bg-[#151515] text-white font-medium border-t-2 border-t-white'
                      : 'text-[#666666] hover:text-[#A3A3A3]'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>stack.json</span>
                </button>
              </div>

              {/* Tab Content Panels */}
              <div className="p-5 sm:p-6 font-mono text-[13px] sm:text-[13.5px] lg:text-[14px] leading-[1.7] overflow-x-auto min-h-[290px] bg-[#0B0B0B]">
                {activeTab === 'architecture' && (
                  <div className="space-y-1 text-[#A3A3A3]">
                    <p className="text-[#555555]">// HasDevs Studio Delivery Model</p>
                    <p>
                      <span className="text-purple-400">export const</span>{' '}
                      <span className="text-yellow-300">studioDelivery</span> = {'{'}
                    </p>
                    <p className="pl-4">
                      <span className="text-[#E5E5E5]">engineer:</span>{' '}
                      <span className="text-emerald-400">&quot;Hashir Khan&quot;</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-[#E5E5E5]">studio:</span>{' '}
                      <span className="text-emerald-400">&quot;HasDevs&quot;</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-[#E5E5E5]">methodology:</span>{' '}
                      <span className="text-emerald-400">&quot;AI-Assisted Full-Stack&quot;</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-[#E5E5E5]">deliverables:</span> [
                    </p>
                    <p className="pl-8 text-emerald-400">
                      &quot;Full-Stack Web Applications&quot;,
                    </p>
                    <p className="pl-8 text-emerald-400">
                      &quot;Autonomous AI Agents &amp; Chatbots&quot;,
                    </p>
                    <p className="pl-8 text-emerald-400">
                      &quot;Complete Source-Code Handover&quot;
                    </p>
                    <p className="pl-4">],</p>
                    <p className="pl-4">
                      <span className="text-[#E5E5E5]">clientsWorldwide:</span>{' '}
                      <span className="text-amber-400">13</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-[#E5E5E5]">codeOwnership:</span>{' '}
                      <span className="text-emerald-400">&quot;100% Client-Owned&quot;</span>
                    </p>
                    <p>{'};'}</p>
                  </div>
                )}

                {activeTab === 'agent' && (
                  <div className="space-y-1 text-[#A3A3A3]">
                    <p className="text-[#555555]"># Multi-LLM Routing &amp; Autonomous Agents</p>
                    <p>
                      <span className="text-purple-400">async def</span>{' '}
                      <span className="text-yellow-300">execute_agent_task</span>(task, context):
                    </p>
                    <p className="pl-4">
                      models = [<span className="text-emerald-400">&quot;Gemini&quot;</span>, <span className="text-emerald-400">&quot;Claude&quot;</span>, <span className="text-emerald-400">&quot;OpenAI&quot;</span>]
                    </p>
                    <p className="pl-4">
                      router = <span className="text-blue-400">ModelRouter</span>(latency_opt=<span className="text-amber-400">True</span>)
                    </p>
                    <p className="pl-4">
                      response = <span className="text-purple-400">await</span> router.dispatch(
                    </p>
                    <p className="pl-8">
                      task=task,
                    </p>
                    <p className="pl-8">
                      stream=<span className="text-amber-400">True</span>,
                    </p>
                    <p className="pl-8">
                      tools=[<span className="text-emerald-400">&quot;db_query&quot;</span>, <span className="text-emerald-400">&quot;web_search&quot;</span>]
                    </p>
                    <p className="pl-4">)</p>
                    <p className="pl-4 text-purple-400">return <span className="text-[#E5E5E5]">response.deliverable</span></p>
                  </div>
                )}

                {activeTab === 'stack' && (
                  <div className="space-y-1 text-[#A3A3A3]">
                    <p className="text-[#555555]">// Technical Stack Manifest</p>
                    <p>{'{'}</p>
                    <p className="pl-4">
                      <span className="text-emerald-400">&quot;frontend&quot;</span>: [<span className="text-amber-300">&quot;React&quot;</span>, <span className="text-amber-300">&quot;Next.js&quot;</span>, <span className="text-amber-300">&quot;Tailwind&quot;</span>],
                    </p>
                    <p className="pl-4">
                      <span className="text-emerald-400">&quot;backend&quot;</span>: [<span className="text-amber-300">&quot;Node.js&quot;</span>, <span className="text-amber-300">&quot;Express.js&quot;</span>, <span className="text-amber-300">&quot;Python&quot;</span>],
                    </p>
                    <p className="pl-4">
                      <span className="text-emerald-400">&quot;databases&quot;</span>: [<span className="text-amber-300">&quot;Supabase&quot;</span>, <span className="text-amber-300">&quot;Firebase&quot;</span>],
                    </p>
                    <p className="pl-4">
                      <span className="text-emerald-400">&quot;ai_apis&quot;</span>: [<span className="text-amber-300">&quot;Gemini&quot;</span>, <span className="text-amber-300">&quot;Claude&quot;</span>, <span className="text-amber-300">&quot;Groq&quot;</span>],
                    </p>
                    <p className="pl-4">
                      <span className="text-emerald-400">&quot;deployment&quot;</span>: <span className="text-amber-300">&quot;Client Cloud Infrastructure&quot;</span>
                    </p>
                    <p>{'}'}</p>
                  </div>
                )}
              </div>

              {/* Bottom Technical Status Bar */}
              <div className="px-4 py-2.5 bg-[#151515] border-t border-[#222222] flex items-center justify-between text-[11px] text-[#666666] font-mono">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-white">
                    <Terminal className="w-3 h-3 text-emerald-400" />
                    <span>hasdevs.runtime</span>
                  </span>
                  <span>UTF-8</span>
                </div>
                <div>
                  <span className="text-[#A3A3A3]">100% Client Ownership</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
