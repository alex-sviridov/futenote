<script setup>
import { 
  FileText,
} from 'lucide-vue-next'

import SidebarButton from '@/components/SidebarButton.vue'
import { useNotesStore } from '@/stores/notes'
import { computed } from 'vue'

defineProps(['isOpen'])
const emit = defineEmits(['close'])

const notesStore = useNotesStore()

// Map notes to sidebar items format
const sideBarItems = computed(() => {
  return notesStore.notes.map(note => ({
    to: `/notes/${note.id}`,
    label: note.title,
    icon: FileText,
    badge: note.badge,
    badgeType: note.badgeType
  }))
})

</script>

<template>
  <!-- Mobile backdrop -->
  <div 
    v-if="isOpen" 
    @click="emit('close')"
    class="fixed inset-0 z-30 bg-black/50 sm:hidden"
  ></div>
  
  <aside :class="[
    'fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700',
    isOpen ? 'translate-x-0' : '-translate-x-full'
  ]">
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
      <ul class="space-y-2 font-medium">
        <SidebarButton
          v-for="item in sideBarItems"
          :key="item.to"
          :to="item.to"
          :label="item.label"
          :icon="item.icon"
          :badge="item.badge"
          :badge-type="item.badgeType"
        />
      </ul>
    </div>
  </aside>
</template>