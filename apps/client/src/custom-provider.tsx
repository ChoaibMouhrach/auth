import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

interface CustomproviderProps {
  children: React.ReactNode;
}

export const CustomProvider: React.FC<CustomproviderProps> = ({ children }) => {
  const [client] = useState(() => new QueryClient());

  return (
    <>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
      <Toaster />
    </>
  );
};
