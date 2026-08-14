import { useTheme } from "@/hooks/use-theme";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

export default function StackNav() {
  const theme = useTheme();
  const params = useLocalSearchParams();
  // console.log("params", params);
  // const pageTitle = params?.
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
        name="nasaImageGallery"
        options={{
          // headerBackVisible: true,
          title: "Nasa Image Gallery",
          headerBackTitle: "",
        }}
      />
      <Stack.Screen
        name="nasaImageDetails"
        options={{
          headerBackVisible: true,
          title: "",
          // title: params.pageTitle,
          headerBackTitle: "",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack>
  );
}
