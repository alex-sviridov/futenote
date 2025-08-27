// stores/notes.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref([
    {
      id: 1,
      title: 'Dashboard',
      content: 'Dashboard content...',
      badge: null,
      badgeType: null
    },
    {
      id: 2,
      title: 'Kanban',
      content: 'Kanban board content...',
      badge: 'Pro',
      badgeType: 'default'
    },
    {
      id: 3,
      title: 'Inbox',
      content: 'Inbox messages...',
      badge: 3,
      badgeType: 'primary'
    },
    {
      id: 4,
      title: 'Users',
      content: 'User management...',
      badge: null,
      badgeType: null
    }
  ])

  const addNote = (note) => {
    notes.value.push({
      id: Date.now(),
      ...note
    })
  }

  const removeNote = (id) => {
    const index = notes.value.findIndex(note => note.id === id)
    if (index > -1) {
      notes.value.splice(index, 1)
    }
  }

  const updateNote = (id, updates) => {
    const note = notes.value.find(note => note.id === id)
    if (note) {
      Object.assign(note, updates)
    }
  }

  return {
    notes,
    addNote,
    removeNote,
    updateNote
  }
})