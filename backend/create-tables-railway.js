const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTables() {
  try {
    console.log('Connecting to Railway MySQL...');
   

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✅ Connected to database!\n');

    // Table for Agency Staff (Users)
    console.log('Creating staff table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Staff table created');

    // Table for Customers
    console.log('Creating customers table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Customers table created');

    console.log('Creating orders table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        customer_id INT NOT NULL,
        departure_city VARCHAR(100) NOT NULL,
        destination_city VARCHAR(100) NOT NULL,
        travel_date DATE NOT NULL,
        flight_price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Orders table created');

    // Create indexes
    console.log('\nCreating indexes...');
    try {
      await connection.query('CREATE INDEX idx_customer_email ON customers(email)');
      await connection.query('CREATE INDEX idx_customer_id ON orders(customer_id)');
      await connection.query('CREATE INDEX idx_staff_email ON staff(email)');
      console.log('✅ Indexes created');
    } catch (err) {
      if (err.message.includes('Duplicate key name')) {
        console.log('✓ Indexes already exist');
      }
    }

    // Verify tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\n📊 Tables in database:');
    tables.forEach(row => {
      console.log('   ✓', Object.values(row)[0]);
    });

    await connection.end();
    console.log('\n🎉 Database setup complete!\n');
    console.log('You can now:');
    console.log('  1. Go to http://localhost:3000');
    console.log('  2. Register a new account');
    console.log('  3. Start using the app!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTables();
