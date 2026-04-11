const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, 'database.sqlite');

try {
  const db = new Database(dbPath, { readonly: true });
  console.log('\n--- 📂 DATABASE INSPECTION ---\n');

  // List Users
  console.log('✅ USERS:');
  const users = db.prepare('SELECT id, name, email, phone_number, role, points FROM users').all();
  console.table(users);

  // List Products
  console.log('\n✅ PRODUCTS:');
  const products = db.prepare('SELECT id, brand, name, price, stock FROM products').all();
  console.table(products);

  // List Services
  console.log('\n✅ SERVICES:');
  const services = db.prepare('SELECT id, name, location, price FROM services').all();
  console.table(services);

  db.close();
} catch (error) {
  console.error('Error reading database:', error.message);
}
