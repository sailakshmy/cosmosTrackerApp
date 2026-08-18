import { useLocalSearchParams, useNavigation } from "expo-router";
import { useTheme } from "./use-theme";
import { useLayoutEffect } from "react";

export default function useNasaImageDetails() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { title, description, imageHref } = useLocalSearchParams<{
    title?: string;
    description?: string;
    imageHref?: string;
  }>();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title ?? "",
      description,
      imageHref,
    });
  }, [navigation, title]);

  return { theme, title, description, imageHref };
}
