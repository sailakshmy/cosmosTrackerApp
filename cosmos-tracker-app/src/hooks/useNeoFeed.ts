import { useState } from "react";
import { useTheme } from "./use-theme";
import { addDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { fetchISOStringDate, fetchNeoFeedData } from "@/utilities/helper";

const useNeoFeed = () => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => addDays(new Date(), 7));

  const onDateRangeChange = (selectedDate: Date, selectedEndDate: Date) => {
    setStartDate(selectedDate);
    setEndDate(selectedEndDate);
  };

  const [neoFeedData, setNeoFeedData] = useState({
    totalNeo: 0,
    hazardousNeo: 0,
    objClosestToEarth: null,
    highestVelocityObj: null,
  });

  const fetchDataForSelectedDateRange = async (signal: AbortSignal) => {
    const selStartDate = fetchISOStringDate(addDays(startDate, 1));
    const selEndDate = fetchISOStringDate(endDate);
    console.log("SelStartDate", selStartDate);
    console.log("selEndDate", selEndDate);
    const updatedNeoFeedDate = await fetchNeoFeedData(
      selStartDate,
      selEndDate,
      signal,
    );
    setNeoFeedData({
      totalNeo: updatedNeoFeedDate?.totalNeos,
      hazardousNeo: updatedNeoFeedDate?.hazardousNeos,
      objClosestToEarth: updatedNeoFeedDate?.objectClosestToEarth,
      highestVelocityObj: updatedNeoFeedDate?.highestVelocityObject,
    });
    return updatedNeoFeedDate;
  };

  const { isLoading, isFetching } = useQuery({
    queryKey: [startDate.toISOString(), endDate.toISOString()],
    queryFn: ({ signal }) => fetchDataForSelectedDateRange(signal),
    retry: 3,
    retryDelay: 100,
  });
  console.log("Node", neoFeedData);

  return {
    theme,
    startDate,
    endDate,
    onDateRangeChange,
    isFetching,
    isLoading,
    neoFeedData,
  };
};

export default useNeoFeed;
