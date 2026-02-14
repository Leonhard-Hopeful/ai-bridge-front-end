<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { marked } from 'marked'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import 'katex/dist/contrib/auto-render.min.js' 
import { useToast } from "vue-toastification"

const toast = useToast()

// UI State
const showSplash = ref(true)
const topic = ref('')
const community = ref('')
const chatHistory = ref([]) 
const currentInput = ref('')
const isStreaming = ref(false)
const isConnected = ref(false)
const hasStarted = ref(false)
const progress = ref(0)
const scrollContainer = ref(null)
const sessionId = ref('')
const isSpeaking = ref(false)

let socket = null

marked.setOptions({ 
  breaks: true, 
  gfm: true,
  headerIds: false,
  mangle: false,
  sanitize: false 
})

const renderMarkdownAndMath = (text) => {
  if (!text) return ''
  let cleanText = text.replace(/\\\\/g, '\\')
  
  const katexOptions = (isBlock) => ({
    displayMode: isBlock,
    throwOnError: false,
    output: 'htmlAndMathml', 
    trust: true
  })

  cleanText = cleanText.replace(/\$\$(.*?)\$\$/gs, (match, formula) => {
    try {
      return `<div class="math-block">${katex.renderToString(formula.trim(), katexOptions(true))}</div>`
    } catch (e) { return match }
  })

  cleanText = cleanText.replace(/\$([^\$]+)\$/g, (match, formula) => {
    try {
      return `<span class="inline-math">${katex.renderToString(formula.trim(), katexOptions(false))}</span>`
    } catch (e) { return match }
  })

  return marked.parse(cleanText)
}

const speak = (text) => {
  window.speechSynthesis.cancel() 
  const cleanText = text.replace(/<\/?[^>]+(>|$)/g, "").replace(/\$\$.*?\$\$/g, "").replace(/\$.*?\$/g, "")
  const utterance = new SpeechSynthesisUtterance(cleanText)
  utterance.onstart = () => isSpeaking.value = true
  utterance.onend = () => isSpeaking.value = false
  window.speechSynthesis.speak(utterance)
}

const stopSpeech = () => {
  window.speechSynthesis.cancel()
  isSpeaking.value = false
}

const connectWS = () => {
  socket = new WebSocket('ws://127.0.0.1:8000/ws/bridge')
  socket.onopen = () => { isConnected.value = true; toast.success("Bridge Online") }
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    const lastMsg = chatHistory.value[chatHistory.value.length - 1]
    if (data.type === 'content' && lastMsg && lastMsg.role === 'ai') {
      lastMsg.text += data.payload
      chatHistory.value = [...chatHistory.value]
    } 
    if (data.type === 'done') {
      isStreaming.value = false
      if (progress.value < 100) progress.value += 10
    }
    nextTick(scrollToBottom)
  }
  socket.onclose = () => { isConnected.value = false; setTimeout(connectWS, 4000) }
}

const dismissSplash = () => {
  showSplash.value = false
}

const startLesson = () => {
  if (!topic.value.trim() || !community.value.trim()) return
  hasStarted.value = true
  chatHistory.value = []
  progress.value = 5
  sessionId.value = `session_${Date.now()}`
  sendMessage(`I want to learn about ${topic.value}. Start lesson 1.`)
}

const sendMessage = (textOverride = null) => {
  const text = textOverride || currentInput.value.trim()
  if (!text || !isConnected.value) return
  if (!textOverride) chatHistory.value.push({ role: 'user', text, timestamp: new Date() })
  chatHistory.value.push({ role: 'ai', text: '', timestamp: new Date() })
  isStreaming.value = true
  socket.send(JSON.stringify({ message: text, topic: topic.value, community: community.value, session_id: sessionId.value }))
  currentInput.value = ''
  nextTick(scrollToBottom)
}

const scrollToBottom = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: scrollContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}

onMounted(() => connectWS())
</script>

