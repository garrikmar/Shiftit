import { useTheme } from "../contexts/theme-context";
import { Toaster as SonnerToaster } from "sonner";

export function ThemedToaster() {
  const { theme } = useTheme();
  
  return (
    <SonnerToaster 
      position="top-center" 
      richColors 
      theme={theme}
      dir="rtl"
      toastOptions={{
        style: {
          direction: 'rtl',
        },
      }}
    />
  );
}
