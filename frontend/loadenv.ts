import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

console.log(`Environment variables loaded from ${envPath}`);