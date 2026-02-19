export interface Reminder {
  id: string
  name: string
  relationship: string
  eventType: 'birthday' | 'anniversary' | 'holiday' | 'other'
  date: string
  notes?: string
  createdAt: string
}

export type EventType = Reminder['eventType']
