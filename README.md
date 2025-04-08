# PingMe Chat Application

A modern chat application built with React and Material UI.

## Features

- **User Authentication**
  - Admin and User login options
  - Google and GitHub authentication (mock implementation)
  - Secure route protection

- **Chat Interface**
  - Personal, Department, and Group chats
  - Real-time messaging (mock implementation)
  - File attachments and voice messages (mock implementation)
  - Message history

- **Contact Management**
  - Search functionality
  - Online/offline status indicators
  - Contact categorization

- **Notice Board**
  - Company announcements
  - Filterable notices
  - Notice history

- **User Profile**
  - Profile information display
  - Logout functionality

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/pingme-chat.git
cd pingme-chat
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── assets/         # Static assets like images and icons
├── components/     # Reusable UI components
├── context/        # React context for state management
├── pages/          # Page components
├── App.jsx         # Main application component
├── main.jsx        # Application entry point
└── index.css       # Global styles
```

## Authentication

The application currently uses mock authentication. To implement real authentication:

1. Configure Google OAuth in the Google Cloud Console
2. Configure GitHub OAuth in the GitHub Developer Settings
3. Update the authentication functions in `AuthContext.jsx`

## Future Enhancements

- Real-time messaging using WebSockets
- End-to-end encryption
- Message reactions and replies
- User profile customization
- Dark mode support
- Mobile responsiveness improvements

## License

This project is licensed under the MIT License - see the LICENSE file for details.
