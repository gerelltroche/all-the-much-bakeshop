import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components';

interface KatieOrderConfirmationEmailProps {
  orderNumber?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  orderType?: 'individual' | 'business' | 'group';
  businessName?: string;
  cookies?: Array<{ name: string; quantity: number; price: number }>;
  total?: number;
  fulfillmentType?: 'pickup' | 'delivery';
  fulfillmentDetails?: string;
  fulfillmentDate?: Date;
  dropName?: string;
}

// Default props for email preview
const defaultProps: Required<KatieOrderConfirmationEmailProps> = {
  orderNumber: 1234,
  customerName: 'Jane Smith',
  customerEmail: 'jane@example.com',
  customerPhone: '(555) 123-4567',
  orderType: 'individual',
  businessName: '',
  cookies: [
    { name: 'Triple Chocolate Peppermint Bark (Dozen)', quantity: 2, price: 36 },
    { name: 'Triple Chocolate Peppermint Bark (Half Dozen)', quantity: 1, price: 20 },
  ],
  total: 92,
  fulfillmentType: 'pickup',
  fulfillmentDetails: 'Downtown Farmers Market, 123 Main St',
  fulfillmentDate: new Date('2025-12-21'),
  dropName: 'Candy Cane Lane',
};

export function KatieOrderConfirmationEmail({
  orderNumber = defaultProps.orderNumber,
  customerName = defaultProps.customerName,
  customerEmail = defaultProps.customerEmail,
  customerPhone = defaultProps.customerPhone,
  orderType = defaultProps.orderType,
  businessName = defaultProps.businessName,
  cookies = defaultProps.cookies,
  total = defaultProps.total,
  fulfillmentType = defaultProps.fulfillmentType,
  fulfillmentDetails = defaultProps.fulfillmentDetails,
  fulfillmentDate = defaultProps.fulfillmentDate,
  dropName = defaultProps.dropName,
}: KatieOrderConfirmationEmailProps) {
  const previewText = `KA-CHING! Order #${orderNumber} from ${customerName} - $${total}`;

  const formattedDate = new Date(fulfillmentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const totalQuantity = cookies.reduce((sum, cookie) => sum + cookie.quantity, 0);

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://allthemuchbakeshop.com'}/Katie-boom.png`}
              width="200"
              height="250"
              alt="Katie walking away from explosion - BOOM"
              style={boomImage}
            />
            <Heading style={headerTitle}>Cha-Ching, Baby!</Heading>
            <Text style={headerSubtitle}>Another one bites the dust (and wants your cookies)</Text>
          </Section>

          <Section style={contentSection}>
            {/* Order Summary Banner */}
            <Section style={orderBanner}>
              <Row>
                <Column style={bannerCol}>
                  <Text style={bannerLabel}>Order #</Text>
                  <Text style={bannerValue}>{orderNumber}</Text>
                </Column>
                <Column style={bannerCol}>
                  <Text style={bannerLabel}>Total</Text>
                  <Text style={bannerValue}>${total.toFixed(2)}</Text>
                </Column>
                <Column style={bannerCol}>
                  <Text style={bannerLabel}>Items</Text>
                  <Text style={bannerValue}>{totalQuantity}</Text>
                </Column>
              </Row>
            </Section>

            {/* Customer Info */}
            <Section style={infoSection}>
              <Text style={sectionTitle}>Customer</Text>
              <Text style={infoText}>
                <strong>{customerName}</strong>
                {orderType === 'business' && businessName && (
                  <>
                    <br />
                    <span style={businessLabel}>{businessName}</span>
                  </>
                )}
                {orderType !== 'individual' && (
                  <>
                    <br />
                    <span style={orderTypeTag}>
                      {orderType === 'business' ? 'Business Order' : 'Group Order'}
                    </span>
                  </>
                )}
              </Text>
              <Text style={contactText}>
                <Link href={`mailto:${customerEmail}`} style={link}>
                  {customerEmail}
                </Link>
                <br />
                <Link href={`tel:${customerPhone}`} style={link}>
                  {customerPhone}
                </Link>
              </Text>
            </Section>

            <Hr style={divider} />

            {/* Order Items */}
            <Section style={infoSection}>
              <Text style={sectionTitle}>Order Details — {dropName}</Text>
              {cookies.map((cookie, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={itemQtyCol}>
                    <Text style={itemQty}>{cookie.quantity}×</Text>
                  </Column>
                  <Column style={itemNameCol}>
                    <Text style={itemName}>{cookie.name}</Text>
                  </Column>
                  <Column style={itemPriceCol}>
                    <Text style={itemPrice}>
                      ${(cookie.price * cookie.quantity).toFixed(2)}
                    </Text>
                  </Column>
                </Row>
              ))}
              <Hr style={subtleDivider} />
              <Row>
                <Column style={itemQtyCol}></Column>
                <Column style={itemNameCol}>
                  <Text style={totalLabel}>Total</Text>
                </Column>
                <Column style={itemPriceCol}>
                  <Text style={totalPrice}>${total.toFixed(2)}</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={divider} />

            {/* Fulfillment Info */}
            <Section style={infoSection}>
              <Text style={sectionTitle}>
                {fulfillmentType === 'pickup' ? 'Pickup' : 'Delivery'}
              </Text>
              <Text style={fulfillmentText}>
                <strong>{formattedDate}</strong>
                <br />
                {fulfillmentDetails}
              </Text>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              This is an automated notification from All the Much Bake Shop
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f3f4f6', // gray-100
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
};

const header = {
  textAlign: 'center' as const,
  padding: '20px 0',
};

const boomImage = {
  margin: '0 auto 16px auto',
  borderRadius: '12px',
};

const headerTitle = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#1f2937', // gray-800
  margin: '0 0 8px 0',
};

