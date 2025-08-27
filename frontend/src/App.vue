<template>
  <TopNavigation @toggle-sidebar="toggleSidebar"/>
  <SideBar :is-open="isSidebarOpen" @close="toggleSidebar" />
  <div class="sm:ml-64 pt-14">
    <main class="p-4">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import TopNavigation from '@/components/TopNavigation.vue'
import SideBar from '@/components/SideBar.vue'

const isSidebarOpen = ref(false)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

</script>