import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import App from './app/App'
import { client } from './app/providers/apollo-client'

// Start MSW in development
async function startApp() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./app/providers/msw')
    await worker.start()
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#1890ff',
                borderRadius: 6,
              },
            }}
          >
            <App />
          </ConfigProvider>
        </BrowserRouter>
      </ApolloProvider>
    </React.StrictMode>,
  )
}

startApp() 