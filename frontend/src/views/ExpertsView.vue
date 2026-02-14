<script setup>

</script>


<template>
    <div id="bg" class="h-[100vh]  p-5">
        <section class="relative flex min-h-[85vh] items-center justify-center overflow-hidden border-b-4 border-black bg-black">
      
      <video 
        autoplay 
        muted 
        loop 
        playsinline 
        class="absolute inset-0 z-0 h-full w-full object-cover opacity-50"
      >
        <source src="/wave.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div class="absolute inset-0 z-10 bg-gradient-from-t-to-b from-blue-950/40 to-black/60"></div>

      <div class="relative z-20 max-w-4xl px-6 text-center animate-fade-in">
        <h2 class="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-white leading-none">
          Your gold minr <span class="text-yellow-400">for understanding</span> <br/> 
          The world arround you
        </h2>
        <p class="mt-8 mx-auto max-w-2xl text-lg md:text-xl font-bold text-blue-100 italic tracking-wide">
          “our expert agents will help you learn in context ”
        </p>
      </div>
    </section>
    </div>
</template>

<style scoped>
#bg {
  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
  background-size: 24px 24px;
}

</style>