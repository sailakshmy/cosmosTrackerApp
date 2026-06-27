import { useState } from "react";
import { useTheme } from "./use-theme";
import { addDays } from "date-fns";

const useNeoFeed = () => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => addDays(new Date(), 7));

  const onDateRangeChange = (selectedDate: Date, selectedEndDate: Date) => {
    setStartDate(selectedDate);
    setEndDate(selectedEndDate);
  };
  return {
    theme,
    startDate,
    endDate,
    onDateRangeChange,
  };
};

export default useNeoFeed;
