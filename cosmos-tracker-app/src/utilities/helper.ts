export const fetchISOStringDate = (date: Date) =>
  date?.toISOString()?.split("T")?.[0];

const readResponseBody = async (response: Response) => {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

export const fetchImageForSelectedDate = async (
  selectedDate: Date,
  signal: AbortSignal,
) => {
  const date = fetchISOStringDate(selectedDate);
  console.log("Triggered the API");
  const apodData = await fetch(
    `${process.env.EXPO_PUBLIC_APOD_BASE_URL}?date=${date}`,
    { signal },
  );
  const apod = await readResponseBody(apodData);

  if (!apodData.ok) {
    const errorMessage =
      typeof apod === "object" && apod !== null && "message" in apod
        ? String(apod.message)
        : `Could not fetch APOD data (${apodData.status})`;

    throw new Error(errorMessage);
  }

  console.log("apod", apod);
  return apod?.data;
};