const headerSubtitle = {
  fontSize: '16px',
  color: '#6b7280', // gray-500
  margin: '0',
};

const contentSection = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '32px',
  border: '1px solid #e5e7eb', // gray-200
};

const orderBanner = {
  backgroundColor: '#fef3c7', // amber-100
  borderRadius: '12px',
  padding: '20px',
  margin: '0 0 24px 0',
};

const bannerCol = {
  textAlign: 'center' as const,
};

const bannerLabel = {
  fontSize: '11px',
  color: '#92400e', // amber-800
  margin: '0 0 4px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const bannerValue = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#78350f', // amber-900
  margin: '0',
};

const infoSection = {
  margin: '20px 0',
};

const sectionTitle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#6b7280', // gray-500
  margin: '0 0 12px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const infoText = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#1f2937', // gray-800
  margin: '0 0 8px 0',
};

const businessLabel = {
  color: '#6b7280', // gray-500
};

const orderTypeTag = {
  display: 'inline-block' as const,
  backgroundColor: '#dbeafe', // blue-100
  color: '#1e40af', // blue-800
  fontSize: '12px',
  padding: '2px 8px',
  borderRadius: '4px',
  marginTop: '4px',
};

const contactText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#4b5563', // gray-600
  margin: '0',
};

const link = {
  color: '#2563eb', // blue-600
  textDecoration: 'none',
};

const divider = {
  borderColor: '#e5e7eb', // gray-200
  margin: '20px 0',
};

const subtleDivider = {
  borderColor: '#f3f4f6', // gray-100
  margin: '12px 0',
};

const itemRow = {
  marginBottom: '8px',
};

const itemQtyCol = {
  width: '40px',
};

const itemQty = {
  fontSize: '14px',
  color: '#6b7280', // gray-500
  margin: '0',
};

const itemNameCol = {
  width: 'auto',
};

const itemPriceCol = {
  width: '80px',
  textAlign: 'right' as const,
};

const itemName = {
  fontSize: '15px',
  color: '#1f2937', // gray-800
  margin: '0',
};

const itemPrice = {
  fontSize: '15px',
  color: '#1f2937', // gray-800
  margin: '0',
};

const totalLabel = {
  fontSize: '15px',
  fontWeight: '600',
  color: '#1f2937', // gray-800
  margin: '0',
};

const totalPrice = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#1f2937', // gray-800
  margin: '0',
};

const fulfillmentText = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#1f2937', // gray-800
  margin: '0',
};

const footer = {
  textAlign: 'center' as const,
  padding: '24px 0 0 0',
};

const footerText = {
  fontSize: '12px',
  color: '#9ca3af', // gray-400
  margin: '0',
};

export default KatieOrderConfirmationEmail;
