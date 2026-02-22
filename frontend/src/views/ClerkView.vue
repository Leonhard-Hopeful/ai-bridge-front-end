<template>
  <div class="clerk-container min-h-screen relative">

    <!-- ── Grid background ── -->
    <div class="absolute inset-0 grid-bg pointer-events-none z-0"></div>

    <!-- ── Floating glyphs ── -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div class="glyph glyph-1">✍</div>
      <div class="glyph glyph-2">∂</div>
      <div class="glyph glyph-3">≡</div>
      <div class="glyph glyph-4">§</div>
      <div class="glyph glyph-5">✦</div>
    </div>

    <!-- ══════════════════════════════ TIMER TOAST ══════════════════════════════ -->
    <Transition name="slide-fade">
      <div v-if="isLoading" class="fixed bottom-8 right-8 z-50 timer-toast">
        <span class="timer-label">Processing Time</span>
        <div class="timer-display">
          <span>{{ formattedTime.mm }}</span>
          <span class="timer-sep">:</span>
          <span>{{ formattedTime.ss }}</span>
          <span class="timer-ms">.{{ formattedTime.mmm }}</span>
        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════ MAIN CARD ══════════════════════════════ -->
    <section class="relative z-10 mx-auto max-w-5xl px-4 md:px-6 py-10">

      <div class="main-card">

        <!-- ── Card Header ── -->
        <div class="card-header">
          <div>
            <!-- <div class="flex items-center gap-3 mb-0.5">
              <div class="logo-mark">DC</div>
              <h2 class="card-title">Digital Clerk</h2>
            </div> -->
            <p class="card-subtitle">Handwriting → Digital Notes</p>
          </div>

          <!-- Download buttons — only when result exists -->
          <div v-if="ocrResult" class="flex gap-2">
            <button @click="downloadFile('pdf')" class="dl-btn dl-btn-light">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
              PDF
            </button>
            <button @click="downloadFile('docx')" class="dl-btn dl-btn-primary">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
              DOCX
            </button>
          </div>
        </div>

        <!-- ── Progress Steps ── -->
        <Transition name="steps-fade">
          <div v-if="isLoading || processingStep > 0" class="steps-bar">
            <div v-for="(step, idx) in steps" :key="step.id" class="step-item">
              <!-- connector line -->
              <div v-if="idx > 0" :class="['step-line', processingStep >= step.id ? 'step-line-active' : '']"></div>

              <div :class="['step-dot', processingStep >= step.id ? 'step-dot-active' : '']">
                <svg v-if="processingStep > step.id" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                <span v-else-if="processingStep === step.id" class="step-pulse"></span>
              </div>
              <span :class="['step-label', processingStep >= step.id ? 'step-label-active' : '']">{{ step.label }}</span>
            </div>
          </div>
        </Transition>

        <!-- ── Body: two-column on md+ ── -->
        <div class="card-body">
          <div class="grid md:grid-cols-2 gap-6">

            <!-- LEFT: Upload / Preview -->
            <div class="space-y-3">
              <div class="panel-label">
                <span class="panel-tag">◈ Source Image</span>
              </div>

              <!-- Image preview -->
              <div v-if="imagePreview" class="preview-wrap">
                <div class="preview-inner">
                  <img :src="imagePreview" class="h-full w-full object-contain" alt="Uploaded note" />

                  <!-- Scan overlay -->
                  <div v-if="isLoading" class="scan-overlay">
                    <div class="scan-line"></div>
                    <span class="scan-label">Scanning...</span>
                  </div>
                </div>

                <!-- Clear button -->
                <button
                  @click="clearImage"
                  :disabled="isLoading"
                  class="clear-btn"
                  title="Remove image"
                >✕</button>
              </div>

              <!-- Drop zone -->
              <label v-else :class="['dropzone', isLoading ? 'dropzone-loading' : 'dropzone-idle']">
                <div class="dropzone-icon">
                  <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" class="w-10 h-10 text-indigo-300">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                  </svg>
                </div>
                <span class="dropzone-title">Drop notes here</span>
                <span class="dropzone-hint">PNG, JPG, WEBP — click to browse</span>
                <input type="file" @change="handleUpload" class="hidden" accept="image/*" :disabled="isLoading" />
              </label>
            </div>

            <!-- RIGHT: Result -->
            <div class="space-y-3">
              <div class="panel-label">
                <span class="panel-tag">✦ Refined Result</span>
                <span v-if="ocrResult" class="result-chars">{{ ocrResult.length }} chars</span>
              </div>

              <div class="result-panel">
                <p v-if="ocrResult" class="result-text">{{ ocrResult }}</p>

                <div v-else class="result-empty">
                  <div class="result-empty-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" class="w-8 h-8 text-indigo-200">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                    </svg>
                  </div>
                  <p class="result-empty-text">Your digitized lesson will appear here after the AI finishes refinement.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const ocrResult = ref('')
