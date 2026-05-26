import {
  fetchImageForSelectedDate,
  fetchISOStringDate,
} from "@/utilities/helper";
import { useEffect, useState } from "react";

const useApodHook = () => {
  const [apodData, setApodData] = useState({
    title: "",
    description: "",
    mediaType: "",
    src: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchImage = async () => {
    const date = fetchISOStringDate(new Date());
    console.log(
      "process.env.EXPO_PUBLIC_APOD_BASE_URL",
      process.env.EXPO_PUBLIC_APOD_BASE_URL,
    );
    try {
      const apodPic = await fetchImageForSelectedDate(date);
      console.log("apod Mobile", apodPic);

      setApodData({
        title: apodPic?.title,
        description: apodPic?.explanation,
        src: apodPic?.url,
        mediaType: apodPic?.method_type,
      });
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchImage();
  }, []);
  return {
    loading,
    apodData,
  };
};

export default useApodHook;
