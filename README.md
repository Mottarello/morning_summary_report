# Morning Summary Report

A full-stack web application that delivers a personalized daily news digest with fresh, categorized news from multiple topics including AI & Startups, World News, UK Pensions, Maidenhead Local news, and Cycling.

## Features

- 🔄 **Live News Integration** - Fetches real-time news from TheNewsAPI.com
- 🏷️ **Smart Categorization** - News organized into 5 distinct categories
- 🚫 **Automatic Deduplication** - Prevents duplicate stories across categories
- 📱 **Responsive Design** - Beautiful UI built with React and Tailwind CSS
- ⚡ **Fast Performance** - Powered by Vite and Express
- 🔐 **Database Integration** - MySQL storage for user management
- 🤖 **Auto-start Service** - Runs automatically on Ubuntu boot with systemd

## Categories

- **AI & Startups** - OpenAI, ChatGPT, Claude, Anthropic, venture capital funding
- **World News** - International news, Ukraine, Middle East, China
- **UK Economy** - UK pensions, state pension, retirement planning
- **Maidenhead Local** - Local news from Maidenhead, Windsor, Berkshire
- **Cycling** - Giro d'Italia, Tour de France, professional cycling

## Prerequisites

- **Ubuntu 24.04** (or similar Linux distribution)
- **Node.js 18+** 
- **pnpm** package manager
- **MySQL Server**
- **Git**

## Installation

### 1. Clone the Repository

git clone https://github.com/Mottarello/morning_summary_report.git
cd morning_summary_report

### 2. Install Dependencies

Install Node.js

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
Install pnpm

curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.bashrc
Install project dependencies

pnpm install

### 3. Set Up MySQL Database

sudo apt install -y mysql-server
sudo systemctl start mysql
sudo mysql

In MySQL:

CREATE DATABASE morning_summary;
CREATE USER 'morning_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
GRANT ALL PRIVILEGES ON morning_summary.* TO 'morning_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

### 4. Configure Environment Variables

Create a `.env` file in the project root:

nano .env

Add the following configuration:

DATABASE_URL=mysql://morning_user:your_password@localhost:3306/morning_summary
NODE_ENV=development
PORT=3002
NEWS_API_KEY=your_thenewsapi_key_here
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
OAUTH_SERVER_URL=http://localhost:3002


**Get your News API key:** Sign up at [TheNewsAPI.com](https://www.thenewsapi.com/)

### 5. Run Database Migrations

pnpm db:push



## Running the Application

### Development Mode

pnpm dev


Access at: `http://localhost:3002`

### Production Build


pnpm build
pnpm start


## Deployment as a Service (Ubuntu)

### Create systemd Service

sudo nano /etc/systemd/system/morning-summary.service

Add:

[Unit]
Description=Morning Summary Report
After=network.target mysql.service
Wants=mysql.service

[Service]
Type=simple
User=YOUR_USERNAME
WorkingDirectory=/path/to/morning_summary_report
EnvironmentFile=/path/to/morning_summary_report/.env
Environment="NODE_ENV=production"
Environment="PORT=3002"
Environment="PATH=/home/YOUR_USERNAME/.local/share/pnpm:/usr/local/bin:/usr/bin:/bin"
ExecStart=/usr/bin/env pnpm start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=morning-summary

[Install]
WantedBy=multi-user.target

### Enable and Start Service

sudo systemctl daemon-reload
sudo systemctl enable morning-summary.service
sudo systemctl start morning-summary.service
sudo systemctl status morning-summary.service

### Service Management Commands

View logs

sudo journalctl -u morning-summary.service -f
Restart service

sudo systemctl restart morning-summary.service
Stop service

sudo systemctl stop morning-summary.service

## Technology Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- TypeScript
- tRPC for type-safe API calls
- Radix UI components

### Backend
- Node.js
- Express
- TypeScript
- tRPC
- Drizzle ORM
- MySQL

### News API
- TheNewsAPI.com for live news fetching

## Project Structure

morning_summary_report/
├── client/ # React frontend
│ ├── src/
│ │ ├── pages/ # Page components
│ │ ├── components/ # Reusable UI components
│ │ └── lib/ # Utilities
├── server/ # Express backend
│ ├── _core/ # Core server setup
│ ├── newsService.ts # News API integration
│ ├── db.ts # Database connection
│ └── routers.ts # tRPC routes
├── drizzle/ # Database schema
├── .env # Environment variables (not in git)
└── package.json # Dependencies

## API Rate Limits

**Important:** The free tier of TheNewsAPI.com has limited requests (typically 100-200/day). 

If you encounter HTTP 402 errors:
- Wait for daily quota reset (midnight UTC)
- Consider upgrading to a paid plan
- Implement caching to reduce API calls

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License

## Author

Luigi

## Acknowledgments

- TheNewsAPI.com for news data
- Radix UI for component primitives
- Tailwind CSS for styling