<template>
  <div class="bridge-container h-[calc(100vh-80px)] w-full overflow-hidden bg-slate-50 relative flex flex-col font-sans">
    
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div class="shape shape-1">∫</div>
      <div class="shape shape-2">π</div>
      <div class="shape shape-3">∑</div>
      <div class="shape shape-4">Δ</div>
      <div class="shape shape-5">Ω</div>
    </div>

    <transition name="fade">
      <div v-if="showSplash" class="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6">
        <div class="max-w-2xl text-center space-y-8">
          <div class="inline-block bg-blue-600 text-white px-6 py-2 font-black text-4xl italic transform -skew-x-12 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            THE BRIDGE
          </div>
          <p class="text-white text-xl font-bold tracking-tight leading-relaxed">
            Welcome to the Socratic learning corridor. <br/>
            We don't just give answers. We build understanding through local context and rigorous inquiry.
          </p>
          <button @click="dismissSplash" class="bg-yellow-400 text-black px-12 py-4 font-black uppercase text-xl border-4 border-white hover:bg-white transition-colors">
            Cross The Bridge
          </button>
        </div>
      </div>
    </transition>

    <div v-if="!hasStarted && !showSplash" class="flex-1 flex items-center justify-center p-6 z-20">
      <div class="max-w-md w-full bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-xl relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
        <h2 class="text-3xl font-black mb-2 uppercase tracking-tighter italic">Join the Quarter</h2>
        <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Cameroon's AI Learning Lab</p>
        
        <div class="space-y-4">
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase">Learning Focus</label>
            <input v-model="topic" placeholder="e.g. Quantum Physics or History" class="w-full border-2 border-black p-4 font-bold outline-none focus:bg-yellow-50 rounded-lg transition-all" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase">Your Community</label>
            <input v-model="community" placeholder="e.g. Douala, Molyko, or Bastos" class="w-full border-2 border-black p-4 font-bold outline-none focus:bg-yellow-50 rounded-lg transition-all" />
          </div>
          <button @click="startLesson" class="w-full bg-blue-600 text-white font-black py-5 uppercase text-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all rounded-lg">
            Initialize Lesson
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="hasStarted" class="flex-1 flex flex-col min-h-0 relative z-10">
      <div class="w-full h-1.5 bg-gray-200 shrink-0">
        <div class="h-full bg-blue-600 transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.5)]" :style="{ width: progress + '%' }"></div>
      </div>

      <div ref="scrollContainer" class="flex-1 overflow-y-auto pt-6 pb-44 px-4 scroll-smooth">
        <div class="max-w-5xl mx-auto space-y-10">
          <div v-for="(msg, i) in chatHistory" :key="i" :class="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
            
            <div v-if="msg.role === 'ai'" class="w-full lg:max-w-8xl bg-white border-2 border-black p-6 md:p-10 relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl group">
              <div class="absolute -top-4 rounded-md left-6 bg-black text-white px-4 py-1 font-black italic text-xs uppercase tracking-widest">
                AI Tutor • {{ community }}
              </div>
              
              <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="isSpeaking ? stopSpeech() : speak(msg.text)" class="bg-blue-50 border-2 border-black p-2 hover:bg-yellow-300 transition-all rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {{ isSpeaking ? '⏹️' : '🔊' }}
                </button>
              </div>

              <div v-html="renderMarkdownAndMath(msg.text)" class="prose prose-blue max-w-none text-lg md:text-xl leading-relaxed markdown-content font-medium"></div>
              
              <div v-if="!msg.text" class="flex gap-2 p-4">
                <div class="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                <div class="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div class="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>

            <div v-else class="bg-yellow-300 border-2 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-bold text-xl italic max-w-[85%] md:max-w-2xl rounded-2xl">
              {{ msg.text }}
            </div>
          </div>
        </div>
      </div>

      <div class="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-8 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent">
        <div class="max-w-5xl mx-auto flex gap-4">
          <div class="flex-1 relative">
            <input 
              v-model="currentInput" 
              @keyup.enter="sendMessage()" 
              placeholder="Ask for an analogy or solve a problem..." 
              class="w-full border-4 border-black p-5 text-xl font-bold outline-none bg-white focus:shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] transition-all rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" 
              :disabled="isStreaming || !isConnected" 
            />
          </div>
          <button 
            @click="sendMessage()" 
            :disabled="isStreaming || !isConnected" 
            class="bg-blue-600 text-white px-8 md:px-16 font-black uppercase text-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-700 active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all rounded-2xl shrink-0"
          >
            {{ isStreaming ? '...' : 'SEND' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* BACKGROUND ANIMATION STYLES */
.shape {
  position: absolute;
  color: #cbd5e1;
  font-size: 5rem;
  font-weight: 900;
  opacity: 0.15;
  user-select: none;
  animation: float 20s infinite linear;
}

.shape-1 { top: 10%; left: 10%; animation-duration: 25s; }
.shape-2 { top: 60%; left: 15%; animation-duration: 30s; animation-direction: reverse; }
.shape-3 { top: 20%; left: 80%; animation-duration: 22s; }
.shape-4 { top: 70%; left: 85%; animation-duration: 28s; }
.shape-5 { top: 40%; left: 50%; animation-duration: 35s; }

@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-100px) rotate(180deg); }
  100% { transform: translateY(0) rotate(360deg); }
}

/* CONTENT STYLES */
.markdown-content :deep(.math-block) {
  margin: 2rem 0;
  padding: 2rem;
  background: #000;
  color: #fff;
  overflow-x: auto;
  font-size: 1.6rem;
  border-radius: 12px;
  box-shadow: 2px 2px 0px 0px #2563eb;
}

.markdown-content :deep(.katex-display) { margin: 0; }
.markdown-content :deep(p) { margin-bottom: 1.5rem; }
.markdown-content :deep(strong) { color: #2563eb; font-weight: 900; }

/* DOT PATTERN BACKGROUND */
.bridge-container {
  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
  background-size: 32px 32px;
}

/* TRANSITIONS */
.fade-enter-active, .fade-leave-active { transition: opacity 0.8s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #000; border-radius: 0; border: 2px solid #f8fafc; }
</style>