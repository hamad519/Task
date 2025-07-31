import React from 'react'
import { Button, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { User } from '@/entities/user/types'

interface ActionCellProps {
  user: User
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export const ActionCell: React.FC<ActionCellProps> = ({ user, onEdit, onDelete }) => {
  return (
    <Space>
      <Button
        type="text"
        size="small"
        icon={<EditOutlined />}
        onClick={() => onEdit(user)}
        title="Edit user"
      />
      <Button
        type="text"
        size="small"
        danger
        icon={<DeleteOutlined />}
        onClick={() => onDelete(user)}
        title="Delete user"
      />
    </Space>
  )
} 