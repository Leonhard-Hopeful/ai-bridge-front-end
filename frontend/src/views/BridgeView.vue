<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { marked } from 'marked'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import 'katex/dist/contrib/auto-render.min.js' 
import { useToast } from "vue-toastification"

const toast = useToast()
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
  
  // 1. Pre-process: Fix double backslashes for matrices
  let cleanText = text.replace(/\\\\/g, '\\')
  
  const katexOptions = (isBlock) => ({
    displayMode: isBlock,
    throwOnError: false,
    output: 'htmlAndMathml', 
    trust: true
  })

  // 2. Handle Math Blocks ($$ ... $$)
  cleanText = cleanText.replace(/\$\$(.*?)\$\$/gs, (match, formula) => {
    try {
      return `<div class="math-block">${katex.renderToString(formula.trim(), katexOptions(true))}</div>`
    } catch (e) { return match }
  })

  // 3. Handle Inline Math ($ ... $)
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
  if (scrollContainer.value) scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
}

onMounted(() => connectWS())
</script>

<template>
  <main id="bg" class="h-screen w-screen bg-slate-50 text-black flex flex-col overflow-hidden font-sans relative">
    
    <header class="bg-white border-b-2 border-black p-4 flex justify-between items-center z-30 shrink-0">
      <h1 class="font-black uppercase text-xl tracking-tighter italic flex items-center gap-2">
        <span class="bg-blue-600 text-white px-2 py-0.5 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">CB</span>
        Learning Bridge
      </h1>
      <div class="flex items-center gap-3">
        <div :class="isConnected ? 'bg-green-500' : 'bg-red-500'" class="w-3 h-3 rounded-full border border-black animate-pulse"></div>
        <span class="text-[10px] font-black uppercase tracking-widest hidden sm:block">{{ isConnected ? 'Live' : 'Offline' }}</span>
      </div>
    </header>

    <div v-if="!hasStarted" class="flex-1 flex items-center justify-center p-6 z-20">
      <div class="max-w-md w-full bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl">
        <h2 class="text-2xl font-black mb-6 uppercase tracking-tighter italic">Join the Quarter</h2>
        <div class="space-y-4">
          <input v-model="topic" placeholder="What are we learning?" class="w-full border-2 border-black p-4 font-bold outline-none focus:bg-yellow-50 rounded-lg transition-all" />
          <input v-model="community" placeholder="Your City (e.g. Douala)" class="w-full border-2 border-black p-4 font-bold outline-none focus:bg-yellow-50 rounded-lg transition-all" />
          <button @click="startLesson" class="w-full bg-blue-600 text-white font-black py-4 uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all rounded-lg">
            Start Lesson
          </button>
        </div>
      </div>
    </div>

    <div v-else class="flex-1 flex flex-col min-h-0 relative">
      <div class="w-full h-1 bg-gray-100 z-10 shrink-0">
        <div class="h-full bg-blue-600 transition-all duration-700" :style="{ width: progress + '%' }"></div>
      </div>

      <div ref="scrollContainer" class="flex-1 overflow-y-auto bg-transparent pb-32 pt-6">
        <div class="max-w-5xl mx-auto p-4 md:p-6 space-y-8">
          <div v-for="(msg, i) in chatHistory" :key="i" :class="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
            
            <div v-if="msg.role === 'ai'" class="w-full lg:max-w-4xl bg-white border-2 border-black p-6 md:p-8 relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-xl">
              <div class="absolute top-4 right-4 flex gap-2">
                <button @click="isSpeaking ? stopSpeech() : speak(msg.text)" class="bg-blue-50 border-2 border-black p-2 hover:bg-yellow-300 transition-all rounded-lg">
                  {{ isSpeaking ? '⏹️' : '🔊' }}
                </button>
              </div>
              <p class="text-[9px] font-black text-blue-600 uppercase mb-3 tracking-[0.2em]">Tutor</p>
              <div v-html="renderMarkdownAndMath(msg.text)" class="prose prose-blue max-w-none text-base md:text-lg leading-relaxed markdown-content"></div>
              
              <div v-if="!msg.text" class="flex gap-1.5 p-2">
                <div class="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce"></div>
                <div class="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              </div>
            </div>

            <div v-else class="bg-yellow-300 border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-lg italic max-w-[85%] md:max-w-xl rounded-xl">
              {{ msg.text }}
            </div>
          </div>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pointer-events-none z-40">
        <div class="max-w-4xl mx-auto flex gap-3 pointer-events-auto">
          <div class="flex-1 relative">
            <input 
              v-model="currentInput" 
              @keyup.enter="sendMessage()" 
              placeholder="Ask the tutor anything..." 
              class="w-full border-2 border-black p-4 text-lg font-bold outline-none bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
              :disabled="isStreaming || !isConnected" 
            />
          </div>
          <button 
            @click="sendMessage()" 
            :disabled="isStreaming || !isConnected" 
            class="bg-blue-600 text-white px-6 md:px-10 font-black uppercase text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all rounded-xl"
          >
            {{ isStreaming ? '...' : 'SEND' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.markdown-content :deep(.math-block) {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: #fdfdfd;
  border: 2px solid #000;
  overflow-x: auto;
  font-size: 1.4rem;
  border-radius: 8px;
}

.markdown-content :deep(.katex-display) {
  line-height: 1.4;
  margin: 0;
}

#bg {
  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
  background-size: 24px 24px;
}

.markdown-content :deep(p) { margin-bottom: 1.2rem; }
.markdown-content :deep(strong) { color: #1e3a8a; font-weight: 800; }

@media (min-width: 1024px) {
  .markdown-content { font-size: 1.15rem; }
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>