import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

console.log('🧪 Testing MySQL Database Connection...\n');
console.log('Configuration:');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`User: ${process.env.DB_USER}`);
console.log(`Database: ${process.env.DB_NAME}`);
console.log('');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    console.log('✅ Query test successful:', rows[0]);
    
    // Check if tables exist
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\n📋 Existing tables:');
    if (tables.length === 0) {
      console.log('  No tables found. They will be created when you start the server.');
    } else {
      tables.forEach(table => {
        console.log(`  - ${Object.values(table)[0]}`);
      });
    }
    
    await connection.end();
    console.log('\n✅ All tests passed! Your database is ready.\n');
  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('\nPossible solutions:');
    console.error('1. Check if MySQL is running');
    console.error('2. Verify DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in .env file');
    console.error('3. Make sure the database user has proper permissions');
    console.error('4. Try changing DB_HOST to "127.0.0.1" or "mysql.yourdomain.com"');
    console.error('');
    process.exit(1);
  }
}

testConnection();
