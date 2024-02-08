export type Project = {
  name: string;
  desc: string;
  link: string;
};

export const products: Project[] = [
  {
    name: 'Asteroid Protocol SDK',
    desc: 'Use Asteroid Protocol SDK to create inscription transactions',
    link: 'https://www.npmjs.com/package/@asteroid-protocol/sdk',
  },
  {
    name: 'CosmosKit',
    desc: 'A wallet adapter for react with mobile WalletConnect support for the Cosmos ecosystem.',
    link: 'https://github.com/cosmology-tech/cosmos-kit',
  },
  {
    name: 'Chain Registry',
    desc: 'Get chain and asset list information from the npm package for the Official Cosmos chain registry.',
    link: 'https://github.com/cosmology-tech/chain-registry',
  },
  {
    name: 'Videos',
    desc: 'How-to videos from the official Cosmology website, with learning resources for building in Cosmos.',
    link: 'https://cosmology.zone/learn',
  },
];

export const dependencies: Project[] = [
  {
    name: 'Asteroid Protocol SDK',
    desc: 'Use Asteroid Protocol SDK to create inscription transactions',
    link: 'https://www.npmjs.com/package/@asteroid-protocol/sdk',
  },
  {
    name: 'Interchain UI',
    desc: 'A simple, modular and cross-framework Component Library for Cosmos',
    link: 'https://cosmology.zone/explore',
  },
  {
    name: 'Next.js',
    desc: 'A React Framework supports hybrid static & server rendering.',
    link: 'https://nextjs.org/',
  },
];
