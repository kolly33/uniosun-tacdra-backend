const mysql = require('mysql2/promise');

async function createDatabase() {
  try {
    console.log('Connecting to MySQL to create database...');
    
    // Connect without specifying database
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3307,
      user: 'root',
      password: ''
    });

    console.log('✅ Connected to MySQL server');
    
    // Create database
    await connection.execute('CREATE DATABASE IF NOT EXISTS uniosun_tacdra');
    console.log('✅ Database "uniosun_tacdra" created successfully!');
    
    // Verify database exists
    const [databases] = await connection.execute('SHOW DATABASES');
    console.log('📋 Available databases:', databases.map(db => db.Database));
    
    await connection.end();
    console.log('✅ Database setup complete!');
    
    console.log('\n🎉 Ready to start the backend!');
    console.log('Run: npm run start:dev');
    
  } catch (error) {
    console.error('❌ Failed to create database:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n📋 MySQL is not running on port 3307');
      console.log('Make sure XAMPP MySQL is started');
    }
  }
}

createDatabase();
