<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)
const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }
const closeMenu = () => { isMenuOpen.value = false }
</script>

<template>
  <div class="min-h-screen bg-cream-white font-sans text-black">
    <nav class="bg-dark-blue p-5 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto flex justify-between items-center text-cream-white">
        <router-link to="/" class="text-2xl font-black tracking-tighter uppercase flex items-center gap-2">
          <font-awesome-icon icon="fa-solid fa-bridge" class="text-cream-white" />
          <span>AI Bridge</span>
        </router-link>

        <div class="hidden md:flex space-x-8 font-bold text-sm uppercase items-center">
          <router-link to="/" class="hover:text-cream-white/70 transition" active-class="border-b-2 border-cream-white">
            <font-awesome-icon icon="fa-solid fa-house" class="mr-1" /> Home
          </router-link>
          <router-link to="/bridge" class="hover:text-cream-white/70 transition" active-class="border-b-2 border-cream-white">
            <font-awesome-icon icon="fa-solid fa-bridge" class="mr-1" /> The Bridge
          </router-link>
          <router-link to="/clerk" class="hover:text-cream-white/70 transition" active-class="border-b-2 border-cream-white">
            <font-awesome-icon icon="fa-solid fa-pen-nib" class="mr-1" /> Digital Clerk
          </router-link>
        </div>

        <button @click="toggleMenu" class="md:hidden text-2xl focus:outline-none">
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
        <div v-if="isMenuOpen" class="md:hidden bg-dark-blue border-t border-black/20 mt-4 pb-4 space-y-4 flex flex-col font-bold uppercase text-cream-white">
          <router-link @click="closeMenu" to="/" class="px-2 py-2 border-b border-black/10">Home</router-link>
          <router-link @click="closeMenu" to="/bridge" class="px-2 py-2 border-b border-black/10">The Bridge</router-link>
          <router-link @click="closeMenu" to="/clerk" class="px-2 py-2 border-b border-black/10">Digital Clerk</router-link>
        </div>
      </transition>
    </nav>

    <main class="px-6 py-8">
      <router-view></router-view>
    </main>
  </div>
</template>