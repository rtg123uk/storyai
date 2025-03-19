import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';

// Import router from the correct file
import router from './router/index.js';
import AuthModal from './components/ui/AuthModal.vue';

// Create and mount the app
const app = createApp(App);

// Register AuthModal globally
app.component('AuthModal', AuthModal);

app.use(router);
app.mount('#app'); 