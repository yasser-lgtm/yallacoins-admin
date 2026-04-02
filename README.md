# YallaCoins Admin Portal

Internal operations dashboard for managing withdrawal requests, rates, payout methods, and user access control.

## Features

- **Dashboard**: Real-time KPI metrics and operational overview
- **Withdrawal Requests**: Review, approve, reject, and track withdrawal requests
- **Rate Management**: Update conversion rates and fees for each app
- **Country & Payout Methods**: Manage payment methods and fees by country
- **App Management**: Control app availability and settings
- **Content Control**: Update website content without code changes
- **Users & Roles**: Manage admin users and role-based access
- **Audit Log**: Complete audit trail of all system actions
- **Reports**: Generate and export operational reports

## Role-Based Access

- **Super Admin**: Full system access
- **Operations Admin**: Review and process withdrawal requests
- **Finance Admin**: Mark requests as paid and confirm payouts
- **Rate Manager**: Update rates and payout methods
- **Support Agent**: View requests and add notes
- **Auditor**: Read-only access to logs and reports

## Tech Stack

- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Wouter for routing
- Lucide React for icons
- Recharts for analytics

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

## Demo Credentials

- Email: `ahmed@yallacoins.com`
- Password: `demo123`

## Project Structure

```
src/
├── pages/          # Page components
├── components/     # Reusable components
├── contexts/       # React contexts (Auth)
├── types.ts        # TypeScript type definitions
├── mockData.ts     # Mock data for development
├── App.tsx         # Router configuration
├── main.tsx        # Entry point
└── index.css       # Global styles
```

## Architecture

The admin portal is completely separate from the public creator withdrawal website. It provides:

1. **Request Management**: Central queue for processing withdrawal requests
2. **Rate Control**: Update conversion rates with version history
3. **Payout Method Management**: Configure payment methods per country
4. **Audit & Compliance**: Complete audit trail for all actions
5. **Role-Based Access**: Fine-grained permission control

## Next Steps

1. Implement withdrawal requests list with filtering
2. Create request details page with review panel
3. Build rate management interface
4. Add country and payout method management
5. Create app management page
6. Implement content control CMS
7. Build users and roles management
8. Add audit log viewer
9. Create reports and export functionality
10. Implement settings page
