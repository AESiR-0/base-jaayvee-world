export type Venture = {
  id: string;
  name: string;
  logoUrl: string;       // /logos/*.svg or .png
  href?: string;         // external
  internalPath?: string; // internal under /ease
  comingSoon?: boolean;  // if true, show "Coming Soon" and disable link
};

export const ventures: Venture[] = [
  { id: 'talaash', name: 'Talaash By Jaayvee', logoUrl: '/static/png with tagline white/talaash-03.png', internalPath: '/ease/talaash', comingSoon: false },
  { id: 'atrractive', name: 'Attractive By Jaayvee', logoUrl: '/static/png with tagline white/clothing-03.png', href: 'https://attractive.thejaayveeworld.com', comingSoon: true },
  { id: 'tours and travels', name: 'Travel and Tour Operators', logoUrl: '/static/png with tagline white/travel and tours-03.png', href: 'https://travel.thejaayveeworld.com', comingSoon: true },
  { id: 'clothing', name: 'Jaayvee Clothing', logoUrl: '/static/png with tagline white/clothing-03.png', href: 'https://clothing.thejaayveeworld.com', comingSoon: true },
  { id: 'realestate', name: 'Jaayvee Real Estate', logoUrl: '/static/png with tagline white/real estate-03.png', href: 'https://realestate.thejaayveeworld.com', comingSoon: true },
  { id: 'events', name: 'Jaayvee Event Planners', logoUrl: '/static/png with tagline white/event planner-03.png', href: 'https://events.thejaayveeworld.com', comingSoon: true },

];
