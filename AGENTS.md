
# Token Risk Scanner - Base Mini App

## Project Goal
Build a **DeFi security tool** as a Farcaster Mini App on Base that scans tokens for security risks, honeypots, and contract vulnerabilities using GoPlus Security API.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: GoPlus Security API (free tier)
- **Integration**: Farcaster MiniKit, Coinbase OnchainKit
- **Deployment**: Vercel

## Core Features
1. **Token Security Scanner** - Analyze smart contracts for vulnerabilities
2. **Risk Scoring System** - 0-100 score with 4 categories (LOW/MEDIUM/HIGH/CRITICAL)
3. **Liquidity Analysis** - Check LP health and holder distribution
4. **Multi-chain Support** - Ethereum, Base, BSC, Polygon, Arbitrum
5. **Honeypot Detection** - Identify scam tokens that prevent selling

## Architecture

### No Database Required
- **100% stateless** - All data from GoPlus API real-time
- No PostgreSQL, no migrations, no user management
- Optional: localStorage for client-side scan history

### API Flow
```
User Input (Token Address + Chain) 
  → Frontend (TokenScanner component)
  → POST /api/scan
  → GoPlus API fetch
  → Risk Engine calculation
  → JSON Response
  → Frontend display (RiskScoreCard component)
```

## File Structure & Purpose

```
token-risk-analyzer-mini-app/
├── app/
│   ├── page.tsx                 # Homepage - Main scanner UI
│   ├── api/
│   │   └── scan/
│   │       └── route.ts         # POST endpoint - Token scan API
│   └── globals.css              # Global styles (Tailwind)
│
├── components/
│   ├── TokenScanner.tsx         # Input form (address + chain selector)
│   └── RiskScoreCard.tsx        # Results display (score + warnings)
│
├── lib/
│   ├── goplus.ts                # GoPlus API client wrapper
│   └── risk-engine.ts           # Risk calculation algorithm
│
├── types/
│   └── index.ts                 # TypeScript interfaces
│
├── minikit.config.ts            # Farcaster Mini App manifest
├── .env.local                   # Environment variables
├── package.json                 # Dependencies
└── AGENTS.md                    # This file
```

## Critical Files Explained

### 1. `types/index.ts`
**Purpose**: Type definitions for API responses and internal data
- `TokenSecurityData` - GoPlus API response structure
- `RiskScore` - Risk calculation output (0-100 + category)
- `ScanResult` - Complete scan result type
- `CHAINS` - Supported blockchain configurations

### 2. `lib/goplus.ts`
**Purpose**: GoPlus API integration
- Class: `GoPlusClient`
- Method: `getTokenSecurity(chainId, contractAddress)`
- Returns: `TokenSecurityData | null`
- API Docs: https://docs.gopluslabs.io/reference/token-security-api
- Free tier: 60 requests/minute (no API key needed)

**Key Checks**:
- Contract verification status (`isOpenSource`)
- Proxy patterns (`isProxy`)
- Mint functions (`isMintable`)
- Owner privileges (`ownerChangeBalance`)
- Honeypot detection (`isHoneypot`)
- Trading taxes (`buyTax`, `sellTax`)
- Holder distribution (`holders[]`, `creatorPercent`)

### 3. `lib/risk-engine.ts`
**Purpose**: Calculate risk scores from security data
- Class: `RiskEngine`
- Method: `calculateRiskScore(securityData)`
- Returns: `RiskScore`

**Scoring Algorithm**:
```
Overall Score = 
  contractSecurity * 30% +
  liquiditySafety * 25% +
  holderDistribution * 20% +
  tradingRestrictions * 25%
```

**Categories**:
- `LOW_RISK`: 0-19 (Green)
- `MEDIUM_RISK`: 20-49 (Yellow)
- `HIGH_RISK`: 50-79 (Orange)
- `CRITICAL_RISK`: 80-100 (Red)

