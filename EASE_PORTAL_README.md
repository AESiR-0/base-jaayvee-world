# Ease Portal - The Jaayvee World

A comprehensive portal for managing merchants, agents, and influencers in The Jaayvee World ecosystem.

## 🚀 Features

### Role-Based Access
- **Agent Portal** (`?role=agent`): Onboard and activate merchants using pre-assigned QR IDs
- **Merchant Portal** (`?role=merchant`): Complete shop registration and toggle shop status
- **User/Influencer Portal** (`?role=user`): Upload influencer posts for cashback after merchant purchases

### Authentication
- Firebase OTP authentication for all roles
- Email authentication for users/influencers
- Secure token-based API communication

## 🏗️ Architecture

### File Structure
```
/app/ease/
├── page.tsx                      # Router dispatcher based on role
├── layout.tsx                    # Ease portal layout with Jaayvee branding
└── talaash/                      # Existing Talaash integration

/components/ease/
├── AgentPanel.tsx                # Agent onboarding interface
├── MerchantPanel.tsx                # Merchant dashboard and controls
├── UserInfluencerPanel.tsx         # Influencer upload interface
└── forms/
    ├── MerchantOnboardForm.tsx     # Merchant registration form
    └── InfluencerUploadForm.tsx    # Influencer post submission form

/components/common/
└── StatusCard.tsx                  # Reusable status display component

/lib/
└── firebaseClient.ts               # Firebase configuration
```

## 🎨 Design System

### Color Palette
- **Background**: White (`#FFFFFF`)
- **Text**: Black (`#0C0C0C`)
- **Accent**: Blue (`#00719C`)
- **Hover**: Light Blue (`#E8F6FA`)

### UI Components
- Minimalist white cards with blue borders
- Consistent typography and spacing
- Responsive design for all screen sizes
- Clean, professional interface

## 🔧 Setup Instructions

### 1. Environment Variables
Create a `.env.local` file with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://talaash.thejaayveeworld.com/api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

## 📱 Usage

### Agent Portal
Access: `/ease?role=agent&merchantId=QR_CODE`

Features:
- Validates merchant QR codes
- Onboards new merchants with shop details
- Handles Firebase OTP verification
- Uploads shop photos to Firebase Storage
- Auto-detects location for address

### Merchant Portal
Access: `/ease?role=merchant&merchantId=MERCHANT_ID`

Features:
- Firebase OTP authentication
- Shop status toggle (open/closed)
- Performance dashboard with stats
- Profile management
- Real-time status updates

### User/Influencer Portal
Access: `/ease?role=user&merchantId=MERCHANT_ID`

Features:
- Multiple authentication options (phone/email)
- Screenshot upload for payment proof
- Social media post link submission
- Optional amount tracking
- Cashback claim process

## 🔌 API Integration

### Endpoints
- `GET /api/qr/resolve?code=` - Validate QR codes
- `POST /api/merchant/activate` - Activate merchants
- `PATCH /api/merchants/toggle` - Toggle shop status
- `POST /api/influencers/submissions` - Submit influencer posts
- `POST /api/<role>/auth/verify-token` - Authentication verification

### Authentication
All API calls include:
```javascript
headers: {
  'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`
}
```

## 🛠️ Technical Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Backend**: Talaash Core APIs
- **Language**: TypeScript

## 🚀 Deployment

The portal is designed to work seamlessly with the existing Jaayvee World infrastructure:

1. **Frontend**: Deploy to Vercel or similar platform
2. **Backend**: Integrate with existing Talaash APIs
3. **Firebase**: Configure Firebase project for authentication and storage
4. **Environment**: Set up production environment variables

## 📋 Features by Role

### Agent Features
- ✅ QR code validation
- ✅ Merchant onboarding form
- ✅ Firebase OTP verification
- ✅ Shop photo upload
- ✅ Location auto-detection
- ✅ Success confirmation

### Merchant Features
- ✅ Firebase authentication
- ✅ Shop status toggle
- ✅ Performance dashboard
- ✅ Profile management
- ✅ Real-time updates
- ✅ Statistics display

### User/Influencer Features
- ✅ Multiple auth options
- ✅ Screenshot upload
- ✅ Social media integration
- ✅ Cashback tracking
- ✅ Success notifications
- ✅ Post verification

## 🔒 Security

- Firebase authentication for all operations
- Token-based API authorization
- Secure file uploads to Firebase Storage
- Input validation and sanitization
- HTTPS-only communication

## 📞 Support

For technical support or feature requests, contact the development team or refer to the main Jaayvee World documentation.

---

**Built with ❤️ for The Jaayvee World**
