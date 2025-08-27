<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Loading state -->
    <div v-if="!note && !notFound" class="animate-pulse">
      <div class="h-8 bg-gray-200 rounded-md w-1/2 mb-4"></div>
      <div class="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
      <div class="h-4 bg-gray-200 rounded-md w-3/4"></div>
    </div>

    <!-- Note not found -->
    <div v-else-if="notFound" class="text-center py-12">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Note Not Found
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        The note with ID {{ $route.params.id }} doesn't exist.
      </p>
      <RouterLink 
        to="/" 
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        Back to Notes
      </RouterLink>
    </div>

    <!-- Note content -->
    <div v-else class="space-y-6">
      <!-- Header -->
      <header class="border-b border-gray-200 dark:border-gray-700 pb-6">
        <div class="flex items-center gap-3 mb-2">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ note.title }}
          </h1>
          
          <!-- Badge -->
          <span v-if="note.badge" :class="badgeClasses">
            {{ note.badge }}
          </span>
        </div>
        
        <p class="text-gray-600 dark:text-gray-400">
          Note ID: {{ note.id }}
        </p>
      </header>

      <!-- Content -->
      <main class="prose prose-gray dark:prose-invert max-w-none">
        <div class="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
          {{ note.content }}
        </div>
      </main>

      <!-- Actions -->
      <footer class="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <RouterLink 
          to="/" 
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
        >
          Back to Notes
        </RouterLink>
        <button 
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          @click="editNote"
        >
          Edit Note
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNotesStore } from '@/stores/notes'

const route = useRoute()
const notesStore = useNotesStore()
const notFound = ref(false)

// Find note by ID from route params
const note = computed(() => {
  const noteId = parseInt(route.params.id)
  return notesStore.notes.find(note => note.id === noteId)
})

// Watch for route changes and check if note exists
watch([() => route.params.id, () => notesStore.notes], () => {
  const noteId = parseInt(route.params.id)
  const foundNote = notesStore.notes.find(note => note.id === noteId)
  notFound.value = !foundNote
}, { immediate: true })

// Badge styling
const badgeClasses = computed(() => {
  if (!note.value?.badge) return ''
  
  const base = 'inline-flex items-center justify-center px-2 py-1 text-sm font-medium rounded-full'
  
  switch (note.value.badgeType) {
    case 'primary':
      return `${base} text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-300`
    case 'success':
      return `${base} text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300`
    default:
      return `${base} text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-300`
  }
})

// Actions
const editNote = () => {
  // Placeholder for edit functionality
  alert(`Edit note: ${note.value?.title}`)
}
</script>