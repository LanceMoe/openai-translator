import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

export function ReactQueryProvider(props: Props) {
  const { children } = props;
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
