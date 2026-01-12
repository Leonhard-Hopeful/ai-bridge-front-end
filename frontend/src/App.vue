<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)
const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }
const closeMenu = () => { isMenuOpen.value = false }
const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans text-black bg-slate-50">
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

        <button @click="toggleMenu" class="md:hidden text-yellow-400 text-xl">
          <font-awesome-icon :icon="isMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" />
        </button>
      </div>

      <transition 
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="isMenuOpen" class="md:hidden flex flex-col pt-4 pb-2 space-y-2 uppercase font-black text-xs px-2">
          <router-link @click="closeMenu" to="/" class="text-white hover:text-yellow-400 py-2">Home</router-link>
          <router-link @click="closeMenu" to="/bridge" class="text-white hover:text-yellow-400 py-2">The Bridge</router-link>
          <router-link @click="closeMenu" to="/clerk" class="text-white hover:text-yellow-400 py-2">Digital Clerk</router-link>
        </div>
      </transition>
    </nav>

    <main class="flex-grow">
      <router-view></router-view>
    </main>

    <footer class="bg-black text-white border-t-8 border-black pt-16 pb-8 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          <div class="space-y-4">
            <div class="inline-block bg-yellow-400 text-black px-4 py-1 font-black uppercase italic text-xl border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              AI Bridge Tutor
            </div>
            <p class="text-xs font-bold leading-relaxed tracking-wide text-gray-300 max-w-sm">
              Revolutionizing education in Cameroon through Socratic AI. 
              Bridging the gap between global technology and local classroom needs.
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col space-y-2">
              <span class="text-yellow-400 font-black uppercase text-[10px] tracking-[0.2em] mb-2">Navigation</span>
              <router-link to="/" class="footer-link">Home</router-link>
              <router-link to="/bridge" class="footer-link">The Bridge</router-link>
              <router-link to="/clerk" class="footer-link">Digital Clerk</router-link>
            </div>
            <div class="flex flex-col space-y-2">
              <span class="text-yellow-400 font-black uppercase text-[10px] tracking-[0.2em] mb-2">Community</span>
              <a href="#" class="footer-link">Support</a>
              <a href="#" class="footer-link">Privacy</a>
              <a href="#" class="footer-link">Contact</a>
            </div>
          </div>

          <div class="space-y-4 md:text-right">
            <span class="text-yellow-400 font-black uppercase text-[10px] tracking-[0.2em]">Based In</span>
            <p class="font-black italic text-lg uppercase tracking-tighter">Bamenda / Douala / Yaoundé</p>
            <div class="flex md:justify-end gap-4 mt-4">
              <a href="#" class="social-icon-btn"><font-awesome-icon icon="fa-brands fa-facebook-f" /></a>
              <a href="#" class="social-icon-btn"><font-awesome-icon icon="fa-brands fa-x-twitter" /></a>
              <a href="#" class="social-icon-btn"><font-awesome-icon icon="fa-brands fa-whatsapp" /></a>
            </div>
          </div>
        </div>

        <div class="border-t-2 border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-[10px] font-black uppercase tracking-widest text-gray-500">
            © {{ currentYear }} AI Bridge Tutor • Built with 🖤 in Cameroon 🇨🇲
          </p>
          <div class="flex gap-6">
             <div class="h-2 w-2 bg-yellow-400 rounded-full animate-pulse"></div>
             <div class="h-2 w-2 bg-blue-600 rounded-full animate-pulse [animation-delay:0.2s]"></div>
             <div class="h-2 w-2 bg-red-600 rounded-full animate-pulse [animation-delay:0.4s]"></div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* In Tailwind v4, we use @reference to give the style block 
  access to tailwind variables/utilities for @apply 
*/
@reference "tailwindcss";

.nav-link {
  padding: 0.5rem 1.2rem;
  color: white;
  transition: all 0.2s ease;
  border-radius: 4px;
}

/* FLAT YELLOW ACTIVE STATE */
.active-nav {
  background-color: #facc15 !important; 
  color: #000000 !important;
  border: none !important;
  box-shadow: none !important;
  transform: none !important;
}

.nav-link:hover:not(.active-nav) {
  color: #facc15;
}

/* Footer Specific Styles */
.footer-link {
  @apply text-[11px] font-black uppercase tracking-tighter text-white hover:text-yellow-400 transition-colors;
}

.social-icon-btn {
  @apply w-10 h-10 border-2 border-white flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black hover:border-black transition-all shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px];
}

/* Scrollbar Customization */
::-webkit-scrollbar {
  width: 12px;
}
::-webkit-scrollbar-track {
  background: #000;
}
::-webkit-scrollbar-thumb {
  background: #facc15;
  border: 3px solid #000;
}
</style>