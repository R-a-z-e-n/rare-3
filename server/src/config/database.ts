import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DATABASE_URL || path.join(__dirname, '../../rare_wellness.sqlite');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize Database Schema
export const initializeDatabase = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone_number TEXT,
      password TEXT,
      role TEXT DEFAULT 'user',
      membership TEXT DEFAULT 'Classic',
      points INTEGER DEFAULT 0,
      otp TEXT,
      otp_expiry TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT,
      name TEXT NOT NULL,
      image TEXT,
      price REAL,
      category TEXT,
      rating REAL,
      description TEXT,
      ingredients TEXT,
      usage TEXT,
      stock INTEGER DEFAULT 100
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT,
      address TEXT,
      image TEXT,
      tags TEXT,
      price TEXT,
      rating REAL,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      userId TEXT,
      serviceId TEXT,
      date TEXT,
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS wishlist (
      id TEXT PRIMARY KEY,
      userId TEXT,
      productId INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id),
      FOREIGN KEY (productId) REFERENCES products (id)
    );
  `);
  console.log('Database initialized successfully');
};

export default db;
