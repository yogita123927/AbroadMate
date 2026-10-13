import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const port = Number(process.env.PORT) || 5000;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be set and at least 32 characters long.');
  process.exit(1);
}

try {
  await connectDB();

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`AbroadMate server listening on ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Stop the other process or change PORT in Backend/.env.`);
      process.exit(1);
    }

    console.error(`Startup failed: ${error.message}`);
    process.exit(1);
  });
} catch (error) {
  console.error(`Startup failed: ${error.message}`);
  process.exit(1);
}
