<template>
  <!-- KaTeX CDN -->
  <teleport to="head">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
  </teleport>

  <div class="bridge-container h-[calc(100vh-80px)] w-full overflow-hidden bg-[#F5F4EF] relative flex flex-col">

    <!-- ── Grid background ── -->
    <div class="absolute inset-0 grid-bg pointer-events-none z-0"></div>

    <!-- ── Floating math glyphs ── -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div class="glyph glyph-1">∫</div>
      <div class="glyph glyph-2">π</div>
      <div class="glyph glyph-3">∑</div>
      <div class="glyph glyph-4">Δ</div>
      <div class="glyph glyph-5">Ω</div>
    </div>

    <!-- ══════════════════════ SPLASH ══════════════════════ -->
    <transition name="splash-fade">
      <div v-if="showSplash" class="fixed inset-0 z-[100] splash-bg flex items-center justify-center p-6 overflow-hidden">
        <canvas ref="threeCanvas" class="absolute inset-0 z-0"></canvas>

        <div class="corner-frame corner-tl"></div>
        <div class="corner-frame corner-tr"></div>
        <div class="corner-frame corner-bl"></div>
        <div class="corner-frame corner-br"></div>

        <div class="relative z-10 max-w-xl text-center space-y-10">
          <div class="flex items-center gap-3 justify-center">
            <div class="h-px w-16 bg-blue-400 opacity-60"></div>
            <span class="text-blue-300 text-[10px] font-bold tracking-[0.35em] uppercase">Cameroon's AI Learning Lab</span>
            <div class="h-px w-16 bg-blue-400 opacity-60"></div>
          </div>

          <div class="space-y-1">
            <h1 class="splash-title">The<br/>Bridge</h1>
            <p class="text-blue-300 text-sm font-medium tracking-widest uppercase">Socratic · Local · Rigorous</p>
          </div>

          <div class="flex flex-wrap justify-center gap-2">
            <span v-for="s in ['Contextual Learning', 'Socratic Method', 'Local Analogies']" :key="s" class="subject-pill">{{ s }}</span>
          </div>

          <button @click="dismissSplash" class="splash-btn">
            Cross The Bridge
            <svg class="inline ml-2 w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </button>

          <p class="text-blue-500 text-xs tracking-wider">We don't just give answers — we build understanding</p>
        </div>
      </div>
    </transition>

    <!-- ══════════════ PROGRESS LINE ══════════════ -->
    <div class="relative z-30 shrink-0">
      <div class="w-full h-[3px] bg-blue-100">
        <div
          class="h-full bg-[#FBBF24] transition-all duration-700"
          :style="{ width: (hasStarted ? progress : 0) + '%' }"
        ></div>
      </div>
      <div class="bg-white border-b border-blue-50 px-6 py-1.5 flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <span :class="['status-dot', isConnected ? 'online' : 'offline']"></span>
          <span class="text-[10px] text-blue-400 uppercase tracking-widest font-semibold" style="font-family:'DM Mono',monospace">
            {{ isConnected ? 'Bridge Online' : 'Connecting...' }}
          </span>
        </div>
        <div v-if="hasStarted" class="flex items-center gap-3">
          <span class="text-[10px] text-blue-300 uppercase tracking-widest font-bold" style="font-family:'DM Mono',monospace">
            {{ topic }}
          </span>
          <span class="text-[10px] text-[#FBBF24] font-bold" style="font-family:'DM Mono',monospace">{{ progress }}%</span>
        </div>
      </div>
    </div>

    <!-- ══════════════════════ SETUP FORM ══════════════════════ -->
    <div v-if="!hasStarted && !showSplash" class="flex-1 flex items-center justify-center p-6 z-20">
      <div class="setup-card">
        <div class="setup-card-stripe"></div>

        <div class="mb-6">
          <h2 class="setup-title">Join the Quarter</h2>
          <p class="setup-subtitle">Cameroon's AI Learning Lab</p>
        </div>

        <div class="space-y-4">
          <div class="space-y-1.5">
            <label class="form-label">Learning Focus</label>
            <input
              v-model="topic"
              placeholder="e.g. Quantum Physics or History"
              class="form-input"
              @keyup.enter="startLesson"
            />
          </div>

          <div class="space-y-1.5">
            <label class="form-label">Your Community</label>
            <input
              v-model="community"
              placeholder="e.g. Douala, Molyko, or Bastos"
              class="form-input"
              @keyup.enter="startLesson"
            />
          </div>

          <button @click="startLesson" class="start-btn">
            Initialize Lesson
            <svg class="inline ml-2 w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════ CHAT AREA ══════════════════════ -->
    <div v-else-if="hasStarted" class="flex-1 flex flex-col min-h-0 relative z-10">

      <div ref="scrollContainer" class="flex-1 overflow-y-auto px-4 md:px-10 py-8 space-y-8 pb-40 custom-scrollbar">

        <div v-for="(msg, i) in chatHistory" :key="i"
             :class="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'">

          <!-- ── AI bubble ── -->
          <div v-if="msg.role === 'ai'"
               class="msg-bubble msg-assistant group w-full max-w-5xl">

            <div class="msg-badge badge-assistant">
              ◈ AI Tutor
              <span class="opacity-60 ml-1">• {{ community }}</span>
            </div>

            <!-- TTS button -->
            <button
              @click="isSpeaking ? stopSpeech() : speak(msg.text)"
              class="tts-btn absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              :title="isSpeaking ? 'Stop' : 'Listen'"
            >
              {{ isSpeaking ? '⏹' : '🔊' }}
            </button>

            <!-- ══ THINKING PANEL ══
                 Visible while agent is calling tools (isThinking).
                 Collapses with animation the moment text content begins streaming.
                 Only shown on the LAST ai message while it is active.
            -->
            <div
              v-if="msg.toolCalls && msg.toolCalls.length > 0"
              class="thinking-wrapper"
              :class="{ 'thinking-collapsed': msg.thinkingDone }"
            >
              <!-- Header row — always visible as collapsed toggle -->
              <button
                class="thinking-header"
                @click="msg.thinkingDone && toggleThinking(i)"
              >
                <!-- Spinning orb: only while still thinking -->
                <span class="thinking-orb" :class="{ 'orb-idle': msg.thinkingDone }"></span>

                <span class="thinking-label">
                  {{ msg.thinkingDone ? 'Researched ' + msg.toolCalls.length + ' source' + (msg.toolCalls.length > 1 ? 's' : '') : 'Researching...' }}
                </span>

                <!-- Step counter badge -->
                <span class="thinking-badge">{{ msg.toolCalls.length }} step{{ msg.toolCalls.length > 1 ? 's' : '' }}</span>

                <!-- Chevron — only shown once collapsed so user can re-expand -->
                <svg
                  v-if="msg.thinkingDone"
                  class="thinking-chevron"
                  :class="{ 'rotate-180': msg.thinkingOpen }"
                  fill="none" stroke="currentColor" stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <!-- Expandable steps list -->
              <div
                class="thinking-steps"
                :class="{ 'steps-open': !msg.thinkingDone || msg.thinkingOpen }"
              >
                <div
                  v-for="(tc, ti) in msg.toolCalls"
                  :key="ti"
                  class="thinking-step"
                  :class="{ 'step-active': ti === msg.toolCalls.length - 1 && !msg.thinkingDone }"
                >
                  <!-- Tool icon -->
                  <span class="step-icon">{{ toolIcon(tc.name) }}</span>

                  <div class="step-body">
                    <!-- Tool name -->
                    <span class="step-name">{{ toolLabel(tc.name) }}</span>

                    <!-- Args rendered as key: value pills -->
                    <div class="step-args">
                      <span
                        v-for="(val, key) in tc.args"
                        :key="key"
                        class="step-arg-pill"
                      >
                        <span class="arg-key">{{ key }}</span>
                        <span class="arg-val">{{ truncate(String(val), 48) }}</span>
                      </span>
                    </div>

                    <!-- Completion tick or spinner -->
                    <span v-if="ti < msg.toolCalls.length - 1 || msg.thinkingDone" class="step-done">✓ done</span>
                    <span v-else class="step-running">
                      <span class="mini-dot" style="animation-delay:0ms"></span>
                      <span class="mini-dot" style="animation-delay:160ms"></span>
                      <span class="mini-dot" style="animation-delay:320ms"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <!-- ══ END THINKING PANEL ══ -->

            <!-- Typing dots — shown only when no tool calls AND no text yet -->
            <div v-if="!msg.text && (!msg.toolCalls || msg.toolCalls.length === 0)"
                 class="flex gap-1.5 py-2 px-1 items-end mt-2">
              <div class="typing-dot" style="animation-delay:0ms"></div>
              <div class="typing-dot" style="animation-delay:160ms"></div>
              <div class="typing-dot" style="animation-delay:320ms"></div>
            </div>

            <div v-if="msg.text"
                 class="prose prose-blue max-w-none text-[1.05rem] leading-relaxed expert-content font-medium"
                 :class="{ 'mt-4': msg.toolCalls && msg.toolCalls.length > 0 }"
                 v-html="renderMarkdownAndMath(msg.text)">
            </div>
          </div>

          <!-- ── User bubble ── -->
          <div v-else class="msg-bubble msg-user max-w-[85%] md:max-w-2xl">
            <div class="msg-badge badge-user">✦ You</div>
            <p class="text-[1.05rem] font-semibold leading-relaxed">{{ msg.text }}</p>
          </div>
        </div>
      </div>

      <!-- ══════════════════════ INPUT BAR ══════════════════════ -->
      <div class="fixed bottom-0 left-0 right-0 z-40 footer-bar px-4 md:px-10 py-4">
        <div class="max-w-5xl mx-auto flex gap-3 items-center">

          <div class="subject-tag hidden md:flex">
            <span>{{ community || '—' }}</span>
          </div>

          <div class="flex-1">
            <input
              v-model="currentInput"
              @keyup.enter="sendMessage()"
              placeholder="Ask for an analogy, solve a problem..."
              class="query-input w-full outline-none"
              :disabled="isStreaming || !isConnected"
            />
          </div>

          <button
            @click="sendMessage()"
            :disabled="isStreaming || !isConnected"
            class="send-btn"
          >
            <span v-if="!isStreaming">
              SEND
              <svg class="inline ml-1.5 w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </span>
            <span v-else class="flex gap-1 items-center">
              <div class="typing-dot !bg-black" style="animation-delay:0ms;width:6px;height:6px"></div>
              <div class="typing-dot !bg-black" style="animation-delay:160ms;width:6px;height:6px"></div>
              <div class="typing-dot !bg-black" style="animation-delay:320ms;width:6px;height:6px"></div>
            </span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { marked } from "marked";
