export type Venture = {
  id: string;
  name: string;
  logoUrl: string;       // /logos/*.svg or .png
  href?: string;         // external
  internalPath?: string; // internal under /ease
};

export const ventures: Venture[] = [
  { id: 'talaash', name: 'Talaash', logoUrl: '/static/png with tagline white/talaash logo with tagline-03.png', internalPath: '/ease/talaash' },
  { id: 'tours and travels', name: 'Tours and Travels', logoUrl: '/static/png with tagline white/travel and tours-03.png', href: 'https://toursandtravels.thejaayveeworld.com' },
  { id: 'clothing', name: 'Clothing', logoUrl: '/static/png with tagline white/clothing-03.png', href: 'https://clothing.thejaayveeworld.com' },
  { id: 'realestate', name: 'Real Estate', logoUrl: '/static/png with tagline white/real estate-03.png', href: 'https://realestate.thejaayveeworld.com' },
  { id: 'events', name: 'Events', logoUrl: '/static/png with tagline white/event planner-03.png', href: 'https://events.thejaayveeworld.com' },
];
