import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloWorld from '../src/components/HelloWorld.vue'

describe('HelloWorld', () => {
  it('renders the message prop correctly', () => {
    const msg = 'Hello DevOps!'
    const wrapper = mount(HelloWorld, {
      props: { msg }
    })
    
    expect(wrapper.find('h1').text()).toBe(msg)
  })

  it('initializes count to 0', () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: 'Test' }
    })
    
    expect(wrapper.find('button').text()).toContain('count is 0')
  })

  it('increments count when button is clicked', async () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: 'Test' }
    })
    
    const button = wrapper.find('button')
    
    // Initial state
    expect(button.text()).toContain('count is 0')
    
    // Click button
    await button.trigger('click')
    expect(button.text()).toContain('count is 1')
    
    // Click again
    await button.trigger('click')
    expect(button.text()).toContain('count is 2')
  })

  it('renders static content correctly', () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: 'Test' }
    })
    
    // Check for key static elements
    expect(wrapper.text()).toContain('Edit')
    expect(wrapper.text()).toContain('components/HelloWorld.vue')
    expect(wrapper.text()).toContain('Check out')
    expect(wrapper.find('.read-the-docs').text()).toBe('Click on the Vite and Vue logos to learn more')
  })

  it('contains expected links', () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: 'Test' }
    })
    
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(2)
    
    // Check first link
    expect(links[0].attributes('href')).toBe('https://vuejs.org/guide/quick-start.html#local')
    expect(links[0].attributes('target')).toBe('_blank')
    expect(links[0].text()).toBe('create-vue')
    
    // Check second link
    expect(links[1].attributes('href')).toBe('https://vuejs.org/guide/scaling-up/tooling.html#ide-support')
    expect(links[1].attributes('target')).toBe('_blank')
  })
})