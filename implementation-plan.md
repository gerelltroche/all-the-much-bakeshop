# Winter Drop Implementation Plan

## Project Overview

Build a cookie ordering system for the Winter 2025 Drop launch featuring:
- Public order page
- Business order page (with attribution tracking)
- Group order page (with multi-person orders and attribution)
- $100 delivery threshold logic
- Email notifications via Resend
- December 1st cutoff date automation

**Tech Stack:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Prisma + PostgreSQL (Docker)
- react-hook-form + zod
- Resend (email notifications)
- Tailwind CSS v4

---

## Database Schema

### Models

**Drop**
```prisma
model Drop {
  id          String   @id @default(cuid())
  name        String   // "Winter 2025"
  slug        String   @unique // "winter-2025"
  startDate   DateTime
  cutoffDate  DateTime
  isActive    Boolean  @default(true)

  orders      Order[]
  emails      Email[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Order**
```prisma
model Order {
  id              String   @id @default(cuid())
  dropId          String
  drop            Drop     @relation(fields: [dropId], references: [id])

  // Form type & attribution
  orderType       String   // "public" | "business" | "group"
  attribution     String?  // For tracking which link/source they came from

  // Customer info
  name            String
  email           String
  phone           String
  zipCode         String

  // Business-specific (nullable)
  businessName    String?
  businessAddress String?

  // Group-specific (nullable)
  coordinatorName String?
  groupMembers    Json?    // Array of {name, snowmanQty, gingerbreadQty, mittensQty}

  // Cookie quantities (for non-group orders)
  snowmanQty      Int      @default(0)
  gingerbreadQty  Int      @default(0)
  mittensQty      Int      @default(0)

  // Calculated fields
  totalCookies    Int
  totalPrice      Decimal  @db.Decimal(10, 2)

  // Fulfillment
  fulfillmentType String   // "pickup" | "delivery"
  requestedDate   DateTime?

  // Status tracking
  status          String   @default("pending")

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([dropId])
  @@index([email])
  @@index([attribution])
}
```

**Email**
```prisma
model Email {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String?

  // Which drop they signed up during (nullable)
  dropId       String?
  drop         Drop?    @relation(fields: [dropId], references: [id])

  isSubscribed Boolean  @default(true)

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([dropId])
  @@index([isSubscribed])
}
```

---

## Route Structure

```
/drops/winter-2025              → Public order page
/drops/winter-2025/business/[attr]  → Business order page
/drops/winter-2025/group/[attr]     → Group order page
```

**Attribution:** Uses route segments (`[attr]`) accessible via `params.attr` in page props

---

## Cookie Configuration (Hardcoded)

- **Snowman** - $10 each
- **Gingerbread Man** - $10 each
- **Mittens** - $10 each

---

## Phase 1: Database & Dependencies Setup

### Step 1: Install Required Dependencies

```bash
npm install react-hook-form @hookform/resolvers zod resend date-fns
```

**Purpose:**
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Zod integration for validation
- `zod` - Schema validation
- `resend` - Email notifications (replacing SendGrid)
- `date-fns` - Date formatting and manipulation

### Step 2: Create Database Schema

**File:** `prisma/schema.prisma`

Update schema with Drop, Order, and Email models (see schema above).

**Action:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Step 3: Seed Winter 2025 Drop

**File:** `prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.drop.upsert({
    where: { slug: 'winter-2025' },
    update: {},
    create: {
      name: 'Winter 2025 Drop',
      slug: 'winter-2025',
      startDate: new Date('2025-11-12T00:00:00Z'),
      cutoffDate: new Date('2025-12-01T23:59:59Z'),
      isActive: true
    }
  })

  console.log('✅ Winter 2025 Drop created')
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

**Update package.json:**
```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

**Action:**
```bash
npm install -D tsx
npx prisma db seed
```

---

## Phase 2: Shared Utilities & Types

### Step 4: Create Drop Management Utilities

**File:** `lib/drops.ts`

```typescript
import { prisma } from './prisma'

