import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import UsersPage from '@/pages/users/UsersPage'
import './App.css'

const { Content } = Layout

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px' }}>
        <Routes>
          <Route path="/" element={<UsersPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </Content>
    </Layout>
  )
}

export default App 