/**
 * profile.js
 * ---------------------------------------------------------------------------
 * EDIT THIS FILE to make the portfolio yours. Every piece of personal content
 * in the OS (Finder, Notes, Terminal, Safari, Mail, Music, Photos, …) reads
 * from here, so this is the single source of truth.
 * ---------------------------------------------------------------------------
 */

export const profile = {
  // ----- Identity -------------------------------------------------------
  name: 'Your Name',
  firstName: 'Your',
  lastName: 'Name',
  initials: 'YN',
  role: 'Full-Stack Developer',
  company: 'Freelance',
  location: 'Kolkata, India',
  // A short one-liner used on the lock screen, About This Mac, etc.
  tagline: 'I build delightful products for the web.',
  avatar:
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#5ac8fa"/>
            <stop offset="0.5" stop-color="#007aff"/>
            <stop offset="1" stop-color="#af52de"/>
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(#g)"/>
        <text x="100" y="128" font-family="Inter,Arial" font-size="80" font-weight="700"
              fill="#fff" text-anchor="middle">YN</text>
      </svg>`,
    ),

  // ----- About ----------------------------------------------------------
  about: [
    'Hi, I\'m Your Name — a full-stack developer who loves turning complex problems into simple, beautiful interfaces.',
    'I specialise in React, TypeScript and Node.js, and I care deeply about accessibility, performance and the small details that make software feel alive.',
    'When I\'m not shipping code you\'ll find me sketching UI ideas, playing music, or exploring somewhere new.',
  ],

  // ----- Contact --------------------------------------------------------
  email: 'you@example.com',
  phone: '+1 (555) 000-0000',
  socials: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    twitter: 'https://x.com/yourusername',
  },
  // Path to your resume. Drop a PDF in /public and point here.
  resumeUrl: '/resume.pdf',
  resumeFileName: 'Resume.pdf',

  // ----- Skills (shown in Notes, App Store, Terminal, Settings) ---------
  skills: {
    Languages: ['TypeScript', 'JavaScript', 'HTML', 'CSS', 'Python', 'SQL'],
    Frontend: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    Backend: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'REST', 'GraphQL'],
    Tools: ['Git', 'Docker', 'Vercel', 'Figma', 'Jest', 'Playwright'],
  },

  // ----- Experience -----------------------------------------------------
  experience: [
    {
      role: 'Senior Full-Stack Developer',
      company: 'Acme Corp',
      period: '2022 — Present',
      location: 'Kolkata, India',
      points: [
        'Led a team of 4 engineers rebuilding the core dashboard in React + TypeScript.',
        'Cut page load time by 63% through code-splitting and edge caching.',
        'Introduced a design-system package adopted by 6 product teams.',
      ],
    },
    {
      role: 'Full-Stack Developer',
      company: 'Startup Inc',
      period: '2020 — 2022',
      location: 'Remote',
      points: [
        'Built and shipped the payments API processing $2M+/month.',
        'Migrated a legacy jQuery app to Next.js with zero downtime.',
      ],
    },
    {
      role: 'Frontend Developer',
      company: 'Studio Web',
      period: '2018 — 2020',
      location: 'Austin, TX',
      points: [
        'Delivered 20+ marketing sites and web apps for clients.',
        'Won an internal award for accessibility excellence.',
      ],
    },
  ],

  // ----- Education ------------------------------------------------------
  education: [
    {
      degree: 'B.Sc. Computer Science',
      school: 'University of Somewhere',
      period: '2014 — 2018',
      detail: 'Graduated with honours. Focus on human–computer interaction.',
    },
  ],

  // ----- Projects (Finder → Projects, Safari favourites, App Store) -----
  projects: [
    {
      id: 'aurora',
      title: 'Aurora Dashboard',
      description:
        'A real-time analytics dashboard with live charts, dark mode and offline support.',
      tech: ['React', 'TypeScript', 'WebSockets', 'D3'],
      link: 'https://example.com',
      repo: 'https://github.com/yourusername/aurora',
      year: '2024',
    },
    {
      id: 'pulse',
      title: 'Pulse Chat',
      description:
        'End-to-end encrypted messaging app with typing indicators and read receipts.',
      tech: ['Next.js', 'Node.js', 'Socket.io', 'PostgreSQL'],
      link: 'https://example.com',
      repo: 'https://github.com/yourusername/pulse',
      year: '2023',
    },
    {
      id: 'orbit',
      title: 'Orbit Commerce',
      description: 'A headless e-commerce storefront with a lightning-fast checkout.',
      tech: ['React', 'Stripe', 'GraphQL', 'Vercel'],
      link: 'https://example.com',
      repo: 'https://github.com/yourusername/orbit',
      year: '2023',
    },
    {
      id: 'lumen',
      title: 'Lumen Notes',
      description: 'A keyboard-first markdown notes app that syncs across devices.',
      tech: ['React', 'IndexedDB', 'CRDT'],
      link: 'https://example.com',
      repo: 'https://github.com/yourusername/lumen',
      year: '2022',
    },
    {
      id: 'vera',
      title: 'Vera Health',
      description: 'A HIPAA-friendly patient portal with an accessible design system.',
      tech: ['React', 'Node.js', 'PostgreSQL'],
      link: 'https://example.com',
      repo: 'https://github.com/yourusername/vera',
      year: '2022',
    },
    {
      id: 'nimbus',
      title: 'Nimbus Weather',
      description: 'A minimalist weather app with beautiful animated forecasts.',
      tech: ['React', 'Weather API', 'Framer Motion'],
      link: 'https://example.com',
      repo: 'https://github.com/yourusername/nimbus',
      year: '2021',
    },
  ],

  // ----- Notes (Finder → Notes app sidebar) ----------------------------
  notes: [
    {
      id: 'about',
      title: 'About Me',
      body:
        'Hi, I\'m Your Name — a full-stack developer who loves turning complex problems into simple, beautiful interfaces.\n\nI specialise in React, TypeScript and Node.js.',
    },
    {
      id: 'skills',
      title: 'Skills',
      body:
        'Languages: TypeScript, JavaScript, Python, SQL\nFrontend: React, Next.js, Tailwind\nBackend: Node.js, Express, PostgreSQL\nTools: Git, Docker, Figma',
    },
    {
      id: 'experience',
      title: 'Experience',
      body:
        'Senior Full-Stack Developer @ Acme Corp (2022 — Present)\nFull-Stack Developer @ Startup Inc (2020 — 2022)\nFrontend Developer @ Studio Web (2018 — 2020)',
    },
    {
      id: 'education',
      title: 'Education',
      body:
        'B.Sc. Computer Science\nUniversity of Somewhere (2014 — 2018)\nGraduated with honours.',
    },
  ],

  // ----- Music (public/audio paths; swap for your own tracks) ----------
  tracks: [
    { id: 1, title: 'Ambient Waves', artist: 'Free Music Archive', src: '', duration: 214, color: '#5ac8fa' },
    { id: 2, title: 'Lo-Fi Sunrise', artist: 'Free Music Archive', src: '', duration: 187, color: '#ff9500' },
    { id: 3, title: 'Neon Drive', artist: 'Free Music Archive', src: '', duration: 242, color: '#af52de' },
    { id: 4, title: 'Rainy Window', artist: 'Free Music Archive', src: '', duration: 165, color: '#34c759' },
    { id: 5, title: 'Midnight City', artist: 'Free Music Archive', src: '', duration: 231, color: '#ff2d55' },
    { id: 6, title: 'Golden Hour', artist: 'Free Music Archive', src: '', duration: 199, color: '#ffcc00' },
  ],

  // ----- System (About This Mac) ---------------------------------------
  system: {
    model: 'MacBook Pro',
    chip: 'Apple M3 Pro',
    memory: '18 GB',
    serial: 'C02XX000XXXX',
    osVersion: 'macOS Tahoe 26',
  },
}

export default profile
