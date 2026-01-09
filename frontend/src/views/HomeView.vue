<script setup>
import { onMounted, ref } from 'vue'

const showFeatures = ref(false)

onMounted(() => {
  // Trigger feature card animations on load
  setTimeout(() => {
    showFeatures.value = true
  }, 300)
})
</script>

<template>
  <div class="relative bg-[url('/gridr.png')] overflow-x-hidden scroll-smooth bg-fixed">
    
    <section class="relative flex min-h-[85vh] items-center justify-center overflow-hidden border-b-4 border-black bg-black">
      
      <video 
        autoplay 
        muted 
        loop 
        playsinline 
        class="absolute inset-0 z-0 h-full w-full object-cover opacity-50"
      >
        <source src="/horseman.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div class="absolute inset-0 z-10 bg-gradient-to-b from-blue-950/40 to-black/60"></div>

      <div class="relative z-20 max-w-4xl px-6 text-center animate-fade-in">
        <h2 class="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-white leading-none">
          Empowering <span class="text-yellow-400">the community</span> <br/> 
          Through AI
        </h2>
        <p class="mt-8 mx-auto max-w-2xl text-lg md:text-xl font-bold text-blue-100 italic tracking-wide">
          “Bridging the gap between global knowledge and local solutions.”
        </p>

        <div class="mt-12 flex flex-wrap justify-center gap-6">
          <router-link
            to="/bridge"
            class="bg-yellow-400 px-8 py-4 text-sm font-black uppercase text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:shadow-none transition-all"
          >
            Explore AI Bridge
          </router-link>
          <router-link
            to="/clerk"
            class="bg-white px-8 py-4 text-sm font-black uppercase text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(250,204,21,1)] hover:translate-y-1 hover:shadow-none transition-all"
          >
            Digital Clerk
          </router-link>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-24">
      <div class="grid gap-12 md:grid-cols-2">
        <div
          class="group relative rounded-none border-4 border-black bg-white p-10 shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
        >
          <div class="absolute -top-5 -left-5 bg-blue-600 px-4 py-1 text-xs font-black uppercase text-white border-2 border-black">New Feature</div>
          <h3 class="text-2xl font-black uppercase text-neutral-900 tracking-tight">AI Bridge</h3>
          <p class="mt-4 font-bold text-neutral-600 leading-relaxed italic">
            Struggling with complex subjects like Calculus or Physics? 
            We transform academic theories into community-relevant explanations 
            using analogies from the Northwest Region.
          </p>
          <router-link
            to="/bridge"
            class="mt-8 inline-flex items-center gap-2 text-sm font-black uppercase text-blue-700 underline decoration-4 underline-offset-4 transition hover:text-black"
          >
            Start Learning →
          </router-link>
        </div>

        <div
          class="group relative rounded-none border-4 border-black bg-white p-10 shadow-[8px_8px_0px_0px_rgba(250,204,21,1)] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
        >
          <h3 class="text-2xl font-black uppercase text-neutral-900 tracking-tight">Digital Clerk</h3>
          <p class="mt-4 font-bold text-neutral-600 leading-relaxed italic">
            Take a photo of your handwritten notes and let our AI convert them 
            into clean digital text. Ideal for archiving student records and 
            local community histories.
          </p>
          <router-link
            to="/clerk"
            class="mt-8 inline-flex items-center gap-2 text-sm font-black uppercase text-yellow-600 underline decoration-4 underline-offset-4 transition hover:text-black"
          >
            Digitize Notes →
          </router-link>
        </div>
      </div>
    </section>

    <section class="relative border-y-4 border-black overflow-hidden bg-black py-24 text-white">
      <div class="absolute inset-0 z-0 bg-[url('/netgrid.png')] bg-cover bg-center opacity-30 parallax"></div>

      <div class="relative z-10 mx-auto max-w-4xl px-6 text-center animate-slide-up">
        <h4 class="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-yellow-400">
          Our Mission
        </h4>
        <p class="mt-8 text-xl font-bold leading-relaxed text-blue-100 max-w-3xl mx-auto">
          To provide accessible, high-tech tools that respect local traditions 
          while enabling self-sustaining innovation across the Northwest Region.
        </p>
        <div class="mt-10 h-1 w-24 bg-white mx-auto"></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Parallax effect */
.parallax {
  background-attachment: fixed;
  will-change: transform;
}

/* Animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.animate-slide-up {
  animation: slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Ensure video covers background completely */
video {
  filter: grayscale(20%) contrast(110%);
}
</style>