export async function getActiveDrop(slug: string) {
  const drop = await prisma.drop.findUnique({
    where: { slug }
  })

  if (!drop) return null

  // Check if drop is still active based on cutoff date
  const now = new Date()
  const isActive = drop.isActive && now <= drop.cutoffDate

  // Auto-update isActive if it changed
  if (isActive !== drop.isActive) {
    await prisma.drop.update({
      where: { id: drop.id },
      data: { isActive }
    })
  }

  return { ...drop, isActive }
}
```

### Step 5: Define Cookie Types & Constants

**File:** `lib/cookies.ts`

```typescript
export const COOKIE_PRICE = 10

export const COOKIES = [
  { id: 'snowman', name: 'Snowman', price: COOKIE_PRICE },
  { id: 'gingerbread', name: 'Gingerbread Man', price: COOKIE_PRICE },
  { id: 'mittens', name: 'Mittens', price: COOKIE_PRICE }
] as const

export type CookieId = typeof COOKIES[number]['id']

export const DELIVERY_THRESHOLD = 100
```

### Step 6: Create Zod Validation Schemas

**File:** `lib/validations/order-schemas.ts`

```typescript
import { z } from 'zod'

const baseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  zipCode: z.string().min(5, 'Valid zip code is required'),

  snowmanQty: z.number().int().min(0).default(0),
  gingerbreadQty: z.number().int().min(0).default(0),
  mittensQty: z.number().int().min(0).default(0),

  fulfillmentType: z.enum(['pickup', 'delivery']),
  requestedDate: z.date().optional()
})

export const publicOrderSchema = baseSchema

export const businessOrderSchema = baseSchema.extend({
  businessName: z.string().min(1, 'Business name is required'),
  businessAddress: z.string().min(1, 'Business address is required')
})

