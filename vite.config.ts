import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          instructors: path.resolve(__dirname, 'instructors.html'),
          programs: path.resolve(__dirname, 'programs.html'),
          experience: path.resolve(__dirname, 'experience.html'),
          students: path.resolve(__dirname, 'students.html'),
          stories: path.resolve(__dirname, 'stories.html'),
          gallery: path.resolve(__dirname, 'gallery.html'),
          music: path.resolve(__dirname, 'music-library.html'),
          blogs: path.resolve(__dirname, 'blogs.html'),
          faq: path.resolve(__dirname, 'faq.html'),
          consultation: path.resolve(__dirname, 'consultation.html'),
          privacy: path.resolve(__dirname, 'privacy.html'),
          terms: path.resolve(__dirname, 'terms.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
