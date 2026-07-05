import { DetailCardItem } from "@/components/detail-card";
import { fetchNeoDataById, formatKeyNames } from "@/utilities/helper";
import { NeoLookupResponse } from "@/utilities/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const useNeoLookupHook = () => {
  const [selectedNeoId, setSelectedNeoId] = useState<undefined | string>();
  const [selectedNeo, setSelectedNeo] = useState<{
    name: string;
    detailList: DetailCardItem[];
  }>({
    name: "",
    detailList: [],
  });
  console.log("selectedneoId from the hook", selectedNeoId);

  const fetchNeoById = async (signal: AbortSignal) => {
    let neoData: NeoLookupResponse | undefined;
    if (selectedNeoId) {
      neoData = await fetchNeoDataById(selectedNeoId, signal);
      const neoLookUpData = neoData?.neoLookUpData;
      if (neoLookUpData) {
        const { name, orbital_data, absolute_magnitude_h, estimated_diameter } =
          neoLookUpData;
        const detailList: DetailCardItem[] = [];
        Object.keys(orbital_data)?.forEach((key) => {
          if (
            key === "aphelion_distance" ||
            key === "ascending_node_longitude" ||
            key === "eccentricity" ||
            key === "epoch_osculation" ||
            key === "equinox" ||
            key === "first_observation_date" ||
            key === "inclination" ||
            key === "orbit_determination_date" ||
            key === "orbital_period" ||
            key === "perihelion_distance" ||
            key === "semi_major_axis" ||
            key === "last_observation_date"
          ) {
            detailList.push({
              key: formatKeyNames("_", key),
              value: orbital_data?.[key],
            });
          }
        });
        detailList.push({
          key: "estimated diameter max",
          value: estimated_diameter?.kilometers?.estimated_diameter_max,
        });
        detailList.push({
          key: "estimated diameter min",
          value: estimated_diameter?.kilometers?.estimated_diameter_min,
        });
        detailList.push({
          key: "absolute magnitude",
          value: absolute_magnitude_h,
        });
        setSelectedNeo({ name, detailList });
      }
    }
    return neoData;
  };

  const { isFetching: isFetchingNeo, isLoading: isLoadingNeo } = useQuery({
    queryKey: [selectedNeoId],
    queryFn: ({ signal }) => fetchNeoById(signal),
    retry: 3,
    retryDelay: 100,
  });
  return {
    setSelectedNeoId,
    isFetchingNeo,
    isLoadingNeo,
    selectedNeo,
  };
};

export default useNeoLookupHook;
