import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Button } from './components/Button';

interface WelcomeEmailProps {
  name?: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  const greeting = name ? `Hi ${name}` : 'Hi there';

  return (
    <Html>
      <Head />
      <Preview>Welcome to All the Much Bake Shop!</Preview>
      <Body style={body}>
        <Container style={container}>
          <Header />
          <Section style={content}>
            <Text style={heading}>{greeting}! 🍪</Text>
            <Text style={paragraph}>
              Thank you for joining the All the Much Bake Shop family! We're so
              excited to have you here.
            </Text>
            <Text style={paragraph}>
              You'll be the first to know when we have new cookie drops,
              special flavors, and exclusive offers. Our homemade cookies are
              baked fresh with the finest ingredients and plenty of love.
            </Text>
            <Text style={paragraph}>
              Keep an eye on your inbox for upcoming drops and delicious updates!
            </Text>
            <Section style={buttonContainer}>
              <Button href="https://allthemuchbakeshop.com">
                Visit Our Shop
              </Button>
            </Section>
            <Text style={paragraph}>
              Happy baking days ahead!
              <br />
              Katie & the All the Much team
            </Text>
          </Section>
          <Footer unsubscribeUrl="https://allthemuchbakeshop.com/unsubscribe" />
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

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
};
