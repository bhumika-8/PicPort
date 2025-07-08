# PicPort

PicPort is a full-stack MERN application for uploading and sharing images of places. Users can sign up, authenticate, create places, and upload images which are stored securely on Cloudinary. The frontend is built using React and deployed via Vercel, while the backend is built with Node.js/Express and deployed on Render.

## Live Demo

- Frontend: https://pic-port.vercel.app
- Backend API: https://picport-backend-ouzn.onrender.com

## Features

- User signup and login with JWT authentication
- Secure password hashing using bcrypt
- Image upload via Multer and Cloudinary
- Create, update, and delete places (title, description, address, image)
- Deleting a place also deletes the associated Cloudinary image
- Fully responsive frontend with modern glassmorphism UI
- Cloud-based deployment (Vercel for frontend, Render for backend)

## Technologies Used

### Frontend

- React (with Hooks and Context API)
- React Router
- Vite
- Vercel (deployment)
- Custom CSS styling with transitions and effects

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- multer and multer-storage-cloudinary for file uploads
- Cloudinary SDK
- Render for deployment

## Environment Variables

### Backend (`.env` on Render)

- `MONGODB_URI=your_mongo_connection_string`
- `JWT_SECRET=your_jwt_secret`
- `CLOUDINARY_CLOUD_NAME=your_cloud_name`
- `CLOUDINARY_API_KEY=your_api_key`
- `CLOUDINARY_API_SECRET=your_api_secret`


### Frontend (`.env` for Vite)
-`VITE_BACKEND_URL=https://your-backend.onrender.com`

> Note: When running locally, use `http://localhost:5000` instead of the Render URL.

---

## Getting Started (Run Locally)

### Prerequisites

- Node.js and npm
- MongoDB (local or hosted via Atlas)

### Clone the repository
- `git clone https://github.com/bhumika-8/PicPort.git`
- `cd picport`

### Setup Backend

- `cd backend`
- `npm install`

Create a `.env` file inside the `backend` directory and fill in the required environment variable values as listed above.


Start the backend server:

npm start

> Server runs on `http://localhost:5000`

---

### Setup Frontend

- `cd ../frontend`
- `npm install`

Create a `.env` file inside the `frontend` directory:

VITE_BACKEND_URL=http://localhost:5000

Start the frontend dev server:

npm run dev

> Frontend runs on `http://localhost:5173`

---

## Build and Deployment

### Frontend (Firebase)

To build and deploy:

- Push commits to GitHub
- Vercel auto-deploys on push or can be manually triggered
- Make sure Vercel environment variables are correctly set in the dashboard:

### Backend (Render)

- Push commits to GitHub
- Render auto-deploys or can be manually triggered
- Make sure Render’s environment variables are correctly set in the dashboard

---

## Folder Structure
```
PicPort/
├── backend/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ └── app.js
│
├── frontend/
│ ├── src/
│ │ ├── places/
│ │ ├── shared/
│ │ ├── user/
│ │ ├── App.jsx
│ │ ├── index.css
│ │ └── main.jsx
│ └── index.html
```
---

## Known Limitations / Future Enhancements

- Add profile pages for users
- Add comments or likes to places
- Integrate Google Maps or Leaflet for better location UX
- Add pagination and search functionality

---

## Author

**Bhumika**  
Computer Science Student  
GitHub: https://github.com/bhumika-8

---

## License

This project is licensed under the MIT License.

