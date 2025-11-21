import { Hr, Link, Section, Text } from '@react-email/components';

interface FooterProps {
  unsubscribeUrl?: string;
}

export function Footer({ unsubscribeUrl }: FooterProps) {
  return (
    <>
      <Hr style={hr} />
      <Section style={footerSection}>
        <Text style={footerText}>
          All the Much Bake Shop
          <br />
          Bringing homemade goodness to your table
        </Text>
        <Text style={footerText}>
          Questions? Reply to this email or visit{' '}
          <Link href="https://allthemuchbakeshop.com" style={link}>
            allthemuchbakeshop.com
          </Link>
        </Text>
        {unsubscribeUrl && (
          <Text style={unsubscribeText}>
            <Link href={unsubscribeUrl} style={unsubscribeLink}>
              Unsubscribe from emails
            </Link>
          </Text>
        )}
      </Section>
    </>
  );
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
};

const footerSection = {
  padding: '20px',
  textAlign: 'center' as const,
  color: '#6b7280',
};

const footerText = {
  fontSize: '12px',
  lineHeight: '20px',
  margin: '8px 0',
};

const link = {
  color: '#92400e',
  textDecoration: 'underline',
};

const unsubscribeText = {
  fontSize: '11px',
  margin: '16px 0 0',
};

const unsubscribeLink = {
  color: '#9ca3af',
  textDecoration: 'underline',
};
