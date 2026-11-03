import React from 'react';
import { Logo } from './Logo.tsx';
import { BRAND } from '../constants/portfolioData.ts';
import { ArrowUp, Mail, MessageSquare, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Services', href: '#services' },
    { label: 'Projects', href: '#projects' },
    { label: 'Education', href: '#education' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#090909] border-t border-[#1F1F1F] pt-16 pb-12 text-[#888888]">
      <div className="site-container">
        
        {/* Top Grid: Studio Info, Links, Direct Channels */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#1E1E1E]">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <Logo showSubtitle={false} />
            <div className="text-white font-medium text-sm font-heading">
              {BRAND.owner} &middot; <span className="text-[#888888] font-normal">{BRAND.title}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#CCCCCC] max-w-sm leading-relaxed font-heading font-medium">
              &ldquo;{BRAND.tagline}&rdquo;
            </p>
            <p className="text-xs text-[#737373] max-w-md leading-relaxed">
              {BRAND.secondaryStatement}
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-4 space-y-3">
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
              Studio Navigation
            </div>
            <ul className="grid grid-cols-2 gap-2 text-xs font-mono">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="hover:text-white hover:translate-x-0.5 inline-block transition-all duration-200 ease-out focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Contacts */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
              Direct Channels
            </div>
            <div className="space-y-2.5 text-xs font-mono">
              <div>
                <a
                  href={BRAND.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white hover:translate-x-0.5 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp: {BRAND.phone}</span>
                </a>
              </div>

              <div>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="inline-flex items-center gap-2 hover:text-white hover:translate-x-0.5 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded"
                >
                  <Mail className="w-3.5 h-3.5 text-[#E5E5E5]" />
                  <span>Email: {BRAND.email}</span>
                </a>
              </div>

              <div>
                <a
                  href={BRAND.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white hover:translate-x-0.5 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 rounded"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#737373]" />
                  <span>Facebook Profile</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Row: Copyright & Back to Top */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#555555]">
          <div>
            &copy; {currentYear} {BRAND.name} ({BRAND.owner}). All rights reserved.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#111111] hover:bg-[#1A1A1A] border border-[#222222] hover:border-[#383838] text-xs text-[#888888] hover:text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 transition-all duration-200 ease-out cursor-pointer"
            aria-label="Back to top"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
