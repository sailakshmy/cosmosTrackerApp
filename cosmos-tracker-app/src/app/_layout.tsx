import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DrawerNav from "@/components/drawer-nav";

const queryClient = new QueryClient();
export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <AnimatedSplashOverlay />
        {/* <AppTabs /> */}
        <DrawerNav />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
