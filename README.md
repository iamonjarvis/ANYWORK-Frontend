# ANYWORK
### ANYWORK is a job posting and finding platform where users can post work opportunities, find available work, and chat with potential collaborators. The platform is built with a modern stack, including React, Tailwind CSS, Leaflet for the frontend, and Node.js, Express.js, and MongoDB for the backend.

## Features
### Post Work: Users can create job postings by specifying details such as title, description, amount, date, time, and location.
### Find Work: Users can search for available jobs based on their preferences.
### Interactive Map: Use Leaflet for selecting the job location on an interactive map.
### Real-time Messaging: Socket.IO integration allows users to chat in real-time.
### User Authentication: Secure login and registration with JWT authentication.
### Technologies Used
#### Frontend:
* React.js
* Tailwind CSS
* Leaflet
* Axios (for API requests)
* React Router (for navigation)
#### Backend:
* Node.js
* Express.js
* MongoDB
* Socket.IO (for real-time messaging)
* JWT Authentication
### Prerequisites
To run the project locally, you need to have the following installed:

#### Node.js
#### MongoDB
#### React (for frontend)
### Setup Instructions
1. Clone the Repository

git clone https://github.com/yourusername/anywork.git

2. Install Backend Dependencies
Navigate to the backend directory and install dependencies:


cd anywork/backend
npm install

3. Setup the Frontend
Navigate to the frontend directory and install dependencies:


cd anywork/frontend
npm install

4. Environment Variables
Create a .env file in both the backend and frontend directories to configure environment variables like MongoDB URI, JWT secret, etc.

Backend .env example:

```
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
PORT=5000 
```
5. Run the Application
##### Backend:


cd anywork/backend
npm start
##### Frontend:


cd anywork/frontend
npm start

### Contact
For inquiries, please contact sahilp123456@gmail.com or open an issue in the repository.
