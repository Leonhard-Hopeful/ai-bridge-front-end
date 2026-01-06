<template>
  <div class="min-h-screen bg-neutral-50 font-sans text-neutral-900">
    <!-- Navigation -->
    <nav class="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div class="mx-auto max-w-7xl px-6">
        <div class="flex h-16 items-center justify-between">
          <!-- Brand -->
          <router-link
            to="/"
            class="text-lg font-extrabold tracking-tight text-neutral-900 hover:text-blue-600 transition"
          >
            AI Bridge System
          </router-link>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-8 text-sm font-medium">
            <router-link
              to="/"
              class="text-neutral-600 hover:text-neutral-900 transition"
              active-class="text-blue-600 font-semibold"
            >
              Home
            </router-link>

            <router-link
              to="/bridge"
              class="text-neutral-600 hover:text-neutral-900 transition"
              active-class="text-blue-600 font-semibold"
            >
              AI Bridge
            </router-link>

            <router-link
              to="/clerk"
              class="text-neutral-600 hover:text-neutral-900 transition"
              active-class="text-blue-600 font-semibold"
            >
              Digital Clerk
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-6 py-8">
      <router-view />
    </main>
  </div>
</template>

<style>
.router-link-active {
  /* @apply text-blue-600 font-semibold; */
}
</style>
