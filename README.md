# CodeClub JUSL

> Official website for CodeClub Jadavpur University SaltLake Campus

## Setup Instructions

### Installation

1. Clone the repository
```bash
git clone https://github.com/codeclubjusl/ccjusl-website.git
cd ccjusl-website
```

2. Install dependencies
```bash
yarn
```

3. Start the development server
```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

Run this command
```bash
    docker compose up -d
```

Connection URL (for local Docker database)
```bash 
    mongodb://127.0.0.1:27017/ccjusl?replicaSet=rs0&directConnection=true
```

Read [development.md](development.md) for more development instructions.