const isLoading = ref(false)
const processingStep = ref(0)
const imagePreview = ref(null)

// ── Timer ──
const timeMS = ref(0)
let timerInterval = null

const formattedTime = computed(() => {
  const totalSeconds = Math.floor(timeMS.value / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const milliseconds = timeMS.value % 1000
  return {
    mm: String(minutes).padStart(2, '0'),
    ss: String(seconds).padStart(2, '0'),
    mmm: String(milliseconds).padStart(3, '0')
  }
})

const startTimer = () => {
  timeMS.value = 0
  const startTime = Date.now()
  timerInterval = setInterval(() => { timeMS.value = Date.now() - startTime }, 10)
}

const stopTimer = () => {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null }
}

onUnmounted(() => stopTimer())

const steps = [
  { id: 1, label: 'OCR Extraction' },
  { id: 2, label: 'AI Refinement' },
  { id: 3, label: 'Finalizing' }
]

const clearImage = () => {
  if (isLoading.value) return
  imagePreview.value = null
  ocrResult.value = ''
  processingStep.value = 0
}

const handleUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.error('Please upload a valid image file (PNG/JPG)')
    return
  }

  imagePreview.value = URL.createObjectURL(file)
  isLoading.value = true
  processingStep.value = 1
  ocrResult.value = ''
  startTimer()

  const formData = new FormData()
  formData.append('file', file)
  formData.append('output_format', 'json')

  try {
    const res = await fetch('http://127.0.0.1:8000/digitize-notes', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Backend error')
    processingStep.value = 2
    const data = await res.json()
    processingStep.value = 3
    ocrResult.value = data.digitized_text
    toast.success('Notes digitized successfully!')
  } catch (err) {
    toast.error('Failed to read notes. Please try again.')
    console.error(err)
  } finally {
    isLoading.value = false
    stopTimer()
    setTimeout(() => { if (!isLoading.value) processingStep.value = 0 }, 2000)
  }
}

const downloadFile = async (format) => {
  const toastId = toast.info(`Generating ${format.toUpperCase()}...`, { timeout: false })
  try {
    const response = await fetch('http://127.0.0.1:8000/download-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: ocrResult.value, format })
    })
    if (!response.ok) throw new Error('Download failed')
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Digitized_Notes.${format}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    toast.dismiss(toastId)
    toast.success(`${format.toUpperCase()} downloaded!`)
  } catch (err) {
    toast.dismiss(toastId)
    toast.error('Could not generate file.')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Mono:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700&display=swap');

/* ── ROOT ── */
.clerk-container {
  font-family: 'DM Sans', sans-serif;
  background-color: #F5F4EF;
}

/* ── GRID ── */
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
  opacity: 0.04;
  user-select: none;
  animation: glyph-drift 28s infinite ease-in-out;
}
.glyph-1 { top: 6%;  left: 3%;  }
.glyph-2 { top: 55%; left: 7%;  animation-delay: -8s;  animation-direction: reverse; }
.glyph-3 { top: 10%; left: 70%; animation-delay: -14s; }
.glyph-4 { top: 70%; left: 80%; animation-delay: -4s;  }
.glyph-5 { top: 35%; left: 45%; animation-delay: -20s; animation-duration: 36s; }

