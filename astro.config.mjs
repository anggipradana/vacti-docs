// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.vacti.org',
	integrations: [
		starlight({
			title: 'Vacti Docs',
			logo: {
				src: './src/assets/logo.svg',
				replacesTitle: true,
			},
			description:
				'Self-hosted AI pentest + VA + CTI platform. Guides for end-users, admins, OS appliance, Docker, and ISO.',
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/anggipradana/vacti-docs',
				},
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'What is Vacti', slug: 'start/01-what-is-vacti' },
						{ label: 'Choose your install', slug: 'start/02-choose-install' },
					],
				},
				{
					label: 'End-User Web Guide',
					items: [{ autogenerate: { directory: 'user' } }],
				},
				{
					label: 'Core Products',
					items: [{ autogenerate: { directory: 'products' } }],
				},
				{
					label: 'Admin + Minting Licenses',
					items: [{ autogenerate: { directory: 'admin' } }],
				},
				{
					label: 'Install: Vacti OS Appliance',
					items: [{ autogenerate: { directory: 'install-appliance' } }],
				},
				{
					label: 'Install: Docker',
					items: [{ autogenerate: { directory: 'install-docker' } }],
				},
				{
					label: 'Install: ISO',
					items: [{ autogenerate: { directory: 'install-iso' } }],
				},
				{
					label: 'Architecture + Troubleshooting',
					items: [{ autogenerate: { directory: 'architecture' } }],
				},
			],
		}),
	],
});
