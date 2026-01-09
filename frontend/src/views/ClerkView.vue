<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const ocrResult = ref('')
const isLoading = ref(false)
const processingStep = ref(0) // 0: Idle, 1: Extracting, 2: Refining, 3: Done

const steps = [
  { id: 1, label: 'OCR Extraction' },
  { id: 2, label: 'AI Refinement' },
  { id: 3, label: 'Finalizing' }
]

const handleUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.error("Please upload a valid image file (PNG/JPG)")
    return
  }

  isLoading.value = true
  processingStep.value = 1
  ocrResult.value = ''
  
  const formData = new FormData()
  formData.append('file', file)
  formData.append('output_format', 'json')

  try {
    const res = await fetch('http://127.0.0.1:8000/digitize-notes', { 
      method: 'POST', 
      body: formData 
    })
    
    if (!res.ok) throw new Error("Backend error")

    processingStep.value = 2
    const data = await res.json()
    
    processingStep.value = 3
    ocrResult.value = data.digitized_text
    toast.success("Notes digitized successfully!")
  } catch (err) {
    toast.error("Failed to read notes. Please try again.")
    console.error(err)
  } finally {
    isLoading.value = false
    setTimeout(() => { if (!isLoading.value) processingStep.value = 0 }, 2000)
  }
}

const downloadFile = async (format) => {
  const toastId = toast.info(`Generating ${format.toUpperCase()}...`, { timeout: false })
  
  try {
    const response = await fetch(`http://127.0.0.1:8000/download-notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: ocrResult.value, format: format })
    })

    if (!response.ok) throw new Error("Download failed")

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
    toast.error("Could not generate file.")
  }
}
</script>

<template>
  <div class="clerk-container min-h-screen">
    <section class="mx-auto max-w-5xl px-6 py-12">
      <div class="rounded-xl border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div class="border-b-4 border-black px-6 py-5 flex justify-between items-center bg-yellow-400">
          <div>
            <h2 class="text-xl font-black uppercase tracking-tight text-black">Digital Clerk</h2>
            <p class="text-xs font-bold text-black opacity-80 uppercase">Handwriting to Digital Notes</p>
          </div>
          
          <div v-if="ocrResult" class="flex gap-2">
            <button @click="downloadFile('pdf')" class="px-4 py-2 bg-white border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all">
              PDF
            </button>
            <button @click="downloadFile('docx')" class="px-4 py-2 bg-blue-600 text-white border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all">
              DOCX
            </button>
          </div>
        </div>

        <div class="p-6 space-y-8">
          <div v-if="isLoading || processingStep > 0" class="flex items-center justify-around py-4 bg-slate-50 border-2 border-black rounded-lg">
             <div v-for="step in steps" :key="step.id" class="flex flex-col items-center gap-2">
                <div :class="['h-4 w-4 rounded-full border-2 border-black', processingStep >= step.id ? 'bg-green-400 animate-pulse' : 'bg-white']"></div>
                <span :class="['text-[10px] font-black uppercase', processingStep >= step.id ? 'text-black' : 'text-gray-400']">{{ step.label }}</span>
             </div>
          </div>

          <label :class="['group flex cursor-pointer flex-col items-center justify-center rounded-lg border-4 border-dashed p-10 text-center transition-all', 
                          isLoading ? 'border-blue-600 bg-blue-50' : 'border-black hover:bg-yellow-50']">
            <span class="text-lg font-black uppercase italic text-black">
              {{ isLoading ? 'AI is reading...' : 'Drop notes here' }}
            </span>
            <span class="mt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Click to browse images</span>
            <input type="file" @change="handleUpload" class="hidden" accept="image/*" />
          </label>

          <div class="rounded-lg border-4 border-black bg-white p-6 min-h-[300px] shadow-[inset_4px_4px_0px_rgba(0,0,0,0.1)]">
            <div v-if="ocrResult" class="relative">
              <span class="absolute -top-10 -left-2 bg-black text-white text-[10px] px-2 py-1 uppercase font-bold">Refined Result</span>
              <p class="whitespace-pre-wrap text-sm font-medium leading-relaxed text-black">{{ ocrResult }}</p>
            </div>
            <div v-else class="flex flex-col items-center justify-center h-full text-gray-400">
               <div class="w-12 h-12 mb-4 opacity-20 bg-black rounded-full"></div>
               <p class="text-xs font-bold uppercase tracking-widest italic text-center text-black opacity-40">Your digitized lesson will appear here after the AI finishes refinement.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.clerk-container {
  /* This points to public/Screenshot (757).png */
  background-image: url('/gridmiro.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}
</style>