### 4. `app/api/scan/route.ts`
**Purpose**: API endpoint for token scanning
- Method: POST
- Input: `{ tokenAddress: string, chainId: string }`
- Flow:
  1. Validate input
  2. Call GoPlus API via `goPlusClient`
  3. Calculate risk via `riskEngine`
  4. Return JSON response

### 5. `components/TokenScanner.tsx`
**Purpose**: User input form
- Chain selector dropdown (5 chains)
- Token address input (0x... format)
- Scan button with loading state
- Error display
- Calls `/api/scan` on submit

### 6. `components/RiskScoreCard.tsx`
**Purpose**: Display scan results
- Risk score badge (colored by category)
- Critical issues list (red alerts)
- Warnings list (yellow alerts)
- Factor breakdown (4 sub-scores)
- Token stats (holders, LP count, creator %)

### 7. `minikit.config.ts`
**Purpose**: Farcaster Mini App manifest
- App metadata (name, description, icons)
- Account association (FID verification)
- Webhook URL
- Primary category: "defi"
- Tags for discovery

## Dependencies

### Production
```
{
  "next": "14.2.5",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "@coinbase/onchainkit": "^0.28.0",
  "viem": "^2.17.0",
  "wagmi": "^2.12.0",
  "@tanstack/react-query": "^5.51.1",
  "axios": "^1.7.2",
  "lucide-react": "^0.424.0"
}
```

### Dev Dependencies
```
{
  "typescript": "^5.5.4",
  "@types/node": "^20.14.12",
  "@types/react": "^18.3.3",
  "tailwindcss": "^3.4.7",
  "autoprefixer": "^10.4.19",
  "postcss": "^8.4.40"
}
```

## Environment Variables

```
# .env.local
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Optional - GoPlus works without key (rate limited)
GOPLUS_API_KEY=

# Already from Base template
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_key
```

## API References

### GoPlus Security API
- **Endpoint**: `https://api.gopluslabs.io/api/v1/token_security/{chainId}`
- **Params**: `contract_addresses` (comma-separated)
- **Docs**: https://docs.gopluslabs.io/
- **Rate Limit**: 60 req/min (free), 300 req/min (with key)

### Supported Chain IDs
- `1` - Ethereum Mainnet
- `8453` - Base
- `56` - BNB Smart Chain
- `137` - Polygon
- `42161` - Arbitrum One

## Development Checklist

### Phase 1: Setup ✅
- [x] Deploy Base Mini App template to Vercel
- [x] Clone repository locally
- [x] Install dependencies (`npm install`)
- [x] Create file structure (types, lib, components)
- [x] Setup environment variables

### Phase 2: Core Implementation ✅
- [x] Create TypeScript types (`types/index.ts`)
- [x] Implement GoPlus API client (`lib/goplus.ts`)
- [x] Build risk scoring engine (`lib/risk-engine.ts`)
- [x] Create scan API endpoint (`app/api/scan/route.ts`)
- [x] Build TokenScanner component
- [x] Build RiskScoreCard component
- [x] Update homepage (`app/page.tsx`)

### Phase 3: Testing 🔄
- [ ] Test with USDC on Base (`0x833589fcd6edb6e08f4c7c32d4f71b54bda02913`)
- [ ] Test with known honeypot token
- [ ] Test all 5 chains
- [ ] Test error handling (invalid address, network errors)
- [ ] Test rate limiting behavior
- [ ] Verify risk scores accuracy

### Phase 4: UI/UX Polish 🔄
- [ ] Add loading skeletons
- [ ] Add success animations
- [ ] Improve mobile responsiveness
- [ ] Add copy-to-clipboard for addresses
- [ ] Add share results functionality
- [ ] Add recent scans (localStorage)
- [ ] Add example tokens buttons

### Phase 5: Deployment 🔄
- [ ] Update `minikit.config.ts` with production URL
- [ ] Create app icons (icon.png, splash.png, hero.png)
- [ ] Push to GitHub main branch
- [ ] Verify Vercel deployment
- [ ] Turn OFF Vercel Deployment Protection
- [ ] Generate account association at basebuild.dev
- [ ] Update `minikit.config.ts` with accountAssociation
- [ ] Push final changes
- [ ] Test at base.dev/preview
- [ ] Publish with post in Base app

