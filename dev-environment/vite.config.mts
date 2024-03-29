import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths(), nodePolyfills()],
	root: 'dev-environment',
	resolve: {
		alias: {
			// This is a temporary fix as zUI uses react-router-dom v6 and this app uses v5
			'react-router-dom': resolve('node_modules/react-router-dom'),
			'remark-emoji': resolve('node_modules/remark-emoji/index.js'),
		},
	},
	define: {
		VITE_DAO_ZNA: process.env.VITE_DAO_ZNA,
		VITE_DAO_ENS: process.env.VITE_DAO_ENS,
		VITE_DAO_NAME: process.env.VITE_DAO_NAME,
		VITE_DAO_SAFE_ADDRESS: process.env.VITE_DAO_SAFE_ADDRESS,
		VITE_DAO_VOTING_TOKEN: process.env.VITE_DAO_VOTING_TOKEN,
		VITE_DAO_CREATOR: process.env.VITE_DAO_CREATOR,
		VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
		VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
	},
});
