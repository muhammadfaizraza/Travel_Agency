const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function createTables() {
  try {
    console.log('Connecting to Railway MySQL...');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    });

    console.log('✅ Connected to database!');

    const sqlFile = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');

    // Split by GO or semicolon
    const statements = sqlFile
      .split(/;|\bGO\b/gi)
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`Executing ${statements.length} SQL statements...`);

    for (const statement of statements) {
      try {
        await connection.query(statement);
        console.log('✓ Statement executed successfully');
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.error('Error:', err.message);
        }
      }
    }

    console.log('\n✅ Database tables created successfully!');

    // Verify tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\nTables in database:');
    tables.forEach(row => {
      console.log(' -', Object.values(row)[0]);
    });

    await connection.end();
    console.log('\nDatabase setup complete! 🎉');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTables();
