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

interface NewsletterEmailProps {
  title: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
}

export function NewsletterEmail({
  title,
  message,
  ctaText,
  ctaUrl,
}: NewsletterEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Header />
          <Section style={content}>
            <Text style={heading}>{title}</Text>
            <Text style={paragraph}>{message}</Text>
            {ctaText && ctaUrl && (
              <Section style={buttonContainer}>
                <Button href={ctaUrl}>{ctaText}</Button>
              </Section>
            )}
            <Text style={signature}>
              Happy baking!
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
  whiteSpace: 'pre-line' as const,
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const signature = {
  fontSize: '16px',
  color: '#374151',
  margin: '24px 0 0',
};
