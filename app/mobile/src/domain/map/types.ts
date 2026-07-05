export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type DayId = `day-${number}`;

export type MapMode =
  | { kind: 'all' }
  | { kind: 'no_day' }
  | { kind: 'day'; dayId: DayId };

export type PointSource = 'search_result' | 'manual_map_tap' | 'manual_text';

export type RouteProfile = 'walking' | 'driving';

export type Place = {
  id: string;
  tripId: string;
  title: string;
  address: string | null;
  note: string | null;
  coordinates: Coordinates | null;
  countryCode: 'GE' | null;
  source: PointSource;
  provider?: string;
  providerPlaceId?: string;
  providerAttribution?: string;
};

export type DayItem = {
  id: string;
  tripId: string;
  dayId: DayId;
  placeId: string;
  routeOrder: number;
};

export type DownloadedArea = {
  id: 'TBILISI_PROOF_AREA';
  latitudeMin: number;
  latitudeMax: number;
  longitudeMin: number;
  longitudeMax: number;
};

export type CoordinateClassificationReason =
  | 'inside_georgia_inside_downloaded_area'
  | 'inside_georgia_outside_downloaded_area'
  | 'inside_georgia_download_area_unknown'
  | 'outside_georgia'
  | 'invalid_coordinate';

export type CoordinateClassification = {
  insideGeorgia: boolean;
  insideDownloadedArea: boolean | null;
  reason: CoordinateClassificationReason;
};

export type MapPin = {
  pointId: string;
  coordinates: Coordinates;
  color: 'gray' | 'red';
  label: string | null;
  title: string;
};

export type MapCardView =
  | {
      kind: 'place';
      pointId: string;
      title: string;
      dayId: DayId | null;
      routeOrder: number | null;
      shownOnMap: boolean;
    }
  | {
      kind: 'missing_target';
      pointId: string;
      title: string;
      dayId: DayId | null;
      routeOrder: number | null;
      reason: 'missing_coordinates' | 'missing_place';
    };

export type PlannedRouteLineSnapshot = {
  mode: 'planned_order';
  dayId: DayId;
  rendered: boolean;
  includedPointIds: string[];
  excludedPointIds: string[];
  orderedCoordinates: Coordinates[];
  testId: string;
};

export type RouteStatus = 'idle' | 'calculating' | 'ready' | 'failed' | 'stale';

export type RouteFailureReason =
  | 'insufficient_waypoints'
  | 'missing_coordinates'
  | 'provider_unavailable'
  | 'stale_input'
  | 'direct_line_not_route_geometry'
  | 'unknown';

export type RouteWaypoint = {
  placeId: string;
  coordinates: Coordinates;
  routeOrder: number;
};

export type RouteSegment = {
  fromPlaceId: string;
  toPlaceId: string;
  coordinates: Coordinates[];
  distanceMeters: number | null;
  durationSeconds: number | null;
};

export type RouteGeometry = {
  source: 'routing_provider_mock' | 'routing_provider';
  provider: 'mock-routing' | string;
  profile: RouteProfile;
  coordinates: Coordinates[];
  segments: RouteSegment[];
  distanceMeters: number | null;
  durationSeconds: number | null;
  isRoadSnapped: boolean;
};

export type RoutePlan = {
  dayId: DayId;
  profile: RouteProfile;
  inputHash: string;
  status: RouteStatus;
  geometry: RouteGeometry | null;
  failureReason: RouteFailureReason | null;
  provider: string | null;
};

export type RouteStateSnapshot = {
  dayId: DayId;
  profile: RouteProfile;
  status: RouteStatus;
  failureReason: RouteFailureReason | null;
  inputHash: string;
  planInputHash: string | null;
  isStale: boolean;
  provider: string | null;
  testId: string;
};

export type RouteGeometrySnapshot = {
  dayId: DayId;
  profile: RouteProfile;
  source: RouteGeometry['source'];
  provider: RouteGeometry['provider'];
  isRoadSnapped: boolean;
  coordinates: Coordinates[];
  segments: RouteSegment[];
  distanceMeters: number | null;
  durationSeconds: number | null;
  testId: string;
};

export type EmptyState =
  | {
      kind: 'empty_trip';
      actions: Array<'add_place' | 'search_online'>;
    }
  | {
      kind: 'empty_no_day';
      actions: Array<'add_no_day_place' | 'switch_all' | 'search_online'>;
    }
  | {
      kind: 'empty_day';
      dayId: DayId;
      actions: Array<'add_to_day' | 'switch_filters' | 'open_day_plan'>;
    };

export type MapViewSnapshot = {
  mode: MapMode;
  pins: MapPin[];
  cards: MapCardView[];
  plannedLine: PlannedRouteLineSnapshot | null;
  routeGeometry: RouteGeometrySnapshot | null;
  routeState: RouteStateSnapshot | null;
  emptyState: EmptyState | null;
};
