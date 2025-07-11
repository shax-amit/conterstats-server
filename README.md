# CounterStats – Node/Express API

Backend for the CounterStats final project (Node + Express + MongoDB).

---

## Local setup

```bash
git clone https://github.com/USERNAME/conterstats-server.git
cd conterstats-server
npm install
cp .env.example .env          # edit the values
npm run seed:all              # seed items + users (admin + customer)
npm run dev                   # http://localhost:4000/api/health
```

### 📊 Architecture Overview

![Architecture](conterstats-server/docs/UML/architecture.png)