import katex from "katex";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";
import { useToast } from "vue-toastification";
import * as THREE from "three";

const toast = useToast();

/* ──────────────────────── THREE.JS (unchanged) ──────────────────────── */

const threeCanvas = ref(null);
let threeRenderer, scene, camera, particles, linesMesh;

const initThree = () => {
  if (!threeCanvas.value) return;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 12;
  threeRenderer = new THREE.WebGLRenderer({ canvas: threeCanvas.value, antialias: true, alpha: true });
  threeRenderer.setSize(window.innerWidth, window.innerHeight);
  threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const particleCount = 150;
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
  particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x3b82f6, size: 0.14, transparent: true, opacity: 0.85 }));
  scene.add(particles);
  linesMesh = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.15 }));
  scene.add(linesMesh);

  const animate = () => {
    if (!showSplash.value) return;
    requestAnimationFrame(animate);
    const positions = particles.geometry.attributes.position.array;
    const linePositions = [];
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += velocities[i].x;
      positions[i * 3 + 1] += velocities[i].y;
      positions[i * 3 + 2] += velocities[i].z;
      if (Math.abs(positions[i * 3]) > 10) velocities[i].x *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 10) velocities[i].y *= -1;
      for (let j = i + 1; j < particleCount; j++) {
        const dx = positions[i*3]-positions[j*3], dy = positions[i*3+1]-positions[j*3+1], dz = positions[i*3+2]-positions[j*3+2];
        if (Math.sqrt(dx*dx+dy*dy+dz*dz) < 4)
          linePositions.push(positions[i*3], positions[i*3+1], positions[i*3+2], positions[j*3], positions[j*3+1], positions[j*3+2]);
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;
    linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    threeRenderer.render(scene, camera);
  };
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    threeRenderer.setSize(window.innerWidth, window.innerHeight);
  });
};

