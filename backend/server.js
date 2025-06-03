const express = require('express');
const chats = require('./data/data.js');
const dotenv = require('dotenv'); 
const connectDB = require('./config/db.js');
const colors= require('colors'); // For colored console output
const userRoutes = require('./routes/userRoutes.js'); // Import user routes
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js'); // Import error handling middleware

dotenv.config();
connectDB()
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
// Middleware to parse JSON bodies

app.get('/', (req, res) => {
    res.send('API is running yoo...');
});

app.use('/api/user',userRoutes)
const PORT = process.env.PORT || 5000;

app.get('/api/chat', (req, res) => {
    res.send([{ _id: 1, message: 'Hello from backend!' }]);
  });
  

app.use(notFound); // Middleware for handling 404 errors
app.use(errorHandler); // Middleware for handling errors

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.yellow.bold);
});
