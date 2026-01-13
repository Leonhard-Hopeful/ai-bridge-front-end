import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router' 
import 'animate.css';

// 1. Import Vue Toastification
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// 2. Font Awesome Imports
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* Import Solid Icons */
import { 
  faBars, 
  faXmark, 
  faBridge, 
  faPenNib, 
  faHouse, 
  faFilePdf,
  faCircle // Added this as it is used in your footer status indicators
} from '@fortawesome/free-solid-svg-icons'

/* Import Brand Icons (Used in your Footer) */
import { 
  faFacebookF, 
  faXTwitter, 
  faWhatsapp 
} from '@fortawesome/free-brands-svg-icons'

// 3. Add icons to the library
library.add(
  faBars, 
  faXmark, 
  faBridge, 
  faPenNib, 
  faHouse, 
  faFilePdf, 
  faCircle,
  faFacebookF, 
  faXTwitter, 
  faWhatsapp
)

// Toast Configuration Options
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

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon); 
app.use(router); 
app.use(Toast, toastOptions); 

app.mount('#app');