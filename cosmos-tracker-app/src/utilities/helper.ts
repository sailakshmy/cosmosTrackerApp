export const fetchISOStringDate = (date: Date) =>
  date?.toISOString()?.split("T")?.[0];

export const fetchImageForSelectedDate = async (selectedDate: Date) => {
  const date = fetchISOStringDate(selectedDate);
  console.log("date", date);
  const apodData = await fetch(
    `${process.env.EXPO_PUBLIC_APOD_BASE_URL}?date=${date}`,
  );
  console.log("apodData", apodData);
  const apod = await apodData.json();
  console.log("apod", apod);
  if (apod) return apod?.data;
};
