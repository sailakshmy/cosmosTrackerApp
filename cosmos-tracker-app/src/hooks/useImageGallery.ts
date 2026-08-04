import { useState } from "react";
import { useTheme } from "./use-theme";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchNasaImages } from "@/utilities/helper";
import { ImageResponse } from "@/utilities/types";
import { useWindowDimensions } from "react-native";

export default function useImageGallery() {
  const theme = useTheme();

  const [imageList, setImageList] = useState<ImageResponse[]>([]);
  let currentPageNumber = 0;

  const fetchImages = async (pageParam = 1, signal: AbortSignal) => {
    const images = await fetchNasaImages(pageParam, signal);
    currentPageNumber = pageParam;
    // console.log("Images", images);

    setImageList((prev) => Array.from(new Set([...prev, ...images])));
    return { images, nextPage: pageParam + 1 };
  };

  const {
    isFetching,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: [currentPageNumber],
    queryFn: ({ signal, pageParam }) => fetchImages(pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.nextPage,
  });
  const { width } = useWindowDimensions();

  return {
    theme,
    imageList,
    isFetching,
    isLoading,
    width,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  };
}
