import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  await connection.execute(
    'INSERT INTO emailSubscriptions (email, scheduledTime, isActive) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE isActive = 1, scheduledTime = ?',
    ['mottarello1@gmail.com', '08:00', 1, '08:00']
  );
  console.log('✓ Successfully subscribed mottarello1@gmail.com to morning reports at 8:00 AM UTC');
} catch (error) {
  console.error('Error:', error);
} finally {
  await connection.end();
}
