<template>
  <div class="relative bg-[url('/gridd.png')] overflow-x-hidden scroll-smooth">
    <!-- Hero / Parallax Section -->
    <section
      class="relative flex min-h-[85vh] items-center justify-center text-white"
    >
      <!-- Background Image -->
      <div
        class="absolute inset-0 bg-[url('/net2.png')] bg-cover bg-center bg-no-repeat parallax"
      ></div>

      <!-- Dark Blue Overlay -->
      <div class="absolute inset-0 bg-blue-950/80"></div>

      <!-- Hero Content -->
      <div class="relative z-10 max-w-4xl px-6 text-center animate-fade-in">
        <h2
          class="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight"
        >
          Empowering Bamenda Through AI
        </h2>
        <p
          class="mt-6 mx-auto max-w-2xl text-lg md:text-xl text-blue-200 italic"
        >
          “Bridging the gap between global knowledge and local solutions.”
        </p>

        <div class="mt-12 flex flex-wrap justify-center gap-4">
          <router-link
            to="/bridge"
            class="rounded-md bg-white px-7 py-3 text-sm font-semibold text-blue-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            Explore AI Bridge
          </router-link>
          <router-link
            to="/clerk"
            class="rounded-md border border-white/70 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Digital Clerk
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="mx-auto max-w-6xl px-6 py-24">
      <div class="grid gap-10 md:grid-cols-2">
        <!-- Bridge Card -->
        <div
          class="group rounded-xl border border-neutral-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <h3 class="text-xl font-semibold text-neutral-900">
            AI Bridge
          </h3>
          <p class="mt-4 text-neutral-600 leading-relaxed">
            Struggling with complex subjects like Calculus or Physics?
            AI Bridge transforms global academic knowledge into practical,
            community-relevant explanations using tools and examples
            available locally.
          </p>

          <router-link
            to="/bridge"
            class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition group-hover:gap-3"
          >
            Start Learning
            <span aria-hidden="true">→</span>
          </router-link>
        </div>

        <!-- Clerk Card -->
        <div
          class="group rounded-xl border border-neutral-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <h3 class="text-xl font-semibold text-neutral-900">
            Digital Clerk
          </h3>
          <p class="mt-4 text-neutral-600 leading-relaxed">
            Prefer handwritten notes? Write on paper, take a photo,
            and let Digital Clerk convert them into clean digital text.
            Ideal for students, teachers, and community archives.
          </p>

          <router-link
            to="/clerk"
            class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition group-hover:gap-3"
          >
            Digitize Notes
            <span aria-hidden="true">→</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Mission / Parallax -->
    <section class="relative text-white">
      <!-- Background -->
      <div
        class="absolute inset-0 bg-[url('/netgrid.png')] bg-cover bg-center parallax"
      ></div>

      <!-- Overlay -->
      <div class="absolute inset-0 bg-blue-950/85"></div>

      <!-- Content -->
      <div
        class="relative mx-auto max-w-5xl px-6 py-24 text-center animate-slide-up"
      >
        <h4 class="text-2xl md:text-3xl font-semibold">
          Our Mission
        </h4>
        <p class="mt-6 text-blue-200 leading-relaxed max-w-3xl mx-auto">
          To provide accessible, high-tech tools that respect local traditions
          while enabling self-sustaining innovation across the Northwest Region.
        </p>
      </div>
    </section>
  </div>
</template>

<style>
/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Parallax effect */
.parallax {
  background-attachment: fixed;
  will-change: transform;
}

/* Animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(32px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.9s ease-out both;
}

.animate-slide-up {
  animation: slide-up 1s ease-out both;
}
</style>
