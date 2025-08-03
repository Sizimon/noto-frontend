# Noto Frontend

Noto is a modern, full-featured note-taking and productivity web application. This repository contains the **frontend** for Noto, built with a focus on speed, accessibility, and a beautiful user experience. It supports rich text editing, dark/light themes, tag and task management, and is designed to be easily extensible for future features.

---

## 🚀 Technologies Used

- **Next.js 15** — App Router, SSR, API routes
- **TypeScript** — Type safety and maintainability
- **Tailwind CSS** — Utility-first, responsive styling
- **Framer Motion** — Smooth UI animations
- **Tiptap** — Rich text editor
- **next-themes** — Dark/Light mode support
- **React 19** — Modern, concurrent UI
- **Vitest** — Unit testing
- **Custom Theme System** — Easily swap colors and fonts

---

## 📚 Project Context

Noto Frontend is designed to provide a seamless, fast, and enjoyable experience for users managing notes and tasks. It features:

- **Authentication** and protected/private routes
- **Tag management** with suggestions and color coding
- **Responsive design** for desktop and mobile
- **Customizable theme and font system**
- **API integration** with a dedicated backend

The project is structured for scalability and maintainability, making it easy to add new features and adapt to different use cases.

---

## 🛠️ Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/noto-frontend.git
   cd noto-frontend
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Run the development server:**
   ```sh
   npm run dev
   ```
4. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
  app/            # Next.js app directory (routing, layouts, pages)
  components/     # Reusable UI components
  context/        # React context providers (Auth, Theme, Tags, etc.)
  theme/          # Theme and font configuration
  utils/          # Utility functions and helpers
  connections/    # API connection logic
public/           # Static assets (favicon, images, etc.)
```

---

## 🧩 Customization

- **Fonts:** Easily swap fonts using Next.js font optimization in `layout.tsx` and CSS variables in `globals.css`.
- **Theme:** Customize colors and themes in the Tailwind config and CSS variables.
- **API:** Update API endpoints in `src/connections/api.ts` to match your backend.

---

## 🔮 Future Features

### ClipCurator (Planned)

**ClipCurator** will allow users to timestamp media with notes and import it into their notes for easy dissection.
This feature aims to:
- Provide a browser extension or in-app tool for clipping content from the web
- Automatically tag and categorize clippings
- Enable fast search and retrieval of saved clips
- Integrate with the main note/task workflow for seamless productivity

Stay tuned for updates as this feature is developed!

---

## 📄 License

This project is licensed under the MIT License.

---

## 🔗 Related

- **Backend:** See the [Noto Backend README](https://github.com/Sizimon/noto-backend/blob/main/README.md) for API and server setup.
