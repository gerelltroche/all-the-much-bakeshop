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

interface OrderConfirmationEmailProps {
  orderNumber?: number;
  customerName?: string;
  cookies?: Array<{ name: string; quantity: number; price: number }>;
  total?: number;
  fulfillmentType?: 'pickup' | 'delivery';
  fulfillmentDetails?: string;
  fulfillmentDate?: Date;
}

// Default props for email preview
const defaultProps: Required<OrderConfirmationEmailProps> = {
  orderNumber: 1234,
  customerName: 'Cookie Lover',
  cookies: [
    { name: 'Triple Chocolate Peppermint Bark (Dozen)', quantity: 1, price: 36 },
    { name: 'Triple Chocolate Peppermint Bark (Half Dozen)', quantity: 2, price: 20 },
  ],
  total: 76,
  fulfillmentType: 'pickup',
  fulfillmentDetails: 'Downtown Farmers Market, 123 Main St',
  fulfillmentDate: new Date('2025-12-21'),
};

export function OrderConfirmationEmail({
  orderNumber = defaultProps.orderNumber,
  customerName = defaultProps.customerName,
  cookies = defaultProps.cookies,
  total = defaultProps.total,
  fulfillmentType = defaultProps.fulfillmentType,
  fulfillmentDetails = defaultProps.fulfillmentDetails,
  fulfillmentDate = defaultProps.fulfillmentDate,
}: OrderConfirmationEmailProps) {
  const previewText = `Order #${orderNumber} confirmed! Your cookies are on the way.`;

  const formattedDate = new Date(fulfillmentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img
              src="https://allthemuchbakeshop.com/AllTheMuchBakeshopLogoTransparentBack.png"
              width="220"
              height="220"
              alt="All the Much Bake Shop"
              style={logoImage}
            />
          </Section>

          <Section style={contentSection}>
            <Heading style={heading}>
              Order Confirmed!
            </Heading>

            <Text style={paragraph}>
              Hey {customerName}! Thanks so much for your order. I'm excited to
              bake these fresh for you!
            </Text>

            {/* Order Number Badge */}
            <Section style={orderBadge}>
              <Text style={orderBadgeLabel}>Order Number</Text>
              <Text style={orderBadgeNumber}>#{orderNumber}</Text>
            </Section>

            {/* Order Items */}
            <Section style={orderSection}>
              <Text style={sectionTitle}>Your Order</Text>
              {cookies.map((cookie, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={itemNameCol}>
                    <Text style={itemName}>
                      {cookie.quantity}× {cookie.name}
                    </Text>
                  </Column>
                  <Column style={itemPriceCol}>
                    <Text style={itemPrice}>
                      ${(cookie.price * cookie.quantity).toFixed(2)}
                    </Text>
                  </Column>
                </Row>
              ))}
              <Hr style={divider} />
              <Row style={itemRow}>
                <Column style={itemNameCol}>
                  <Text style={totalLabel}>Total</Text>
                </Column>
                <Column style={itemPriceCol}>
                  <Text style={totalPrice}>${total.toFixed(2)}</Text>
                </Column>
              </Row>
            </Section>

            {/* Fulfillment Info */}
            <Section style={fulfillmentSection}>
              <Text style={sectionTitle}>
                {fulfillmentType === 'pickup' ? 'Pickup Details' : 'Delivery Details'}
              </Text>
              <Row>
                <Column style={iconCol}>
                  <Text style={icon}>
                    {fulfillmentType === 'pickup' ? '📍' : '🚗'}
                  </Text>
                </Column>
                <Column>
                  <Text style={fulfillmentText}>
                    <strong>{formattedDate}</strong>
                    <br />
                    {fulfillmentDetails}
                  </Text>
                </Column>
              </Row>
              <Text style={timeNote}>
                I'll send another email closer to the date with the exact pickup location and
                time window.
              </Text>
            </Section>

            {/* What's Next */}
            <Section style={highlightBox}>
              <Text style={highlightText}>
                <strong>What's next?</strong> I'll reach out if I have any
                questions about your order. Otherwise, just show up on the
                pickup date and your cookies will be ready!
              </Text>
            </Section>

            <Text style={paragraph}>
              If you have any questions, just reply to this email — I'm happy to
              help!
            </Text>

            <Section style={signoffSection}>
              <Img
                src="https://allthemuchbakeshop.com/Katie-pfp.jpg"
                width="60"
                height="60"
                alt="Katie"
                style={avatar}
              />
              <Text style={signoff}>
                Happy snacking,
                <br />
                <strong>Katie</strong>
              </Text>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              All the Much Bake Shop
              <br />
              Baked with love in small batches
            </Text>
            <Text style={footerLinks}>
              <Link href="https://allthemuchbakeshop.com" style={link}>
                Website
              </Link>
              {' · '}
              <Link href="https://instagram.com/allthemuchbakeshop" style={link}>
                Instagram
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles - warm rose/amber palette to match the brand
const main = {
  backgroundColor: '#fdf2f4', // rose-50 equivalent
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
};

const logoSection = {
  textAlign: 'center' as const,
  padding: '0',
  marginTop: '-40px',
};

const logoImage = {
  margin: '0 auto',
};

const contentSection = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '40px 32px',
  border: '1px solid #fecdd3', // rose-200
};

const heading = {
  fontSize: '28px',
  fontWeight: '600',
  color: '#78350f', // amber-900
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#78350f', // amber-900
  margin: '0 0 20px 0',
};

const orderBadge = {
  backgroundColor: '#f59e0b', // amber-500
  borderRadius: '12px',
  padding: '16px 24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const orderBadgeLabel = {
  fontSize: '12px',
  color: '#ffffff',
  margin: '0 0 4px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  opacity: 0.9,
};

const orderBadgeNumber = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#ffffff',
  margin: '0',
};

