import React from 'react';

interface TechLogoProps {
  name: string;
  className?: string;
  size?: number;
}

export const TechLogo: React.FC<TechLogoProps> = ({
  name,
  className = '',
  size = 18,
}) => {
  const norm = name.trim().toLowerCase();

  // Helper container props
  const svgProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    className: `shrink-0 transition-transform duration-200 group-hover:scale-110 ${className}`,
    'aria-hidden': true,
  };

  // 1. React
  if (norm === 'react') {
    return (
      <svg {...svgProps} viewBox="-11.5 -10.23174 23 20.46348" fill="#61DAFB">
        <circle cx="0" cy="0" r="2.05" />
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  // 2. Next.js
  if (norm === 'next.js' || norm === 'nextjs') {
    return (
      <svg {...svgProps} viewBox="0 0 180 180" fill="none">
        <circle cx="90" cy="90" r="90" fill="#000000" stroke="#333333" strokeWidth="6" />
        <path
          d="M149.508 157.438L69.1438 54H54V125.975H66.6896V69.9679L139.99 164.444C143.332 162.298 146.517 159.954 149.508 157.438Z"
          fill="#FFFFFF"
        />
        <rect x="115" y="54" width="12.5" height="72" fill="#FFFFFF" />
      </svg>
    );
  }

  // 3. HTML / HTML5
  if (norm === 'html' || norm === 'html5') {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <path d="M3 2l1.8 17.8L12 22l7.2-2.2L21 2H3z" fill="#E44D26" />
        <path d="M12 3.8v16.4l5.6-1.7 1.4-14.7H12z" fill="#F16529" />
        <path d="M7.4 6.8h9.2l-.3 3.1H7.7l.3 3.2h8.5l-.5 5.2-4 1.1-4-1.1-.3-3H6l.4 4.8 5.6 1.6 5.6-1.6 1-10.2H7.2l.2-3.1z" fill="#FFFFFF" />
      </svg>
    );
  }

  // 4. CSS / CSS3
  if (norm === 'css' || norm === 'css3') {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <path d="M3 2l1.8 17.8L12 22l7.2-2.2L21 2H3z" fill="#264DE4" />
        <path d="M12 3.8v16.4l5.6-1.7 1.4-14.7H12z" fill="#2965F1" />
        <path d="M16.6 6.8H7.4l.2 3.1h8.8l-.4 4.2-4 .9-4-.9-.2-2.1H6.3l.4 3.7 5.3 1.5 5.3-1.5.8-8.9z" fill="#FFFFFF" />
      </svg>
    );
  }

  // 5. JavaScript
  if (norm === 'javascript' || norm === 'js') {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="2" fill="#F7DF1E" />
        <path
          d="M7.8 18.2c-.8 0-1.4-.3-1.8-.8-.4-.5-.6-1.2-.6-2.1h2.2c0 .5.1.9.3 1.1.2.2.5.4.8.4.4 0 .7-.1.9-.4.2-.2.3-.6.3-1.2v-5.4H12v5.5c0 1.3-.3 2.2-.9 2.8-.5.6-1.3.9-2.3.9zm8.5 0c-1.2 0-2.1-.4-2.7-1.1-.6-.7-.9-1.7-.9-2.9h2.2c0 .7.1 1.3.4 1.6.3.4.7.6 1.2.6.4 0 .7-.1.9-.3.2-.2.3-.5.3-.8 0-.4-.1-.7-.4-.9-.2-.2-.7-.5-1.4-.8-.9-.4-1.6-.8-2-1.3-.4-.5-.6-1.2-.6-1.9 0-.9.3-1.6.9-2.1.6-.5 1.4-.8 2.4-.8 1 0 1.8.3 2.4.9.6.6.9 1.4.9 2.5h-2.2c0-.5-.1-.9-.3-1.2-.2-.2-.5-.4-.9-.4-.4 0-.6.1-.8.3-.2.2-.3.4-.3.7 0 .3.1.5.3.7.2.2.6.4 1.3.7 1 .4 1.8.9 2.2 1.4.4.5.6 1.2.6 2 0 1-.3 1.8-1 2.3-.6.6-1.5.8-2.5.8z"
          fill="#000000"
        />
      </svg>
    );
  }

  // 6. Node.js
  if (norm === 'node.js' || norm === 'nodejs') {
    return (
      <svg {...svgProps} viewBox="0 0 32 32">
        <path
          d="M16 2.5l12.5 7.2v14.6L16 31.5 3.5 24.3V9.7L16 2.5z"
          fill="#539E43"
        />
        <path
          d="M16 6.8l8.8 5.1v10.2L16 27.2l-8.8-5.1V11.9L16 6.8z"
          fill="#333333"
        />
        <circle cx="16" cy="17" r="4" fill="#68A063" />
      </svg>
    );
  }

  // 7. Express.js
  if (norm === 'express.js' || norm === 'express') {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="#FFFFFF" strokeWidth="1.5" />
        <path
          d="M8 8h8M8 12h5.5M8 16h7.5"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // 8. Python
  if (norm === 'python') {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <path
          d="M11.9 2C8.3 2 8.6 3.6 8.6 3.6l.01 1.7h3.4v.5H5.4S2 5.4 2 9.1c0 3.6 3 3.5 3 3.5h1.8v-2.5c0-1.4 1.2-2.5 2.6-2.5h5.1c1.2 0 2.1-.9 2.1-2.1V3.9C16.6 2.6 14.5 2 11.9 2zM9.9 3.5a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6z"
          fill="#3776AB"
        />
        <path
          d="M12.1 22c3.6 0 3.3-1.6 3.3-1.6l-.01-1.7H12v-.5h6.6s3.4.4 3.4-3.3c0-3.6-3-3.5-3-3.5h-1.8v2.5c0 1.4-1.2 2.5-2.6 2.5H9.5c-1.2 0-2.1.9-2.1 2.1v1.7c0 1.3 2.1 1.9 4.7 1.9zm2-1.5a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z"
          fill="#FFD43B"
        />
      </svg>
    );
  }

  // 9. Supabase
  if (norm === 'supabase') {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <path
          d="M13.2 2.3c-.6-.7-1.7-.5-2 .3L4.2 14.8c-.4.8.2 1.8 1.1 1.8h7.1v5.1c0 .9 1.1 1.3 1.7.6l7.3-8.8c.6-.7.1-1.8-.8-1.8h-7.4V2.3z"
          fill="#3ECF8E"
        />
      </svg>
    );
  }

  // 10. Firebase
  if (norm === 'firebase') {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <path
          d="M4.6 18.2L6.8 4.3c.1-.8 1.1-1 1.5-.4l3.5 6.4L4.6 18.2z"
          fill="#FFA000"
        />
        <path
          d="M4.6 18.2l7.2 4.1c.5.3 1.1.3 1.6 0l7.2-4.1-3.4-10.4c-.2-.7-1.1-.9-1.6-.3l-11 10.7z"
          fill="#FFCA28"
        />
        <path
          d="M11.8 10.3l2.4-4.5c.3-.6 1.2-.6 1.5 0l4.9 12.4-8.8-7.9z"
          fill="#F57C00"
        />
      </svg>
    );
  }

  // 11. Google Gemini (Gemini API)
  if (norm.includes('gemini')) {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <defs>
          <linearGradient id="geminiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4E87F8" />
            <stop offset="50%" stopColor="#9B72CB" />
            <stop offset="100%" stopColor="#D96570" />
          </linearGradient>
        </defs>
        <path
          d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"
          fill="url(#geminiGrad)"
        />
      </svg>
    );
  }

  // 12. Anthropic Claude (Claude API)
  if (norm.includes('claude')) {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10.5" fill="#1C1816" stroke="#D97757" strokeWidth="1.2" />
        <path
          d="M12 6v12M6 12h12M7.8 7.8l8.4 8.4M7.8 16.2l8.4-8.4"
          stroke="#D97757"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="2" fill="#D97757" />
      </svg>
    );
  }

  // 13. OpenAI API
  if (norm.includes('openai')) {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#10A37F" />
        <path
          d="M12 7v5l4 2.5M12 7l-4 2.5 4 2.5M16 14.5l-4-2.5v-5M8 9.5l4 2.5v5M12 17l4-2.5-4-2.5M8 14.5l4-2.5"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // 14. Groq API
  if (norm.includes('groq')) {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="4" fill="#F55036" />
        <path
          d="M14 6H9c-1.7 0-3 1.3-3 3v6c0 1.7 1.3 3 3 3h4.5c1.4 0 2.5-1.1 2.5-2.5V12h-4v2h2v1.5c0 .3-.2.5-.5.5H9c-.6 0-1-.4-1-1V9c0-.6.4-1 1-1h5V6z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // 15. DeepSeek API
  if (norm.includes('deepseek')) {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="4" fill="#0066FF" />
        <path
          d="M6 14.5c2-4 5-6 9.5-6 1.5 0 2.5.5 2.5 1.5s-.8 1.5-2 1.5c-3 0-5 1.5-6.5 4.5l-3.5-1.5z"
          fill="#FFFFFF"
        />
        <circle cx="16.5" cy="11.5" r="1.2" fill="#FFFFFF" />
      </svg>
    );
  }

  // 16. Kimi K3 API (Moonshot AI / Kimi)
  if (norm.includes('kimi')) {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#1A1A1A" stroke="#444444" strokeWidth="1.5" />
        <path
          d="M8 7v10M8 12l6-5M8 12l6 5M17 7v10"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // 17. AgentRouter API
  if (norm.includes('agentrouter')) {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <circle cx="6" cy="6" r="3" fill="#10B981" />
        <circle cx="18" cy="6" r="3" fill="#3B82F6" />
        <circle cx="12" cy="18" r="3" fill="#A855F7" />
        <path
          d="M7.5 7.5L10.5 15.5M16.5 7.5L13.5 15.5M8 6h8"
          stroke="#666666"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // 18. Oxionai API
  if (norm.includes('oxionai')) {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="#E5E5E5" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="12" cy="12" r="4" fill="#38BDF8" />
      </svg>
    );
  }

  // 19. GitHub
  if (norm === 'github') {
    return (
      <svg {...svgProps} viewBox="0 0 24 24" fill="#FFFFFF">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    );
  }

  // 20. GitLab
  if (norm === 'gitlab') {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78L4.65 2.4a.43.43 0 0 1 .82 0l2.38 7.32h8.3l2.38-7.32a.43.43 0 0 1 .82 0l2.38 7.27 1.22 3.78a.84.84 0 0 1-.3.94z" fill="#E24329" />
        <path d="M12 22.13L1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78L12 22.13z" fill="#FC6D26" />
        <path d="M12 22.13l9.65-7.74a.84.84 0 0 0 .3-.94l-1.22-3.78L12 22.13z" fill="#FC6D26" />
        <path d="M2.27 9.67l2.38-7.27a.43.43 0 0 1 .82 0l2.38 7.27H2.27z" fill="#FCA326" />
        <path d="M16.15 9.67l2.38-7.27a.43.43 0 0 1 .82 0l2.38 7.27h-5.58z" fill="#FCA326" />
      </svg>
    );
  }

  // 21. Visual Studio Code
  if (norm.includes('visual studio') || norm === 'vscode') {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <path
          d="M17.5 2.5L7 11.2l-4.5-3.5L1 9l4 3-4 3 1.5 1.3L7 12.8l10.5 8.7L23 18.8V5.2L17.5 2.5zm1 14.2l-7.2-4.7 7.2-4.7v9.4z"
          fill="#007ACC"
        />
      </svg>
    );
  }

  // 22. Cursor
  if (norm === 'cursor') {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#1E1E1E" stroke="#555555" strokeWidth="1.2" />
        <path
          d="M8.5 7.5L16.5 12L12 13.5L10 17.5L8.5 7.5Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // 23. Claude Code
  if (norm === 'claude code') {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="4" fill="#1C1816" stroke="#D97757" strokeWidth="1" />
        <path d="M6 8l4 4-4 4M12 16h6" stroke="#D97757" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 24. Antigravity
  if (norm === 'antigravity') {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#161616" stroke="#444444" strokeWidth="1.2" />
        <path d="M12 6l5 10H7l5-10z" fill="#10B981" />
        <circle cx="12" cy="12" r="1.5" fill="#090909" />
      </svg>
    );
  }

  // 25. Codex
  if (norm === 'codex') {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <rect width="24" height="24" rx="4" fill="#0E0E0E" stroke="#333333" strokeWidth="1.2" />
        <path d="M7 8h10M7 12h7M7 16h4" stroke="#10A37F" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 26. AI Agents
  if (norm === 'ai agents') {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="#10B981" strokeWidth="1.5" />
        <circle cx="12" cy="8" r="2" fill="#10B981" />
        <circle cx="8" cy="15" r="2" fill="#3B82F6" />
        <circle cx="16" cy="15" r="2" fill="#A855F7" />
        <path d="M12 10v3M9.5 14l2-2 2 2" stroke="#666666" strokeWidth="1.2" />
      </svg>
    );
  }

  // 27. AI Chatbots
  if (norm === 'ai chatbots') {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <path
          d="M12 3c-4.97 0-9 3.58-9 8 0 1.63.56 3.14 1.54 4.38L3.5 21l5.88-1.54C10.36 19.78 11.16 20 12 20c4.97 0 9-3.58 9-8s-4.03-9-9-9z"
          fill="#1E1E1E"
          stroke="#38BDF8"
          strokeWidth="1.5"
        />
        <circle cx="9" cy="11" r="1.5" fill="#38BDF8" />
        <circle cx="15" cy="11" r="1.5" fill="#38BDF8" />
      </svg>
    );
  }

  // 28. Personal AI Assistants
  if (norm === 'personal ai assistants') {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" stroke="#F59E0B" strokeWidth="1.5" />
        <path d="M5 20c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="18" cy="6" r="1.5" fill="#10B981" />
      </svg>
    );
  }

  // 29. AI API Integrations
  if (norm === 'ai api integrations') {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <rect x="3" y="5" width="6" height="6" rx="1.5" stroke="#E5E5E5" strokeWidth="1.5" />
        <rect x="15" y="5" width="6" height="6" rx="1.5" stroke="#E5E5E5" strokeWidth="1.5" />
        <rect x="9" y="15" width="6" height="6" rx="1.5" fill="#6366F1" />
        <path d="M6 11v2a2 2 0 002 2h1M18 11v2a2 2 0 01-2 2h-1" stroke="#555555" strokeWidth="1.5" />
      </svg>
    );
  }

  // 30. AI Automation
  if (norm === 'ai automation') {
    return (
      <svg {...svgProps} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4" fill="#10B981" />
        <path
          d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"
          stroke="#444444"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Clean fallback for any uncaught item
  return (
    <svg {...svgProps} viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="#555555" strokeWidth="1.5" />
      <path d="M8 12h8" stroke="#E5E5E5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};
