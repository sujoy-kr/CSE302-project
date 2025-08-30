# Canteen Management Project

This is a Canteen Management system with a React frontend and a Node.js backend. The project allows managing canteen operations such as orders, supplies, food items etc.

## Prerequisites

Before running the project, make sure you have the following software installed:

- XAMPP
- Node.js

## Project Structure

- **frontend** - ReactJS for the user interface.
- **backend** - Node.js application for the backend and API.

## Setup Instructions

1. **Clone the repository** to your local machine:

   ```bash
   git clone https://github.com/sujoy-kr/CSE302-project.git
   cd CSE302-project
   ```

2. **Install dependencies** in both frontend and backend folders:

   ```bash
   cd frontend
   npm install

   cd backend
   npm install
   ```

3. **Enable MySQL** in XAMPP before starting the backend.

4. **Run the applications**:

   ```bash
   # In frontend folder
   cd frontend
   npm run dev

   # In backend folder
   cd backend
   npm run dev
   ```

5. Open your browser and access the frontend application (usually at `http://localhost:5173`).

## Notes

- Make sure MySQL is running before starting the backend server.
- Any configuration for database connection (host, username, password) goes in the backend/db.js file.
