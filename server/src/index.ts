import app from './app';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize Server
const startServer = async () => {
  try {
    // Initialize SQLite Database
    initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
