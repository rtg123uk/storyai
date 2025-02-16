import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';

// Import router from the correct file
import router from './router/index.js';

// Create and mount the app
const app = createApp(App);
app.use(router);
app.mount('#app'); 