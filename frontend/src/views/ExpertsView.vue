<template>
  <!-- KaTeX font CDN — guarantees math fonts load even without bundler resolution -->
  <teleport to="head">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
  </teleport>

  <div class="bridge-container h-[calc(100vh-64px)] w-full overflow-hidden bg-[#F5F4EF] relative flex flex-col">

    <!-- Ambient grid background -->
    <div class="absolute inset-0 grid-bg pointer-events-none z-0"></div>

    <!-- Floating math glyphs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div class="glyph glyph-1">∫</div>
      <div class="glyph glyph-2">π</div>
      <div class="glyph glyph-3">∑</div>
      <div class="glyph glyph-4">Δ</div>
      <div class="glyph glyph-5">Ω</div>
    </div>

    <!-- ═══════════════════════════════ SPLASH SCREEN ═══════════════════════════════ -->
    <transition name="splash-fade">
      <div v-if="showSplash" class="fixed inset-0 z-[100] splash-bg flex items-center justify-center p-6 overflow-hidden">
        <canvas ref="threeCanvas" class="absolute inset-0 z-0"></canvas>

        <!-- Decorative corner frames -->
        <div class="corner-frame corner-tl"></div>
        <div class="corner-frame corner-tr"></div>
        <div class="corner-frame corner-bl"></div>
        <div class="corner-frame corner-br"></div>

        <div class="relative z-10 max-w-xl text-center space-y-10">
          <!-- Eyebrow line -->
          <div class="flex items-center gap-3 justify-center">
            <div class="h-px w-16 bg-indigo-400 opacity-60"></div>
            <span class="text-indigo-300 text-[10px] font-bold tracking-[0.35em] uppercase">Academic AI System</span>
            <div class="h-px w-16 bg-indigo-400 opacity-60"></div>
          </div>

          <!-- Logotype -->
          <div class="space-y-1">
            <h1 class="splash-title">Expert<br/>Bridge</h1>
            <p class="text-indigo-300 text-sm font-medium tracking-widest uppercase">Retrieval · Reasoning · Results</p>
          </div>

          <!-- Subject pills -->
          <div class="flex flex-wrap justify-center gap-2">
            <span v-for="s in ['Discrete Maths', 'Operations Research', 'Stochastic Processes']" :key="s"
                  class="subject-pill">{{ s }}</span>
          </div>

          <button @click="dismissSplash" class="splash-btn">
            Initialize Connection
            <svg class="inline ml-2 w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </button>

          <p class="text-indigo-500 text-xs tracking-wider">Strict syllabus notes only • No hallucination corridor</p>
        </div>
      </div>
    </transition>

    <!-- ═══════════════════════════════ HEADER ═══════════════════════════════ -->
    <header class="relative z-30 bg-[#1E1B4B] text-white flex items-center justify-between px-6 py-3 border-b border-indigo-900">
      <!-- Logo mark -->
      <div class="flex items-center gap-4">
        <div class="logo-mark">
          <span>EB</span>
        </div>
        <div>
          <p class="text-white font-black text-base tracking-tight leading-none">Expert Bridge</p>
          <div class="flex items-center gap-1.5 mt-0.5">
            <span :class="['status-dot', isSocketReady ? 'online' : 'offline']"></span>
            <span class="text-[10px] text-indigo-300 uppercase tracking-widest font-semibold">
              {{ isSocketReady ? 'Bridge Online' : 'Connecting...' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Subject selector -->
      <div class="relative">
        <select v-model="selectedSubject"
                class="subject-select appearance-none pr-8 pl-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer outline-none">
          <option value="Discrete Mathematics">Discrete Mathematics</option>
          <option value="Operations Research">Operations Research</option>
          <option value="Stochastic Processes">Stochastic Processes</option>
        </select>
        <svg class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-300" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
      </div>
    </header>

    <!-- ═══════════════════════════════ CHAT AREA ═══════════════════════════════ -->
    <main ref="chatContainer" class="flex-1 overflow-y-auto px-4 md:px-10 py-8 space-y-8 z-10 pb-40 custom-scrollbar">

      <!-- Empty state -->
      <div v-if="messages.length === 0" class="empty-state">
        <div class="empty-icon">🎓</div>
        <p class="text-[#1E1B4B] font-black text-2xl tracking-tight">What would you like to explore?</p>
        <p class="text-slate-500 text-sm mt-2">Ask about Simplex Method, Markov Chains, Graph Theory, and more.</p>
        <div class="flex flex-wrap gap-2 justify-center mt-6">
          <button v-for="q in quickPrompts" :key="q" @click="quickAsk(q)" class="quick-chip">{{ q }}</button>
        </div>
      </div>

      <div v-for="(msg, index) in messages" :key="index"
           :class="['msg-bubble', msg.role === 'user' ? 'msg-user' : 'msg-assistant']">

        <!-- Role badge -->
        <div :class="['msg-badge', msg.role === 'user' ? 'badge-user' : 'badge-assistant']">
          {{ msg.role === 'user' ? '✦ Question' : '◈ Teacher\'s Notes' }}
        </div>

        <!-- Typing indicator -->
        <div v-if="msg.role === 'assistant' && !msg.content" class="flex gap-1.5 py-2 px-1 items-end">
          <div class="typing-dot" style="animation-delay: 0ms"></div>
          <div class="typing-dot" style="animation-delay: 160ms"></div>
          <div class="typing-dot" style="animation-delay: 320ms"></div>
        </div>

        <div v-else
             class="prose prose-indigo max-w-none text-[1.05rem] leading-relaxed expert-content font-medium"
             v-html="renderMarkdownAndMath(msg.content)">
        </div>
      </div>
    </main>

    <!-- ═══════════════════════════════ INPUT BAR ═══════════════════════════════ -->
    <footer class="fixed bottom-0 left-0 right-0 z-40 footer-bar px-4 md:px-10 py-4">
      <div class="max-w-5xl mx-auto flex gap-3 items-center">
        <!-- Subject tag -->
        <div class="subject-tag hidden md:flex">
          <span>{{ selectedSubject.split(' ')[0] }}</span>
        </div>

        <div class="flex-1 relative">
          <input
            v-model="userInput"
            @keyup.enter="sendMessage"
            :placeholder="isSocketReady ? 'Ask about Simplex, Logic, Markov Chains...' : 'Establishing bridge...'"
            class="query-input w-full outline-none"
            :disabled="isTyping || !isSocketReady"
          />
        </div>

        <button
          @click="sendMessage"
          :disabled="isTyping || !isSocketReady"
          class="send-btn"
        >
          <span v-if="!isTyping">
            QUERY
            <svg class="inline ml-1.5 w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </span>
          <span v-else class="flex gap-1 items-center">
            <div class="typing-dot !bg-black" style="animation-delay:0ms;width:6px;height:6px"></div>
            <div class="typing-dot !bg-black" style="animation-delay:160ms;width:6px;height:6px"></div>
            <div class="typing-dot !bg-black" style="animation-delay:320ms;width:6px;height:6px"></div>
          </span>
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";
import MarkdownIt from 'markdown-it';
import * as THREE from "three";
import katex from 'katex';
import 'katex/dist/katex.min.css';

// ── Markdown / KaTeX ──
// Robust manual KaTeX rendering: parse $...$ and $$...$$ directly using katex
// This avoids broken markdown-it-katex plugin issues entirely.

const renderKatex = (str, displayMode) => {
  try {
    return katex.renderToString(str, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: true,
      macros: { "\\R": "\\mathbb{R}" }
    });
  } catch (e) {
    return str;
  }
};

// Replace $$...$$ (display) and $...$ (inline) with rendered KaTeX HTML
const processLatex = (text) => {
  // Display math: $$...$$
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => {
    return `<div class="katex-display-wrap">${renderKatex(expr.trim(), true)}</div>`;
  });
  // Inline math: $...$  (avoid matching currency — require non-space after $)
  text = text.replace(/\$([^\s$][^$]*?[^\s$]|\S)\$/g, (_, expr) => {
    return renderKatex(expr.trim(), false);
  });
  return text;
};

