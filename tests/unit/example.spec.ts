import { mount } from '@vue/test-utils'
import SettingsPage from '@/views/SettingsPage.vue'

describe('SettingsPage.vue', () => {
  it('renders tab 1 SettingsPage', () => {
    const wrapper = mount(SettingsPage)
    expect(wrapper.text()).toMatch('Tab 1 page')
  })
})
