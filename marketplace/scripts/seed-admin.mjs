import "dotenv/config";
import bcrypt from "bcryptjs";
import { Client } from "pg";

const connectionString = process.env.DATABASE_URL;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_DEFAULT_PASSWORD;

if (!connectionString) {
  console.error("DATABASE_URL must be set in .env");
  process.exit(1);
}

if (!email || !password) {
  console.error("ADMIN_EMAIL and ADMIN_DEFAULT_PASSWORD must be set in .env");
  process.exit(1);
}

const client = new Client({ connectionString });
await client.connect();

try {
  const hashed = await bcrypt.hash(password, 12);
  const { rowCount } = await client.query("SELECT 1 FROM users WHERE email = $1", [email]);

  if (rowCount === 0) {
    await client.query(
      `INSERT INTO users (email, name, password_hash, role)
       VALUES ($1, $2, $3, 'admin')`,
      [email, "BIC Admin", hashed],
    );
    console.log(`Created admin user ${email}`);
  } else {
    await client.query(
      `UPDATE users
         SET password_hash = $1,
             updated_at = NOW()
       WHERE email = $2`,
      [hashed, email],
    );
    console.log(`Updated admin password for ${email}`);
  }
} finally {
  await client.end();
}
