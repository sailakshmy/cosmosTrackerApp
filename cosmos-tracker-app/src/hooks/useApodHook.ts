import {
  fetchImageForSelectedDate,
  fetchISOStringDate,
} from "@/utilities/helper";
import { useEffect, useState } from "react";
import { useTheme } from "./use-theme";
import { useQuery } from "@tanstack/react-query";

const useApodHook = () => {
  const [apodData, setApodData] = useState({
    title: "",
    description: "",
    mediaType: "",
    src: "",
  });
  // const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const selectedDate = fetchISOStringDate(date);

  const fetchImage = async (signal: AbortSignal) => {
    console.log(
      "process.env.EXPO_PUBLIC_APOD_BASE_URL",
      process.env.EXPO_PUBLIC_APOD_BASE_URL,
    );

    const apodPic = await fetchImageForSelectedDate(date, signal);

    setApodData({
      title: apodPic?.title,
      description: apodPic?.explanation,
      src: apodPic?.url,
      mediaType: apodPic?.media_type,
    });
    if (apodPic?.date && apodPic.date !== selectedDate) {
      const newDate = new Date(apodPic?.date);
      setDate(newDate);
    }

    return "";
  };
  // useEffect(() => {
  //   fetchImage();
  // }, [date]);

  const { isLoading } = useQuery({
    queryKey: ["apod", selectedDate],
    queryFn: ({ signal }) => fetchImage(signal),
    retry: 3,
    retryDelay: 100,
  });

  const theme = useTheme();
  const [imageLoading, setImageLoading] = useState(isLoading);
  console.log("Media source", apodData?.src);
  const imageSource = apodData?.src ? { uri: apodData.src } : undefined;
  console.log("imageSource", imageSource);
  const showImageSkeleton = isLoading || imageLoading || !imageSource;
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  useEffect(() => {
    setImageLoading(Boolean(imageSource) || isLoading);
  }, [imageSource?.uri, isLoading]);

  return {
    isLoading,
    apodData,
    date,
    setDate,
    theme,
    showImageSkeleton,
    blurhash,
    imageSource,
    setImageLoading,
  };
};

export default useApodHook;
