import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' 
import 'animate.css';

// 1. Import Vue Toastification
import Toast from "vue-toastification";
// Import the CSS for toasts
import "vue-toastification/dist/index.css";

// Font Awesome Imports
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBars, faXmark, faBridge, faPenNib, faHouse, faFilePdf } from '@fortawesome/free-solid-svg-icons'

// Add icons to the library
library.add(faBars, faXmark, faBridge, faPenNib, faHouse, faFilePdf)

// Toast Configuration Options (Optional)
const toastOptions = {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false
};

// Create and configure the app
const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon); // Register FontAwesome globally
app.use(router); // Use Router
app.use(Toast, toastOptions); // Use Toastification with our options

app.mount('#app');