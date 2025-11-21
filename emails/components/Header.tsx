import { Img, Section, Text } from '@react-email/components';

export function Header() {
  return (
    <Section style={headerSection}>
      <Text style={logo}>All the Much Bake Shop</Text>
      <Text style={tagline}>Homemade cookies baked with love</Text>
    </Section>
  );
}

const headerSection = {
  padding: '40px 20px 20px',
  textAlign: 'center' as const,
  backgroundColor: '#fef3c7',
};

const logo = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#92400e',
  margin: '0 0 8px',
};

const tagline = {
  fontSize: '14px',
  color: '#78350f',
  margin: '0',
};
