import { useState, useEffect } from 'react'
import { Reminder, EventType } from '../types'
import { getReminders, addReminder, updateReminder, deleteReminder } from '../utils/storage'
import { differenceInDays, isPast, addYears, parseISO } from 'date-fns'
import ReminderForm from './ReminderForm'
import ReminderCard from './ReminderCard'
import './ReminderPage.css'

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  birthday: '生日',
  anniversary: '纪念日',
  holiday: '节日',
  other: '其他',
}

export default function ReminderPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)
  const [filter, setFilter] = useState<EventType | 'all'>('all')

  useEffect(() => {
    loadReminders()
  }, [])

  const loadReminders = () => {
    const loaded = getReminders()
    setReminders(loaded)
  }

  const handleAdd = (data: Omit<Reminder, 'id' | 'createdAt'>) => {
    addReminder(data)
    loadReminders()
    setShowForm(false)
  }

  const handleUpdate = (id: string, data: Partial<Reminder>) => {
    updateReminder(id, data)
    loadReminders()
    setEditingReminder(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个提醒吗？')) {
      deleteReminder(id)
      loadReminders()
    }
  }

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder)
    setShowForm(true)
  }

  const getDaysUntil = (dateStr: string): number => {
    const date = parseISO(dateStr)
    const today = new Date()
    const thisYear = new Date(today.getFullYear(), date.getMonth(), date.getDate())
    const nextYear = addYears(thisYear, 1)
    
    if (isPast(thisYear)) {
      return differenceInDays(nextYear, today)
    }
    return differenceInDays(thisYear, today)
  }

  const filteredReminders = reminders
    .filter(r => filter === 'all' || r.eventType === filter)
    .sort((a, b) => {
      const daysA = getDaysUntil(a.date)
      const daysB = getDaysUntil(b.date)
      return daysA - daysB
    })

  const upcomingReminders = filteredReminders.filter(r => getDaysUntil(r.date) <= 30)

  return (
    <div className="reminder-page">
      <header className="reminder-header">
        <h1>🎁 AI Gifting Reminder</h1>
        <p className="subtitle">管理朋友和家人的重要日子</p>
      </header>

      <div className="reminder-controls">
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingReminder(null)
            setShowForm(true)
          }}
        >
          + 添加提醒
        </button>

        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            全部
          </button>
          {Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => (
            <button
              key={key}
              className={`filter-tab ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key as EventType)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {upcomingReminders.length > 0 && (
        <section className="upcoming-section">
          <h2>📅 即将到来 (30天内)</h2>
          <div className="reminder-grid">
            {upcomingReminders.map(reminder => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                daysUntil={getDaysUntil(reminder.date)}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      )}

      <section className="all-reminders-section">
        <h2>📋 所有提醒 ({filteredReminders.length})</h2>
        {filteredReminders.length === 0 ? (
          <div className="empty-state">
            <p>还没有添加任何提醒</p>
            <p className="hint">点击"添加提醒"开始记录重要日子吧！</p>
          </div>
        ) : (
          <div className="reminder-grid">
            {filteredReminders.map(reminder => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                daysUntil={getDaysUntil(reminder.date)}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      {showForm && (
        <ReminderForm
          reminder={editingReminder}
          onSave={editingReminder 
            ? (data) => handleUpdate(editingReminder.id, data)
            : handleAdd
          }
          onCancel={() => {
            setShowForm(false)
            setEditingReminder(null)
          }}
        />
      )}
    </div>
  )
}
