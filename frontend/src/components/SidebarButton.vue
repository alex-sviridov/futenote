<template>
  <li>
    <RouterLink 
      :to="to"
      :class="[
        'flex items-center p-2 rounded-lg transition-colors group',
        isActive 
          ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' 
          : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
      ]"
    >
      <component 
        :is="icon" 
        :class="[
          'shrink-0 w-5 h-5 transition duration-75',
          isActive
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
        ]"
      />
      <span class="flex-1 ms-3 whitespace-nowrap">{{ label }}</span>
      
      <!-- Badge slot -->
      <span v-if="badge" :class="badgeClasses">
        {{ badge }}
      </span>
    </RouterLink>
  </li>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
  to: { type: String, required: true },
  label: { type: String, required: true },
  icon: { type: Object, required: true },
  badge: { type: [String, Number], default: null },
  badgeType: { type: String, default: 'default' } // 'default', 'primary', 'success'
})

const route = useRoute()
const isActive = computed(() => route.path === props.to)

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center justify-center px-2 ms-3 text-sm font-medium rounded-full'
  
  switch (props.badgeType) {
    case 'primary':
      return `${base} text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-300`
    case 'success':
      return `${base} text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-300`
    default:
      return `${base} text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-300`
  }
})
</script>