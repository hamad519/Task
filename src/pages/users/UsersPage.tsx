import React, { useState, useEffect, useMemo } from 'react'
import { 
  Card, 
  Button, 
  Row, 
  Col, 
  Input, 
  Select, 
  Space, 
  Tooltip, 
  Alert, 
  Spin, 
  message,
  Badge,
  Typography,
  Divider,
  Pagination,
  Empty,
  theme
} from 'antd'
import { 
  PlusOutlined, 
  ReloadOutlined, 
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { AgGridReact } from '@ag-grid-community/react'
import { ColDef, GridReadyEvent } from '@ag-grid-community/core'
import { ModuleRegistry } from '@ag-grid-community/core'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { useQuery, useMutation } from '@apollo/client'
import { GET_USERS, UPDATE_USER } from '@/entities/user/graphql'
import { useUserStore } from '@/entities/user/store'
import { UserFormModal } from '@/features/user-form/UserFormModal'
import { DeleteConfirmModal } from '@/features/user-delete/DeleteConfirmModal'
import { StatusTag } from '@/shared/ui/StatusTag'
import { RoleTag } from '@/shared/ui/RoleTag'
import { ActionCell } from '@/shared/ui/ActionCell'
import { MswTest } from '@/shared/ui/MswTest'
import { formatDate, formatDateISO } from '@/shared/lib/date-utils'
import type { User, UserRole } from '@/entities/user/types'
import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-alpine.css'

// Register AG Grid modules
ModuleRegistry.registerModules([ClientSideRowModelModule])

const { Option } = Select
const { Title, Text } = Typography

const UsersPage: React.FC = () => {
  const { token } = theme.useToken()
  const [formModalVisible, setFormModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [filters, setFilters] = useState({
    email: '',
    role: '' as UserRole | '',
  })
  const [messageApi, contextHolder] = message.useMessage()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { users, setUsers, setLoading, setError, setPagination, updateUser } = useUserStore()
  const [pagination, setPaginationState] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  const [updateUserMutation] = useMutation(UPDATE_USER)

  const { loading, error, refetch } = useQuery(GET_USERS, {
    variables: {
      page: pagination.current,
      limit: pagination.pageSize,
      email: filters.email || undefined,
      role: filters.role || undefined,
    },
    fetchPolicy: 'cache-and-network', // This ensures fresh data on refetch
    onCompleted: (data) => {
      console.log('Query completed:', data)
      if (data?.users) {
        setUsers(data.users.data)
        setPagination(data.users.page, data.users.limit, data.users.total)
        setPaginationState(prev => ({
          ...prev,
          current: data.users.page,
          total: data.users.total
        }))
      }
      setIsRefreshing(false)
    },
    onError: (error) => {
      console.error('Query error:', error)
      setError(error.message)
      setIsRefreshing(false)
    }
  })

  useEffect(() => {
    setLoading(loading)
  }, [loading, setLoading])

  // Refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch({
        page: 1,
        limit: pagination.pageSize,
        email: filters.email || undefined,
        role: filters.role || undefined,
      })
      setPaginationState(prev => ({ ...prev, current: 1 }))
    }, 300) // Debounce filter changes

    return () => clearTimeout(timeoutId)
  }, [filters, refetch, pagination.pageSize])

  const handleGridReady = (_params: GridReadyEvent) => {
    console.log('Grid ready')
  }

  const handleAddUser = () => {
    setFormMode('create')
    setSelectedUser(null)
    setFormModalVisible(true)
  }

  const handleEditUser = (user: User) => {
    setFormMode('edit')
    setSelectedUser(user)
    setFormModalVisible(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setDeleteModalVisible(true)
  }

  const handleFormSuccess = () => {
    setFormModalVisible(false)
    messageApi.success('User saved successfully!')
    refetch()
  }

  const handleDeleteSuccess = () => {
    setDeleteModalVisible(false)
    setSelectedUser(null)
    messageApi.success('User deleted successfully!')
    refetch()
  }

  const handleFilterChange = (key: 'email' | 'role', value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
  
    try {
      // Optionally reset pagination to page 1
      setPaginationState(prev => ({
        ...prev,
        current: 1
      }))
  
      // Clear any grid selection if needed
      // gridRef.current?.api?.deselectAll() // if using a gridRef
  
      await refetch({
        page: 1,
        limit: pagination.pageSize,
        email: filters.email || undefined,
        role: filters.role || undefined,
      })
  
      messageApi.success('Table refreshed successfully!')
    } catch (error) {
      console.error('Refresh error:', error)
      messageApi.error('Failed to refresh data')
    } finally {
      setIsRefreshing(false)
    }
  }
  

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      // Optimistic update
      updateUser(userId, { role: newRole })
      
      // Send mutation to update user role
      await updateUserMutation({ 
        variables: { 
          id: userId, 
          input: { role: newRole } 
        } 
      })
      
      messageApi.success('Role updated successfully!')
    } catch (error) {
      console.error('Failed to update role:', error)
      messageApi.error('Failed to update role')
      // Revert optimistic update
      refetch()
    }
  }

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPaginationState(prev => ({ ...prev, current: page, pageSize }))
    refetch({
      page,
      limit: pageSize,
      email: filters.email || undefined,
      role: filters.role || undefined,
    })
  }

  // Memoize column definitions to prevent re-creation on every render
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'ID',
      field: 'id',
      width: 80,
      sortable: true,
      filter: true,
      cellStyle: { fontWeight: '500', color: token.colorTextSecondary }
    },
    {
      headerName: 'Name',
      field: 'name',
      width: 200,
      sortable: true,
      filter: true,
      cellStyle: { fontWeight: '600' }
    },
    {
      headerName: 'Email',
      field: 'email',
      width: 280,
      sortable: true,
      filter: true,
      cellStyle: { color: token.colorPrimary }
    },
    {
      headerName: 'Role',
      field: 'role',
      width: 150,
      sortable: true,
      filter: true,
      cellRenderer: (params: any) => (
        <RoleTag 
          role={params.value} 
          editable={true}
          onRoleChange={(newRole) => handleRoleChange(params.data.id, newRole)}
        />
      ),
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 120,
      sortable: true,
      filter: true,
      cellRenderer: (params: any) => <StatusTag status={params.value} />,
    },
    {
      headerName: 'Created',
      field: 'createdAt',
      width: 150,
      sortable: true,
      filter: true,
      cellRenderer: (params: any) => (
        <Tooltip title={formatDateISO(params.value)}>
          <span style={{ color: token.colorTextSecondary }}>
            {formatDate(params.value)}
          </span>
        </Tooltip>
      ),
    },
    {
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <ActionCell
          user={params.data}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      ),
    },
  ], [handleRoleChange, token])

  // Memoize default column definition
  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
  }), [])

  // Ensure users is always an array
  const gridRowData = useMemo(() => users || [], [users])

  // Don't render the grid until we have data or are not loading
  const shouldRenderGrid = !loading || gridRowData.length > 0

  const statsData = useMemo(() => {
    if (!users) return { total: 0, active: 0, inactive: 0 }
    return {
      total: users.length,
      active: users.filter(user => user.status === 'active').length,
      inactive: users.filter(user => user.status === 'inactive').length,
    }
  }, [users])

  return (
    <div style={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorFillQuaternary} 100%)`,
      padding: '24px'
    }}>
      {contextHolder}
      <MswTest />
      
      {/* Header Section */}
      <div style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title 
              level={2} 
              style={{ 
                margin: 0, 
                background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryActive})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              <UserOutlined style={{ marginRight: '12px' }} />
              User Management
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              Manage and monitor user accounts
            </Text>
          </Col>
          <Col>
            <Space size="middle">
              <Badge count={statsData.total} color={token.colorPrimary}>
                <Card size="small" style={{ minWidth: '80px', textAlign: 'center' }}>
                  <Text strong>Total</Text>
                </Card>
              </Badge>
              <Badge count={statsData.active} color={token.colorSuccess}>
                <Card size="small" style={{ minWidth: '80px', textAlign: 'center' }}>
                  <Text strong>Active</Text>
                </Card>
              </Badge>
              <Badge count={statsData.inactive} color={token.colorWarning}>
                <Card size="small" style={{ minWidth: '80px', textAlign: 'center' }}>
                  <Text strong>Inactive</Text>
                </Card>
              </Badge>
            </Space>
          </Col>
        </Row>
      </div>

      <Card 
        style={{ 
          borderRadius: '16px',
          boxShadow: `0 8px 32px ${token.colorBgMask}`,
          border: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgElevated
        }}
        bodyStyle={{ padding: '32px' }}
      >
        {error && (
          <Alert
            message="Error"
            description={typeof error === 'string' ? error : error.message}
            type="error"
            showIcon
            closable
            style={{ 
              marginBottom: 24,
              borderRadius: '12px',
              border: `1px solid ${token.colorErrorBorder}`
            }}
          />
        )}
        
        {/* Filters and Actions */}
        <Row gutter={[24, 16]} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Input
              size="large"
              placeholder="Search by email..."
              prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
              value={filters.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('email', e.target.value)}
              allowClear
              style={{ 
                borderRadius: '12px',
                border: `1px solid ${token.colorBorder}`
              }}
            />
          </Col>
          <Col span={6}>
            <Select
              size="large"
              placeholder="Filter by role"
              prefix={<FilterOutlined />}
              value={filters.role}
              onChange={(value) => handleFilterChange('role', value)}
              allowClear
              style={{ 
                width: '100%',
                borderRadius: '12px'
              }}
            >
              <Option value="admin">Admin</Option>
              <Option value="moderator">Moderator</Option>
              <Option value="user">User</Option>
            </Select>
          </Col>
          <Col span={10}>
            <Row justify="end">
              <Space size="middle">
                <Button 
                  size="large"
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  loading={isRefreshing}
                  style={{ 
                    borderRadius: '12px',
                    border: `1px solid ${token.colorPrimary}`,
                    color: token.colorPrimary
                  }}
                >
                  Refresh
                </Button>
                <Button 
                  type="primary" 
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={handleAddUser}
                  style={{ 
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryActive})`,
                    border: 'none',
                    boxShadow: `0 4px 16px ${token.colorPrimaryBg}`
                  }}
                >
                  Add User
                </Button>
              </Space>
            </Row>
          </Col>
        </Row>

        <Divider style={{ margin: '24px 0' }} />

        {/* Data Grid */}
        <div 
          className="ag-theme-alpine" 
          style={{ 
            height: '600px', 
            width: '100%', 
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            border: `1px solid ${token.colorBorderSecondary}`
          }}
        >
          {loading && gridRowData.length === 0 && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              backdropFilter: 'blur(4px)'
            }}>
              <Spin size="large" />
            </div>
          )}
          
          {/* Only render AG Grid when we should */}
          {shouldRenderGrid && (
            <AgGridReact
              columnDefs={columnDefs}
              rowData={gridRowData}
              onGridReady={handleGridReady}
              pagination={false}
              domLayout="normal"
              defaultColDef={defaultColDef}
              rowModelType="clientSide"
              suppressMenuHide={true}
              suppressRowClickSelection={true}
              overlayLoadingTemplate="<span class='ag-overlay-loading-center'>Loading...</span>"
              overlayNoRowsTemplate="<span class='ag-overlay-no-rows-center'>No data to display</span>"
              animateRows={true}
              suppressColumnVirtualisation={false}
              suppressRowVirtualisation={false}
              rowHeight={60}
              headerHeight={50}
              // Custom styling
              getRowStyle={(params) => {
                if (params.rowIndex % 2 === 0) {
                  return { background: token.colorFillAlter }
                }
                return { background: token.colorBgContainer }
              }}
            />
          )}
          
          {/* Show empty state when no data and not loading */}
          {!loading && gridRowData.length === 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              flexDirection: 'column'
            }}>
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span style={{ color: token.colorTextTertiary, fontSize: '16px' }}>
                    No users found
                  </span>
                }
              />
            </div>
          )}
        </div>

        {/* Enhanced Pagination */}
        {gridRowData.length > 0 && (
          <div style={{ 
            marginTop: 24, 
            padding: '16px 0',
            borderTop: `1px solid ${token.colorBorderSecondary}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Text style={{ color: token.colorTextSecondary, fontSize: '14px' }}>
              Showing {((pagination.current - 1) * pagination.pageSize) + 1} to{' '}
              {Math.min(pagination.current * pagination.pageSize, pagination.total)} of{' '}
              <strong>{pagination.total}</strong> users
            </Text>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePaginationChange}
              onShowSizeChange={handlePaginationChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) => 
                `${range[0]}-${range[1]} of ${total} items`
              }
              pageSizeOptions={['10', '20', '50', '100']}
              className="custom-pagination"
            />
          </div>
        )}
      </Card>

      <UserFormModal
        visible={formModalVisible}
        onCancel={() => setFormModalVisible(false)}
        onSuccess={handleFormSuccess}
        user={selectedUser}
        mode={formMode}
      />

      <DeleteConfirmModal
        user={selectedUser}
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}

export default UsersPage