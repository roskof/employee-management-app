import {defineConfig} from 'vite';
import {fileURLToPath, URL} from 'node:url';
import svg from 'vite-plugin-svgo';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    svg({
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              convertColors: {
                currentColor: true,
              },
            },
          },
        },
      ],
    }),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: [
        'regenerator-runtime/runtime',
        'core-js/modules/es.promise',
        'core-js/modules/es.array.iterator',
      ],
    }),
  ],

  build: {
    target: ['es2015', 'chrome58', 'firefox57', 'safari11', 'edge16', 'ie11'],
    rollupOptions: {
      input: {
        main: 'index.html',
      },
      output: {
        entryFileNames: 'bundle.[hash].js',
        assetFileNames: '[name][extname]',
      },
      external: /^lit/,
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
