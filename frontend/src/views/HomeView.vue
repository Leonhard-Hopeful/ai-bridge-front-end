<template>
  <!-- Font Awesome CDN -->
  <teleport to="head">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  </teleport>

  <div class="home-container relative overflow-x-hidden">

    <!-- ── Grid background ── -->
    <div class="absolute inset-0 grid-bg pointer-events-none z-0"></div>

    <!-- ── Floating glyphs ── -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div class="glyph glyph-1">∑</div>
      <div class="glyph glyph-2">π</div>
      <div class="glyph glyph-3">Δ</div>
      <div class="glyph glyph-4">∞</div>
      <div class="glyph glyph-5">Ω</div>
    </div>

    <!-- ══════════════════════════════ HERO ══════════════════════════════ -->
    <section class="relative h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden">

      <!-- Video backdrop -->
      <video autoplay muted loop playsinline class="absolute inset-0 z-0 h-full w-full object-cover hero-video">
        <source src="/horseman.mp4" type="video/mp4" />
      </video>

      <!-- Gradient overlay -->
      <div class="absolute inset-0 z-10 hero-overlay"></div>

      <!-- Corner brackets -->
      <div class="corner-frame corner-tl z-20"></div>
      <div class="corner-frame corner-tr z-20"></div>
      <div class="corner-frame corner-bl z-20"></div>
      <div class="corner-frame corner-br z-20"></div>

      <!-- Hero content — grows to fill, centres everything -->
      <div class="relative z-20 w-full flex-1 flex flex-col items-center justify-center text-center hero-content">

        <!-- Eyebrow -->
        <div class="flex items-center gap-3 justify-center hero-eyebrow-row">
          <div class="h-px w-10 bg-indigo-400 opacity-40"></div>
          <span class="eyebrow-text">Cameroon's AI Learning Lab</span>
          <div class="h-px w-10 bg-indigo-400 opacity-40"></div>
        </div>

        <!-- Title -->
        <h1 class="hero-title">
          Empowering
          <span class="hero-accent"> the community</span>
          <br/>through AI
        </h1>

        <!-- Subtitle -->
        <p class="hero-sub">
          Bridging the gap between global knowledge and local solutions.
        </p>

        <!-- Buttons -->
        <div class="hero-btn-group">
          <router-link to="/bridge" class="hero-btn-primary">
            Explore AI Bridge
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </router-link>
          <router-link to="/clerk" class="hero-btn-secondary">
            Digital Clerk
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </router-link>
        </div>
      </div>

      <!-- Scroll indicator pinned to bottom -->
      <div class="relative z-20 pb-6 flex flex-col items-center gap-2">
        <span class="scroll-label">Scroll</span>
        <div class="scroll-dot"></div>
      </div>

    </section>

    <!-- ══════════════════════════════ FEATURES ══════════════════════════════ -->
    <section class="relative z-10 mx-auto max-w-6xl px-4 md:px-6 py-24">

      <!-- Section header -->
      <div class="section-header">
        <span class="section-tag">◈ Platform</span>
        <h2 class="section-title">What we offer</h2>
        <p class="section-sub">Two powerful tools built for the Northwest Region</p>
      </div>

      <div class="grid gap-6 md:grid-cols-2 mt-14">

        <!-- AI Bridge card -->
        <div :class="['feature-card', showFeatures ? 'feature-card-visible' : '']" style="transition-delay: 0ms">
          <div class="feature-badge badge-new">New Feature</div>
          <div class="feature-icon feature-icon-indigo">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" class="w-7 h-7">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/>
            </svg>
          </div>
          <h3 class="feature-title">AI Bridge</h3>
          <p class="feature-desc">
            Struggling with complex subjects like Calculus or Physics? We transform academic theories into community-relevant explanations using analogies from the Northwest Region.
          </p>
          <router-link to="/bridge" class="feature-link feature-link-indigo">
            Start Learning
            <svg class="inline ml-1.5 w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </router-link>
        </div>

        <!-- Digital Clerk card -->
        <div :class="['feature-card', showFeatures ? 'feature-card-visible' : '']" style="transition-delay: 120ms">
          <div class="feature-icon feature-icon-yellow">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" class="w-7 h-7">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
            </svg>
          </div>
          <h3 class="feature-title">Digital Clerk</h3>
          <p class="feature-desc">
            Take a photo of your handwritten notes and let our AI convert them into clean digital text. Ideal for archiving student records and local community histories.
          </p>
          <router-link to="/clerk" class="feature-link feature-link-yellow">
            Digitize Notes
            <svg class="inline ml-1.5 w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </router-link>
        </div>

      </div>
    </section>

    <!-- ══════════════════════════════ MISSION ══════════════════════════════ -->
    <section class="relative z-10 mission-section py-28 overflow-hidden">

      <!-- Background texture -->
      <div class="absolute inset-0 mission-grid pointer-events-none"></div>

      <!-- Decorative lines -->
      <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent"></div>
      <div class="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-yellow-400/30 to-transparent"></div>

      <div class="relative z-10 mx-auto max-w-4xl px-6 text-center mission-content">

        <div class="flex items-center gap-3 justify-center mb-8">
          <div class="h-px w-12 bg-indigo-400 opacity-40"></div>
          <span class="mission-eyebrow">◈ Our Mission</span>
          <div class="h-px w-12 bg-indigo-400 opacity-40"></div>
        </div>

        <h2 class="mission-title">
          Knowledge for<br/>
          <span class="mission-accent">every community</span>
        </h2>

        <p class="mission-body">
          To provide accessible, high-tech tools that respect local traditions while enabling self-sustaining innovation across the Northwest Region.
        </p>

        <div class="mission-divider"></div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          <div v-for="pillar in pillars" :key="pillar.title" class="pillar-card">
            <div class="pillar-icon-wrap">
              <i :class="pillar.faIcon" class="pillar-fa-icon"></i>
            </div>
            <h4 class="pillar-title">{{ pillar.title }}</h4>
            <p class="pillar-desc">{{ pillar.desc }}</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const showFeatures = ref(false)

