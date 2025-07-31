# User Management Panel

A modern React TypeScript application for managing users with a clean, intuitive interface built using AG Grid, Ant Design, and GraphQL.

## 🚀 Features

- **User List**: Display users in an AG Grid table with sorting, filtering, and pagination
- **Add User**: Modal form for creating new users with validation
- **Edit User**: Update existing user information
- **Delete User**: Confirmation modal for safe user deletion
- **Filtering**: Filter by email and role
- **Status Tags**: Visual status indicators (Active, Banned, Pending)
- **Role Tags**: Role display with icons (Admin, Moderator, User)
- **Date Formatting**: Formatted creation dates with tooltips
- **Responsive Design**: Clean, modern UI with Ant Design components

## 🛠 Tech Stack

- **React 18** with TypeScript
- **Zustand** for state management
- **Apollo Client** for GraphQL operations
- **AG Grid** for advanced table functionality
- **Ant Design** for UI components
- **MSW (Mock Service Worker)** for API mocking
- **date-fns** for date formatting
- **Vite** for fast development and building

## 📁 Project Structure

```
src/
├── app/                    # Application layer
│   ├── providers/         # Apollo Client, MSW setup
│   ├── App.tsx           # Main app component
│   └── App.css           # Global styles
├── pages/                 # Page components
│   └── users/            # User management page
├── features/              # Feature components
│   ├── user-form/        # Add/Edit user modal
│   └── user-delete/      # Delete confirmation modal
├── entities/              # Business entities
│   └── user/             # User types, GraphQL, store
└── shared/               # Shared utilities
    ├── ui/               # Common UI components
    └── lib/              # Utilities and helpers
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd user-management-panel
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎨 UI Components

### Custom Components

- **StatusTag**: Displays user status with color-coded tags
- **RoleTag**: Shows user roles with icons
- **UserFormModal**: Form for adding/editing users
- **DeleteConfirmModal**: Confirmation dialog for deletions

### Table Features

- **Sorting**: Click column headers to sort
- **Filtering**: Use the filter inputs above the table
- **Pagination**: Built-in pagination controls
- **Resizable Columns**: Drag column borders to resize
- **Action Buttons**: Edit and Delete buttons in each row

## 🔧 Configuration

### GraphQL Setup

The application uses MSW (Mock Service Worker) to mock GraphQL API calls in development. The mock data includes:

- 5 sample users with different roles and statuses
- Full CRUD operations (Create, Read, Update, Delete)
- Filtering and pagination support

### State Management

Zustand store manages:
- User list data
- Loading states
- Error handling
- Pagination information

### Styling

- Ant Design theme customization
- Responsive design
- Clean, modern UI with proper spacing
- Custom component styling

## 🎯 Key Features Explained

### User Status System
- **Active**: Green tag - User can access the system
- **Banned**: Red tag - User access is restricted
- **Pending**: Yellow tag - User awaiting approval

### Role System
- **Admin**: Red tag with crown icon - Full system access
- **Moderator**: Blue tag with certificate icon - Limited admin access
- **User**: Default tag with user icon - Basic access

### Date Formatting
- Display format: `DD.MM.YYYY, HH:mm`
- Tooltip shows full ISO date on hover
- Proper timezone handling

## 🔮 Future Enhancements

- [ ] Dark theme support
- [ ] Advanced filtering options
- [ ] Bulk operations (delete multiple users)
- [ ] User activity logs
- [ ] Export functionality (CSV, PDF)
- [ ] Real-time updates with WebSocket
- [ ] User profile images
- [ ] Advanced search with multiple criteria

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue in the repository. 