const md = new MarkdownIt({ html: true, linkify: true, typographer: true, breaks: true });

const renderMarkdownAndMath = (text) => {
  if (!text) return "";
  try {
    // Process LaTeX BEFORE markdown so md doesn't escape the HTML
    const latexProcessed = processLatex(text);
    return md.render(latexProcessed);
  } catch (e) {
    return text;
  }
};

// ── UI State ──
const showSplash = ref(true);
const selectedSubject = ref('Discrete Mathematics');
const userInput = ref('');
const messages = ref([]);
const isTyping = ref(false);
const isSocketReady = ref(false);
const chatContainer = ref(null);
const threeCanvas = ref(null);
let socket = null;

const quickPrompts = [
  'Explain Simplex Method',
  'What is a Markov Chain?',
  'Prove DeMorgan\'s Law',
  'Hungarian Algorithm steps',
];

const quickAsk = (q) => { userInput.value = q; sendMessage(); };

// ── Three.js splash ──
let threeRenderer, scene, camera, particles, linesMesh;

const initThree = () => {
  if (!threeCanvas.value) return;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 12;
  threeRenderer = new THREE.WebGLRenderer({ canvas: threeCanvas.value, antialias: true, alpha: true });
  threeRenderer.setSize(window.innerWidth, window.innerHeight);

  const particleCount = 100;
  const coords = new Float32Array(particleCount * 3);
  const velocities = [];
  for (let i = 0; i < particleCount; i++) {
    coords[i * 3] = (Math.random() - 0.5) * 20;
    coords[i * 3 + 1] = (Math.random() - 0.5) * 20;
    coords[i * 3 + 2] = (Math.random() - 0.5) * 20;
    velocities.push(new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02));
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(coords, 3));
  particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x818cf8, size: 0.12, transparent: true, opacity: 0.9 }));
  scene.add(particles);

  linesMesh = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.15 }));
  scene.add(linesMesh);

  const animate = () => {
    if (!showSplash.value) return;
    requestAnimationFrame(animate);
    const positions = particles.geometry.attributes.position.array;
    const linePositions = [];
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += velocities[i].x;
      positions[i * 3 + 1] += velocities[i].y;
      if (Math.abs(positions[i * 3]) > 10) velocities[i].x *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 10) velocities[i].y *= -1;
      for (let j = i + 1; j < particleCount; j++) {
        const dist = Math.sqrt(Math.pow(positions[i*3]-positions[j*3],2) + Math.pow(positions[i*3+1]-positions[j*3+1],2));
        if (dist < 4) linePositions.push(positions[i*3], positions[i*3+1], positions[i*3+2], positions[j*3], positions[j*3+1], positions[j*3+2]);
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;
    linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    threeRenderer.render(scene, camera);
  };
  animate();
};

