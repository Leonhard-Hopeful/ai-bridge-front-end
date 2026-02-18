<template>
  <div class="bridge-container h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-50 relative flex flex-col font-sans">
    
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div class="shape shape-1">∫</div>
      <div class="shape shape-2">π</div>
      <div class="shape shape-3">∑</div>
      <div class="shape shape-4">Δ</div>
      <div class="shape shape-5">Ω</div>
    </div>

    <transition name="fade">
      <div v-if="showSplash" class="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
        <canvas ref="threeCanvas" class="absolute inset-0 z-0"></canvas>
        <div class="max-w-2xl text-center space-y-8 z-10 relative">
          <div class="inline-block bg-indigo-600 text-white px-6 py-2 font-black text-4xl italic transform -skew-x-12 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] uppercase">
            Expert Bridge
          </div>
          <p class="text-white text-xl font-bold tracking-tight leading-relaxed drop-shadow-lg">
            Welcome to the rigorous retrieval corridor. <br />
            Accessing strict syllabus notes for Discrete Maths, OR, and Stochastic Processes.
          </p>
          <button @click="dismissSplash" class="bg-yellow-400 text-black px-12 py-4 font-black uppercase text-xl border-4 border-white hover:bg-white transition-colors shadow-2xl">
            Initialize Connection
          </button>
        </div>
      </div>
    </transition>

    <header class="relative z-30 bg-indigo-700 text-white p-4 border-b-4 border-black flex justify-between items-center shadow-[0_4px_0_0_rgba(0,0,0,1)]">
      <div>
        <h1 class="text-xl font-black italic tracking-tighter uppercase">Expert Bridge 🎓</h1>
        <p class="text-[10px] font-bold uppercase text-indigo-200">
          {{ isSocketReady ? 'Bridge Online • Ready for Query' : 'Connecting to Retrieval Lab...' }}
        </p>
      </div>
      
      <select v-model="selectedSubject" class="bg-black border-2 border-white text-white text-xs font-bold p-2 outline-none cursor-pointer hover:bg-indigo-900 transition-colors">
        <option value="Discrete Mathematics">Discrete Mathematics</option>
        <option value="Operations Research">Operations Research</option>
        <option value="Stochastic Processes">Stochastic Processes</option>
      </select>
    </header>

    <main ref="chatContainer" class="flex-1 overflow-y-auto p-4 md:p-8 space-y-10 z-10 scroll-smooth custom-scrollbar pb-40">
      <div v-for="(msg, index) in messages" :key="index" 
           :class="['max-w-[95%] md:max-w-5xl p-6 md:p-10 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl relative transition-all', 
                    msg.role === 'user' ? 'bg-indigo-50 ml-auto' : 'bg-white mr-auto']">
        
        <div class="absolute -top-4 left-6 bg-black text-white px-4 py-1 font-black italic text-xs uppercase tracking-widest rounded-md">
          {{ msg.role === 'user' ? 'Question' : 'Teacher\'s Notes' }}
        </div>

        <div v-if="msg.role === 'assistant' && !msg.content" class="flex gap-2 p-4">
          <div class="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
          <div class="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div class="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>

        <div class="prose prose-indigo max-w-none text-lg leading-relaxed expert-content font-medium" 
             v-html="renderMarkdownAndMath(msg.content)"></div>
      </div>
    </main>

    <footer class="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-8 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent">
      <div class="max-w-5xl mx-auto flex gap-4">
        <div class="flex-1 relative">
          <input 
            v-model="userInput" 
            @keyup.enter="sendMessage" 
            :placeholder="isSocketReady ? 'Ask about Simplex, Logic, or Markov Chains...' : 'Establishing Bridge...'" 
            class="w-full border-4 border-black p-5 text-xl font-bold outline-none bg-white focus:shadow-[8px_8px_0px_0px_rgba(79,70,229,1)] transition-all rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            :disabled="isTyping || !isSocketReady"
          />
        </div>
        <button 
          @click="sendMessage" 
          :disabled="isTyping || !isSocketReady"
          class="bg-yellow-400 text-black px-8 md:px-16 font-black uppercase text-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-white active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all rounded-2xl shrink-0 disabled:grayscale disabled:opacity-50"
        >
          {{ isTyping ? "..." : "QUERY" }}
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";
import MarkdownIt from 'markdown-it';
import markdownItKatex from 'markdown-it-katex';
import 'katex/dist/katex.min.css';
import * as THREE from "three";

