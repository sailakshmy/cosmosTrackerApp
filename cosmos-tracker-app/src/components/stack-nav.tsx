import { useTheme } from "@/hooks/use-theme";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

export default function StackNav() {
  const theme = useTheme();
  const params = useLocalSearchParams();
  // console.log("params", params);
  // const pageTitle = params?.
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen
        name="nasaImageGallery"
        // options={{
        //   // headerBackVisible: true,
        //   title: "",
        //   headerBackTitle: "",
        // }}
      />
      <Stack.Screen
        name="nasaImageDetails"
        // options={{
        //   headerBackVisible: true,
        //   title: "",
        //   // title: params.pageTitle,
        //   headerBackTitle: "",
        //   headerBackButtonDisplayMode: "minimal",
        // }}
      />
    </Stack>
  );
}
