<template>
    <div class="flex items-center ms-3 relative">
        <div>
            <button type="button" @click="toggleUserMenu"
                class="flex text-sm rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                :aria-expanded="isUserMenuOpen">
                <span class="sr-only">Open user menu</span>
                <CircleUserRoundIcon class="w-8 h-8 rounded-full" :size="32" />
            </button>
        </div>
        <Transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <div v-show="isUserMenuOpen"
                class="absolute right-0 top-full mt-2 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-lg dark:bg-gray-700 dark:divide-gray-600"
                id="dropdown-user">
                <div class="px-4 py-3" role="none">
                    <p class="text-sm text-gray-900 dark:text-white" role="none">{{ name }}</p>
                    <p class="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">{{ email }}</p>
                </div>
                <ul class="py-1" role="none">
                    <li>
                        <a href="#"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                            role="menuitem">Settings</a>
                    </li>
                    <li>
                        <a href="#" @click="handleSignOut"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                            role="menuitem">Sign out</a>
                    </li>
                </ul>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import {
    CircleUserRound as CircleUserRoundIcon,
} from 'lucide-vue-next';

import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
})

const isUserMenuOpen = ref(false)

const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value
}

const closeUserMenu = () => {
    isUserMenuOpen.value = false
}

const handleSignOut = () => {
    closeUserMenu()
    // Add your sign out logic here
    console.log('Signing out...')
}

// Close menu when clicking outside
const handleClickOutside = (event) => {
    const userMenu = document.getElementById('dropdown-user')
    const userButton = event.target.closest('button')

    if (!userMenu?.contains(event.target) && !userButton?.closest('.relative')?.contains(event.target)) {
        closeUserMenu()
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>