import { OrderProvider } from './context/OrderContext';

export default function DropLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OrderProvider>{children}</OrderProvider>;
}
