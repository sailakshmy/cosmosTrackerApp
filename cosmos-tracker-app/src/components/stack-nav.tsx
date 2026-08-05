import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";

export default function StackNav() {
  const theme = useTheme();
  return (
    <Stack
      // See React Navigation documentation for more information on available screenOptions: https://reactnavigation.org/docs/headers/#sharing-common-options-across-screens
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="nasaInageGallery"
        options={{
          headerBackVisible: true,
          title: "Nasa Image Gallery",
        }}
      />
    </Stack>
  );
}
