Book Explorer 📚

Book Explorer is a full-stack web application that scrapes book data from the "Books to Scrape" website, stores it in a MongoDB database, and presents it through a dynamic frontend built with React. Users can browse, search, and filter through the entire catalog of books.

This project was built to demonstrate a complete development cycle, from data scraping and database management to API and frontend development.
Features

    Automated Scraper: A Node.js script to scrape book details (title, price, rating, etc.) from all pages of the source website.

    Backend API: A robust Express.js API to serve the book data.

    Dynamic Frontend: A responsive React application for users to interact with the data.

    Search: Full-text search by book title.

    Filtering: Filter books by rating ("and below") and by a minimum/maximum price range.

    Pagination: Paginated display of books to handle the large catalog efficiently.

Project Structure

/book-explorer
|-- /scraper
|   |-- scraper.js
|   |-- package.json
|-- /backend
|   |-- server.js
|   |-- package.json
|-- /frontend
|   |-- (React app structure)
|-- README.md

Technology Stack

    Scraper: Node.js, Axios, Cheerio, Mongoose

    Backend: Node.js, Express, Mongoose, CORS

    Frontend: React, Vite, Axios

    Database: MongoDB

Setup and Installation
Prerequisites

    Node.js (v18 or later)

    npm

    A running MongoDB instance (local or via MongoDB Atlas)

1. Clone the Repository

git clone <your-repo-url>
cd book-explorer

2. Install Dependencies

You need to install dependencies for each part of the application separately.

    For the Scraper:

    cd scraper
    npm install
    cd ..

    For the Backend:

    cd backend
    npm install
    cd ..

    For the Frontend:

    cd frontend
    npm install
    cd ..

3. Configure Environment

Make sure your MongoDB connection string is correctly configured in the following files:

    scraper/scraper.js

    backend/server.js

Update the MONGO_URI variable to point to your MongoDB instance.
Example: const MONGO_URI = 'mongodb://127.0.0.1:27017/book-explorer-db';
How to Run the Application
1. Run the Scraper

First, populate the database using the scraper script.

cd scraper
node scraper.js

Wait for the script to finish. It will log its progress in the terminal.
2. Start the Backend Server

In a new terminal window, start the backend API server.

cd backend
npm install -g nodemon # Optional, for a better dev experience
nodemon server.js

The server should now be running on http://localhost:5000.
3. Launch the Frontend Application

In a third terminal window, launch the React development server.

cd frontend
npm run dev

The application will be available at http://localhost:5173 (or another port if 5173 is busy).