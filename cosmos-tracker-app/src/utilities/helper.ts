export const fetchISOStringDate = (date: Date) =>
  date?.toISOString()?.split("T")?.[0];

export const fetchImageForSelectedDate = async (date: string) => {
  const apodData = await fetch(
    `${process.env.EXPO_PUBLIC_APOD_BASE_URL}?date=${"2026-05-25"}`,
  );
  const apod = await apodData.json();
  return apod?.data;
};
