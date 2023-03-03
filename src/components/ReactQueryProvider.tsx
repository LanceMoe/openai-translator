import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

export default function ReactQueryProvider(props: Props) {
  const { children } = props;
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
