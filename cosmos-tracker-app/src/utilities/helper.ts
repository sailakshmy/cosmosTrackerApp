export const fetchISOStringDate = (date: Date) =>
  date?.toISOString()?.split("T")?.[0];

export const fetchImageForSelectedDate = async (selectedDate: Date) => {
  const date = fetchISOStringDate(selectedDate);
  let apodData = await fetch(
    `${process.env.EXPO_PUBLIC_APOD_BASE_URL}?date=${date}`,
  );
  let apod = await apodData.json();

  if (apod) return apod?.data;
};
