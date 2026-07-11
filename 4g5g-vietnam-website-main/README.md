# Vietnam Network Website

Next.js website for Vietnam Mobile Networks with payment integration (VNPay, MoMo, ZaloPay), Telegram bot notifications, and admin dashboard.

## 🚀 Quick Start

### Local Development
```bash
npm install
npm run dev
```

### Generate Master Key
```bash
npm run generate-key
```

## 📦 Deployment

### Deploy to Vercel
1. Push code to Git
2. Import project to Vercel
3. Add Redis database (Upstash Redis)
4. Set `MASTER_KEY` environment variable
5. Deploy!

**See detailed instructions:**
- Quick guide: `QUICK_DEPLOY.md`
- Full guide: `DEPLOYMENT.md`

## 🔧 Features

- ✅ VNPay payment integration
- ✅ MoMo payment integration
- ✅ ZaloPay payment integration
- ✅ Telegram bot notifications
- ✅ Admin dashboard
- ✅ Chat widget
- ✅ Order management
- ✅ Settings management
- ✅ Redis/KV storage

## 📝 Environment Variables

See `.env.example` for required environment variables.

## 📚 Documentation

- `DEPLOYMENT.md` - Full deployment guide
- `QUICK_DEPLOY.md` - Quick deployment steps

## 🛠️ Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Vercel KV / Redis
- VNPay / MoMo / ZaloPay integration
- Telegram Bot API

## 📄 License

Private
