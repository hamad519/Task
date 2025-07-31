import { format, parseISO } from 'date-fns'

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString)
    return format(date, 'dd.MM.yyyy, HH:mm')
  } catch {
    return 'Invalid date'
  }
}

export const formatDateISO = (dateString: string): string => {
  try {
    const date = parseISO(dateString)
    return format(date, 'yyyy-MM-dd HH:mm:ss')
  } catch {
    return 'Invalid date'
  }
} 