// ==========================================
// CONSTANTS & CONFIGURATION
// ==========================================

export const PROJECT_CATEGORIES = [
  'DeFi',
  'NFT',
  'DAO',
  'Gaming',
  'AI',
  'Social',
  'Infrastructure',
  'Other',
] as const;

export const TECH_STACK_OPTIONS = [
  'Solana',
  'Ethereum',
  'Bitcoin',
  'Rust',
  'Solidity',
  'TypeScript',
  'JavaScript',
  'React',
  'Next.js',
  'Node.js',
  'Python',
  'Go',
  'Move',
  'Anchor',
  'Hardhat',
  'Foundry',
  'IPFS',
  'The Graph',
  'Firebase',
  'Supabase',
  'MongoDB',
  'PostgreSQL',
  'TailwindCSS',
  'Web3.js',
  'Ethers.js',
  'Viem',
  'Wagmi',
] as const;

export const PROJECT_STATUS_CONFIG = {
  idea: { label: '💡 Idea', color: '#FFD700', progress: 25 },
  building: { label: '🔨 Building', color: '#FF8C00', progress: 50 },
  live: { label: '🚀 Live', color: '#00C8FF', progress: 75 },
  launched: { label: '🏆 Launched', color: '#00FF88', progress: 100 },
} as const;

export const TEAM_SIZE_CONFIG = {
  solo: { label: 'Solo 🧑', icon: '🧑' },
  duo: { label: 'Duo 👥', icon: '👥' },
  team: { label: 'Team 👥👥', icon: '👥👥' },
} as const;

export const CATEGORY_COLORS: Record<string, string> = {
  DeFi: '#00D4AA',
  NFT: '#FF6B6B',
  DAO: '#845EF7',
  Gaming: '#FF922B',
  AI: '#20C997',
  Social: '#339AF0',
  Infrastructure: '#868E96',
  Other: '#CED4DA',
};

// Language colors (matching GitHub)
export const LANGUAGE_COLORS: Record<string, string> = {
  Rust: '#DEA584',
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#3776AB',
  Solidity: '#AA6746',
  Go: '#00ADD8',
  Move: '#4B32C3',
  HTML: '#E34F26',
  CSS: '#1572B6',
  Shell: '#89E051',
  Dockerfile: '#384D54',
  C: '#555555',
  'C++': '#F34B7D',
  Java: '#B07219',
  Ruby: '#701516',
  Swift: '#FA7343',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
};

// Badge definitions
export const BADGES = {
  first_timer: {
    id: 'first_timer',
    name: 'First Timer',
    icon: '🔰',
    description: 'Participated for the first time',
    requirement: 'Submit your first project',
  },
  streak_builder: {
    id: 'streak_builder',
    name: 'Streak Builder',
    icon: '🔥',
    description: 'Participated 3 weeks in a row',
    requirement: 'Participate 3 consecutive weeks',
  },
  champion: {
    id: 'champion',
    name: 'Champion',
    icon: '🏆',
    description: 'Won a Builder\'s Hub week',
    requirement: 'Win a Builder\'s Hub vote',
  },
  shark_survivor: {
    id: 'shark_survivor',
    name: 'Shark Survivor',
    icon: '🦈',
    description: 'Participated in Shark Tank',
    requirement: 'Submit a project to Shark Tank',
  },
  shark_king: {
    id: 'shark_king',
    name: 'Shark King',
    icon: '👑',
    description: 'Won a Shark Tank round',
    requirement: 'Win a Shark Tank vote',
  },
  fan_favorite: {
    id: 'fan_favorite',
    name: 'Fan Favorite',
    icon: '❤️',
    description: 'Received 50+ votes on a single project',
    requirement: 'Get 50 votes on one project',
  },
  veteran: {
    id: 'veteran',
    name: 'Veteran',
    icon: '🏗️',
    description: 'Participated 5+ times',
    requirement: 'Submit 5 projects total',
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond Builder',
    icon: '💎',
    description: 'Won both Builder\'s Hub and Shark Tank',
    requirement: 'Win in both events',
  },
  code_is_law: {
    id: 'code_is_law',
    name: 'Code is Law',
    icon: '💻',
    description: 'Has GitHub profile linked',
    requirement: 'Link your GitHub profile',
  },
  star_collector: {
    id: 'star_collector',
    name: 'Star Collector',
    icon: '⭐',
    description: '100+ total GitHub stars',
    requirement: 'Earn 100 stars on GitHub',
  },
  open_source_king: {
    id: 'open_source_king',
    name: 'Open Source King',
    icon: '🌟',
    description: '500+ total GitHub stars',
    requirement: 'Earn 500 stars on GitHub',
  },
  community_builder: {
    id: 'community_builder',
    name: 'Community Builder',
    icon: '👥',
    description: '100+ GitHub followers',
    requirement: 'Get 100 GitHub followers',
  },
  polyglot: {
    id: 'polyglot',
    name: 'Polyglot Dev',
    icon: '🧠',
    description: 'Uses 3+ programming languages',
    requirement: 'Code in 3+ languages',
  },
} as const;

export const ALL_BADGE_IDS = Object.keys(BADGES);