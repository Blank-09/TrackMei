import dotenv from 'dotenv'

dotenv.config()

// Check if all environment variables are set
const requiredEnvVariables = [
  'SQL_DIALECT',
  'SQL_HOSTNAME',
  'SQL_USERNAME',
  'SQL_PASSWORD',
  'DATABASE_NAME',
]

requiredEnvVariables.forEach((env) => {
  if (!process.env[env]) {
    console.error(`❌ Environment variable ${env} is missing`)
    console.error('   Please check your `.env` file')
    throw new Error(`Environment variable ${env} is missing`)
  }
})

// SQL
export const SQL_DIALECT = process.env.SQL_DIALECT!
export const SQL_HOSTNAME = process.env.SQL_HOSTNAME!
export const SQL_USERNAME = process.env.SQL_USERNAME!
export const SQL_PASSWORD = process.env.SQL_PASSWORD!
export const DATABASE_NAME = process.env.DATABASE_NAME!