@keyframes glyph-drift {
  0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
  50%       { transform: translateY(-50px) rotate(12deg) scale(1.04); }
}

/* ── TIMER TOAST ── */
.timer-toast {
  background: #1E1B4B;
  border: 1.5px solid #312e81;
  border-radius: 14px;
  padding: 14px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 150px;
  box-shadow: 0 8px 32px rgba(30,27,75,0.3);
}
.timer-label {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #a5b4fc;
  margin-bottom: 6px;
}
.timer-display {
  font-family: 'DM Mono', monospace;
  font-size: 1.6rem;
  font-weight: 500;
  color: #FBBF24;
  letter-spacing: -0.02em;
  line-height: 1;
}
.timer-sep { color: #a5b4fc; margin: 0 1px; }
.timer-ms  { font-size: 0.85rem; color: #a5b4fc; opacity: 0.8; }

/* ── MAIN CARD ── */
.main-card {
  background: #FFFFFF;
  border: 1.5px solid #e0e7ff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(30,27,75,0.08);
}

/* ── CARD HEADER ── */
.card-header {
  background: #07070a;
  padding: 20px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1.5px solid #312e81;
}

.logo-mark {
  width: 36px; height: 36px;
  background: #4338CA;
  display: flex; align-items: center; justify-content: center;
  border-radius: 8px;
  font-family: 'Syne', sans-serif;
  font-weight: 900; font-size: 13px;
  letter-spacing: -0.03em; color: #fff;
  flex-shrink: 0;
}

.card-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.1rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  line-height: 1;
}

.card-subtitle {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #a5b4fc;
  margin-top: 5px;
}

/* ── DOWNLOAD BUTTONS ── */
.dl-btn {
  display: flex; align-items: center; 
  gap: 6px;
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}
.dl-btn:active { transform: translateY(1px); box-shadow: none !important; }

.dl-btn-light {
  background: rgba(255,255,255,0.1);
  color: #e0e7ff;
  border: 1px solid rgba(255,255,255,0.2);
}
.dl-btn-light:hover { background: rgba(255,255,255,0.18); }

.dl-btn-primary {
  background: #FBBF24;
  color: #1E1B4B;
  box-shadow: 0 3px 12px rgba(251,191,36,0.35);
}
.dl-btn-primary:hover { background: #fcd34d; box-shadow: 0 5px 20px rgba(251,191,36,0.45); }

/* ── PROGRESS STEPS ── */
.steps-bar {
  background: #F5F4EF;
  border-bottom: 1.5px solid #e0e7ff;
  padding: 16px 28px;
  display: flex;
  align-items: center;
  gap: 0;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: relative;
  flex: 1;
}

.step-line {
  position: absolute;
  top: 10px;
  right: 50%;
  left: -50%;
  height: 2px;
  background: #e0e7ff;
  transition: background 0.4s;
  z-index: 0;
}
.step-line-active { background: #4338CA; }

.step-dot {
  width: 20px; height: 20px;
  border-radius: 50%;
  border: 2px solid #e0e7ff;
  background: #fff;
  display: flex; align-items: center; justify-content: center;
  position: relative; z-index: 1;
  transition: all 0.3s;
  flex-shrink: 0;
}
.step-dot-active {
  background: #4338CA;
  border-color: #4338CA;
  box-shadow: 0 0 0 4px rgba(67,56,202,0.15);
  color: #fff;
}

.step-pulse {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #FBBF24;
  animation: pulse-step 1s infinite;
  display: block;
}

@keyframes pulse-step {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.7; }
}

.step-label {
  font-family: 'DM Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #94a3b8;
  white-space: nowrap;
  transition: color 0.3s;
}
.step-label-active { color: #4338CA; font-weight: 600; }

/* ── CARD BODY ── */
.card-body { padding: 28px; }

/* ── PANEL LABELS ── */
.panel-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.panel-tag {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #4338CA;
  font-weight: 600;
}

.result-chars {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ── IMAGE PREVIEW ── */
.preview-wrap {
  position: relative;
  border: 1.5px solid #e0e7ff;
  border-radius: 14px;
  background: #fff;
  padding: 8px;
  box-shadow: 0 4px 16px rgba(30,27,75,0.06);
}

.preview-inner {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: #f8f9ff;
  height: 260px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid #e0e7ff;
}

/* ── SCAN OVERLAY ── */
.scan-overlay {
  position: absolute; inset: 0;
  background: rgba(30,27,75,0.25);
  backdrop-filter: blur(2px);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  z-index: 10;
}

.scan-line {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: #FBBF24;
  box-shadow: 0 0 16px 4px rgba(251,191,36,0.7);
  animation: scan 2s ease-in-out infinite;
}

.scan-label {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #fff;
  background: rgba(30,27,75,0.7);
  padding: 5px 14px;
  border-radius: 100px;
  animation: pulse-label 1.2s ease-in-out infinite;
}

@keyframes scan {
  0%   { top: 0%;   opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

@keyframes pulse-label {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}

/* ── CLEAR BUTTON ── */
.clear-btn {
  position: absolute;
  top: -10px; right: -10px;
  width: 28px; height: 28px;
  background: #ef4444;
  border: 1.5px solid #fff;
  border-radius: 50%;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 2px 8px rgba(239,68,68,0.4);
  transition: transform 0.15s, box-shadow 0.15s;
}
.clear-btn:hover  { transform: scale(1.1); }
.clear-btn:active { transform: scale(0.95); }
.clear-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── DROP ZONE ── */
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 260px;
  border-radius: 14px;
  border: 2px dashed;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  padding: 24px;
  gap: 10px;
}
.dropzone-idle {
  border-color: #c7d2fe;
  background: #fafafe;
}
.dropzone-idle:hover {
  border-color: #4338CA;
  background: #f0f2ff;
}
.dropzone-loading {
  border-color: #4338CA;
  background: #f0f2ff;
  cursor: not-allowed;
  opacity: 0.7;
}

.dropzone-icon {
  width: 56px; height: 56px;
  background: #f0f2ff;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  border: 1.5px solid #c7d2fe;
}

.dropzone-title {
  font-family: 'Syne', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  color: #1E1B4B;
  text-transform: uppercase;
  letter-spacing: -0.01em;
}

.dropzone-hint {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ── RESULT PANEL ── */
.result-panel {
  height: 260px;
  border: 1.5px solid #e0e7ff;
  border-radius: 14px;
  background: #fafafe;
  padding: 20px;
  overflow-y: auto;
  box-shadow: inset 0 2px 8px rgba(30,27,75,0.04);
}

.result-text {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  line-height: 1.75;
  color: #1E1B4B;
  white-space: pre-wrap;
}

.result-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
}

.result-empty-icon {
  width: 52px; height: 52px;
  background: #f0f2ff;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  border: 1.5px solid #e0e7ff;
}

.result-empty-text {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
  max-width: 220px;
  line-height: 1.7;
}

/* ── RESULT SCROLLBAR ── */
.result-panel::-webkit-scrollbar { width: 5px; }
.result-panel::-webkit-scrollbar-track { background: transparent; }
.result-panel::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 100px; }
.result-panel::-webkit-scrollbar-thumb:hover { background: #4338CA; }

/* ── TRANSITIONS ── */
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-fade-enter-from,
.slide-fade-leave-to { transform: translateX(20px); opacity: 0; }

.steps-fade-enter-active { transition: all 0.35s ease-out; }
.steps-fade-leave-active { transition: all 0.2s ease-in; }
.steps-fade-enter-from,
.steps-fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>