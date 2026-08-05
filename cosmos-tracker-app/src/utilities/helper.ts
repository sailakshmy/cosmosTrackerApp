import { format } from "date-fns";
import { DateType } from "react-native-ui-datepicker";
import { Data, NeoTableData, NeoTableObject } from "./types";

export const fetchISOStringDate = (date: Date) => format(date, "yyyy-MM-dd");

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

export const toDate = (date: DateType) => {
  if (!date) {
    return undefined;
  }

  if (date instanceof Date) {
    return date;
  }

  if (typeof date === "string" || typeof date === "number") {
    return new Date(date);
  }

  return date.toDate();
};

export const formatDateType = (date: DateType, fallback: string) => {
  const nativeDate = toDate(date);

  return nativeDate ? fetchISOStringDate(nativeDate) : fallback;
};

export const fetchNeoFeedData = async (
  startDate: string,
  endDate: string,
  signal?: AbortSignal,
) => {
  const neoFeedData = await fetch(
    `${process.env.EXPO_PUBLIC_APOD_BASE_URL}/neo?startDate=${startDate}&endDate=${endDate}`,
    { signal },
  );
  const neoFeed = await neoFeedData?.json();
  // console.log("neoFeed", neoFeed);
  return neoFeed;
};

export const convertEpochDateToMonthDateYearFormat = (
  epochDate: EpochTimeStamp,
) => {
  return new Date(epochDate)?.toUTCString();
};

export function createData(object: NeoTableObject): Data {
  return [
    object?.close_approach_data?.[0]?.close_approach_date,
    object?.id,
    object?.name,
    object?.is_potentially_hazardous_asteroid ? "Yes" : "No",
    object?.close_approach_data?.[0]?.miss_distance?.kilometers,
    object?.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour,
  ];
}

export const fetchRowsFromTableData = (tableData: NeoTableData): Data[] => {
  const rows: Data[] = [];
  tableData.forEach((date) => {
    Object?.keys(date)?.forEach((datekey) => {
      const dateObj = date?.[datekey];
      if (dateObj?.length) {
        dateObj?.forEach((neo) => rows?.push(createData(neo)));
      }
    });
  });
  return rows;
};

export const fetchNeoDataById = async (neoId: string, signal?: AbortSignal) => {
  const neoDataRes = await fetch(
    `${process.env.EXPO_PUBLIC_APOD_BASE_URL}/neo/${neoId}`,
    {
      signal,
    },
  );
  const neoData = await neoDataRes?.json();
  return neoData;
};

export const formatKeyNames = (symbol: string, name: string) => {
  return name?.split(symbol)?.join(" ");
};

export const fetchNasaImages = async (page = 1, signal?: AbortSignal) => {
  console.log("Reached here");
  const nasaImageData = await fetch("http://localhost:8080/nasa/images?page=2");
  // await fetch(
  //   `${process.env.EXPO_PUBLIC_APOD_BASE_URL}/images?page=${page}`,
  //   { signal },
  // );
  console.log("Reached here after the call");
  const nasaImages = await nasaImageData?.json();
  return nasaImages?.imageData?.collection?.items ?? [];
};
