import { gql } from '@apollo/client'

export const GET_USERS = gql`
  query GetUsers($page: Int, $limit: Int, $email: String, $role: String) {
    users(page: $page, limit: $limit, email: $email, role: $role) {
      data {
        id
        name
        email
        role
        status
        createdAt
      }
      total
      page
      limit
    }
  }
`

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      role
      status
      createdAt
    }
  }
`

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
      role
      status
      createdAt
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      name
      email
      role
      status
      createdAt
    }
  }
`

export type GetUsersQuery = {
  users: {
    data: Array<{
      id: string
      name: string
      email: string
      role: string
      status: string
      createdAt: string
    }>
    total: number
    page: number
    limit: number
  }
}

export type CreateUserMutation = {
  createUser: {
    id: string
    name: string
    email: string
    role: string
    status: string
    createdAt: string
  }
}

export type UpdateUserMutation = {
  updateUser: {
    id: string
    name: string
    email: string
    role: string
    status: string
    createdAt: string
  }
}

export type DeleteUserMutation = {
  deleteUser: {
    id: string
    name: string
    email: string
    role: string
    status: string
    createdAt: string
  }
} 