export const groupOrderSchema = z.object({
  coordinatorName: z.string().min(1, 'Coordinator name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  zipCode: z.string().min(5, 'Valid zip code is required'),

  groupMembers: z.array(z.object({
    name: z.string().min(1, 'Member name is required'),
    snowmanQty: z.number().int().min(0).default(0),
    gingerbreadQty: z.number().int().min(0).default(0),
    mittensQty: z.number().int().min(0).default(0)
  })).min(1, 'At least one group member is required'),

  fulfillmentType: z.enum(['pickup', 'delivery']),
  requestedDate: z.date().optional()
})
```

---

## Phase 3: Reusable Components

### Step 7: Cookie Quantity Selector Component

**File:** `components/cookie-selector.tsx`

Features:
- Display cookie name and image
- Quantity input (integrated with react-hook-form)
- Real-time price display per cookie type
- Accessible input controls

### Step 8: Price Calculator Hook

**File:** `hooks/use-order-total.ts`

```typescript
import { useWatch } from 'react-hook-form'
import { COOKIE_PRICE, DELIVERY_THRESHOLD } from '@/lib/cookies'

export function useOrderTotal(control: any) {
  const snowmanQty = useWatch({ control, name: 'snowmanQty' }) || 0
  const gingerbreadQty = useWatch({ control, name: 'gingerbreadQty' }) || 0
  const mittensQty = useWatch({ control, name: 'mittensQty' }) || 0

  const totalCookies = snowmanQty + gingerbreadQty + mittensQty
  const totalPrice = totalCookies * COOKIE_PRICE
  const meetsDeliveryThreshold = totalPrice >= DELIVERY_THRESHOLD

  return { totalCookies, totalPrice, meetsDeliveryThreshold }
}
```

### Step 9: Delivery/Pickup Logic Component

**File:** `components/fulfillment-options.tsx`

Features:
- Watches total price
- Shows pickup warning when < $100
- Shows delivery date picker when >= $100
- Conditional rendering based on threshold

### Step 10: Order Confirmation Component

**File:** `components/order-confirmation.tsx`

Features:
- Thank you message
- Order summary display
- Replaces form after successful submission

---

## Phase 4: API Routes

### Step 11: Order Submission API

**File:** `app/api/drops/[slug]/orders/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { publicOrderSchema, businessOrderSchema, groupOrderSchema } from '@/lib/validations/order-schemas'
import { sendOrderNotification } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Get drop and verify it's active
  const drop = await prisma.drop.findUnique({
    where: { slug, isActive: true }
  })

  if (!drop) {
    return NextResponse.json(
      { error: 'Drop not found or closed' },
      { status: 404 }
    )
  }

  const body = await request.json()

  // Validate based on orderType
  let validatedData
  try {
    switch (body.orderType) {
      case 'business':
        validatedData = businessOrderSchema.parse(body)
        break
      case 'group':
        validatedData = groupOrderSchema.parse(body)
        break
      default:
        validatedData = publicOrderSchema.parse(body)
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid form data', details: error },
      { status: 400 }
    )
  }

  // Create order
  const order = await prisma.order.create({
    data: {
      dropId: drop.id,
      orderType: body.orderType || 'public',
      attribution: body.attribution,
      ...validatedData
    }
  })

  // Send email notification
  await sendOrderNotification(order)

  return NextResponse.json({ success: true, orderId: order.id })
}
```

### Step 12: Email Notification Setup

**File:** `.env`
```
RESEND_API_KEY=your_api_key_here
RESEND_FROM_EMAIL=orders@yourdomain.com
BAKER_EMAIL=katie@example.com
BAKER_SMS_EMAIL=katie@sms-gateway.com  # Email-to-SMS gateway
```

**File:** `lib/email.ts`

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderNotification(order: any) {
  const subject = `New ${order.orderType} order - ${order.fulfillmentType}`

  const html = `
    <h2>New Order Received</h2>
    <p><strong>Type:</strong> ${order.orderType}</p>
    ${order.attribution ? `<p><strong>Attribution:</strong> ${order.attribution}</p>` : ''}
    <p><strong>Name:</strong> ${order.name}</p>
    <p><strong>Email:</strong> ${order.email}</p>
    <p><strong>Phone:</strong> ${order.phone}</p>
    <p><strong>Zip:</strong> ${order.zipCode}</p>

    <h3>Order Details</h3>
    <ul>
      <li>Snowman: ${order.snowmanQty}</li>
      <li>Gingerbread Man: ${order.gingerbreadQty}</li>
      <li>Mittens: ${order.mittensQty}</li>
    </ul>

    <p><strong>Total Cookies:</strong> ${order.totalCookies}</p>
    <p><strong>Total Price:</strong> $${order.totalPrice}</p>

    <h3>Fulfillment</h3>
    <p><strong>Type:</strong> ${order.fulfillmentType}</p>
    ${order.requestedDate ? `<p><strong>Requested Date:</strong> ${order.requestedDate}</p>` : ''}

    ${order.businessName ? `<p><strong>Business:</strong> ${order.businessName}</p>` : ''}
    ${order.businessAddress ? `<p><strong>Address:</strong> ${order.businessAddress}</p>` : ''}
  `

  // Send to baker's email
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: process.env.BAKER_EMAIL!,
    subject,
    html
  })

  // Send SMS notification via email-to-SMS gateway
  if (process.env.BAKER_SMS_EMAIL) {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.BAKER_SMS_EMAIL!,
      subject: 'New Cookie Order',
      text: `New ${order.orderType} order: ${order.totalCookies} cookies, $${order.totalPrice} - ${order.fulfillmentType}`
    })
  }
}
```

---

## Phase 5: Public Order Page

### Step 13: Create Public Order Route

**File:** `app/drops/[slug]/page.tsx`

Features:
- Fetch active drop by slug
- Show "Orders Closed" if past cutoff
- Render public order form
- Handle form submission
- Show confirmation after success

### Step 14: Public Form Implementation

Components:
- react-hook-form with zod resolver
- Cookie quantity selectors
- Customer info fields (name, email, phone, zipCode)
- Real-time total calculation
- Conditional delivery date picker (>= $100)
- Submit button with loading state
- Error handling

---

## Phase 6: Business Orders Page

