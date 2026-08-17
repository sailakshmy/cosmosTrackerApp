import { useCallback, useMemo } from "react";
import { useTheme } from "./use-theme";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchNasaImages } from "@/utilities/helper";
import { useWindowDimensions } from "react-native";

export default function useImageGallery() {
  const theme = useTheme();

  const fetchImages = async (pageParam = 1, signal: AbortSignal) => {
    const images = await fetchNasaImages(pageParam, signal);
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
    data,
  } = useInfiniteQuery({
    queryKey: ["nasa-images"],
    queryFn: ({ signal, pageParam }) => fetchImages(pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.images?.length ? lastPage.nextPage : undefined,
  });

  const imageList = useMemo(() => {
    const seenIds = new Set<string>();

    return (
      data?.pages
        ?.flatMap((page) => page.images ?? [])
        ?.filter((image) => {
          const id = image?.data?.[0]?.nasa_id ?? image.href;

          if (seenIds.has(id)) {
            return false;
          }

          seenIds.add(id);
          return true;
        }) ?? []
    );
  }, [data]);

  const { width } = useWindowDimensions();
  const columnCount = width >= 760 ? 3 : 2;

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
    columnCount,
    handleEndReached,
  };
}
