import {
  SkillCategory,
  ServiceItem,
  ProjectItem,
  ProcessStep,
} from '../types/index.ts';

export const BRAND = {
  name: 'HasDevs',
  owner: 'Hashir Khan',
  title: 'AI & Web Application Developer',
  tagline: 'Turning Ideas Into Intelligent Digital Solutions.',
  secondaryStatement:
    'I build modern web applications and AI-powered solutions by combining technical knowledge, problem-solving, and AI as a development partner.',
  availability: 'Available for select freelance projects & custom development',
  clientCount: '13',
  clientMetricText: 'Clients Worldwide',
  email: 'hasdeves@gmail.com',
  phone: '+923169896229',
  phoneRaw: '923169896229',
  whatsappUrl: 'https://wa.me/923169896229',
  facebookUrl: 'https://www.facebook.com/share/1FoEqAqXhY/',
  
  // Dedicated logo asset paths:
  // - transparent: Trimmed transparent PNG of user's original logo
  // - original: Exact original file as supplied
  // - mode: 'transparent' | 'wordmark' | 'original'
  logoAssetPath: '/assets/logo/hasdevs-logo-trimmed.png',
  originalLogoAssetPath: '/assets/logo/hasdevs-logo.png',
  logoMode: 'transparent' as 'transparent' | 'wordmark' | 'original',
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    category: 'Frontend Development',
    description: 'Modern, responsive client interfaces built with component architecture.',
    items: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js'],
  },
  {
    id: 'backend',
    category: 'Backend Development',
    description: 'Server logic, RESTful APIs, and application runtime environments.',
    items: ['Node.js', 'Express.js', 'Python'],
  },
  {
    id: 'databases',
    category: 'Databases & BaaS',
    description: 'Scalable data persistence, real-time sync, and authentication services.',
    items: ['Supabase', 'Firebase'],
  },
  {
    id: 'ai-apis',
    category: 'AI APIs & Models',
    description: 'Integration with state-of-the-art LLMs and high-speed inference endpoints.',
    items: [
      'Gemini API',
      'Claude API',
      'OpenAI API',
      'AgentRouter API',
      'Groq API',
      'Oxionai API',
      'DeepSeek API',
      'Kimi K3 API',
    ],
  },
  {
    id: 'ai-dev',
    category: 'AI Development',
    description: 'Autonomous workflows, conversational interfaces, and intelligent assistants.',
    items: [
      'AI Agents',
      'AI Chatbots',
      'Personal AI Assistants',
      'AI API Integrations',
      'AI Automation',
    ],
  },
  {
    id: 'tools',
    category: 'Development Tools',
    description: 'Version control, AI-assisted IDEs, code editors, and workflow accelerators.',
    items: [
      'GitHub',
      'GitLab',
      'Visual Studio Code',
      'Cursor',
      'Claude Code',
      'Antigravity',
      'Codex',
    ],
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'web-dev',
    number: '01',
    title: 'Full-Stack Web Development',
    summary:
      'End-to-end responsive web applications engineered for stability, performance, and clean maintainability.',
    features: [
      'Business websites & landing platforms',
      'Responsive full-stack web applications',
      'SaaS platforms & micro-services',
      'Admin dashboards & analytics panels',
      'Authentication & session systems',
      'Custom tailored web solutions',
    ],
  },
  {
    id: 'ai-dev',
    number: '02',
    title: 'AI Development',
    summary:
      'Leveraging advanced language models and agentic workflows to deliver practical automated intelligence.',
    features: [
      'Custom AI autonomous agents',
      'Interactive AI chatbots & support systems',
      'Personal AI assistants & task handlers',
      'AI API integrations (Gemini, Claude, OpenAI)',
      'AI business automation pipelines',
      'Intelligent context-aware web apps',
    ],
  },
  {
    id: 'hosting-deployment',
    number: '03',
    title: 'Hosting & Deployment',
    summary:
      'Production configuration, environment provisioning, and technical assistance to take applications live.',
    features: [
      'Custom domain & DNS configuration',
      'Cloud hosting & server setup',
      'Database configuration & migration',
      'Deployment preparation & containerization',
      'Deployment assistance & verification',
      'Complete technical handover & walkthrough',
    ],
  },
  {
    id: 'custom-solutions',
    number: '04',
    title: 'Custom Digital Solutions',
    summary:
      'Purpose-built digital utilities, automation scripts, and specialized business applications.',
    features: [
      'Ad link shortening platforms',
      'Dynamic ad link generation engines',
      'Custom web utilities & automation tools',
      'Business-specific workflow applications',
      'Custom API bridges & data processors',
      'Tailored software solutions on demand',
    ],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'project-saas',
    title: 'Modern Full-Stack SaaS Management Platform',
    category: 'Full-Stack Web Development',
    description:
      'A multi-tenant management portal featuring secure authentication, role-based access control, responsive dashboards, and database persistence.',
    techStack: ['React', 'Next.js', 'Node.js', 'Supabase', 'Tailwind CSS'],
    status: 'In Development',
    isPrivateClient: true,
    features: [
      'Interactive analytical dashboard',
      'Role-based permission gating',
      'Automated background jobs',
      'Custom reporting views',
    ],
    githubUrl: null,
    demoUrl: null,
  },
  {
    id: 'project-ai-agent',
    title: 'Multi-Modal Intelligent AI Agent & Support System',
    category: 'AI Development',
    description:
      'An autonomous customer support assistant powered by multi-LLM routing, context retrieval, and structured JSON tool-calling capabilities.',
    techStack: ['Python', 'Gemini API', 'Claude API', 'Groq API', 'Express.js'],
    status: 'In Development',
    isPrivateClient: true,
    features: [
      'Dynamic fallback model routing',
      'Contextual intent classification',
      'Real-time streaming responses',
      'Autonomous ticket classification',
    ],
    githubUrl: null,
    demoUrl: null,
  },
  {
    id: 'project-ad-link',
    title: 'Custom Ad Link Shortener & Traffic Engine',
    category: 'Custom Digital Solutions',
    description:
      'A high-performance URL shortening and redirect engine designed for campaign tracking, dynamic query parameter forwarding, and analytics.',
    techStack: ['Node.js', 'Express.js', 'Firebase', 'React'],
    status: 'In Development',
    isPrivateClient: true,
    features: [
      'Sub-millisecond link redirects',
      'UTM and campaign attribution retention',
      'Dynamic slug generator',
      'Device and browser analytics logging',
    ],
    githubUrl: null,
    demoUrl: null,
  },
  {
    id: 'project-agentic-assistant',
    title: 'Personal AI Workflow & Research Assistant',
    category: 'AI Development',
    description:
      'A personalized desktop productivity assistant orchestrating web searches, document synthesis, and automated task execution.',
    techStack: ['Python', 'OpenAI API', 'DeepSeek API', 'Cursor'],
    status: 'In Development',
    isPrivateClient: false,
    features: [
      'Automated document summarization',
      'Multi-source research compilation',
      'Scheduled notification alerts',
      'Modular tool-calling framework',
    ],
    githubUrl: null,
    demoUrl: null,
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Understanding Requirements',
    description:
      'We dive deep into your project concept, target audience, essential feature requirements, and technical expectations to establish a clear roadmap.',
    deliverable: 'Defined project scope & specification list',
  },
  {
    number: '02',
    title: 'Planning & Development',
    description:
      'Architecting the system, selecting the optimal tech stack, and writing clean, scalable code with AI-assisted acceleration and precision.',
    deliverable: 'Functional milestone builds & structured architecture',
  },
  {
    number: '03',
    title: 'Testing & Quality Assurance',
    description:
      'Rigorously validating all implemented features, resolving edge-case bugs, verifying responsive viewports, and inspecting core user flows.',
    deliverable: 'Stable, tested, and verified application code',
  },
  {
    number: '04',
    title: 'Source Code Handover',
    description:
      'Transferring complete, unencumbered ownership of the source code repository, setup guides, and environment configurations directly to you.',
    deliverable: 'Full Git repository & documentation handover',
  },
  {
    number: '05',
    title: 'Hosting & Deployment Assistance',
    description:
      'Assistance with custom domain configuration, hosting setup, server configuration, database provisioning, and preparing your application for launch.',
    deliverable: 'Deployment-ready application with hosting and launch assistance.',
  },
];

export const EDUCATION_DATA = {
  degree: 'BS Computer Science',
  description:
    'Formal computer science foundational studies covering data structures, algorithm design, software engineering methodologies, and computational theory.',
  selfTaughtStatement:
    'I continuously develop my technical knowledge through independent learning, hands-on experimentation, AI-assisted development, and building practical projects.',
  learningResources: [
    {
      name: 'Microsoft Learn',
      category: 'Cloud, Systems & Architecture',
    },
    {
      name: 'freeCodeCamp',
      category: 'Full-Stack Web Foundations & Algorithms',
    },
    {
      name: 'Coursera',
      category: 'Computer Science & Software Principles',
    },
    {
      name: 'Anthropic',
      category: 'LLM Prompt Engineering & Context Management',
    },
    {
      name: 'Google',
      category: 'Developer Documentation, Tools & AI SDKs',
    },
    {
      name: 'AI-Assisted Learning & Experimentation',
      category: 'Active hands-on coding with AI as a dev partner',
    },
  ],
};