// ── WebSocket ──
const connectWebSocket = () => {
  socket = new WebSocket('ws://localhost:8000/ws/expert');
  socket.onopen = () => { isSocketReady.value = true; };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'content') {
      const lastMsg = messages.value[messages.value.length - 1];
      if (lastMsg && lastMsg.role === 'assistant') lastMsg.content += data.payload;
      scrollToBottom();
    } else if (data.type === 'done') {
      isTyping.value = false;
    }
  };
  socket.onclose = () => { isSocketReady.value = false; setTimeout(connectWebSocket, 3000); };
};

const sendMessage = () => {
  if (!userInput.value.trim() || isTyping.value || !isSocketReady.value) return;
  const userText = userInput.value;
  messages.value.push({ role: 'user', content: userText });
  messages.value.push({ role: 'assistant', content: '' });
  isTyping.value = true;
  socket.send(JSON.stringify({ message: userText, subject: selectedSubject.value }));
  userInput.value = '';
  scrollToBottom();
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
};

const dismissSplash = () => { showSplash.value = false; };

onMounted(() => { initThree(); connectWebSocket(); });
onBeforeUnmount(() => { if (socket) socket.close(); });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&display=swap');

/* ── ROOT ── */
.bridge-container {
  font-family: 'DM Sans', sans-serif;
  background-color: #F5F4EF;
}

