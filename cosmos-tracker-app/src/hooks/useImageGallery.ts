import { useState } from "react";
import { useTheme } from "./use-theme";
import { useQuery } from "@tanstack/react-query";
import { fetchNasaImages } from "@/utilities/helper";
import { ImageResponse } from "@/utilities/types";
import { useWindowDimensions } from "react-native";

export default function useImageGallery() {
  const theme = useTheme();

  const [imageList, setImageList] = useState<ImageResponse[]>([]);

  const fetchImages = async (signal: AbortSignal) => {
    const images = await fetchNasaImages(1, signal);
    console.log("Images", images);

    setImageList((prev) => Array.from(new Set([...prev, ...images])));
    return images;
  };

  const { isFetching, isLoading } = useQuery({
    queryKey: ["imageList"],
    queryFn: ({ signal }) => fetchImages(signal),
    retry: 3,
    retryDelay: 100,
  });
  const { width } = useWindowDimensions();

  return {
    theme,
    imageList,
    isFetching,
    isLoading,
    width,
  };
}
