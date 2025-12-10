import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  const [rows] = await connection.execute(
    'SELECT * FROM emailSubscriptions WHERE email = ?',
    ['mottarello1@gmail.com']
  );
  console.log('Email subscription status:');
  console.log(JSON.stringify(rows, null, 2));
} catch (error) {
  console.error('Error:', error);
} finally {
  await connection.end();
}
