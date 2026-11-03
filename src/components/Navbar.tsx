import React, { useState, useEffect } from 'react';
import { Logo } from './Logo.tsx';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['about', 'skills', 'services', 'projects', 'education', 'process', 'contact'];
      const scrollPosition = window.scrollY + 140;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-[#090909]/95 backdrop-blur-md border-b border-[#242424] shadow-lg shadow-black/50'
          : 'bg-[#090909]/80 backdrop-blur-sm border-b border-[#1A1A1A]'
      }`}
    >
      <div className="site-container">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded py-1"
            aria-label="HasDevs Home"
          >
            <Logo showSubtitle={true} />
          </a>

          {/* Desktop Navigation Links — Clean Inter 500 Font (14px) */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`group relative px-3.5 py-2 text-[14px] font-medium transition-colors duration-200 rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 ${
                    isActive
                      ? 'text-white'
                      : 'text-[#9E9E9E] hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {/* Animated underline / active indicator with zero layout shift */}
                  <span
                    className={`absolute bottom-0.5 left-3.5 right-3.5 h-[2px] rounded-full transition-all duration-200 ease-out origin-left ${
                      isActive
                        ? 'bg-emerald-400 opacity-100 scale-x-100'
                        : 'bg-white/70 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                    }`}
                  />
                  {isActive && (
                    <span className="sr-only">(current section)</span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="group hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wide text-black bg-[#E5E5E5] hover:bg-white hover:shadow-md hover:shadow-white/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 ease-out rounded-md font-heading cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <span>Hire Me</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#A3A3A3] hover:text-white hover:bg-[#151515] hover:border-[#3A3A3A] transition-all duration-200 rounded-md border border-[#262626] focus:outline-none focus-visible:ring-1 focus-visible:ring-white cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#242424] bg-[#111111] px-4 pt-3 pb-6 space-y-1 shadow-2xl animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`px-3.5 py-2.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-between ${
                    isActive
                      ? 'text-white bg-[#181818] border-l-2 border-emerald-400 pl-3'
                      : 'text-[#A3A3A3] hover:text-white hover:bg-[#141414] hover:translate-x-1'
                  }`}
                >
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          <div className="pt-4 mt-2 border-t border-[#222222]">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="group w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold tracking-wide text-black bg-[#E5E5E5] hover:bg-white hover:shadow-md hover:shadow-white/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 ease-out rounded-md font-heading cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <span>Hire Me</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      )}

    </header>
  );
};