### Phase 6: Optimization (Optional) 📋
- [ ] Add response caching (15 min TTL)
- [ ] Implement request deduplication
- [ ] Add analytics tracking
- [ ] SEO optimization (meta tags)
- [ ] Add token logo fetching
- [ ] Add price data integration
- [ ] Add watchlist feature
- [ ] Add notification system

## Common Issues & Solutions

### Issue: Module not found errors
**Solution**: Verify file exists at exact path, check imports use `@/` alias

### Issue: GoPlus API returns null
**Solution**: 
- Token doesn't exist on that chain
- Use different chain ID
- Check token address format (must be 0x... format)

### Issue: Risk score always 0
**Solution**: Check security data structure matches types, verify calculation logic

### Issue: Build fails with ESLint errors
**Solution**: 
- Fix type errors (use proper types, not `any`)
- Remove unused imports
- Or disable ESLint: `eslint: { ignoreDuringBuilds: true }` in `next.config.js`

### Issue: Mini App not showing in Base app
**Solution**:
- Verify account association completed
- Check manifest at `your-domain.com/.well-known/farcaster.json`
- Wait up to 10 minutes for indexing
- Ensure `primaryCategory` is set

## Testing Tokens

### Safe Tokens (for testing)
- **USDC (Base)**: `0x833589fcd6edb6e08f4c7c32d4f71b54bda02913`
- **WETH (Ethereum)**: `0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2`
- **USDT (BSC)**: `0x55d398326f99059ff775485246999027b3197955`

### High-Risk Examples
- Find recent honeypots on BSC via GoPlus examples
- Test with newly deployed tokens (usually riskier)

## Performance Targets
- **API Response**: < 2s
- **Page Load**: < 1s
- **Time to Interactive**: < 2s
- **Mobile Score**: > 90

## Security Considerations
- No private keys handled
- No wallet connection required for scanning
- All data fetched server-side (API route)
- Rate limiting handled by GoPlus
- No sensitive data stored

## Future Features (v2)
- [ ] Batch scanning (multiple tokens)
- [ ] Portfolio risk analysis
- [ ] Historical risk tracking
- [ ] Comparison mode (token A vs B)
- [ ] Custom alerts/notifications
- [ ] API for third-party integration
- [ ] AI-powered risk prediction
- [ ] Community ratings/reviews

## Resources
- **Base Docs**: https://docs.base.org/mini-apps/
- **GoPlus Docs**: https://docs.gopluslabs.io/
- **Farcaster Docs**: https://miniapps.farcaster.xyz/
- **OnchainKit**: https://onchainkit.xyz/
- **Next.js Docs**: https://nextjs.org/docs

## Notes for AI Agents

### Context Preservation
- This is a **Mini App for Farcaster** (social protocol)
- Deployed on **Base L2** (Coinbase's blockchain)
- **No auth needed** for basic scanning
- **No database** - completely stateless
- Focus on **speed and simplicity**

### Code Style
- Use **TypeScript strict mode**
- Prefer **functional components**
- Use **Tailwind for styling** (no CSS modules)
- Follow **Next.js App Router** conventions
- Keep components **small and focused**

### Priority Order
1. **Core functionality** (scanning works)
2. **Error handling** (graceful failures)
3. **UX polish** (loading states, feedback)
4. **Performance** (fast responses)
5. **Features** (nice-to-haves)

### Don't Do
- ❌ Don't add database
- ❌ Don't add authentication (unless required by Mini App spec)
- ❌ Don't use external state management (React state is enough)
- ❌ Don't over-engineer (keep it simple)
- ❌ Don't add heavy dependencies

### Always Remember
- Token address must be **lowercase** for GoPlus API
- Chain ID must be **string**, not number
- Handle **null responses** from GoPlus
- Show **clear error messages** to users
- Risk scores are **0-100**, categories are derived

---

**Last Updated**: 2025-10-06
**Version**: 1.0
**Status**: Development Complete, Testing In Progress
