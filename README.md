# YallaCoins Admin Portal

Internal operations and administration portal for managing withdrawals, rates, countries, and user accounts.

## Features

- 👥 **User Management** - Manage admin users and roles
- 💰 **Rate Management** - Update app conversion rates and fees
- 🌍 **Country Management** - Configure countries and payout methods
- 📋 **Request Management** - Review and process withdrawal requests
- 📊 **Reports** - Generate withdrawal and performance reports
- 📝 **Audit Logs** - Complete audit trail of all admin actions
- 🔐 **Role-Based Access** - Different permission levels for different roles
- 🌐 **Bilingual** - Full Arabic and English support

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Routing**: Wouter
- **Language**: TypeScript
- **Internationalization**: i18next
- **State Management**: React Context

## Prerequisites

- Node.js 18+
- npm or pnpm
- Backend API running (see Backend Setup)

## Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/yallacoins-admin.git
cd yallacoins-admin
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and set:

```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Run Development Server

```bash
npm run dev
```

Access at: `http://localhost:5174`

## Available Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Admin pages
│   ├── services/       # API service layer
│   ├── contexts/       # React contexts (Auth, etc.)
│   ├── lib/            # Utilities and helpers
│   ├── hooks/          # Custom hooks
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Admin Pages

- **Dashboard** - Overview of system statistics
- **Requests** - View and manage withdrawal requests
- **Rates** - Configure app conversion rates and fees
- **Countries** - Manage supported countries and payout methods
- **Users** - Manage admin user accounts and roles
- **Audit Log** - View complete audit trail
- **Reports** - Generate and export reports
- **Settings** - System configuration

## API Integration

This portal communicates with the YallaCoins API backend for:

- Admin authentication
- Fetching withdrawal requests
- Updating request statuses
- Managing app rates
- Managing countries and payout methods
- Managing admin users
- Retrieving audit logs

**Backend Repository**: [yallacoins-api](https://github.com/yourusername/yallacoins-api)

## Authentication

Admin users authenticate with:
- Email
- Password

Roles determine access levels:
- **Super Admin** - Full system access
- **Operations Admin** - Request management
- **Finance Admin** - Financial operations
- **Rate Manager** - Rate configuration
- **Support Agent** - Support operations
- **Auditor** - Audit log access

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set environment variables in Vercel dashboard:
- `VITE_API_URL` - Production API URL

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Docker

```bash
docker build -t yallacoins-admin .
docker run -p 3000:3000 yallacoins-admin
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend API base URL |

## Troubleshooting

### API Connection Issues

- Verify `VITE_API_URL` is correct
- Check backend is running
- Verify CORS is configured on backend
- Check authentication token is valid

### Login Issues

- Verify backend is running
- Check admin user exists in database
- Verify password is correct
- Check JWT configuration on backend

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

### Port Already in Use

```bash
# Use different port
npm run dev -- --port 5175
```

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## Security

- Never commit `.env` files with real credentials
- Always use HTTPS in production
- Keep dependencies updated
- Report security issues privately
- Use strong passwords for admin accounts

## License

Proprietary - YallaCoins

## Support

For issues or questions, contact: support@yallacoins.com

## Related Repositories

- [yallacoins-withdrawal](https://github.com/yourusername/yallacoins-withdrawal) - Creator portal
- [yallacoins-api](https://github.com/yourusername/yallacoins-api) - Backend API
