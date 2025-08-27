import { createRouter, createWebHistory } from 'vue-router'

import NotesList from '@/components/NotesList.vue';
import NotePage from '@/components/NotePage.vue';

const routes = [
  { path: '/', redirect: { name: 'notes' } },
  { name: 'notes', path: '/notes', component: NotesList },
  { name: 'note', path: '/notes/:id', component: NotePage },
]   

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;