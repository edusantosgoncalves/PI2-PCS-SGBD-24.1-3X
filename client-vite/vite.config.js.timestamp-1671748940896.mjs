// vite.config.js
import { defineConfig } from "./node_modules/vite/dist/node/index.js";
import react from "./node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 3113,
  },
});
export { vite_config_default as default };
