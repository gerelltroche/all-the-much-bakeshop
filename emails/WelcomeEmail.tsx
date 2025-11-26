import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  name?: string;
  email?: string;
}

export function WelcomeEmail({ name, email }: WelcomeEmailProps) {
  const unsubscribeUrl = email
    ? `https://allthemuchbakeshop.com/unsubscribe?email=${btoa(email)}`
    : 'https://allthemuchbakeshop.com/unsubscribe';
  const previewText = "You're on the list for our next cookie drop!";

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
              {name ? `Hey ${name}!` : 'Hey there!'}
            </Heading>

            <Text style={paragraph}>
              Thanks for signing up to be notified about my cookie drops! You're
              now on the list and will be the first to know when fresh batches
              are ready.
            </Text>

            <Text style={paragraph}>
              I bake in small batches with love, using quality ingredients and
              lots of butter (obviously). Each drop is limited, so keep an eye on
              your inbox!
            </Text>

            <Section style={highlightBox}>
              <Text style={highlightText}>
                <strong>What to expect:</strong> I'll email you when a new drop
                is announced with all the details — flavors, quantities, and when
                ordering opens.
              </Text>
            </Section>

            <Text style={paragraph}>
              In the meantime, follow me on social media to see behind-the-scenes
              baking content and sneak peeks of upcoming flavors.
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
            <Text style={unsubscribeText}>
              Don't want to hear about drops?{' '}
              <Link href={unsubscribeUrl} style={link}>
                Unsubscribe
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
  fontSize: '24px',
  fontWeight: '600',
  color: '#78350f', // amber-900
  margin: '0 0 24px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#78350f', // amber-900
  margin: '0 0 20px 0',
};

const highlightBox = {
  backgroundColor: '#fffbeb', // amber-50
  borderRadius: '12px',
  padding: '20px 24px',
  margin: '24px 0',
  border: '1px solid #fcd34d', // amber-300
};

const highlightText = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#92400e', // amber-800
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

const signoffTitle = {
  fontSize: '14px',
  color: '#b45309', // amber-700
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

const unsubscribeText = {
  fontSize: '12px',
  color: '#d97706', // amber-600
  margin: '16px 0 0 0',
};

export default WelcomeEmail;
