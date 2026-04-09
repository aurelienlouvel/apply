import { AppShell } from '@/components/layout/AppShell';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
