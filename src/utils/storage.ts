import { Reminder } from '../types'

const STORAGE_KEY = 'drewlry-reminders'

export const getReminders = (): Reminder[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const saveReminders = (reminders: Reminder[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
  } catch (error) {
    console.error('保存提醒失败:', error)
  }
}

export const addReminder = (reminder: Omit<Reminder, 'id' | 'createdAt'>): Reminder => {
  const reminders = getReminders()
  const newReminder: Reminder = {
    ...reminder,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  reminders.push(newReminder)
  saveReminders(reminders)
  return newReminder
}

export const updateReminder = (id: string, updates: Partial<Reminder>): boolean => {
  const reminders = getReminders()
  const index = reminders.findIndex(r => r.id === id)
  if (index === -1) return false
  reminders[index] = { ...reminders[index], ...updates }
  saveReminders(reminders)
  return true
}

export const deleteReminder = (id: string): boolean => {
  const reminders = getReminders()
  const filtered = reminders.filter(r => r.id !== id)
  if (filtered.length === reminders.length) return false
  saveReminders(filtered)
  return true
}
