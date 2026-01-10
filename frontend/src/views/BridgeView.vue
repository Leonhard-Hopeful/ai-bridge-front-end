<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { marked } from 'marked'
import katex from 'katex'
import 'katex/dist/katex.min.css'

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

// --- ENHANCED MARKDOWN & LATEX RENDERING ---
marked.setOptions({ breaks: true, gfm: true })

const renderMarkdownAndMath = (text) => {
  if (!text) return ''
  
  // STEP 1: Fix common AI double-escape issues
  // This turns \\frac into \frac so KaTeX can read it
  let cleanText = text.replace(/\\\\/g, '\\')

  // STEP 2: Render Display Math Blocks: $$ formula $$
  cleanText = cleanText.replace(/\$\$(.*?)\$\$/gs, (match, formula) => {
    try {
      return `<div class="math-block">${katex.renderToString(formula.trim(), { 
        displayMode: true, 
        throwOnError: false 
      })}</div>`
    } catch (e) { return match }
  })

  // STEP 3: Render Inline Math: $ formula $
  // We use a more careful regex to avoid catching regular dollar signs
  cleanText = cleanText.replace(/\$([^\$]+)\$/g, (match, formula) => {
    try {
      return katex.renderToString(formula.trim(), { 
        displayMode: false, 
        throwOnError: false 
      })
    } catch (e) { return match }
  })

  // STEP 4: Final Markdown pass
  return marked.parse(cleanText)
}

// --- VOICE (TEXT TO SPEECH) ---
const speak = (text) => {
  window.speechSynthesis.cancel() 
  const cleanText = text.replace(/<\/?[^>]+(>|$)/g, "")
  const utterance = new SpeechSynthesisUtterance(cleanText)
  utterance.onstart = () => isSpeaking.value = true
  utterance.onend = () => isSpeaking.value = false
  const voices = window.speechSynthesis.getVoices()
  utterance.voice = voices.find(v => v.lang.includes('en')) || voices[0]
  window.speechSynthesis.speak(utterance)
}

const stopSpeech = () => {
  window.speechSynthesis.cancel()
  isSpeaking.value = false
}

// --- WEBSOCKET LOGIC ---
const connectWS = () => {
  socket = new WebSocket('ws://127.0.0.1:8000/ws/bridge')
  socket.onopen = () => isConnected.value = true
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    const lastMsg = chatHistory.value[chatHistory.value.length - 1]

    if (data.type === 'content' && lastMsg && lastMsg.role === 'ai') {
      lastMsg.text += data.payload
      chatHistory.value = [...chatHistory.value]
    } 
    
    if (data.type === 'done') {
      isStreaming.value = false
      if (progress.value < 100) progress.value += 15
    }
    nextTick(scrollToBottom)
  }
  socket.onclose = () => {
    isConnected.value = false
    setTimeout(connectWS, 3000)
  }
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
  socket.send(JSON.stringify({ 
    message: text, topic: topic.value, community: community.value, session_id: sessionId.value 
  }))
  currentInput.value = ''
  nextTick(scrollToBottom)
}

const scrollToBottom = () => {
  if (scrollContainer.value) scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
}

onMounted(() => {
  connectWS()
  window.speechSynthesis.getVoices() 
})
</script>
<template>
  <main id="bg" class="h-screen bg-slate-50 text-black flex flex-col overflow-hidden font-sans">
    
    <div v-if="hasStarted" class="w-full h-2 bg-gray-200 relative">
      <div class="h-full bg-blue-600 transition-all duration-700" :style="{ width: progress + '%' }"></div>
    </div>

    <div v-if="!hasStarted" class="flex-1 flex items-center justify-center p-6">
      <div class="max-w-md w-full bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 class="text-2xl font-black mb-6 uppercase tracking-tight">🇨🇲 AI Bridge Tutor</h1>
        <div class="space-y-4">
          <input v-model="topic" placeholder="What do you want to learn?" class="w-full border-2 border-black p-3 outline-none focus:bg-yellow-50" />
          <input v-model="community" placeholder="Your town (e.g. Douala)" class="w-full border-2 border-black p-3 outline-none focus:bg-yellow-50" />
          <button @click="startLesson" class="w-full bg-blue-600 text-white font-bold py-3 uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1">
            Start Learning
          </button>
        </div>
      </div>
    </div>

    <div v-else ref="scrollContainer" class="flex-1 overflow-y-auto p-4 md:px-20 space-y-6 bg-white">
      <div v-for="(msg, i) in chatHistory" :key="i" class="max-w-2xl mx-auto">
        <div v-if="msg.role === 'ai'" class="bg-blue-50 border-2 border-black p-5 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          
          <div class="absolute top-2 right-2 flex gap-2">
             <button @click="isSpeaking ? stopSpeech() : speak(msg.text)" 
                     class="p-2 hover:bg-blue-100 rounded-full transition-colors"
                     title="Read Aloud">
                <span v-if="isSpeaking && i === chatHistory.length - 1">⏹️</span>
                <span v-else>🔊</span>
             </button>
          </div>

          <span class="text-[10px] font-black text-blue-600 uppercase mb-2 block tracking-widest">AI Tutor</span>
          
          <div v-if="msg.text" 
               v-html="renderMarkdownAndMath(msg.text)" 
               class="prose prose-blue max-w-none text-sm leading-relaxed markdown-content">
          </div>

          <div v-else-if="isStreaming && i === chatHistory.length - 1" class="flex gap-1 py-2">
              <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        </div>

        <div v-else class="flex justify-end">
          <div class="bg-yellow-300 border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm max-w-[80%] font-bold">
            {{ msg.text }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasStarted" class="p-4 bg-gray-50 border-t-4 border-black">
      <div class="max-w-2xl mx-auto flex gap-2">
        <input 
          v-model="currentInput" 
          @keyup.enter="sendMessage()" 
          placeholder="Reply to the tutor..." 
          class="flex-1 border-2 border-black p-3 outline-none focus:bg-white"
          :disabled="isStreaming"
        />
        <button @click="sendMessage()" :disabled="isStreaming" class="bg-blue-600 text-white px-6 font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {{ isStreaming ? '...' : 'Send' }}
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.markdown-content :deep(p) { margin-bottom: 1rem; }
.markdown-content :deep(strong) { color: #1e3a8a; font-weight: 800; }
.markdown-content :deep(.math-block) {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
  overflow-x: auto;
}
.markdown-content :deep(ul) { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }

/* Neobrutalist custom scrollbar */
.overflow-y-auto::-webkit-scrollbar { width: 10px; }
.overflow-y-auto::-webkit-scrollbar-track { background: #fff; border-left: 2px solid #000; }
.overflow-y-auto::-webkit-scrollbar-thumb { background: #000; }


#bg {
  /* This points to public/Screenshot (757).png */
  background-image: url('/gridr.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}
</style>