/* ──────────────────────── MARKDOWN + KATEX (unchanged) ──────────────────────── */

marked.setOptions({ breaks: true, gfm: true, headerIds: false, mangle: false, sanitize: false });

const markdownRenderer = new marked.Renderer();
markdownRenderer.code = (code, language) => {
  const valid = language && hljs.getLanguage(language);
  const highlighted = valid ? hljs.highlight(code, { language }).value : hljs.highlightAuto(code).value;
  return `<div class="code-wrapper group relative">
    <button class="copy-btn absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
      onclick="navigator.clipboard.writeText(\`${code.replace(/`/g, "\\`")}\`).then(()=>window.dispatchEvent(new CustomEvent('code-copied')))">📋</button>
    <pre class="code-block"><code class="hljs ${language || ""}">${highlighted}</code></pre>
  </div>`;
};
marked.use({ renderer: markdownRenderer });

const renderMarkdownAndMath = (text) => {
  if (!text) return "";
  let cleanText = text.replace(/\\\\/g, "\\");
  const lines = cleanText.split("\n");
  let result = "", inCodeBlock = false, codeBuffer = "", codeLang = "", normalTextBuffer = "";

  const flushNormal = () => {
    if (!normalTextBuffer.trim()) return;
    let temp = normalTextBuffer;
    const mathChunks = {};
    let chunkIdx = 0;
    const placeholder = (html) => {
      const key = `%%MATH_${chunkIdx++}%%`;
      mathChunks[key] = html;
      return key;
    };
    temp = temp.replace(/\$\$([\s\S]+?)\$\$/g, (_, f) => {
      try {
        const html = `<div class="katex-display-wrap">${katex.renderToString(f.trim(), { displayMode: true, throwOnError: false, trust: true })}</div>`;
        return placeholder(html);
      } catch { return _; }
    });
    temp = temp.replace(/(?<!\$)\$(?!\$)([^\n$]+?)(?<!\$)\$(?!\$)/g, (_, f) => {
      if (/^\d+(\.\d+)?$/.test(f.trim())) return _;
      try {
        const html = `<span class="inline-math">${katex.renderToString(f.trim(), { displayMode: false, throwOnError: false, trust: true })}</span>`;
        return placeholder(html);
      } catch { return _; }
    });
    let parsed = marked.parse(temp);
    for (const [key, html] of Object.entries(mathChunks)) {
      parsed = parsed.replace(key, html);
    }
    result += parsed;
    normalTextBuffer = "";
  };

  for (let line of lines) {
    const fence = line.match(/^```(\w*)/);
    if (fence) {
      flushNormal();
      if (!inCodeBlock) { inCodeBlock = true; codeLang = fence[1] || ""; codeBuffer = ""; }
      else {
        inCodeBlock = false;
        const hl = codeLang && hljs.getLanguage(codeLang)
          ? hljs.highlight(codeBuffer, { language: codeLang }).value
          : hljs.highlightAuto(codeBuffer).value;
        result += `<div class="code-wrapper group relative">
          <button class="copy-btn absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" data-code="${encodeURIComponent(codeBuffer)}">📋</button>
          <pre class="code-block"><code class="hljs ${codeLang}">${hl}</code></pre>
        </div>`;
      }
      continue;
    }
    if (inCodeBlock) codeBuffer += line + "\n";
    else normalTextBuffer += line + "\n";
  }

  flushNormal();
  if (inCodeBlock) result += `<pre class="code-block-stream">${codeBuffer}</pre>`;
  return result;
};

/* ──────────────────────── SPEECH (unchanged) ──────────────────────── */

const isSpeaking = ref(false);
const speak = (text) => {
  window.speechSynthesis.cancel();
  const clean = text.replace(/<\/?[^>]+(>|$)/g, "").replace(/\$\$.*?\$\$/g, "").replace(/\$.*?\$/g, "");
  const utt = new SpeechSynthesisUtterance(clean);
  utt.onstart = () => (isSpeaking.value = true);
  utt.onend = () => (isSpeaking.value = false);
  window.speechSynthesis.speak(utt);
};
const stopSpeech = () => { window.speechSynthesis.cancel(); isSpeaking.value = false; };

/* ──────────────────────── TOOL HELPERS ──────────────────────── */

/**
 * Maps backend tool names to friendly display labels.
 * Matches the tool names defined in community_agent.py.
 */
const toolLabel = (name) => ({
  web_search:                 'Web Search',
  get_community_profile:      'Community Profile',
  search_case_studies:        'Case Studies',
  search_funding_and_ngos:    'Funding & NGOs',
  search_local_data:          'Local Data',
  generate_action_plan:       'Action Plan',
  estimate_resource_requirements: 'Resource Estimate',
}[name] || name);

/**
 * Maps tool names to emoji icons for visual scanning.
 */
const toolIcon = (name) => ({
  web_search:                 '🔍',
  get_community_profile:      '🏘️',
  search_case_studies:        '📚',
  search_funding_and_ngos:    '💰',
  search_local_data:          '📊',
  generate_action_plan:       '🗺️',
  estimate_resource_requirements: '⚙️',
}[name] || '🔧');

/** Truncates a string for display in the arg pill. */
const truncate = (str, len) => str.length > len ? str.slice(0, len) + '…' : str;

/** Toggles the thinking panel open/closed after it has collapsed. */
const toggleThinking = (msgIndex) => {
  const msg = chatHistory.value[msgIndex];
  if (msg) msg.thinkingOpen = !msg.thinkingOpen;
  chatHistory.value = [...chatHistory.value];
};

/* ──────────────────────── UI STATE ──────────────────────── */

const showSplash   = ref(true);
const topic        = ref("");
const community    = ref("");
const chatHistory  = ref([]);
const currentInput = ref("");
const isStreaming  = ref(false);
const isConnected  = ref(false);
const hasStarted   = ref(false);
const progress     = ref(0);
const scrollContainer = ref(null);
const sessionId    = ref("");

let socket = null;

window.addEventListener("code-copied", () => toast.success("Code copied to clipboard!"));

/* ──────────────────────── WEBSOCKET ──────────────────────── */

const connectWS = () => {
  socket = new WebSocket("ws://127.0.0.1:8000/ws/bridge");

  socket.onopen = () => {
    isConnected.value = true;
    toast.success("Bridge Online");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const lastMsg = chatHistory.value[chatHistory.value.length - 1];
    if (!lastMsg || lastMsg.role !== 'ai') return;

    /* ── type: "tool_call"
         Agent is calling a tool. Push it onto the message's toolCalls array.
         The thinking panel renders from this array reactively.
    */
    if (data.type === 'tool_call') {
      if (!lastMsg.toolCalls) lastMsg.toolCalls = [];
      lastMsg.toolCalls.push({ name: data.tool_name, args: data.args || {} });
      chatHistory.value = [...chatHistory.value];
    }

    /* ── type: "content"
         First content chunk arriving — mark thinkingDone so the panel
         collapses, then append the streamed text.
    */
    else if (data.type === 'content') {
      if (!lastMsg.thinkingDone) {
        // Trigger the collapse animation exactly once
        lastMsg.thinkingDone = true;
        lastMsg.thinkingOpen = false;
      }
      lastMsg.text += data.payload;
      chatHistory.value = [...chatHistory.value];
    }

    /* ── type: "done"
         Stream finished. Unlock input and nudge progress bar.
    */
    else if (data.type === 'done') {
      isStreaming.value = false;
      if (progress.value < 100) progress.value = Math.min(progress.value + 10, 100);
      // Ensure panel is fully collapsed on completion
      lastMsg.thinkingDone = true;
      chatHistory.value = [...chatHistory.value];
    }

    nextTick(scrollToBottom);
  };

  socket.onclose = () => {
    isConnected.value = false;
    setTimeout(connectWS, 4000);
  };
};

const dismissSplash = () => (showSplash.value = false);

const startLesson = () => {
  if (!topic.value.trim() || !community.value.trim()) return;
  hasStarted.value = true;
  chatHistory.value = [];
  progress.value = 5;
  sessionId.value = `session_${Date.now()}`;
  sendMessage(`I want to learn about ${topic.value}. Start lesson 1.`);
};

const sendMessage = (textOverride = null) => {
  const text = textOverride || currentInput.value.trim();
  if (!text || !isConnected.value) return;

  if (!textOverride) chatHistory.value.push({ role: 'user', text, timestamp: new Date() });

  // New AI message — includes toolCalls array and thinking state flags
  chatHistory.value.push({
    role:         'ai',
    text:         '',
    toolCalls:    [],
    thinkingDone: false,
    thinkingOpen: false,
    timestamp:    new Date(),
  });

  isStreaming.value = true;
  socket.send(JSON.stringify({
    message:    text,
    topic:      topic.value,
    community:  community.value,
    session_id: sessionId.value,
  }));
  currentInput.value = "";
  nextTick(scrollToBottom);
};

const scrollToBottom = () => {
  if (scrollContainer.value)
    scrollContainer.value.scrollTo({ top: scrollContainer.value.scrollHeight, behavior: "smooth" });
};

onMounted(() => { connectWS(); initThree(); });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&display=swap');

/* ── ROOT ── */
.bridge-container {
  font-family: 'DM Sans', sans-serif;
  background-color: #F5F4EF;
}

/* ── GRID ── */
.grid-bg {
  background-image:
    linear-gradient(to right, #1E3A8A08 1px, transparent 1px),
    linear-gradient(to bottom, #1E3A8A08 1px, transparent 1px);
  background-size: 48px 48px;
}

/* ── GLYPHS ── */
.glyph {
  position: absolute;
  font-family: 'Syne', sans-serif;
  font-size: 9rem;
  font-weight: 900;
  color: #2563EB;
  opacity: 0.04;
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
  background: radial-gradient(ellipse at 30% 40%, #1d3f9a 0%, #0e1e5c 50%, #030818 100%);
}
.corner-frame {
  position: absolute;
  width: 64px; height: 64px;
  border-color: rgba(59,130,246,0.35);
  border-style: solid; border-width: 0;
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
  background: rgba(59,130,246,0.12);
  border: 1px solid rgba(59,130,246,0.35);
  color: #93c5fd;
}
.splash-btn {
  font-family: 'Syne', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 16px 48px;
  background: #FBBF24;
  color: #0a0f2e;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.15s;
}
.splash-btn:hover {
  background: #fff;
  box-shadow: 0 0 40px 8px rgba(251,191,36,0.25);
  transform: translateY(-2px);
}

/* ── HEADER ── */
.status-dot {
  width: 7px; height: 7px;
  border-radius: 50%; display: inline-block;
}
.status-dot.online  { background: #34d399; box-shadow: 0 0 6px #34d39980; animation: pulse-dot 2s infinite; }
.status-dot.offline { background: #f87171; }
@keyframes pulse-dot {
  0%, 100% { opacity: 1; } 50% { opacity: 0.5; }
}

/* ── SETUP FORM ── */
.setup-card {
  max-width: 440px; width: 100%;
  background: #fff;
  border: 1.5px solid #bfdbfe;
  border-radius: 20px;
  padding: 36px 32px 32px;
  position: relative; overflow: hidden;
  box-shadow: 0 8px 40px rgba(37,99,235,0.10);
}
.setup-card-stripe {
  position: absolute; top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(to right, #2563EB, #FBBF24);
}
.setup-title {
  font-family: 'Syne', sans-serif;
  font-size: 2rem; font-weight: 900;
  color: #1E3A8A;
  letter-spacing: -0.03em; line-height: 1;
  text-transform: uppercase;
}
.setup-subtitle {
  font-family: 'DM Mono', monospace;
  font-size: 10px; text-transform: uppercase;
  letter-spacing: 0.2em; color: #93c5fd; margin-top: 6px;
}
.form-label {
  font-family: 'DM Mono', monospace;
  font-size: 10px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.15em;
  color: #1E3A8A; display: block;
}
.form-input {
  width: 100%;
  border: 1.5px solid #bfdbfe; border-radius: 10px;
  padding: 14px 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px; font-weight: 500; color: #1e3a8a;
  background: #fff; outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-input:focus { border-color: #2563EB; box-shadow: 0 0 0 4px rgba(37,99,235,0.1); }
.form-input::placeholder { color: #94a3b8; }
.start-btn {
  width: 100%; padding: 16px;
  background: #2563EB; color: #fff;
  font-family: 'Syne', sans-serif;
  font-weight: 800; font-size: 15px;
  text-transform: uppercase; letter-spacing: 0.1em;
  border: none; border-radius: 10px; cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 16px rgba(37,99,235,0.3); margin-top: 8px;
}
.start-btn:hover { background: #1d4ed8; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,99,235,0.35); }

/* ── MESSAGES ── */
.msg-bubble {
  position: relative; border-radius: 16px;
  padding: 28px 32px 24px;
  border: 1.5px solid transparent;
}
.msg-assistant {
  background: #FFFFFF; color: #1e3a8a;
  border-color: #dbeafe;
  box-shadow: 0 4px 24px rgba(37,99,235,0.07);
}
.msg-user {
  background: #1E3A8A; color: #dbeafe;
  border-color: #1e40af; margin-left: auto;
}
.msg-badge {
  position: absolute; top: -11px; left: 20px;
  font-family: 'DM Mono', monospace;
  font-size: 10px; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.12em;
  padding: 3px 10px; border-radius: 100px;
}
.badge-assistant { background: #FBBF24; color: #1e3a8a; }
.badge-user      { background: #2563EB; color: #dbeafe; }

/* ── TTS ── */
.tts-btn {
  font-size: 14px; background: #eff6ff;
  border: 1.5px solid #bfdbfe; border-radius: 8px;
  padding: 6px 10px; cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.tts-btn:hover { background: #FBBF24; border-color: #FBBF24; }

/* ── TYPING DOTS ── */
.typing-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #2563EB;
  animation: bounce-dot 0.8s infinite ease-in-out;
  display: inline-block;
}
@keyframes bounce-dot {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50%       { transform: translateY(-6px); opacity: 1; }
}

/* ════════════════════════════════════════════════
   THINKING PANEL
   All new styles — matched to the existing design
   system: DM Mono, #1E3A8A, #FBBF24, border #bfdbfe
════════════════════════════════════════════════ */

.thinking-wrapper {
  border: 1.5px solid #bfdbfe;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 4px;
  background: #f0f7ff;
  transition: all 0.4s ease;
}

/* Collapsed state — smaller border + muted bg */
.thinking-collapsed {
  background: #f8fbff;
  border-color: #dbeafe;
}

/* Header row — always visible */
.thinking-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: transparent;
  border: none;
  cursor: default;
  text-align: left;
}

/* Make it a real button cursor only after done (re-expandable) */
.thinking-collapsed .thinking-header {
  cursor: pointer;
}
.thinking-collapsed .thinking-header:hover {
  background: #e8f2ff;
}

/* Animated orb */
.thinking-orb {
  flex-shrink: 0;
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #2563EB;
  box-shadow: 0 0 0 0 rgba(37,99,235,0.5);
  animation: orb-pulse 1.4s infinite;
}
.orb-idle {
  animation: none;
  background: #34d399;
  box-shadow: none;
}
@keyframes orb-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(37,99,235,0.5); }
  70%  { box-shadow: 0 0 0 8px rgba(37,99,235,0); }
  100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); }
}

.thinking-label {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  color: #1e3a8a;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  flex: 1;
}

.thinking-badge {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 100px;
  background: #FBBF24;
  color: #1e3a8a;
  letter-spacing: 0.05em;
}

.thinking-chevron {
  width: 14px; height: 14px;
  color: #93c5fd;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

/* Steps list — expands/collapses via max-height transition */
.thinking-steps {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  border-top: 0px solid #dbeafe;
}

.steps-open {
  max-height: 600px; /* large enough for 8 steps */
  border-top-width: 1px;
}

/* Individual step row */
.thinking-step {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 9px 14px;
  border-bottom: 1px solid #e8f2ff;
  transition: background 0.2s;
}
.thinking-step:last-child { border-bottom: none; }

/* Highlight the currently running step */
.step-active {
  background: #eff6ff;
}

.step-icon {
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 1px;
}

.step-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.step-name {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  color: #1e3a8a;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Arg pills row */
.step-args {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.step-arg-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 6px;
  background: #dbeafe;
  border: 1px solid #bfdbfe;
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  max-width: 100%;
  overflow: hidden;
}

.arg-key {
  color: #1e40af;
  font-weight: 600;
  flex-shrink: 0;
}

.arg-val {
  color: #374151;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Done / running status */
.step-done {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #34d399;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.step-running {
  display: flex;
  gap: 3px;
  align-items: center;
  margin-top: 2px;
}

.mini-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #2563EB;
  display: inline-block;
  animation: bounce-dot 0.7s infinite ease-in-out;
}

/* ════════════════════════════════════════════════ */

/* ── FOOTER ── */
.footer-bar {
  background: linear-gradient(to top, #F5F4EF 70%, transparent);
  padding-top: 24px;
}
.subject-tag {
  background: #1E3A8A; color: #93c5fd;
  border-radius: 8px; padding: 0 14px; height: 52px;
  align-items: center;
  font-family: 'DM Mono', monospace;
  font-size: 10px; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.1em;
  white-space: nowrap; flex-shrink: 0;
}
.query-input {
  height: 56px; padding: 0 22px;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px; font-weight: 500; color: #1e3a8a;
  background: white;
  border: 1.5px solid #bfdbfe; border-radius: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.query-input:focus { border-color: #2563EB; box-shadow: 0 0 0 4px rgba(37,99,235,0.1); }
.query-input::placeholder { color: #94a3b8; }
.query-input:disabled { background: #f1f5f9; cursor: not-allowed; }
.send-btn {
  height: 56px; padding: 0 28px;
  background: #FBBF24; color: #1e3a8a;
  font-family: 'Syne', sans-serif;
  font-weight: 800; font-size: 13px;
  text-transform: uppercase; letter-spacing: 0.1em;
  border: none; border-radius: 12px; cursor: pointer; flex-shrink: 0;
  transition: background 0.2s, transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 16px rgba(251,191,36,0.4);
}
.send-btn:hover:not(:disabled) { background: #fcd34d; transform: translateY(-2px); box-shadow: 0 6px 24px rgba(251,191,36,0.5); }
.send-btn:active:not(:disabled) { transform: translateY(0); box-shadow: none; }
.send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── EXPERT CONTENT ── */
.expert-content :deep(.katex) { font-size: 1.1em; }
.expert-content :deep(.katex-display-wrap) {
  margin: 1.5rem 0; padding: 1.25rem 1.75rem;
  background: #0c1445; border-radius: 10px;
  overflow-x: auto; border-left: 4px solid #FBBF24; display: block;
}
.expert-content :deep(.katex-display-wrap .katex),
.expert-content :deep(.katex-display-wrap .katex *),
.expert-content :deep(.katex-display-wrap .katex-html) { color: #dbeafe !important; }
.expert-content :deep(.katex-display) { margin: 0; overflow-x: auto; }
.expert-content :deep(.inline-math) { display: inline; vertical-align: middle; }
.expert-content :deep(.inline-math .katex) { color: #1e3a8a; font-size: 1.05em; }
.msg-user .expert-content :deep(.inline-math .katex) { color: #dbeafe; }
.msg-user .expert-content :deep(.katex-display-wrap) { background: rgba(255,255,255,0.06); }
.msg-user .expert-content :deep(.katex-display-wrap .katex),
.msg-user .expert-content :deep(.katex-display-wrap .katex *) { color: #dbeafe !important; }
.expert-content :deep(table) {
  width: 100%; border-collapse: collapse;
  margin: 1.5rem 0; border-radius: 10px;
  overflow: hidden; border: 1.5px solid #bfdbfe;
}
.expert-content :deep(th) {
  background: #1E3A8A; color: #dbeafe; padding: 10px 14px;
  font-family: 'Syne', sans-serif;
  font-weight: 800; font-size: 12px;
  text-transform: uppercase; letter-spacing: 0.08em;
}
.expert-content :deep(td) {
  border: 1px solid #dbeafe; padding: 10px 14px;
  font-family: 'DM Mono', monospace; font-size: 13px; text-align: center;
}
.expert-content :deep(tr:nth-child(even) td) { background: #f0f7ff; }
.expert-content :deep(p) { margin-bottom: 1.25rem; }
.expert-content :deep(strong) { color: #1d4ed8; font-weight: 800; }
.expert-content :deep(code) {
  font-family: 'DM Mono', monospace;
  background: #dbeafe; color: #1e3a8a;
  padding: 2px 6px; border-radius: 4px; font-size: 0.875em;
}
.expert-content :deep(.code-wrapper) { position: relative; margin: 1.5rem 0; }
.expert-content :deep(pre.code-block) {
  background: #0c1445; color: #bfdbfe; padding: 1.25rem;
  border-radius: 10px; overflow-x: auto; border-left: 4px solid #2563EB;
}
.expert-content :deep(.code-block-stream) {
  background: #0c1445; color: #bfdbfe; padding: 1.25rem;
  border-radius: 10px; white-space: pre-wrap;
}
.expert-content :deep(pre.code-block code) { background: transparent; color: #93c5fd; font-size: 0.9rem; }
.expert-content :deep(.copy-btn) {
  background: #fff; border: 1.5px solid #bfdbfe;
  padding: 5px 10px; font-weight: 700; cursor: pointer;
  border-radius: 8px; box-shadow: 2px 2px 0 #bfdbfe;
}
.expert-content :deep(.copy-btn:hover) { background: #FBBF24; border-color: #FBBF24; }
.expert-content :deep(blockquote) {
  border-left: 4px solid #FBBF24; background: #fffbeb;
  padding: 12px 20px; border-radius: 0 8px 8px 0;
  margin: 1.25rem 0; font-style: italic; color: #78350f;
}

/* ── SCROLLBAR ── */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #bfdbfe; border-radius: 100px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2563EB; }

/* ── TRANSITIONS ── */
.splash-fade-enter-active, .splash-fade-leave-active { transition: opacity 0.7s ease; }
.splash-fade-enter-from, .splash-fade-leave-to { opacity: 0; }
</style>