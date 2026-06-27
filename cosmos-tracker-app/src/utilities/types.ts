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
