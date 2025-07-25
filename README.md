# DevTasks - Desktop Task Management App

DevTasks is a cross-platform desktop application for managing tasks with offline support and cloud synchronization. Built with **Go** for the backend and **Electron** with **TypeScript/React** for the frontend, it provides a seamless experience for organizing tasks with a modern and intuitive interface.

## Features

- **Task Management**: Create, edit, delete, and categorize tasks (To-Do, In Progress, Done).
- **Offline Support**: Store tasks locally using SQLite, allowing usage without an internet connection.
- **Cloud Synchronization**: Sync tasks with a remote server when online for seamless access across devices.
- **Real-Time Updates**: Receive task updates in real-time using WebSocket (optional feature).
- **Cross-Platform**: Runs on Windows, macOS, and Linux via Electron.
- **Minimalist UI**: Clean and responsive interface styled with Tailwind CSS.

## Tech Stack

- **Backend**: Go (Gin for REST API, Gorilla WebSocket for real-time updates, SQLite for local storage)
- **Frontend**: Electron, TypeScript, React, Tailwind CSS
- **Database**: SQLite (local), PostgreSQL (cloud, optional)
- **Deployment**: Docker (optional for server), Electron Builder for desktop app

## Getting Started

### Prerequisites

- **Go**: v1.18 or higher
- **Node.js**: v16 or higher
- **npm**: v8 or higher
- **Git**: For cloning the repository

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Author**: Amin Asadi
- **GitHub**: [aminasadiam](https://github.com/aminasadiam)
- **Telegram**: [aminasadiam](https://t.me/aminasadiam)