/* ── GRID BACKGROUND ── */
.grid-bg {
  background-image:
    linear-gradient(to right, #1E1B4B08 1px, transparent 1px),
    linear-gradient(to bottom, #1E1B4B08 1px, transparent 1px);
  background-size: 48px 48px;
}

/* ── FLOATING GLYPHS ── */
.glyph {
  position: absolute;
  font-family: 'Syne', sans-serif;
  font-size: 9rem;
  font-weight: 900;
  color: #4338CA;
  opacity: 0.045;
  user-select: none;
  animation: glyph-drift 28s infinite ease-in-out;
}
.glyph-1 { top: 8%; left: 4%; }
.glyph-2 { top: 60%; left: 8%; animation-delay: -8s; animation-direction: reverse; }
.glyph-3 { top: 12%; left: 72%; animation-delay: -14s; }
.glyph-4 { top: 72%; left: 78%; animation-delay: -4s; }
.glyph-5 { top: 38%; left: 44%; animation-delay: -20s; animation-duration: 38s; }

@keyframes glyph-drift {
  0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
  50% { transform: translateY(-50px) rotate(15deg) scale(1.05); }
}

/* ── SPLASH ── */
.splash-bg {
  background: radial-gradient(ellipse at 30% 40%, #2d3b8f 0%, #0f0e2a 55%, #04030e 100%);
}

.corner-frame {
  position: absolute;
  width: 64px;
  height: 64px;
  border-color: rgba(99, 102, 241, 0.35);
  border-style: solid;
  border-width: 0;
}
.corner-tl { top: 24px; left: 24px; border-top-width: 2px; border-left-width: 2px; }
.corner-tr { top: 24px; right: 24px; border-top-width: 2px; border-right-width: 2px; }
.corner-bl { bottom: 24px; left: 24px; border-bottom-width: 2px; border-left-width: 2px; }
.corner-br { bottom: 24px; right: 24px; border-bottom-width: 2px; border-right-width: 2px; }

.splash-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(4rem, 10vw, 6.5rem);
  font-weight: 900;
  line-height: 0.9;
  color: #fff;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}

.subject-pill {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 6px 14px;
  border-radius: 100px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.35);
  color: #a5b4fc;
}

.splash-btn {
  font-family: 'Syne', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 16px 48px;
  background: #FBBF24;
  color: #0f0e2a;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 0 0 0 rgba(251,191,36,0.5);
}
.splash-btn:hover {
  background: #fff;
  box-shadow: 0 0 40px 8px rgba(251,191,36,0.25);
  transform: translateY(-2px);
}

/* ── HEADER ── */
.logo-mark {
  width: 36px;
  height: 36px;
  background: #4338CA;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-family: 'Syne', sans-serif;
  font-weight: 900;
  font-size: 13px;
  letter-spacing: -0.03em;
  color: #fff;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}
.status-dot.online { background: #34d399; box-shadow: 0 0 6px #34d39980; animation: pulse-dot 2s infinite; }
.status-dot.offline { background: #f87171; }

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.subject-select {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(165,180,252,0.25);
  border-radius: 6px;
  color: #e0e7ff;
  font-family: 'DM Mono', monospace;
  transition: border-color 0.2s;
}
.subject-select:hover { border-color: rgba(165,180,252,0.6); }
.subject-select option { background: #1E1B4B; }

/* ── MESSAGES ── */
.msg-bubble {
  position: relative;
  max-width: 90%;
  border-radius: 16px;
  padding: 28px 32px 24px;
  border: 1.5px solid transparent;
}

.msg-user {
  background: #1E1B4B;
  color: #e0e7ff;
  margin-left: auto;
  border-color: #312e81;
}

.msg-assistant {
  background: #FFFFFF;
  color: #1e1b4b;
  margin-right: auto;
  border-color: #e0e7ff;
  box-shadow: 0 4px 24px rgba(30,27,75,0.07);
}

.msg-badge {
  position: absolute;
  top: -11px;
  left: 20px;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  padding: 3px 10px;
  border-radius: 100px;
}

.badge-user {
  background: #4338CA;
  color: #e0e7ff;
}

.badge-assistant {
  background: #FBBF24;
  color: #1e1b4b;
}

/* ── TYPING DOTS ── */
.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4338CA;
  animation: bounce-dot 0.8s infinite ease-in-out;
  display: inline-block;
}

@keyframes bounce-dot {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50% { transform: translateY(-6px); opacity: 1; }
}

/* ── EMPTY STATE ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 80px 24px 40px;
  font-family: 'Syne', sans-serif;
}
.empty-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  filter: grayscale(0.3);
}
.quick-chip {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 8px 16px;
  border-radius: 100px;
  background: white;
  border: 1.5px solid #c7d2fe;
  color: #4338CA;
  cursor: pointer;
  transition: all 0.2s;
}
.quick-chip:hover {
  background: #4338CA;
  color: white;
  border-color: #4338CA;
  transform: translateY(-1px);
}

/* ── FOOTER / INPUT ── */
.footer-bar {
  background: linear-gradient(to top, #F5F4EF 70%, transparent);
  padding-top: 24px;
}

.subject-tag {
  background: #1E1B4B;
  color: #a5b4fc;
  border-radius: 8px;
  padding: 0 14px;
  height: 52px;
  align-items: center;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
  flex-shrink: 0;
}

.query-input {
  height: 56px;
  padding: 0 22px;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: #1e1b4b;
  background: white;
  border: 1.5px solid #c7d2fe;
  border-radius: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.query-input:focus {
  border-color: #4338CA;
  box-shadow: 0 0 0 4px rgba(67,56,202,0.1);
}
.query-input::placeholder { color: #94a3b8; }
.query-input:disabled { background: #f1f5f9; cursor: not-allowed; }

.send-btn {
  height: 56px;
  padding: 0 28px;
  background: #FBBF24;
  color: #1e1b4b;
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s, transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 16px rgba(251,191,36,0.4);
}
.send-btn:hover:not(:disabled) {
  background: #fcd34d;
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(251,191,36,0.5);
}
.send-btn:active:not(:disabled) { transform: translateY(0); box-shadow: none; }
.send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── EXPERT CONTENT (math/tables) ── */

/* Inline KaTeX — works in both light and dark bubbles */
.expert-content :deep(.katex) {
  font-size: 1.1em;
}

/* Display (block) math wrapper */
.expert-content :deep(.katex-display-wrap) {
  margin: 1.5rem 0;
  padding: 1.25rem 1.75rem;
  background: #0f0e2a;
  border-radius: 10px;
  overflow-x: auto;
  border-left: 4px solid #FBBF24;
  display: block;
}

/* KaTeX renders SVG/HTML — force white text inside dark block */
.expert-content :deep(.katex-display-wrap .katex),
.expert-content :deep(.katex-display-wrap .katex *),
.expert-content :deep(.katex-display-wrap .katex-html) {
  color: #e0e7ff !important;
}

/* KaTeX display mode override (if katex itself wraps in .katex-display) */
.expert-content :deep(.katex-display) {
  margin: 0;
  overflow-x: auto;
}

/* Inside dark user bubble — keep math readable */
.msg-user .expert-content :deep(.katex) {
  color: #e0e7ff;
}
.msg-user .expert-content :deep(.katex-display-wrap) {
  background: rgba(255,255,255,0.07);
  border-left-color: #FBBF24;
}
.msg-user .expert-content :deep(.katex-display-wrap .katex),
.msg-user .expert-content :deep(.katex-display-wrap .katex *) {
  color: #e0e7ff !important;
}

.expert-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1.5px solid #c7d2fe;
}
.expert-content :deep(th) {
  background: #1E1B4B;
  color: #e0e7ff;
  padding: 10px 14px;
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.expert-content :deep(td) {
  border: 1px solid #e0e7ff;
  padding: 10px 14px;
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  text-align: center;
}
.expert-content :deep(tr:nth-child(even) td) { background: #f5f4ef; }

.expert-content :deep(code) {
  font-family: 'DM Mono', monospace;
  background: #e0e7ff;
  color: #4338CA;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.875em;
}
.expert-content :deep(pre) {
  background: #0f0e2a;
  border-radius: 10px;
  padding: 1.25rem;
  overflow-x: auto;
  border-left: 4px solid #4338CA;
}
.expert-content :deep(pre code) { background: transparent; color: #a5b4fc; }

.expert-content :deep(blockquote) {
  border-left: 4px solid #FBBF24;
  background: #fffbeb;
  padding: 12px 20px;
  border-radius: 0 8px 8px 0;
  margin: 1.25rem 0;
  font-style: italic;
  color: #78350f;
}

/* ── TRANSITIONS ── */
.splash-fade-enter-active, .splash-fade-leave-active { transition: opacity 0.7s ease; }
.splash-fade-enter-from, .splash-fade-leave-to { opacity: 0; }

/* ── SCROLLBAR ── */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 100px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4338CA; }
</style>