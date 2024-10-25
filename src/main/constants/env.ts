import dotenv from 'dotenv';

dotenv.config();

// Define required environment variables, but conditionally for SQLite
const requiredEnvVariables = [
  'SQL_DIALECT',
  'DATABASE_NAME',
];

if (process.env.SQL_DIALECT !== 'sqlite') {
  requiredEnvVariables.push('SQL_HOSTNAME', 'SQL_USERNAME', 'SQL_PASSWORD');
}

// Check if all required environment variables are set
requiredEnvVariables.forEach((env) => {
  if (!process.env[env]) {
    console.error(`❌ Environment variable ${env} is missing`);
    console.error('   Please check your `.env` file');
    throw new Error(`Environment variable ${env} is missing`);
  }
});

// SQL configuration
export const SQL_DIALECT = process.env.SQL_DIALECT;
export const SQL_HOSTNAME = process.env.SQL_HOSTNAME || null;
export const SQL_USERNAME = process.env.SQL_USERNAME || null;
export const SQL_PASSWORD = process.env.SQL_PASSWORD || null;
export const DATABASE_NAME = process.env.DATABASE_NAME;
