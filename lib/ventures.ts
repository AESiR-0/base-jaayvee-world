export type Venture = {
  id: string;
  name: string;
  logoUrl: string;       // /logos/*.svg or .png
  href?: string;         // external
  internalPath?: string; // internal under /ease
};

export const ventures: Venture[] = [
  { id: 'talaash', name: 'Talaash', logoUrl: '/logos/talaash.svg', internalPath: '/ease/talaash' },
  { id: 'clothing', name: 'Clothing', logoUrl: '/logos/clothing.svg', href: 'https://clothing.thejaayveeworld.com' },
  { id: 'realestate', name: 'Real Estate', logoUrl: '/logos/realestate.svg', href: 'https://realestate.thejaayveeworld.com' },
  { id: 'events', name: 'Events', logoUrl: '/logos/events.svg', href: 'https://events.thejaayveeworld.com' }
];
