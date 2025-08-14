
# Full-Stack Portfolio (React • Node.js • Sequelize • PostgreSQL)

Includes **admin code protection** for create/update/delete, and a header avatar.

## Setup

### PostgreSQL
Create a database (default: `portfolio_db`).

### Server
```bash
cd server
cp .env.example .env
# fill DB creds and set ADMIN_CODE
npm install
npm run dev
```
### Client
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

**Usage:** when you click "Add Project" or Delete, you'll be prompted for the admin code.
