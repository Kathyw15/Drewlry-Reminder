import { useState, useEffect } from 'react'
import { Reminder, EventType } from '../types'
import './ReminderForm.css'

interface ReminderFormProps {
  reminder?: Reminder | null
  onSave: (data: Omit<Reminder, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'birthday', label: '生日' },
  { value: 'anniversary', label: '纪念日' },
  { value: 'holiday', label: '节日' },
  { value: 'other', label: '其他' },
]

export default function ReminderForm({ reminder, onSave, onCancel }: ReminderFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    eventType: 'birthday' as EventType,
    date: '',
    notes: '',
  })

  useEffect(() => {
    if (reminder) {
      setFormData({
        name: reminder.name,
        relationship: reminder.relationship,
        eventType: reminder.eventType,
        date: reminder.date,
        notes: reminder.notes || '',
      })
    }
  }, [reminder])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.date) {
      alert('请填写姓名和日期')
      return
    }
    onSave(formData)
  }

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2>{reminder ? '编辑提醒' : '添加提醒'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="reminder-form">
          <div className="form-group">
            <label htmlFor="name">姓名 *</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="输入姓名"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="relationship">关系</label>
            <input
              id="relationship"
              type="text"
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              placeholder="如：朋友、家人、同事等"
            />
          </div>

          <div className="form-group">
            <label htmlFor="eventType">事件类型 *</label>
            <select
              id="eventType"
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value as EventType })}
              required
            >
              {EVENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">日期 *</label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">备注</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="添加一些备注信息..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              {reminder ? '更新' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
