import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';
import static_adapter from 'sveltekit-adapter-chrome-extension';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
        adapter: static_adapter(),
        alias: {
            "@/*": "src/lib/*",
        },
        appDir: "app",
    }
};

export default config;