const pillars = [
  {
    title: 'Accessible',
    desc: 'Tools designed for low-bandwidth environments and everyday devices.',
    faIcon: 'fa-solid fa-globe'
  },
  {
    title: 'Contextual',
    desc: 'AI that understands local culture, language, and community needs.',
    faIcon: 'fa-solid fa-brain'
  },
  {
    title: 'Empowering',
    desc: 'From students to community leaders — technology for everyone.',
    faIcon: 'fa-solid fa-bolt'
  },
]

onMounted(() => {
  setTimeout(() => { showFeatures.value = true }, 300)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,700;0,800;0,900;1,700;1,800;1,900&family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&display=swap');

/* ── ROOT ── */
.home-container {
  font-family: 'DM Sans', sans-serif;
  background-color: #F5F4EF;
}

/* ── GRID ── */
.grid-bg {
  background-image:
    linear-gradient(to right, #1E1B4B08 1px, transparent 1px),
    linear-gradient(to bottom, #1E1B4B08 1px, transparent 1px);
  background-size: 48px 48px;
  height: 100%;
}

/* ── FLOATING GLYPHS ── */
.glyph {
  position: absolute;
  font-family: 'Syne', sans-serif;
  font-size: 9rem;
  font-weight: 900;
  color: #4338CA;
  opacity: 0.035;
  user-select: none;
  animation: glyph-drift 30s infinite ease-in-out;
}
.glyph-1 { top: 8%;  left: 3%;  }
.glyph-2 { top: 30%; left: 88%; animation-delay: -8s; animation-direction: reverse; }
.glyph-3 { top: 60%; left: 5%;  animation-delay: -14s; }
.glyph-4 { top: 75%; left: 82%; animation-delay: -4s; }
.glyph-5 { top: 45%; left: 48%; animation-delay: -20s; animation-duration: 40s; }

@keyframes glyph-drift {
  0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
  50%       { transform: translateY(-55px) rotate(14deg) scale(1.05); }
}

/* ══ HERO ══ */
.hero-video {
  filter: grayscale(25%) contrast(105%);
  opacity: 0.45;
}

.hero-overlay {
  background: linear-gradient(
    to bottom,
    rgba(30, 27, 75, 0.5) 0%,
    rgba(10, 8, 30, 0.78) 100%
  );
}

/* Corner brackets */
.corner-frame {
  position: absolute;
  width: 48px; height: 48px;
  border-color: rgba(165,180,252,0.28);
  border-style: solid; border-width: 0;
}
.corner-tl { top: 20px; left: 20px; border-top-width: 2px; border-left-width: 2px; }
.corner-tr { top: 20px; right: 20px; border-top-width: 2px; border-right-width: 2px; }
.corner-bl { bottom: 20px; left: 20px; border-bottom-width: 2px; border-left-width: 2px; }
.corner-br { bottom: 20px; right: 20px; border-bottom-width: 2px; border-right-width: 2px; }

/* Content wrapper — flex column centres stack and limits width */
.hero-content {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 32px;
  animation: hero-in 1s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes hero-in {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Eyebrow row spacing */
.hero-eyebrow-row {
  margin-bottom: 20px;
}

.eyebrow-text {
  font-family: 'Poppins', sans-serif;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.28em;
  color: #a5b4fc;
}

/* Title — compact clamp so it never overflows */
.hero-title {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(2rem, 5.5vw, 3.75rem);
  font-weight: 900;
  font-style: italic;
  line-height: 1.08;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: #fff;
  margin: 0;
}

.hero-accent { color: #FBBF24; }

/* Subtitle — smaller, lighter */
.hero-sub {
  margin-top: 16px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(199, 210, 254, 0.75);
  font-style: italic;
  line-height: 1.65;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}

/* Button group */
.hero-btn-group {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}

/* Primary button */
.hero-btn-primary {
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 14px 36px;
  background: #FBBF24;
  color: #1E1B4B;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 20px rgba(251,191,36,0.4);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.hero-btn-primary:hover {
  background: #fde68a;
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(251,191,36,0.5);
}
.hero-btn-primary:active { transform: translateY(0); box-shadow: none; }

/* Secondary button */
.hero-btn-secondary {
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 13px 36px;
  background: transparent;
  color: #fff;
  border-radius: 6px;
  border: 1.5px solid rgba(255,255,255,0.4);
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, border-color 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.hero-btn-secondary:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.75);
  transform: translateY(-2px);
}
.hero-btn-secondary:active { transform: translateY(0); }

/* Scroll cue */
.scroll-label {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: rgba(165,180,252,0.5);
}
.scroll-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #a5b4fc;
  animation: scroll-bounce 2s ease-in-out infinite;
}
@keyframes scroll-bounce {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50%       { transform: translateY(6px); opacity: 1; }
}

/* ══ FEATURES SECTION ══ */
.section-header {
  text-align: center;
}
.section-tag {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #4338CA;
  font-weight: 600;
}
.section-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  color: #1E1B4B;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  margin-top: 8px;
  line-height: 1;
}
.section-sub {
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  color: #64748b;
  margin-top: 10px;
}

/* Feature cards */
.feature-card {
  position: relative;
  background: #FFFFFF;
  border: 1.5px solid #e0e7ff;
  border-radius: 20px;
  padding: 36px 32px 32px;
  box-shadow: 0 4px 24px rgba(30,27,75,0.07);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease, box-shadow 0.2s, border-color 0.2s;
  overflow: hidden;
}
.feature-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(to right, #4338CA, #FBBF24);
  opacity: 0;
  transition: opacity 0.2s;
}
.feature-card:hover::before { opacity: 1; }
.feature-card:hover {
  box-shadow: 0 12px 40px rgba(30,27,75,0.12);
  border-color: #c7d2fe;
  transform: translateY(-3px) !important;
}

.feature-card-visible {
  opacity: 1;
  transform: translateY(0);
}

.feature-badge {
  position: absolute;
  top: -1px; right: 24px;
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  padding: 4px 12px;
  border-radius: 0 0 8px 8px;
}
.badge-new {
  background: #4338CA;
  color: #e0e7ff;
}

.feature-icon {
  width: 52px; height: 52px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 20px;
  border: 1.5px solid;
}
.feature-icon-indigo {
  background: #eef2ff;
  border-color: #c7d2fe;
  color: #4338CA;
}
.feature-icon-yellow {
  background: #fffbeb;
  border-color: #fde68a;
  color: #d97706;
}

.feature-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.35rem;
  font-weight: 900;
  color: #1E1B4B;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}

.feature-desc {
  font-family: 'DM Sans', sans-serif;
  font-size: 14.5px;
  color: #475569;
  line-height: 1.75;
  margin-bottom: 24px;
}

.feature-link {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 8px;
  transition: transform 0.15s, box-shadow 0.15s;
}
.feature-link:hover { transform: translateY(-1px); }

.feature-link-indigo {
  background: #4338CA;
  color: #fff;
  box-shadow: 0 3px 12px rgba(67,56,202,0.3);
}
.feature-link-indigo:hover { box-shadow: 0 6px 20px rgba(67,56,202,0.4); }

.feature-link-yellow {
  background: #FBBF24;
  color: #1E1B4B;
  box-shadow: 0 3px 12px rgba(251,191,36,0.35);
}
.feature-link-yellow:hover { box-shadow: 0 6px 20px rgba(251,191,36,0.45); }

/* ══ MISSION SECTION ══ */
.mission-section {
  background: #1E1B4B;
}

.mission-grid {
  background-image:
    linear-gradient(to right, rgba(165,180,252,0.07) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(165,180,252,0.07) 1px, transparent 1px);
  background-size: 48px 48px;
}

.mission-content {
  animation: slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes slide-up {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}

.mission-eyebrow {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #a5b4fc;
  font-weight: 500;
}

.mission-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  line-height: 0.92;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  color: #fff;
  margin-top: 20px;
}

.mission-accent { color: #FBBF24; }

.mission-body {
  margin-top: 28px;
  font-family: 'DM Sans', sans-serif;
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.75;
  color: #c7d2fe;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.mission-divider {
  width: 48px; height: 3px;
  background: linear-gradient(to right, #4338CA, #FBBF24);
  border-radius: 100px;
  margin: 28px auto 0;
}

/* Pillar cards */
.pillar-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(165,180,252,0.15);
  border-radius: 16px;
  padding: 28px 24px;
  text-align: left;
  transition: background 0.2s, border-color 0.2s;
}
.pillar-card:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(165,180,252,0.3);
}

.pillar-icon-wrap {
  width: 48px; height: 48px;
  background: rgba(245, 222, 179, 0.08);
  border: 1px solid rgba(245, 222, 179, 0.18);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 18px;
  transition: background 0.2s, border-color 0.2s;
}
.pillar-card:hover .pillar-icon-wrap {
  background: rgba(245, 222, 179, 0.14);
  border-color: rgba(245, 222, 179, 0.35);
}

.pillar-fa-icon {
  font-size: 1.2rem;
  color: #F5DEB3;
}

.pillar-title {
  font-family: 'Syne', sans-serif;
  font-size: 1rem;
  font-weight: 900;
  color: #e0e7ff;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  margin-bottom: 8px;
}

.pillar-desc {
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px;
  color: #94a3b8;
  line-height: 1.65;
}
</style>