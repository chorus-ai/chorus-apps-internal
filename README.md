# Hulab Apps! 🌍

This is a fullstack JavaScript application with:

- **React (Create React App)** for the frontend
- **Node.js + Express** for the backend

The frontend is modularized into separate apps and shares components via a common `shared/` folder.

---

## 📁 Project Structure

```
App/
├── client/                # React frontend
│   ├── public/
│   ├── src/
│   │   ├── apps/          # e.g., app1, app2
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── server/                # Express backend
│   ├── server.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Step 1: Install dependencies

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### Step 2: Run the full app (dev mode)

From the root of the project:

```bash
npm run dev
```

This will:
- Start React on [http://localhost:3000](http://localhost:3000)
- Start Express on [http://localhost:8080](http://localhost:8080)
- Forward API requests (from frontend) to the backend

---

## 🔁 Proxy Setup

To allow the React frontend to talk to the Express backend during development, add this line to `client/package.json`:

```json
"proxy": "http://localhost:8080",
```
---

## 📦 Scripts Overview

### Client `package.json`
```json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build"
}
```

### Server `package.json`
```json
"scripts": {
  "start": "node server.js"
}
```
---

## 🛠 Future Todos

- Add authentication (JWT, OAuth)
- Add form validation, protected routes
- Dockerize for easy deployment
- Add tests (Jest, Supertest, etc.)

---

## 🙌 Contributions Welcome

Feel free to fork this repo, submit issues, or open pull requests to improve the project!

