export type Venture = {
  id: string;
  name: string;
  logoUrl: string;       // /logos/*.svg or .png
  href?: string;         // external
  internalPath?: string; // internal under /ease
};

export const ventures: Venture[] = [
  { id: 'talaash', name: 'Talaash By Jaayvee', logoUrl: '/static/png with tagline white/talaash-03.png', internalPath: '/ease/talaash' },
  { id: 'atrractive', name: 'Attractive By Jaayvee', logoUrl: '/static/png with tagline white/clothing-03.png', href: 'https://attractive.thejaayveeworld.com' },
  { id: 'tours and travels', name: 'Travel and Tour Operators', logoUrl: '/static/png with tagline white/travel and tours-03.png', href: 'https://travel.thejaayveeworld.com' },
  { id: 'clothing', name: 'Jaayvee Clothing', logoUrl: '/static/png with tagline white/clothing-03.png', href: 'https://clothing.thejaayveeworld.com' },
  { id: 'realestate', name: 'Jaayvee Real Estate', logoUrl: '/static/png with tagline white/real estate-03.png', href: 'https://realestate.thejaayveeworld.com' },
  { id: 'events', name: 'Jaayvee Event Planners', logoUrl: '/static/png with tagline white/event planner-03.png', href: 'https://events.thejaayveeworld.com' },

];
