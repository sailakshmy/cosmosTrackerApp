import { fetchImageForSelectedDate } from "@/utilities/helper";
import { useEffect, useState } from "react";
import { useTheme } from "./use-theme";

const useApodHook = () => {
  const [apodData, setApodData] = useState({
    title: "",
    description: "",
    mediaType: "",
    src: "",
  });
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());

  const fetchImage = async () => {
    console.log(
      "process.env.EXPO_PUBLIC_APOD_BASE_URL",
      process.env.EXPO_PUBLIC_APOD_BASE_URL,
    );
    try {
      const apodPic = await fetchImageForSelectedDate(date);

      setApodData({
        title: apodPic?.title,
        description: apodPic?.explanation,
        src: apodPic?.hdurl,
        mediaType: apodPic?.media_type,
      });
      if (apodPic?.date) {
        const newDate = new Date(apodPic?.date);
        setDate(newDate);
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchImage();
  }, [date]);
  const theme = useTheme();
  const [imageLoading, setImageLoading] = useState(true);
  const imageSource = apodData?.src ? { uri: apodData.src } : undefined;
  const showImageSkeleton = loading || imageLoading || !imageSource;
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  useEffect(() => {
    setImageLoading(Boolean(imageSource));
  }, [imageSource?.uri]);

  return {
    loading,
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
