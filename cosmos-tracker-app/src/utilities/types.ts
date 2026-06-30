interface RelativeVelocity {
  kilometers_per_second: string;
  kilometers_per_hour: string;
  miles_per_hour: string;
}

interface MissDistance {
  astronomical: string;
  lunar: string;
  kilometers: string;
  miles: string;
}

export interface NearEarthObject {
  name: string;
  id: string;
  neo_reference_id: string;
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: EpochTimeStamp;
  relative_velocity: RelativeVelocity;
  miss_distance: MissDistance;
  orbiting_body: string;
}

export type Data = Array<string | undefined>;

export interface NeoTableObject {
  close_approach_data?: Array<{
    close_approach_date?: string;
    miss_distance?: {
      kilometers?: string;
    };
    relative_velocity?: {
      kilometers_per_hour?: string;
    };
  }>;
  id?: string;
  name?: string;
  is_potentially_hazardous_asteroid?: boolean;
}

export type NeoTableData = Array<Record<string, NeoTableObject[]>>;
