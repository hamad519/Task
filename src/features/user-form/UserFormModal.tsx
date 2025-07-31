import React, { useEffect } from 'react'
import { Modal, Form, Input, Select, Button, message } from 'antd'
import { useMutation } from '@apollo/client'
import { CREATE_USER, UPDATE_USER } from '@/entities/user/graphql'
import { useUserStore } from '@/entities/user/store'
import type { User, CreateUserInput, UpdateUserInput } from '@/entities/user/types'

const { Option } = Select

interface UserFormModalProps {
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
  user?: User | null
  mode: 'create' | 'edit'
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  user,
  mode
}) => {
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()
  const { addUser, updateUser } = useUserStore()

  const [createUser, { loading: createLoading }] = useMutation(CREATE_USER, {
    onCompleted: (data) => {
      // Add the new user to the store for optimistic update
      addUser(data.createUser)
      messageApi.success('User created successfully!')
      form.resetFields()
      onSuccess()
    },
    onError: (error) => {
      messageApi.error(`Failed to create user: ${error.message}`)
    }
  })

  const [updateUserMutation, { loading: updateLoading }] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      // Update the user in the store for optimistic update
      updateUser(data.updateUser.id, data.updateUser)
      messageApi.success('User updated successfully!')
      onSuccess()
    },
    onError: (error) => {
      messageApi.error(`Failed to update user: ${error.message}`)
    }
  })

  const loading = createLoading || updateLoading

  useEffect(() => {
    if (visible && user && mode === 'edit') {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      })
    } else if (visible && mode === 'create') {
      form.resetFields()
    }
  }, [visible, user, mode, form])

  const handleSubmit = async (values: CreateUserInput) => {
    try {
      if (mode === 'create') {
        await createUser({
          variables: { input: values }
        })
      } else if (mode === 'edit' && user) {
        await updateUserMutation({
          variables: { 
            id: user.id, 
            input: values as UpdateUserInput 
          }
        })
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <>
      {contextHolder}
      <Modal
        title={mode === 'create' ? 'Add New User' : 'Edit User'}
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={500}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            role: 'user',
            status: 'active'
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: 'Please enter the user name' },
              { min: 2, message: 'Name must be at least 2 characters' }
            ]}
          >
            <Input placeholder="Enter user name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter the email address' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select role">
              <Option value="admin">Admin</Option>
              <Option value="moderator">Moderator</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="banned">Banned</Option>
              <Option value="pending">Pending</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
} 