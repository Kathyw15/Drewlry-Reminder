import { Reminder } from '../types'
import { format, parseISO } from 'date-fns'
import './ReminderCard.css'

interface ReminderCardProps {
  reminder: Reminder
  daysUntil: number
  onEdit: (reminder: Reminder) => void
  onDelete: (id: string) => void
}

const EVENT_TYPE_ICONS: Record<Reminder['eventType'], string> = {
  birthday: '🎂',
  anniversary: '💝',
  holiday: '🎉',
  other: '📌',
}

const EVENT_TYPE_LABELS: Record<Reminder['eventType'], string> = {
  birthday: '生日',
  anniversary: '纪念日',
  holiday: '节日',
  other: '其他',
}

export default function ReminderCard({ reminder, daysUntil, onEdit, onDelete }: ReminderCardProps) {
  const date = parseISO(reminder.date)
  const isUpcoming = daysUntil <= 7
  const isToday = daysUntil === 0
  const isPast = daysUntil < 0

  const getDaysText = () => {
    if (isToday) return '今天！'
    if (isPast) return `已过 ${Math.abs(daysUntil)} 天`
    if (daysUntil === 1) return '明天'
    return `${daysUntil} 天后`
  }

  return (
    <div className={`reminder-card ${isUpcoming ? 'upcoming' : ''} ${isToday ? 'today' : ''}`}>
      <div className="card-header">
        <div className="event-icon">{EVENT_TYPE_ICONS[reminder.eventType]}</div>
        <div className="event-info">
          <h3 className="person-name">{reminder.name}</h3>
          <span className="event-type">{EVENT_TYPE_LABELS[reminder.eventType]}</span>
        </div>
      </div>

      <div className="card-body">
        {reminder.relationship && (
          <div className="relationship">
            <span className="label">关系：</span>
            <span>{reminder.relationship}</span>
          </div>
        )}
        
        <div className="date-info">
          <span className="date">
            {format(date, 'M月d日')}
          </span>
          <span className={`days-until ${isToday ? 'today-badge' : ''} ${isUpcoming ? 'urgent' : ''}`}>
            {getDaysText()}
          </span>
        </div>

        {reminder.notes && (
          <div className="notes">
            <p>{reminder.notes}</p>
          </div>
        )}
      </div>

      <div className="card-actions">
        <button className="action-btn edit-btn" onClick={() => onEdit(reminder)}>
          编辑
        </button>
        <button className="action-btn delete-btn" onClick={() => onDelete(reminder.id)}>
          删除
        </button>
      </div>
    </div>
  )
}
