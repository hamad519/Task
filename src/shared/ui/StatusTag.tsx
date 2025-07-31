import React from 'react'
import { Tag } from 'antd'
import type { UserStatus } from '@/entities/user/types'

interface StatusTagProps {
  status: UserStatus
}

const statusConfig = {
  active: { color: 'success', text: 'Active' },
  banned: { color: 'error', text: 'Banned' },
  pending: { color: 'warning', text: 'Pending' },
} as const

export const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const config = statusConfig[status]
  
  return (
    <Tag color={config.color}>
      {config.text}
    </Tag>
  )
} 