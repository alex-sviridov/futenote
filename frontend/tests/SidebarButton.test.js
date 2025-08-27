import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SidebarButton from '@/components/SidebarButton.vue'
import { createRouter, createWebHistory } from 'vue-router'

// Mock icon component for testing
const MockIcon = {
  name: 'MockIcon',
  template: '<svg data-testid="mock-icon"></svg>'
}

describe('SidebarButton', () => {
  let router

  beforeEach(async () => {
    // Create a test router
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/notes/1', component: { template: '<div>Note 1</div>' } },
        { path: '/notes/2', component: { template: '<div>Note 2</div>' } },
        { path: '/dashboard', component: { template: '<div>Dashboard</div>' } }
      ]
    })

    // Set initial route
    await router.push('/dashboard')
    await router.isReady()
  })

  const createWrapper = async (props = {}, currentRoute = '/dashboard') => {
    // Push to the desired route before mounting
    await router.push(currentRoute)
    await router.isReady()
    
    return mount(SidebarButton, {
      props: {
        to: '/notes/1',
        label: 'Test Label',
        icon: MockIcon,
        ...props
      },
      global: {
        plugins: [router]
      }
    })
  }

  it('renders with required props', async () => {
    const wrapper = await createWrapper({
      to: '/notes/1',
      label: 'Dashboard',
      icon: MockIcon
    })

    const routerLink = wrapper.findComponent({ name: 'RouterLink' })
    expect(routerLink.props('to')).toBe('/notes/1')
    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.find('[data-testid="mock-icon"]').exists()).toBe(true)
  })

  it('renders without badge when not provided', async () => {
    const wrapper = await createWrapper()

    const spans = wrapper.findAll('span')
    const labelSpan = spans.find(span => span.text() === 'Test Label')
    expect(labelSpan.exists()).toBe(true)
    
    // Should only have the label span, no badge span
    const badgeSpan = spans.find(span => span.classes().includes('rounded-full'))
    expect(badgeSpan).toBeUndefined()
  })

  it('renders string badge correctly', async () => {
    const wrapper = await createWrapper({
      badge: 'Pro',
      badgeType: 'default'
    })

    const spans = wrapper.findAll('span')
    const badge = spans.find(span => span.text() === 'Pro')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('Pro')
    expect(badge.classes()).toContain('text-gray-800')
    expect(badge.classes()).toContain('bg-gray-100')
  })

  it('renders numeric badge correctly', async () => {
    const wrapper = await createWrapper({
      badge: 5,
      badgeType: 'primary'
    })

    const spans = wrapper.findAll('span')
    const badge = spans.find(span => span.text() === '5')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('5')
    expect(badge.classes()).toContain('text-blue-800')
    expect(badge.classes()).toContain('bg-blue-100')
  })

  it('applies correct badge classes for different types', async () => {
    // Test primary badge type
    const primaryWrapper = await createWrapper({
      badge: 'New',
      badgeType: 'primary'
    })
    const primarySpans = primaryWrapper.findAll('span')
    const primaryBadge = primarySpans.find(span => span.text() === 'New')
    expect(primaryBadge.classes()).toContain('text-blue-800')
    expect(primaryBadge.classes()).toContain('bg-blue-100')

    // Test success badge type
    const successWrapper = await createWrapper({
      badge: 'Done',
      badgeType: 'success'
    })
    const successSpans = successWrapper.findAll('span')
    const successBadge = successSpans.find(span => span.text() === 'Done')
    expect(successBadge.classes()).toContain('text-green-800')
    expect(successBadge.classes()).toContain('bg-green-100')

    // Test default badge type
    const defaultWrapper = await createWrapper({
      badge: 'Default',
      badgeType: 'default'
    })
    const defaultSpans = defaultWrapper.findAll('span')
    const defaultBadge = defaultSpans.find(span => span.text() === 'Default')
    expect(defaultBadge.classes()).toContain('text-gray-800')
    expect(defaultBadge.classes()).toContain('bg-gray-100')
  })

  it('shows active state when route matches', async () => {
    const wrapper = await createWrapper({
      to: '/notes/1'
    }, '/notes/1') // Set current route to match the 'to' prop

    const routerLink = wrapper.findComponent({ name: 'RouterLink' })
    expect(routerLink.classes()).toContain('bg-gray-100')
    expect(routerLink.classes()).toContain('text-gray-900')

    const icon = wrapper.find('[data-testid="mock-icon"]')
    expect(icon.classes()).toContain('text-gray-900')
  })

  it('shows inactive state when route does not match', async () => {
    const wrapper = await createWrapper({
      to: '/notes/1'
    }, '/dashboard') // Current route doesn't match the 'to' prop

    const routerLink = wrapper.findComponent({ name: 'RouterLink' })
    expect(routerLink.classes()).not.toContain('bg-gray-100')
    expect(routerLink.classes()).toContain('hover:bg-gray-100')
    expect(routerLink.classes()).toContain('text-gray-900')

    const icon = wrapper.find('[data-testid="mock-icon"]')
    expect(icon.classes()).toContain('text-gray-500')
  })

  it('has correct base CSS classes', async () => {
    const wrapper = await createWrapper()

    const routerLink = wrapper.findComponent({ name: 'RouterLink' })
    expect(routerLink.classes()).toContain('flex')
    expect(routerLink.classes()).toContain('items-center')
    expect(routerLink.classes()).toContain('p-2')
    expect(routerLink.classes()).toContain('rounded-lg')
    expect(routerLink.classes()).toContain('transition-colors')
    expect(routerLink.classes()).toContain('group')

    const icon = wrapper.find('[data-testid="mock-icon"]')
    expect(icon.classes()).toContain('shrink-0')
    expect(icon.classes()).toContain('w-5')
    expect(icon.classes()).toContain('h-5')
    expect(icon.classes()).toContain('transition')

    const spans = wrapper.findAll('span')
    const labelSpan = spans.find(span => span.text() === 'Test Label')
    expect(labelSpan.classes()).toContain('flex-1')
    expect(labelSpan.classes()).toContain('ms-3')
    expect(labelSpan.classes()).toContain('whitespace-nowrap')
  })

  it('updates active state when route changes', async () => {
    const wrapper = await createWrapper({
      to: '/notes/1'
    }, '/dashboard')

    // Initially inactive
    let routerLink = wrapper.findComponent({ name: 'RouterLink' })
    expect(routerLink.classes()).not.toContain('bg-gray-100')

    // Change route to match
    await router.push('/notes/1')
    await wrapper.vm.$nextTick()

    // Re-find the component after route change
    routerLink = wrapper.findComponent({ name: 'RouterLink' })
    expect(routerLink.classes()).toContain('bg-gray-100')
  })

  it('renders all required elements in correct structure', async () => {
    const wrapper = await createWrapper({
      label: 'Test Item',
      badge: 'Badge Text'
    })

    // Should have li > RouterLink structure
    expect(wrapper.find('li').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'RouterLink' }).exists()).toBe(true)

    // Should have icon, label, and badge
    expect(wrapper.find('[data-testid="mock-icon"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Item')
    expect(wrapper.text()).toContain('Badge Text')
  })
})