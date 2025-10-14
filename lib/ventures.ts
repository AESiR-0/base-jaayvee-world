export type Venture = {
  id: string;
  name: string;
  logoUrl: string;       // /logos/*.svg or .png
  href?: string;         // external
  internalPath?: string; // internal under /ease
};

export const ventures: Venture[] = [
  { id: 'talaash', name: 'Talaash', logoUrl: '/static/logo(icon) white/talaash icon-03.png', internalPath: '/ease/talaash' },
  { id: 'clothing', name: 'Clothing', logoUrl: '/static/logo(icon) white/jaayvee icon-03.png', href: 'https://clothing.thejaayveeworld.com' },
  { id: 'realestate', name: 'Real Estate', logoUrl: '/static/logo(icon) white/jaayvee icon-03.png', href: 'https://realestate.thejaayveeworld.com' },
  { id: 'events', name: 'Events', logoUrl: '/static/logo(icon) white/jaayvee icon-03.png', href: 'https://events.thejaayveeworld.com' }
];
