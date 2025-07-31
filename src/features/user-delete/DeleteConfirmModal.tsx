import React from 'react'
import { Modal, Button, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useMutation } from '@apollo/client'
import { DELETE_USER } from '@/entities/user/graphql'
import { useUserStore } from '@/entities/user/store'
import type { User } from '@/entities/user/types'

const { confirm } = Modal

interface DeleteConfirmModalProps {
  user: User | null
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  user,
  visible,
  onCancel,
  onSuccess
}) => {
  const [messageApi, contextHolder] = message.useMessage()
  const { removeUser } = useUserStore()

  const [deleteUser, { loading }] = useMutation(DELETE_USER, {
    onCompleted: (data) => {
      // Remove the user from the store for optimistic update
      removeUser(data.deleteUser.id)
      messageApi.success('User deleted successfully!')
      onSuccess()
    },
    onError: (error) => {
      messageApi.error(`Failed to delete user: ${error.message}`)
    }
  })

  const handleDelete = () => {
    if (!user) return

    confirm({
      title: 'Are you sure you want to delete this user?',
      icon: <ExclamationCircleOutlined />,
      content: `This action cannot be undone. User "${user.name}" will be permanently deleted.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteUser({
            variables: { id: user.id }
          })
        } catch (error) {
          console.error('Delete error:', error)
        }
      }
    })
  }

  if (!user) return null

  return (
    <>
      {contextHolder}
      <Modal
        title="Delete User"
        open={visible}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>,
          <Button 
            key="delete" 
            danger 
            loading={loading}
            onClick={handleDelete}
          >
            Delete
          </Button>
        ]}
        width={400}
      >
        <p>
          Are you sure you want to delete user <strong>{user.name}</strong>?
        </p>
        <p>This action cannot be undone.</p>
      </Modal>
    </>
  )
} 