import React from 'react'
import { Tag, Dropdown, Menu } from 'antd'
import { UserOutlined, CrownOutlined, SafetyCertificateOutlined, DownOutlined } from '@ant-design/icons'
import type { UserRole } from '@/entities/user/types'

interface RoleTagProps {
  role: UserRole
  editable?: boolean
  onRoleChange?: (newRole: UserRole) => void
}

const roleConfig = {
  admin: { 
    color: 'red', 
    text: 'Admin', 
    icon: <CrownOutlined />
  },
  moderator: { 
    color: 'blue', 
    text: 'Moderator', 
    icon: <SafetyCertificateOutlined />
  },
  user: { 
    color: 'default', 
    text: 'User', 
    icon: <UserOutlined />
  },
} as const

export const RoleTag: React.FC<RoleTagProps> = ({ role, editable = false, onRoleChange }) => {
  const config = roleConfig[role]
  
  const handleRoleChange = (newRole: UserRole) => {
    if (onRoleChange) {
      onRoleChange(newRole)
    }
  }

  const menu = (
    <Menu
      items={[
        {
          key: 'admin',
          label: 'Admin',
          icon: <CrownOutlined />,
          onClick: () => handleRoleChange('admin')
        },
        {
          key: 'moderator',
          label: 'Moderator',
          icon: <SafetyCertificateOutlined />,
          onClick: () => handleRoleChange('moderator')
        },
        {
          key: 'user',
          label: 'User',
          icon: <UserOutlined />,
          onClick: () => handleRoleChange('user')
        }
      ]}
    />
  )

  if (editable) {
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <Tag 
          color={config.color} 
          icon={config.icon}
          style={{ cursor: 'pointer' }}
        >
          {config.text} <DownOutlined />
        </Tag>
      </Dropdown>
    )
  }
  
  return (
    <Tag color={config.color} icon={config.icon}>
      {config.text}
    </Tag>
  )
} 