// 1. Markdown/Math Setup
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
}).use(markdownItKatex);

const renderMarkdownAndMath = (text) => {
  if (!text) return "";
  try {
    return md.render(text);
  } catch (e) {
    return text;
  }
};

// 2. UI State
const showSplash = ref(true);
const selectedSubject = ref('Discrete Mathematics');
const userInput = ref('');
const messages = ref([]);
const isTyping = ref(false);
const isSocketReady = ref(false);
const chatContainer = ref(null);
const threeCanvas = ref(null);
let socket = null;

// 3. Three.js Background Logic
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
  particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x4f46e5, size: 0.15, transparent: true, opacity: 0.8 }));
  scene.add(particles);

  const lineMat = new THREE.LineBasicMaterial({ color: 0x4f46e5, transparent: true, opacity: 0.2 });
  linesMesh = new THREE.LineSegments(new THREE.BufferGeometry(), lineMat);
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

// 4. WebSocket Logic
const connectWebSocket = () => {
  socket = new WebSocket('ws://localhost:8000/ws/expert');
  socket.onopen = () => { isSocketReady.value = true; };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'content') {
      const lastMsg = messages.value[messages.value.length - 1];
      if (lastMsg && lastMsg.role === 'assistant') {
        lastMsg.content += data.payload;
      }
      scrollToBottom();
    } else if (data.type === 'done') {
      isTyping.value = false;
    }
  };
  socket.onclose = () => {
    isSocketReady.value = false;
    setTimeout(connectWebSocket, 3000);
  };
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
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const dismissSplash = () => { showSplash.value = false; };

onMounted(() => {
  initThree();
  connectWebSocket();
});

onBeforeUnmount(() => {
  if (socket) socket.close();
});
</script>

<style scoped>
@reference "tailwindcss";

.bridge-container {
  background-image: radial-gradient(#cbd5e1 2px, transparent 2px);
  background-size: 40px 40px;
}

/* FLOATING SHAPES */
.shape { position: absolute; color: #6366f1; font-size: 6rem; font-weight: 900; opacity: 0.1; user-select: none; animation: float 25s infinite linear; z-index: 0; }
.shape-1 { top: 10%; left: 5%; }
.shape-2 { top: 65%; left: 10%; animation-direction: reverse; }
.shape-3 { top: 15%; left: 75%; }
.shape-4 { top: 75%; left: 80%; }
.shape-5 { top: 40%; left: 45%; animation-duration: 35s; }

@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-60px) rotate(180deg); }
  100% { transform: translateY(0) rotate(360deg); }
}

/* EXPERT RAG CONTENT STYLING */
.expert-content :deep(.math-block), .expert-content :deep(.katex-display) {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: #000;
  color: #fff;
  border-radius: 12px;
  overflow-x: auto;
  box-shadow: 4px 4px 0px 0px #4f46e5;
}

.expert-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  background: white;
  border: 4px solid black;
  box-shadow: 6px 6px 0px 0px rgba(0,0,0,1);
}

.expert-content :deep(th) {
  background: #e0e7ff;
  border: 2px solid black;
  padding: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
}

.expert-content :deep(td) {
  border: 2px solid black;
  padding: 0.75rem;
  text-align: center;
  font-family: monospace;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.6s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.custom-scrollbar::-webkit-scrollbar { width: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #000; border: 2px solid #f8fafc; }
</style>