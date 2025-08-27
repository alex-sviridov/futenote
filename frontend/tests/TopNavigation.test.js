import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import TopNavigation from '@/components/TopNavigation.vue'

// Mock lucide-vue-next icons
vi.mock('lucide-vue-next', () => ({
  Menu: {
    name: 'MenuIcon',
    template: '<svg data-testid="menu-icon"></svg>'
  }
}))

// Mock TopUserMenu component
vi.mock('@/components/TopUserMenu.vue', () => ({
  default: {
    name: 'TopUserMenu',
    props: ['name', 'email'],
    template: '<div data-testid="top-user-menu">{{ name }} - {{ email }}</div>'
  }
}))

describe('TopNavigation', () => {
  let router

  beforeEach(async () => {
    // Create a simple test router
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } }
      ]
    })

    await router.push('/')
    await router.isReady()
  })

  const createWrapper = () => {
    return mount(TopNavigation, {
      global: {
        plugins: [router]
      }
    })
  }

  it('renders correctly with all elements', () => {
    const wrapper = createWrapper()

    // Check main nav structure
    const nav = wrapper.find('nav')
    expect(nav.exists()).toBe(true)
    expect(nav.classes()).toContain('fixed')
    expect(nav.classes()).toContain('top-0')
    expect(nav.classes()).toContain('z-50')
    expect(nav.classes()).toContain('w-full')
    expect(nav.classes()).toContain('bg-white')
    expect(nav.classes()).toContain('border-b')

    // Check for menu button
    const menuButton = wrapper.find('button')
    expect(menuButton.exists()).toBe(true)
    expect(menuButton.classes()).toContain('sm:hidden') // Mobile only

    // Check for logo and brand
    const routerLink = wrapper.findComponent({ name: 'RouterLink' })
    expect(routerLink.exists()).toBe(true)
    expect(routerLink.props('to')).toBe('/')

    const logo = wrapper.find('img')
    expect(logo.exists()).toBe(true)

    const brandText = wrapper.find('span.self-center')
    expect(brandText.text()).toBe('Futénote')
  })

  it('emits toggle-sidebar event when menu button is clicked', async () => {
    const wrapper = createWrapper()

    const menuButton = wrapper.find('button')
    await menuButton.trigger('click')

    expect(wrapper.emitted('toggle-sidebar')).toBeTruthy()
    expect(wrapper.emitted('toggle-sidebar')).toHaveLength(1)
  })

  it('renders menu icon', () => {
    const wrapper = createWrapper()

    const menuIcon = wrapper.find('[data-testid="menu-icon"]')
    expect(menuIcon.exists()).toBe(true)
  })

  it('renders TopUserMenu with correct props', () => {
    const wrapper = createWrapper()

    const topUserMenu = wrapper.findComponent({ name: 'TopUserMenu' })
    expect(topUserMenu.exists()).toBe(true)
    expect(topUserMenu.props('name')).toBe('John Doe')
    expect(topUserMenu.props('email')).toBe('john.dow@mailbox.org')
  })

  it('has correct RouterLink to home', () => {
    const wrapper = createWrapper()

    const routerLink = wrapper.findComponent({ name: 'RouterLink' })
    expect(routerLink.props('to')).toBe('/')
    expect(routerLink.classes()).toContain('flex')
    expect(routerLink.classes()).toContain('ms-2')
  })

  it('has correct button styling and accessibility', () => {
    const wrapper = createWrapper()

    const menuButton = wrapper.find('button')
    expect(menuButton.attributes('type')).toBe('button')
    
    // Check CSS classes
    expect(menuButton.classes()).toContain('inline-flex')
    expect(menuButton.classes()).toContain('items-center')
    expect(menuButton.classes()).toContain('p-2')
    expect(menuButton.classes()).toContain('text-sm')
    expect(menuButton.classes()).toContain('text-gray-500')
    expect(menuButton.classes()).toContain('rounded-lg')
    expect(menuButton.classes()).toContain('sm:hidden')

    // Check for screen reader text
    const srText = menuButton.find('.sr-only')
    expect(srText.exists()).toBe(true)
    expect(srText.text()).toBe('Open sidebar')
  })

  it('has correct layout structure', () => {
    const wrapper = createWrapper()

    // Check main container structure
    const container = wrapper.find('.px-3.py-3')
    expect(container.exists()).toBe(true)

    const flexContainer = wrapper.find('.flex.items-center.justify-between')
    expect(flexContainer.exists()).toBe(true)

    // Check left side (logo and menu)
    const leftSide = wrapper.find('.flex.items-center.justify-start')
    expect(leftSide.exists()).toBe(true)

    // Check right side (user menu)
    const rightSide = wrapper.find('.flex.items-center')
    expect(rightSide.exists()).toBe(true)
  })

  it('has correct dark mode classes', () => {
    const wrapper = createWrapper()

    const nav = wrapper.find('nav')
    expect(nav.classes()).toContain('dark:bg-gray-800')
    expect(nav.classes()).toContain('dark:border-gray-700')

    const menuButton = wrapper.find('button')
    expect(menuButton.classes()).toContain('dark:text-gray-400')
    expect(menuButton.classes()).toContain('dark:hover:bg-gray-700')
    expect(menuButton.classes()).toContain('dark:focus:ring-gray-600')

    const brandText = wrapper.find('span')
    expect(brandText.classes()).toContain('dark:text-white')
  })

  it('multiple clicks emit multiple events', async () => {
    const wrapper = createWrapper()

    const menuButton = wrapper.find('button')
    
    await menuButton.trigger('click')
    await menuButton.trigger('click')
    await menuButton.trigger('click')

    expect(wrapper.emitted('toggle-sidebar')).toHaveLength(3)
  })

  it('has correct responsive classes', () => {
    const wrapper = createWrapper()

    // Check responsive padding
    const container = wrapper.find('div.px-3.py-3.lg\\:px-5.lg\\:pl-3')
    expect(container.exists()).toBe(true)

    // Check responsive brand spacing
    const routerLink = wrapper.findComponent({ name: 'RouterLink' })
    expect(routerLink.classes()).toContain('md:me-24')

    // Check responsive text size
    const brandText = wrapper.find('span')
    expect(brandText.classes()).toContain('text-xl')
    expect(brandText.classes()).toContain('sm:text-2xl')
  })
})