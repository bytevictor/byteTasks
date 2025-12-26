# byteTasks 🚀

> **Your Tasks. Your Drive. 100% Privacy.**

![byteTasks Banner](https://via.placeholder.com/1200x400?text=byteTasks+Preview)

**byteTasks** is a modern, privacy-first task management application that lives entirely in your browser. It syncs your data directly to your personal **Google Drive**, ensuring you own your data completely. No third-party servers, no tracking, just you and your tasks.

## ✨ Features

### 🔒 Privacy & Storage

- **Google Drive Sync**: Seamlessly syncs your tasks to a private JSON file in your Google Drive.
- **Guest Mode**: Use the app locally without an account. Data stays in your browser's LocalStorage.
- **Frontend-Only**: Authentication and data handling happen directly between you and Google.

### 🎨 User Experience

- **Beautiful UI**: Built with a stunning glassmorphism design using **daisyUI** and **TailwindCSS**.
- **Theming**: Choose from a variety of vibrant themes (Cyberpunk, Retro, Synthwave, and more).
- **Smooth Animations**: Enjoy fluid transitions and interactions.
- **Responsive**: Fully optimized for Desktop and Mobile.
- **Gestures**: Swipe from the right edge on mobile to open the settings drawer.

### ⚡ Productivity

- **Keyboard Shortcuts**: Power user? Control your tasks without leaving the keyboard.
- **Drag & Drop**: Reorder tasks effortlessly.
- **Bi-lingual**: Native support for **English** 🇺🇸 and **Spanish** 🇪🇸.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+ (App Router)](https://nextjs.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) & [daisyUI](https://daisyui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context + Hooks
- **Persistence**: Google Drive API v3 & IndexedDB/LocalStorage

## 🚀 Getting Started

### Prerequisites

You will need **Node.js 18+** and a **Google Cloud Project** with the Drive API enabled.

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/byteTasks.git
    cd byteTasks
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your Google Cloud credentials:

    ```env
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
    NEXT_PUBLIC_GOOGLE_API_KEY=your_api_key
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
