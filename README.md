# 🖍️ Real Time Whiteboard

Real Time Whiteboard is a collaborative web-based tool where multiple users can join a session and collaborate on work in real time. Users can also create their own private boards to work individually. The project is built with Keycloak for authentication, React for the front-end, and WebSocket for real-time collaboration.

## 🚀 Features

- **Real-time Collaboration**: Multiple users can join the same whiteboard session and draw, add notes, and interact with the board in real time.
- **Private Workspace**: Users can work individually on their own private whiteboards.
- **User Authentication**: Secure login and logout functionality using Keycloak.
- **Session Management**: Users can create, join, and leave whiteboard sessions.
- **Responsive Design**: Fully responsive interface to work across all screen sizes.

## 🛠️ Technologies Used

- **Frontend**: React
- **Authentication**: Keycloak
- **Real-time Communication**: WebSockets
- **Backend**: Node.js (or any backend of choice for managing WebSocket connections)
- **State Management**: Context API

---

## ⚙️ Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/realtime-whiteboard.git
   cd realtime-whiteboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory and add the following:

   ```bash
   VITE_KEYCLOAK_URL=http://localhost:8080/
   VITE_KEYCLOAK_REALM=myRealm
   VITE_KEYCLOAK_CLIENT_ID=myClient
   VITE_BACKEND_URL=http://localhost:3000
   ```

4. **Start the development server**:
   ```bash
   npm run dev 
   ```
   both for frontend and backend in there respective folders

   This will launch the app.

---

## 🔐 Keycloak Setup

This project uses **Keycloak** for authentication. Follow these steps to set up Keycloak for the application:

1. **Install Keycloak**: Follow the official [Keycloak installation guide](https://www.keycloak.org/getting-started) to install it on your system.

2. **Create a Realm**: In the Keycloak admin console, create a realm to manage users.

3. **Create a Client**: Under the new realm, create a client application with the following settings:
   - **Client Protocol**: `openid-connect`
   - **Access Type**: `public`
   - **Valid Redirect URIs**: `http://localhost:3000/*`

4. **Get Client Details**: Copy the client ID, Keycloak URL, and realm name into the `.env` file.

---

## 👨‍💻 Usage

1. **Login**: Users can log in using the secure Keycloak authentication. Upon login, they will be redirected to the whiteboard dashboard.
   
2. **Create or Join Session**: Users can create a new session or join an existing one by entering a session ID.

3. **Collaborate**: In real-time, users can draw, type, and collaborate on a shared whiteboard. The WebSocket connection ensures real-time synchronization.

4. **Private Boards**: Users can also work on their private boards without sharing with others.

5. **Logout**: Clicking the "Logout" button will securely log the user out of the application and invalidate their session.

---
## 🖼️ Screenshots
![rt login](https://github.com/user-attachments/assets/56ac3270-ce47-471e-b528-251f64360acf)
![rt landing](https://github.com/user-attachments/assets/51fe3630-26e8-4790-9a30-1daf514d9bc8)
![rt whitboard working](https://github.com/user-attachments/assets/99f3a303-b093-4ae5-8933-b6f56e6a0dca)
![rt multiuser](https://github.com/user-attachments/assets/1b25b256-79cd-4434-a9ae-01da4f356bb2)
![rt share](https://github.com/user-attachments/assets/2c1bf5fa-c9fb-4343-b18b-40d2ac3c7758)
![rt zoom](https://github.com/user-attachments/assets/05f3e882-7709-4516-b0bc-fce59b8f3318)

---
## 🌐 WebSocket Implementation

The WebSocket connection ensures real-time updates to all connected users. Here's an overview of how it's structured:

- **Backend (Node.js)**: Handles WebSocket connections and broadcasts whiteboard updates to all connected clients.
- **Frontend (React)**: Listens for WebSocket events and updates the board in real time when a user performs an action (e.g., drawing, erasing).

---

## 🧩 Future Enhancements

- **Chat Functionality**: Add a real-time chat feature for better collaboration.
- **Audio/Video Integration**: Allow users to communicate via audio or video while collaborating on the whiteboard.
- **Versioning**: Allow users to save and revisit different versions of a whiteboard.
- **Export Feature**: Add the ability to export whiteboard content as images or PDFs.

---

## 👥 Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1. Fork the project.
2. Create a new branch.
3. Commit your changes.
4. Open a pull request.

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

### 🎉 Happy Collaborating!

---

This `README.md` file gives a comprehensive overview of this project, including installation, setup, usage, and future plans, all while following best practices for open-source projects.
