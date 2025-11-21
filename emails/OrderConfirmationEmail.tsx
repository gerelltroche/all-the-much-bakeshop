import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

interface OrderConfirmationEmailProps {
  orderNumber: number;
  customerName: string;
  cookies: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  fulfillmentType: 'pickup' | 'delivery';
  fulfillmentDetails: string;
  fulfillmentDate: Date;
}

export function OrderConfirmationEmail({
  orderNumber,
  customerName,
  cookies,
  total,
  fulfillmentType,
  fulfillmentDetails,
  fulfillmentDate,
}: OrderConfirmationEmailProps) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(fulfillmentDate);

  return (
    <Html>
      <Head />
      <Preview>Order Confirmation - {orderNumber.toString()}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Header />
          <Section style={content}>
            <Text style={heading}>Thank You for Your Order! 🍪</Text>
            <Text style={paragraph}>Hi {customerName},</Text>
            <Text style={paragraph}>
              Your order has been confirmed! We can't wait to bake these
              delicious cookies for you.
            </Text>

            <Section style={orderBox}>
              <Text style={orderBoxTitle}>Order #{orderNumber.toString()}</Text>

              <Hr style={hr} />

              {cookies.map((cookie, index) => (
                <Section key={index} style={cookieRow}>
                  <Text style={cookieName}>
                    {cookie.quantity}x {cookie.name}
                  </Text>
                  <Text style={cookiePrice}>
                    ${(cookie.quantity * cookie.price).toFixed(2)}
                  </Text>
                </Section>
              ))}

              <Hr style={hr} />

              <Section style={totalRow}>
                <Text style={totalLabel}>Total</Text>
                <Text style={totalAmount}>${total.toFixed(2)}</Text>
              </Section>
            </Section>

            <Section style={fulfillmentBox}>
              <Text style={fulfillmentTitle}>
                {fulfillmentType === 'pickup' ? '📍 Pickup' : '🚗 Delivery'}{' '}
                Details
              </Text>
              <Text style={fulfillmentDateStyle}>{formattedDate}</Text>
              <Text style={fulfillmentInfo}>{fulfillmentDetails}</Text>
            </Section>

            <Text style={paragraph}>
              If you have any questions about your order, feel free to reply to
              this email. We're here to help!
            </Text>

            <Text style={paragraph}>
              Thank you for supporting All the Much Bake Shop!
              <br />
              Katie
            </Text>
          </Section>
          <Footer />
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
};

const content = {
  padding: '32px 20px',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 24px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#374151',
  margin: '0 0 16px',
};

const orderBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const orderBoxTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 16px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '16px 0',
};

const cookieRow = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '8px 0',
};

const cookieName = {
  fontSize: '14px',
  color: '#374151',
  margin: '0',
  flex: 1,
};

const cookiePrice = {
  fontSize: '14px',
  color: '#374151',
  margin: '0',
  fontWeight: '600',
};

const totalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '8px 0',
};

const totalLabel = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0',
  flex: 1,
};

const totalAmount = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#92400e',
  margin: '0',
};

const fulfillmentBox = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const fulfillmentTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#92400e',
  margin: '0 0 8px',
};

const fulfillmentDateStyle = {
  fontSize: '15px',
  fontWeight: '600',
  color: '#78350f',
  margin: '0 0 8px',
};

const fulfillmentInfo = {
  fontSize: '14px',
  color: '#78350f',
  margin: '0',
  lineHeight: '20px',
};
