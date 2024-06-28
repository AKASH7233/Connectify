# 🌐 Connectify

Connectify is a social networking web application designed to connect people through shared interests and activities.

## ✨ Features

- 🔒 **User Authentication**: Secure login and registration.
- 📝 **Profile Management**: Create and update profiles.
- 🤝 **Friend Connections**: Send and accept friend requests.
- 💬 **Messaging**: Real-time chat with friends.
- 🗨️ **Posts and Comments**: Create posts, comment, and interact with others.

## 🚀 Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/AKASH7233/Connectify.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Connectify
    ```
3. Install dependencies for the client and server:
    ```bash
    cd client
    npm install
    cd backend
    npm install
    ```
4. Create a `.env` file in the `backend` directory with the following keys and your corresponding values:
    ```
    PORT=8080
    MONGO_URI='Your MongoDB collection URI'
    DB_NAME='Your Database Name'
    ACCESS_TOKEN_SECRET= 'Your Access Token Secret '
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=' Your Refresh Token Secret'
    REFRESH_TOKEN_EXPIRY=10d
    CLOUDINARY_CLOUD_NAME= 'Your Cloudinary Cloud Name'
    CLOUDINARY_API_KEY= ' Your Cloudinary API Key '
    CLOUDINARY_API_SECRET= 'Your Cloudinary API Secret '
    NODE_ENV=production

    ```

5. Run the application:
    ```bash
    # In the backend directory
    npm run dev

    # In the client directory
    npm run both
    ```

## 📖 Usage

- Open your browser and go to `http://localhost:5173`
- Register or log in to start connecting with others

## 🛠️ Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.io

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a new Pull Request

## 📜 License

This project is licensed under the MIT License.

---

For more details, visit the [Connectify repository](https://github.com/AKASH7233/Connectify).
