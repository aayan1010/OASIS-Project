# OASIS Backend

This is the backend API for the OASIS project, built using Node.js and Express.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/)

## Getting Started

1. **Install Dependencies**
   Navigate to the backend directory and install the required packages:
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root of the `oasis_backend` directory (a template is provided if you look at the source) and add your environment variables.
   ```env
   PORT=5000
   ```

3. **Running the Server**
   - For development (with hot-reloading via nodemon):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

## API Endpoints

- `GET /` - Basic endpoint that returns a welcome message.
