# 🚀 Streamify — Language Exchange, Real-Time Chat & Video Calling App

Streamify is a full-stack language-exchange platform that helps users connect with partners to learn new languages through **real-time chat**, **video calls**, and **collaborative communication tools**.

Whether your native language is English and you want to learn Hindi—or any other combination—Streamify matches you with the right partner for effective language learning.

---

##  Features

### 🔥 Real-Time Communication
- Live chat with typing indicators  
- Emoji reactions  
- Online/offline presence  
- Message read receipts  

### 🎥 Video Calling
- 1-on-1 and Group video calls  
- Screen sharing  
- Call recording  
- High-quality WebRTC via Stream  

### 🌍 Language Exchange System
- Match users by:
  - Native language  
  - Target language  
- Smart user profiles  
- Clean matching UI  

### 🎨 UI Customization
- 32+ unique UI themes  
- Dark/Light mode  
- Modern and clean interface  

### 🔐 Authentication & Security
- JWT authentication  
- Protected routes  
- Password hashing  
- Secure session handling  

### ⚙️ Tech Stack
- **Frontend:** React, Vite, TailwindCSS, Zustand, TanStack Query  
- **Backend:** Node.js, Express, MongoDB  
- **Real-Time Engine:** Stream  
- **Others:** Axios, WebSockets, REST API  

---

## 📁 Project Structure

```
Streamify/
│── backend/      # Express API
│── frontend/     # React UI
│── README.md
│── package.json
```

---

## 🔧 Environment Variables

### Backend (`/backend/.env`)
```env
PORT=5000
MONGO_URI=your_mongo_uri
STEAM_API_KEY=your_stream_api_key
STEAM_API_SECRET=your_stream_api_secret
JWT_SECRET_KEY=your_jwt_secret
NODE_ENV=development
```

### Frontend (`/frontend/.env`)
```env
VITE_STREAM_API_KEY=your_stream_api_key
```

---

## 🧪 Run Locally

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

> Backend: http://localhost:5000 
> Frontend: http://localhost:5173

---

## 🖼️ Demo

![App Preview](/frontend/public/screenshot-for-readme.png)

---


