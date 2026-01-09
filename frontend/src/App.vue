<!-- <script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)
const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }
const closeMenu = () => { isMenuOpen.value = false }

// Current Year for Footer
const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-black flex flex-col">
    
    <nav class="bg-black p-5 sticky top-0 z-[100] border-b-4 border-black w-full">
      <div class="max-w-6xl mx-auto flex justify-between items-center text-white">
        
        <router-link to="/" class="text-2xl font-black tracking-tighter uppercase flex items-center gap-2 hover:text-yellow-400 transition-colors">
          <font-awesome-icon icon="fa-solid fa-bridge" class="text-yellow-400" />
          <span>AI Bridge</span>
        </router-link>

        <div class="hidden md:flex space-x-4 font-black text-[10px] uppercase items-center">
          <router-link to="/" class="nav-link" active-class="active-nav">
            <font-awesome-icon icon="fa-solid fa-house" class="mr-1" /> Home
          </router-link>
          <router-link to="/bridge" class="nav-link" active-class="active-nav">
            <font-awesome-icon icon="fa-solid fa-bridge" class="mr-1" /> The Bridge
          </router-link>
          <router-link to="/clerk" class="nav-link" active-class="active-nav">
            <font-awesome-icon icon="fa-solid fa-pen-nib" class="mr-1" /> Digital Clerk
          </router-link>
        </div>

        <button @click="toggleMenu" class="md:hidden text-2xl focus:outline-none text-yellow-400">
          <font-awesome-icon :icon="isMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" />
        </button>
      </div>

      <transition 
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-4 opacity-0"
      >
        <div v-if="isMenuOpen" class="md:hidden bg-black border-t-2 border-yellow-400 mt-4 pb-4 flex flex-col font-black uppercase text-white">
          <router-link @click="closeMenu" to="/" class="px-4 py-4 hover:bg-yellow-400 hover:text-black transition-colors">Home</router-link>
          <router-link @click="closeMenu" to="/bridge" class="px-4 py-4 hover:bg-yellow-400 hover:text-black transition-colors">The Bridge</router-link>
          <router-link @click="closeMenu" to="/clerk" class="px-4 py-4 hover:bg-yellow-400 hover:text-black transition-colors">Digital Clerk</router-link>
        </div>
      </transition>
    </nav>

    <main class="flex-grow">
      <router-view></router-view>
    </main>

    <footer class="bg-black text-white border-t-4 border-black py-12 px-6">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div class="text-center md:text-left">
          <h3 class="text-2xl font-black uppercase italic tracking-widest text-yellow-400 leading-none">AI Bridge Tutor</h3>
          <p class="text-[10px] font-bold uppercase mt-2 opacity-60 tracking-wider text-white">Bridging the Gap for Cameroon Learners 🇨🇲</p>
        </div>
        
        <div class="flex gap-8 text-[11px] font-black uppercase italic tracking-widest">
          <a href="#" class="hover:text-yellow-400 transition-colors">About</a>
          <a href="#" class="hover:text-yellow-400 transition-colors">Support</a>
          <a href="#" class="hover:text-yellow-400 transition-colors">Contact</a>
        </div>

        <div class="text-[10px] font-black uppercase tracking-tighter opacity-80">
          © {{ currentYear }} • Built for the future of education
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* Neobrutalist Nav Links */
.nav-link {
  padding: 0.6rem 1.2rem;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 2px solid transparent;
  color: white;
  display: flex;
  align-items: center;
}

/* HIGH CONTRAST YELLOW ACTIVE STATE */
.active-nav {
  background-color: #facc15; /* Tailwind yellow-400 */
  color: #000000 !important;
  border: 2px solid #000000;
  box-shadow: 4px 4px 0px 0px rgba(255, 255, 255, 1); /* White shadow for pop on black nav */
  transform: translate(-2px, -2px);
}

.nav-link:hover:not(.active-nav) {
  color: #facc15;
}

/* Global Reset */
body {
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Smooth Scrolling */
html {
  scroll-behavior: smooth;
}
</style> -->
<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)
const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }
const closeMenu = () => { isMenuOpen.value = false }
const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans text-black">
    <nav class="bg-black p-5 sticky top-0 z-[100] border-b-4 border-black">
      <div class="max-w-6xl mx-auto flex justify-between items-center text-white">
        <router-link to="/" class="text-2xl font-black uppercase flex items-center gap-2">
          <font-awesome-icon icon="fa-solid fa-bridge" class="text-yellow-400" />
          <span>AI Bridge</span>
        </router-link>

        <div class="hidden md:flex space-x-2 font-black text-[11px] uppercase items-center">
          <router-link to="/" class="nav-link" active-class="active-nav">Home</router-link>
          <router-link to="/bridge" class="nav-link" active-class="active-nav">The Bridge</router-link>
          <router-link to="/clerk" class="nav-link" active-class="active-nav">Digital Clerk</router-link>
        </div>

        <button @click="toggleMenu" class="md:hidden text-yellow-400">
          <font-awesome-icon :icon="isMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" />
        </button>
      </div>
    </nav>

    <main class="flex-grow">
      <router-view></router-view>
    </main>

    <footer class="bg-black text-white border-t-4 border-black py-8 px-6 text-center">
      <p class="text-[10px] font-black uppercase tracking-widest">
        © {{ currentYear }} AI Bridge Tutor • Cameroon 🇨🇲
      </p>
    </footer>
  </div>
</template>

<style>
.nav-link {
  padding: 0.5rem 1.2rem;
  color: white;
  transition: all 0.2s ease;
  border-radius: 4px; /* Optional: slight rounding for the flat look */
}

/* FLAT YELLOW ACTIVE STATE */
.active-nav {
  background-color: #facc15 !important; /* Flat Yellow */
  color: #000000 !important;
  border: none !important;
  box-shadow: none !important;
  transform: none !important;
}

.nav-link:hover:not(.active-nav) {
  color: #facc15;
}
</style>