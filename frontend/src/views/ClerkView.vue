<script setup>
import { ref } from 'vue'

const ocrResult = ref('')
const isLoading = ref(false)

const handleUpload = async (event) => {
  isLoading.ref = true
  const file = event.target.files[0]
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await fetch('http://127.0.0.1:8000/digitize-notes', { method: 'POST', body: formData })
    const data = await res.json()
    ocrResult.value = data.digitized_text
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-5xl px-6 py-12">
    <div class="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <!-- Header -->
      <div class="border-b border-neutral-200 px-6 py-5">
        <h2 class="text-xl font-semibold text-neutral-900">
          Digital Clerk
        </h2>
        <p class="mt-1 text-sm text-neutral-600">
          Upload handwritten notes or scanned images to convert them into clean, editable text.
        </p>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-8">
        <!-- Upload Area -->
        <label
          class="group flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 px-8 py-14 text-center transition hover:border-blue-600 hover:bg-blue-50"
        >
          <span class="text-lg font-semibold text-neutral-800">
            {{ isLoading ? 'Reading image…' : 'Upload handwritten notes' }}
          </span>
          <span class="mt-2 text-sm text-neutral-500">
            Click to select an image file
          </span>

          <div
            v-if="isLoading"
            class="mt-6 h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"
          ></div>

          <input type="file" @change="handleUpload" class="hidden" />
        </label>

        <!-- Result Area -->
        <div class="rounded-lg border border-neutral-200 bg-neutral-50 p-6 min-h-[320px] max-h-[420px] overflow-y-auto">
          <p v-if="ocrResult" class="whitespace-pre-wrap text-sm leading-relaxed text-neutral-800">
            {{ ocrResult }}
          </p>
          <p v-else class="text-sm italic text-neutral-400">
            Digitized text will appear here after uploading an image…
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
