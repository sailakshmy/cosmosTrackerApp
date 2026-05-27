import { fetchImageForSelectedDate } from "@/utilities/helper";
import { useEffect, useState } from "react";

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
        src: apodPic?.url,
        mediaType: apodPic?.method_type,
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

  return {
    loading,
    apodData,
    date,
    setDate,
  };
};

export default useApodHook;
