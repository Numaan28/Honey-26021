import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          seller_dashboard: path.resolve(__dirname, 'seller/dashboard.html'),
          seller_hives: path.resolve(__dirname, 'seller/hives.html'),
          seller_ai: path.resolve(__dirname, 'seller/ai-analysis.html'),
          seller_batches: path.resolve(__dirname, 'seller/batches.html'),
          seller_batch_details: path.resolve(__dirname, 'seller/batch-details.html'),
          seller_quality: path.resolve(__dirname, 'seller/quality.html'),
          seller_traceability: path.resolve(__dirname, 'seller/traceability.html'),
          seller_qr: path.resolve(__dirname, 'seller/qr-generator.html'),
          seller_analytics: path.resolve(__dirname, 'seller/analytics.html'),
          buyer_verify: path.resolve(__dirname, 'buyer/verify.html'),
          buyer_result: path.resolve(__dirname, 'buyer/result.html'),
          buyer_journey: path.resolve(__dirname, 'buyer/journey.html'),
          buyer_quality: path.resolve(__dirname, 'buyer/quality.html'),
          buyer_history: path.resolve(__dirname, 'buyer/history.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
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
