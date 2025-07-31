import { setupWorker } from 'msw/browser'
import { graphql } from 'msw'

// Mock data
const mockUsers = [
  {
    id: '1',
    name: 'Muhammad Hammad',
    email: 'muhammadhammad@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2023-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Usman Naveed',
    email: 'usmannaveed@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2023-02-20T14:45:00Z',
  },
  {
    id: '3',
    name: 'Behroze Ali',
    email: 'behrozeali@example.com',
    role: 'moderator',
    status: 'banned',
    createdAt: '2023-03-10T09:15:00Z',
  },
  {
    id: '4',
    name: 'Uneeb Ur Rehman',
    email: 'uneeburrehman@example.com',
    role: 'user',
    status: 'pending',
    createdAt: '2023-04-05T16:20:00Z',
  },
  {
    id: '5',
    name: 'Usama Basharat',
    email: 'usamabasharat@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2023-05-12T11:00:00Z',
  },
]

let users = [...mockUsers]

export const worker = setupWorker(
  graphql.query('GetUsers', ({ variables }) => {
    const { page = 1, limit = 10, email, role } = variables || {}
    
    let filteredUsers = users
    
    if (email) {
      filteredUsers = filteredUsers.filter(user => 
        user.email.toLowerCase().includes(email.toLowerCase())
      )
    }
    
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role)
    }
    
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)
    
    return Response.json({
      data: {
        users: {
          data: paginatedUsers,
          total: filteredUsers.length,
          page,
          limit,
        }
      }
    })
  }),

  graphql.mutation('CreateUser', ({ variables }) => {
    const { input } = variables
    const newUser = {
      id: String(users.length + 1),
      ...input,
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    
    return Response.json({
      data: {
        createUser: newUser
      }
    })
  }),

  graphql.mutation('UpdateUser', ({ variables }) => {
    const { id, input } = variables
    const userIndex = users.findIndex(user => user.id === id)
    
    if (userIndex === -1) {
      return Response.json({
        errors: [
          {
            message: 'User not found',
            extensions: { code: 'USER_NOT_FOUND' }
          }
        ]
      })
    }
    
    users[userIndex] = { ...users[userIndex], ...input }
    
    return Response.json({
      data: {
        updateUser: users[userIndex]
      }
    })
  }),

  graphql.mutation('DeleteUser', ({ variables }) => {
    const { id } = variables
    const userIndex = users.findIndex(user => user.id === id)
    
    if (userIndex === -1) {
      return Response.json({
        errors: [
          {
            message: 'User not found',
            extensions: { code: 'USER_NOT_FOUND' }
          }
        ]
      })
    }
    
    const deletedUser = users[userIndex]
    users = users.filter(user => user.id !== id)
    
    return Response.json({
      data: {
        deleteUser: deletedUser
      }
    })
  })
) 