### Step 15: Create Business Order Route

**File:** `app/drops/[slug]/business/[attr]/page.tsx`

```typescript
export default async function BusinessOrderPage({
  params
}: {
  params: Promise<{ slug: string; attr: string }>
}) {
  const { slug, attr } = await params
  // Extract attribution from route params
  // Pass to form component
}
```

### Step 16: Business Form Implementation

Extends public form with:
- Business name input
- Business address input
- Attribution passed to API on submit
- orderType set to "business"
- Same $100 threshold logic

---

## Phase 7: Group Orders Page

### Step 17: Create Group Order Route

**File:** `app/drops/[slug]/group/[attr]/page.tsx`

Features:
- Extract attribution from route params
- Coordinator section
- Dynamic group members with useFieldArray
- Grand total calculation across all members

### Step 18: Group Form Implementation

Structure:
- Coordinator fields: name, email, phone, zipCode
- "Add Person" button (useFieldArray)
- Each member: name + 3 cookie quantity inputs
- Remove member button
- Grand total calculation
- orderType set to "group"

---

## Phase 8: Polish & Testing

### Step 19: Styling & Mobile Responsiveness

Checklist:
- [ ] Apply "cozy with fabulous flair" styling
- [ ] Test all forms on mobile (iPhone, Android)
- [ ] Add loading spinners during submission
- [ ] Style error messages
- [ ] Ensure touch-friendly inputs
- [ ] Test on various screen sizes

### Step 20: Cutoff Date Logic Testing

Test scenarios:
- [ ] Before Dec 1: Forms active and accepting orders
- [ ] After Dec 1: "Orders Closed" message displayed
- [ ] Form submission disabled after cutoff
- [ ] isActive auto-updates in database
- [ ] Manual date change testing

### Step 21: End-to-End Testing

Full workflow tests:
- [ ] Submit public order → verify email arrives
- [ ] Submit business order → check attribution tracked
- [ ] Submit group order → verify groupMembers JSON
- [ ] Check database records created correctly
- [ ] Verify price calculations accurate
- [ ] Test delivery threshold logic ($99 vs $100 vs $101)
- [ ] Confirm SMS notifications work

---

## Final File Structure

```
app/
  drops/
    [slug]/
      page.tsx                    # Public orders
      business/
        [attr]/
          page.tsx                # Business orders
      group/
        [attr]/
          page.tsx                # Group orders
  api/
    drops/
      [slug]/
        orders/
          route.ts                # Order submission API

components/
  cookie-selector.tsx             # Quantity selector
  fulfillment-options.tsx         # Pickup/delivery logic
  order-confirmation.tsx          # Thank you message

lib/
  drops.ts                        # Drop utilities
  cookies.ts                      # Cookie constants
  email.ts                        # Resend integration
  validations/
    order-schemas.ts              # Zod schemas

hooks/
  use-order-total.ts              # Price calculator

prisma/
  schema.prisma                   # Database models
  seed.ts                         # Winter drop seed
```

---

## Environment Variables Needed

```env
# Database (already configured)
DATABASE_URL="postgresql://..."

# Email
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="orders@yourdomain.com"
BAKER_EMAIL="katie@example.com"
BAKER_SMS_EMAIL="katie@sms-gateway.com"  # Optional SMS via email
```

---

## Launch Checklist

- [ ] All dependencies installed
- [ ] Database migrated and seeded
- [ ] Resend API key configured
- [ ] Email notifications tested
- [ ] All three forms tested end-to-end
- [ ] Mobile responsiveness verified
- [ ] Cutoff date logic working
- [ ] Attribution tracking verified
- [ ] Price calculations accurate
- [ ] Error handling working
- [ ] Deploy to production
- [ ] Monitor first real orders

---

## Notes

- Cookie designs are hardcoded (can be moved to DB later)
- Email notifications are fire-and-forget (no retry logic)
- No admin dashboard (manage via database queries)
- Private pages use route segments for attribution (accessible via SEO but unlisted)
- isActive automatically updates based on cutoff date when drop is fetched
