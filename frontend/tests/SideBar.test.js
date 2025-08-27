import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SideBar from '@/components/SideBar.vue'
import { useNotesStore } from '@/stores/notes'

// Mock the SidebarButton component since it's imported
vi.mock('@/components/SidebarButton.vue', () => ({
  default: {
    name: 'SidebarButton',
    props: ['to', 'label', 'icon', 'badge', 'badgeType'],
    template: '<li><a :href="to">{{ label }}</a></li>'
  }
}))

// Mock notes store
vi.mock('@/stores/notes', () => ({
  useNotesStore: vi.fn()
}))

describe('SideBar', () => {
  let pinia
  let mockNotesStore

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    // Create mock store with test data
    mockNotesStore = {
      notes: [
        {
          id: 1,
          title: 'Test Note 1',
          badge: null,
          badgeType: null
        },
        {
          id: 2,
          title: 'Test Note 2',
          badge: 'Pro',
          badgeType: 'default'
        },
        {
          id: 3,
          title: 'Test Note 3',
          badge: 5,
          badgeType: 'primary'
        }
      ]
    }
    
    // Mock the store hook to return our mock data
    vi.mocked(useNotesStore).mockReturnValue(mockNotesStore)
  })

  const createWrapper = (props = {}) => {
    return mount(SideBar, {
      props: {
        isOpen: false,
        ...props
      },
      global: {
        plugins: [pinia]
      }
    })
  }

  it('renders correctly when closed', () => {
    const wrapper = createWrapper({ isOpen: false })

    const aside = wrapper.find('aside')
    expect(aside.classes()).toContain('-translate-x-full')
    expect(aside.classes()).not.toContain('translate-x-0')
  })

  it('renders correctly when open', () => {
    const wrapper = createWrapper({ isOpen: true })

    const aside = wrapper.find('aside')
    expect(aside.classes()).toContain('translate-x-0')
    expect(aside.classes()).not.toContain('-translate-x-full')
  })

  it('shows mobile backdrop when open', () => {
    const wrapper = createWrapper({ isOpen: true })

    const backdrop = wrapper.find('.fixed.inset-0.z-30')
    expect(backdrop.exists()).toBe(true)
  })

  it('hides mobile backdrop when closed', () => {
    const wrapper = createWrapper({ isOpen: false })

    const backdrop = wrapper.find('.fixed.inset-0.z-30')
    expect(backdrop.exists()).toBe(false)
  })

  it('emits close event when backdrop is clicked', async () => {
    const wrapper = createWrapper({ isOpen: true })

    const backdrop = wrapper.find('.fixed.inset-0.z-30')
    await backdrop.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('renders all notes from store as sidebar items', () => {
    const wrapper = createWrapper({ isOpen: true })

    const sidebarButtons = wrapper.findAllComponents({ name: 'SidebarButton' })
    expect(sidebarButtons).toHaveLength(3) // Based on our mock data
  })

  it('passes correct props from store notes to SidebarButton components', () => {
    const wrapper = createWrapper({ isOpen: true })

    const sidebarButtons = wrapper.findAllComponents({ name: 'SidebarButton' })
    
    // Check first note
    expect(sidebarButtons[0].props('to')).toBe('/notes/1')
    expect(sidebarButtons[0].props('label')).toBe('Test Note 1')
    expect(sidebarButtons[0].props('badge')).toBe(null)
    expect(sidebarButtons[0].props('badgeType')).toBe(null)
    
    // Check second note with badge
    expect(sidebarButtons[1].props('to')).toBe('/notes/2')
    expect(sidebarButtons[1].props('label')).toBe('Test Note 2')
    expect(sidebarButtons[1].props('badge')).toBe('Pro')
    expect(sidebarButtons[1].props('badgeType')).toBe('default')
    
    // Check third note with numeric badge
    expect(sidebarButtons[2].props('to')).toBe('/notes/3')
    expect(sidebarButtons[2].props('label')).toBe('Test Note 3')
    expect(sidebarButtons[2].props('badge')).toBe(5)
    expect(sidebarButtons[2].props('badgeType')).toBe('primary')
  })

  it('handles empty notes list', () => {
    // Create a new mock store with empty notes for this test
    const emptyMockStore = {
      notes: []
    }
    vi.mocked(useNotesStore).mockReturnValue(emptyMockStore)
    
    const wrapper = createWrapper({ isOpen: true })
    const sidebarButtons = wrapper.findAllComponents({ name: 'SidebarButton' })
    
    expect(sidebarButtons).toHaveLength(0)
  })

  it('handles different note configurations', () => {
    // Test with a custom set of notes
    const customMockStore = {
      notes: [
        { id: 10, title: 'Simple Note', badge: null, badgeType: null },
        { id: 20, title: 'Premium Feature', badge: 'Pro', badgeType: 'premium' },
        { id: 30, title: 'Urgent Task', badge: 99, badgeType: 'danger' },
        { id: 40, title: 'New Feature', badge: 'Beta', badgeType: 'info' }
      ]
    }
    vi.mocked(useNotesStore).mockReturnValue(customMockStore)
    
    const wrapper = createWrapper({ isOpen: true })
    const sidebarButtons = wrapper.findAllComponents({ name: 'SidebarButton' })
    
    expect(sidebarButtons).toHaveLength(4)
    
    // Check specific configurations
    expect(sidebarButtons[0].props('to')).toBe('/notes/10')
    expect(sidebarButtons[1].props('badge')).toBe('Pro')
    expect(sidebarButtons[1].props('badgeType')).toBe('premium')
    expect(sidebarButtons[2].props('badge')).toBe(99)
    expect(sidebarButtons[3].props('label')).toBe('New Feature')
  })

  it('has correct CSS classes for styling', () => {
    const wrapper = createWrapper({ isOpen: true })

    const aside = wrapper.find('aside')
    expect(aside.classes()).toContain('fixed')
    expect(aside.classes()).toContain('w-64')
    expect(aside.classes()).toContain('h-screen')
    expect(aside.classes()).toContain('bg-white')
    expect(aside.classes()).toContain('border-r')
    expect(aside.classes()).toContain('dark:bg-gray-800')
  })
})