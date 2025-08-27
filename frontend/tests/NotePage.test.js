import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import NotePage from '@/components/NotePage.vue'
import { useNotesStore } from '@/stores/notes'

// Mock the notes store
vi.mock('@/stores/notes', () => ({
  useNotesStore: vi.fn()
}))

describe('NotePage', () => {
  let pinia
  let mockNotesStore
  let router

  beforeEach(async () => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    // Create mock store with test data
    mockNotesStore = {
      notes: [
        {
          id: 1,
          title: 'Test Note 1',
          content: 'This is the content of test note 1.\nIt has multiple lines.',
          badge: null,
          badgeType: null
        },
        {
          id: 2,
          title: 'Pro Feature Note',
          content: 'This note has a Pro badge.',
          badge: 'Pro',
          badgeType: 'default'
        },
        {
          id: 3,
          title: 'Important Note',
          content: 'This is an important note with a primary badge.',
          badge: 5,
          badgeType: 'primary'
        }
      ]
    }
    
    // Mock the store hook
    vi.mocked(useNotesStore).mockReturnValue(mockNotesStore)

    // Create router with memory history for testing
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { 
          path: '/', 
          component: { template: '<div>Home</div>' } 
        },
        { 
          path: '/notes/:id', 
          name: 'NotePage',
          component: NotePage 
        }
      ]
    })
  })

  const createWrapper = async (noteId = '1') => {
    // Navigate to the specific route
    await router.push(`/notes/${noteId}`)
    await router.isReady()
    
    return mount(NotePage, {
      global: {
        plugins: [pinia, router]
      }
    })
  }

  it('renders existing note correctly', async () => {
    const wrapper = await createWrapper('1')

    // Check note title
    const title = wrapper.find('h1')
    expect(title.text()).toBe('Test Note 1')

    // Check note content
    const content = wrapper.find('.whitespace-pre-line')
    expect(content.text()).toContain('This is the content of test note 1.')
    expect(content.text()).toContain('It has multiple lines.')

    // Check note ID display
    expect(wrapper.text()).toContain('Note ID: 1')

    // Should not show not found message
    expect(wrapper.text()).not.toContain('Note Not Found')
  })

  it('renders note with badge correctly', async () => {
    const wrapper = await createWrapper('2')

    // Check note title
    expect(wrapper.find('h1').text()).toBe('Pro Feature Note')

    // Check badge exists and has correct text
    const spans = wrapper.findAll('span')
    const badge = spans.find(span => 
      span.classes().includes('rounded-full') && span.text() === 'Pro'
    )
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('Pro')
    expect(badge.classes()).toContain('text-gray-800')
    expect(badge.classes()).toContain('bg-gray-100')
  })

  it('renders note with primary badge correctly', async () => {
    const wrapper = await createWrapper('3')

    // Check note title
    expect(wrapper.find('h1').text()).toBe('Important Note')

    // Check primary badge
    const spans = wrapper.findAll('span')
    const badge = spans.find(span => 
      span.classes().includes('rounded-full') && span.text() === '5'
    )
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('5')
    expect(badge.classes()).toContain('text-blue-800')
    expect(badge.classes()).toContain('bg-blue-100')
  })

  it('shows not found message for non-existent note', async () => {
    const wrapper = await createWrapper('999')

    // Should show not found message
    expect(wrapper.find('h1').text()).toBe('Note Not Found')
    expect(wrapper.text()).toContain("The note with ID 999 doesn't exist.")

    // Should not show note content
    expect(wrapper.text()).not.toContain('This is the content')
    
    // Should have back to notes link
    const backLink = wrapper.findComponent({ name: 'RouterLink' })
    expect(backLink.exists()).toBe(true)
    expect(backLink.props('to')).toBe('/')
  })

  it('renders back to notes link', async () => {
    const wrapper = await createWrapper('1')

    const backLinks = wrapper.findAllComponents({ name: 'RouterLink' })
    const backLink = backLinks.find(link => link.props('to') === '/')
    
    expect(backLink.exists()).toBe(true)
    expect(backLink.text()).toBe('Back to Notes')
  })

  it('renders edit button and handles click', async () => {
    // Mock alert to avoid browser popup in tests
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    
    const wrapper = await createWrapper('1')

    const editButton = wrapper.find('button')
    expect(editButton.exists()).toBe(true)
    expect(editButton.text()).toBe('Edit Note')

    await editButton.trigger('click')
    expect(alertSpy).toHaveBeenCalledWith('Edit note: Test Note 1')

    alertSpy.mockRestore()
  })

  it('has correct CSS classes and structure', async () => {
    const wrapper = await createWrapper('1')

    // Check main container
    const mainContainer = wrapper.find('.max-w-4xl')
    expect(mainContainer.exists()).toBe(true)
    expect(mainContainer.classes()).toContain('mx-auto')
    expect(mainContainer.classes()).toContain('p-6')

    // Check header
    const header = wrapper.find('header')
    expect(header.exists()).toBe(true)
    expect(header.classes()).toContain('border-b')

    // Check main content
    const main = wrapper.find('main')
    expect(main.exists()).toBe(true)
    expect(main.classes()).toContain('prose')

    // Check footer
    const footer = wrapper.find('footer')
    expect(footer.exists()).toBe(true)
    expect(footer.classes()).toContain('border-t')
  })

  it('handles route parameter changes', async () => {
    const wrapper1 = await createWrapper('1')
    expect(wrapper1.find('h1').text()).toBe('Test Note 1')

    const wrapper2 = await createWrapper('2')
    expect(wrapper2.find('h1').text()).toBe('Pro Feature Note')
  })

  it('shows note without badge when badge is null', async () => {
    const wrapper = await createWrapper('1')

    // Check that no badge element exists
    const spans = wrapper.findAll('span')
    const badges = spans.filter(span => 
      span.classes().includes('rounded-full')
    )
    expect(badges).toHaveLength(0)
  })

  it('displays multiline content correctly', async () => {
    const wrapper = await createWrapper('1')

    const content = wrapper.find('.whitespace-pre-line')
    expect(content.classes()).toContain('whitespace-pre-line')
    
    // Check that content preserves line breaks
    const contentText = content.text()
    expect(contentText).toContain('This is the content of test note 1.')
    expect(contentText).toContain('It has multiple lines.')
  })

  it('has proper dark mode classes', async () => {
    const wrapper = await createWrapper('1')

    const title = wrapper.find('h1')
    expect(title.classes()).toContain('dark:text-white')

    const content = wrapper.find('.whitespace-pre-line')
    expect(content.classes()).toContain('dark:text-gray-300')

    const header = wrapper.find('header')
    expect(header.classes()).toContain('dark:border-gray-700')
  })
})