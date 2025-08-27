<script setup>
import { 
    Menu as MenuIcon,
    } from 'lucide-vue-next';

import TopUserMenu from '@/components/TopUserMenu.vue'


const emit = defineEmits(['toggle-sidebar'])
</script>

<template>
    <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div class="px-3 py-3 lg:px-5 lg:pl-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center justify-start rtl:justify-end">
<button 
    @click="emit('toggle-sidebar')" 
    type="button"
    class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
>                        <span class="sr-only dark:text-white text-xl sm:text-2xl">Open sidebar</span>
                        <MenuIcon />
                    </button>
                    <RouterLink to="/" class="flex ms-2 md:me-24">
                        <img src="/images/vue.svg" class="h-8 me-3" alt="Futénote Logo" />
                        <span
                            class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Futénote</span>
                    </RouterLink>
                </div>
                <div class="flex items-center">
                    <TopUserMenu name="John Doe" email="john.dow@mailbox.org" />
                </div>
            </div>
        </div>
    </nav>
</template>
