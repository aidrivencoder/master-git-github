# GitHub Tutorial Platform

An interactive platform for learning Git and GitHub through hands-on tutorials.

## Features

### Implemented
- 🔐 Authentication with email/password
- 🌓 Dark/light theme support
- 👤 User profiles with display name customization
- 📚 Tutorial listing and viewing
- 🔒 Protected routes for authenticated content
- 🎨 Responsive design with Tailwind CSS
- 🔥 Real-time Firebase integration
- ⚡ Built with Next.js 13 App Router

### Coming Soon
- 🔄 OAuth authentication (GitHub, Google)
- 📧 Password reset functionality
- 📱 Profile picture uploads
- 🏷️ Tutorial filtering and search
- 📊 Progress tracking
- ⭐ Tutorial bookmarking
- 💳 Premium subscriptions
- 📱 Offline support

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **State Management**: React Query, Zustand
- **UI Components**: Headless UI
- **Icons**: Heroicons

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/github-tutorial-platform.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── app/                 # Next.js 13 app directory
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── home/           # Homepage components
│   ├── layout/         # Layout components
│   ├── profile/        # Profile components
│   ├── providers/      # Context providers
│   ├── theme/          # Theme components
│   ├── tutorials/      # Tutorial components
│   └── ui/             # Shared UI components
├── lib/                # Utility functions
│   ├── firebase/       # Firebase configuration
│   ├── hooks/          # Custom hooks
│   └── utils/          # Helper functions
├── stores/             # State management
└── types/              # TypeScript types
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.