const orderSection = {
  margin: '24px 0',
};

const sectionTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#78350f', // amber-900
  margin: '0 0 16px 0',
};

const itemRow = {
  marginBottom: '8px',
};

const itemNameCol = {
  width: '70%',
};

const itemPriceCol = {
  width: '30%',
  textAlign: 'right' as const,
};

const itemName = {
  fontSize: '15px',
  color: '#92400e', // amber-800
  margin: '0',
};

const itemPrice = {
  fontSize: '15px',
  color: '#92400e', // amber-800
  margin: '0',
};

const divider = {
  borderColor: '#fcd34d', // amber-300
  margin: '16px 0',
};

const totalLabel = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#78350f', // amber-900
  margin: '0',
};

const totalPrice = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#78350f', // amber-900
  margin: '0',
};

const fulfillmentSection = {
  backgroundColor: '#fffbeb', // amber-50
  borderRadius: '12px',
  padding: '20px 24px',
  margin: '24px 0',
  border: '1px solid #fcd34d', // amber-300
};

const iconCol = {
  width: '40px',
  verticalAlign: 'top' as const,
};

const icon = {
  fontSize: '24px',
  margin: '0',
};

const fulfillmentText = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#92400e', // amber-800
  margin: '0',
};

const timeNote = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#b45309', // amber-700
  margin: '12px 0 0 0',
  fontStyle: 'italic' as const,
};

const highlightBox = {
  backgroundColor: '#ecfdf5', // green-50
  borderRadius: '12px',
  padding: '20px 24px',
  margin: '24px 0',
  border: '1px solid #6ee7b7', // green-300
};

const highlightText = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#065f46', // green-800
  margin: '0',
};

const signoffSection = {
  marginTop: '24px',
};

const avatar = {
  borderRadius: '50%',
  marginBottom: '12px',
};

const signoff = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#78350f', // amber-900
  margin: '0',
};

const footer = {
  textAlign: 'center' as const,
  padding: '32px 0 0 0',
};

const footerText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#b45309', // amber-700
  margin: '0 0 12px 0',
};

const footerLinks = {
  fontSize: '14px',
  color: '#b45309', // amber-700
  margin: '0 0 12px 0',
};

const link = {
  color: '#b45309', // amber-700
  textDecoration: 'underline',
};

export default OrderConfirmationEmail;
