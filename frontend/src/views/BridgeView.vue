<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const topic = ref('')
const community = ref('')
const bridgeResponse = ref('')
const isStreaming = ref(false)
let socket = null

const connectWS = () => {
  socket = new WebSocket("ws://127.0.0.1:8000/ws/bridge")
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'content') { bridgeResponse.value += data.payload }
    if (data.payload === 'Done.') { isStreaming.value = false }
  }
}

const startBridge = () => {
  bridgeResponse.value = ''
  isStreaming.value = true
  socket.send(JSON.stringify({ topic: topic.value, community: community.value }))
}

onMounted(() => connectWS())
onUnmounted(() => { if (socket) socket.close() })
</script>

<template>
  <section class="mx-auto max-w-5xl h-[80vh] flex flex-col rounded-xl border border-blue-900 bg-white shadow-sm overflow-hidden">
    
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-blue-900/20 bg-blue-900 px-6 py-4">
      <div>
        <h2 class="text-lg font-semibold text-white">AI Bridge Agent</h2>
        <p class="text-xs text-blue-200">
          Community-aware learning assistant
        </p>
      </div>

      <span
        class="flex items-center gap-2 text-xs font-medium text-blue-100"
      >
        <span
          class="h-2 w-2 rounded-full"
          :class="isStreaming ? 'bg-green-400 animate-pulse' : 'bg-blue-300'"
        ></span>
        {{ isStreaming ? 'Thinking…' : 'Idle' }}
      </span>
    </div>

    <!-- Chat Window -->
    <div class="flex-1 overflow-y-auto bg-slate-50 px-6 py-6 space-y-6">
      
      <!-- Agent Message -->
      <div class="flex items-start gap-3">
        <div class="h-8 w-8 flex items-center justify-center rounded-full bg-blue-900 text-white text-xs font-bold">
          AI
        </div>
        <div class="max-w-[80%] rounded-lg bg-white border border-blue-900/10 p-4 text-sm text-slate-800 shadow-sm">
          <p class="font-medium text-blue-900 mb-1">AI Bridge</p>
          <p class="text-slate-600">
            Tell me what you want to learn and the community context.  
            I will generate localized, practical guidance.
          </p>
        </div>
      </div>

      <!-- Streaming / Response -->
      <div v-if="bridgeResponse" class="flex items-start gap-3">
        <div class="h-8 w-8 flex items-center justify-center rounded-full bg-blue-900 text-white text-xs font-bold">
          AI
        </div>
        <div class="max-w-[80%] rounded-lg bg-white border border-blue-900/10 p-4 text-sm text-slate-800 shadow-sm whitespace-pre-wrap leading-relaxed">
          {{ bridgeResponse }}
        </div>
      </div>

      <div
        v-if="isStreaming && !bridgeResponse"
        class="flex items-start gap-3"
      >
        <div class="h-8 w-8 flex items-center justify-center rounded-full bg-blue-900 text-white text-xs font-bold">
          AI
        </div>
        <div class="rounded-lg bg-white border border-blue-900/10 px-4 py-3 text-sm text-slate-500 animate-pulse">
          Generating guidance…
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="border-t border-blue-900/20 bg-white px-6 py-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <input
          v-model="topic"
          type="text"
          placeholder="Learning topic (e.g. Calculus – Limits)"
          class="rounded-md border border-blue-900/20 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/40"
        />
        <input
          v-model="community"
          type="text"
          placeholder="Community context (e.g. Bamenda students)"
          class="rounded-md border border-blue-900/20 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/40"
        />
      </div>

      <button
        @click="startBridge"
        class="w-full rounded-md bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
      >
        {{ isStreaming ? 'Agent Working…' : 'Send to AI Bridge' }}
      </button>
    </div>
  </section>
</template>
