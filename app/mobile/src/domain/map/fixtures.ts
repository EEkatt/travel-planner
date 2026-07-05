import { buildRouteInputHash, buildRouteWaypointsFromDayItems } from './routes';
import type { DayId, DayItem, DownloadedArea, Place, RouteGeometry, RoutePlan } from './types';

export const TRIP_ID = 'trip-georgia-001';

export const DAYS: Array<{ id: DayId; title: string }> = [
  { id: 'day-1', title: 'Day 1' },
  { id: 'day-2', title: 'Day 2' },
];

export const TBILISI_PROOF_AREA: DownloadedArea = {
  id: 'TBILISI_PROOF_AREA',
  latitudeMin: 41.6,
  latitudeMax: 41.8,
  longitudeMin: 44.65,
  longitudeMax: 44.9,
};

export const MAP_COORDINATES = {
  GE_TBILISI_NARIKALA: { latitude: 41.6886, longitude: 44.8086 },
  GE_TBILISI_RIKE: { latitude: 41.6937, longitude: 44.8106 },
  GE_TBILISI_LIBERTY: { latitude: 41.693, longitude: 44.8015 },
  GE_TBILISI_SULFUR_BATHS: { latitude: 41.6879, longitude: 44.8112 },
  GE_MTSKHETA_CATHEDRAL: { latitude: 41.8418, longitude: 44.721 },
  GE_BATUMI_BOULEVARD: { latitude: 41.6509, longitude: 41.636 },
  OUTSIDE_GE_YEREVAN_CASCADE: { latitude: 40.1904, longitude: 44.5155 },
  OUTSIDE_GE_TRABZON_CENTER: { latitude: 41.0053, longitude: 39.7264 },
} as const;

export const SHARED_PLACES: Place[] = [
  {
    id: 'pt-noday-rike',
    tripId: TRIP_ID,
    title: 'Rike Park',
    address: 'Rike Park, Tbilisi, Georgia',
    note: null,
    coordinates: MAP_COORDINATES.GE_TBILISI_RIKE,
    countryCode: 'GE',
    source: 'manual_map_tap',
  },
  {
    id: 'pt-noday-text',
    tripId: TRIP_ID,
    title: 'Cafe idea without location',
    address: null,
    note: null,
    coordinates: null,
    countryCode: null,
    source: 'manual_text',
  },
  {
    id: 'pt-day1-narikala',
    tripId: TRIP_ID,
    title: 'Narikala Fortress',
    address: 'Narikala Fortress, Tbilisi, Georgia',
    note: null,
    coordinates: MAP_COORDINATES.GE_TBILISI_NARIKALA,
    countryCode: 'GE',
    source: 'search_result',
  },
  {
    id: 'pt-day1-no-coord',
    tripId: TRIP_ID,
    title: 'Dinner reservation',
    address: 'Old Tbilisi, address to confirm',
    note: null,
    coordinates: null,
    countryCode: 'GE',
    source: 'manual_text',
  },
  {
    id: 'pt-day1-liberty',
    tripId: TRIP_ID,
    title: 'Freedom Square',
    address: 'Freedom Square, Tbilisi, Georgia',
    note: null,
    coordinates: MAP_COORDINATES.GE_TBILISI_LIBERTY,
    countryCode: 'GE',
    source: 'manual_map_tap',
  },
  {
    id: 'pt-day1-baths',
    tripId: TRIP_ID,
    title: 'Sulfur Baths',
    address: 'Abanotubani, Tbilisi, Georgia',
    note: null,
    coordinates: MAP_COORDINATES.GE_TBILISI_SULFUR_BATHS,
    countryCode: 'GE',
    source: 'manual_map_tap',
  },
  {
    id: 'pt-day2-mtskheta',
    tripId: TRIP_ID,
    title: 'Svetitskhoveli Cathedral',
    address: 'Mtskheta, Georgia',
    note: null,
    coordinates: MAP_COORDINATES.GE_MTSKHETA_CATHEDRAL,
    countryCode: 'GE',
    source: 'search_result',
  },
  {
    id: 'pt-address-no-coord',
    tripId: TRIP_ID,
    title: 'Hotel address only',
    address: 'Rustaveli Avenue, Tbilisi, Georgia',
    note: null,
    coordinates: null,
    countryCode: 'GE',
    source: 'manual_text',
  },
  {
    id: 'pt-title-only',
    tripId: TRIP_ID,
    title: 'Souvenir shop idea',
    address: null,
    note: null,
    coordinates: null,
    countryCode: null,
    source: 'manual_text',
  },
];

export const SHARED_DAY_ITEMS: DayItem[] = [
  {
    id: 'day-item-narikala',
    tripId: TRIP_ID,
    dayId: 'day-1',
    placeId: 'pt-day1-narikala',
    routeOrder: 1,
  },
  {
    id: 'day-item-no-coord',
    tripId: TRIP_ID,
    dayId: 'day-1',
    placeId: 'pt-day1-no-coord',
    routeOrder: 2,
  },
  {
    id: 'day-item-liberty',
    tripId: TRIP_ID,
    dayId: 'day-1',
    placeId: 'pt-day1-liberty',
    routeOrder: 3,
  },
  {
    id: 'day-item-baths',
    tripId: TRIP_ID,
    dayId: 'day-1',
    placeId: 'pt-day1-baths',
    routeOrder: 4,
  },
  {
    id: 'day-item-mtskheta',
    tripId: TRIP_ID,
    dayId: 'day-2',
    placeId: 'pt-day2-mtskheta',
    routeOrder: 1,
  },
];

export const MOCK_DAY_1_ROUTE_GEOMETRY: RouteGeometry = {
  source: 'routing_provider_mock',
  provider: 'mock-routing',
  profile: 'walking',
  isRoadSnapped: true,
  distanceMeters: 1900,
  durationSeconds: 1680,
  coordinates: [
    MAP_COORDINATES.GE_TBILISI_NARIKALA,
    { latitude: 41.6894, longitude: 44.8098 },
    { latitude: 41.6914, longitude: 44.8046 },
    MAP_COORDINATES.GE_TBILISI_LIBERTY,
    { latitude: 41.6911, longitude: 44.8068 },
    { latitude: 41.6898, longitude: 44.8108 },
    MAP_COORDINATES.GE_TBILISI_SULFUR_BATHS,
  ],
  segments: [
    {
      fromPlaceId: 'pt-day1-narikala',
      toPlaceId: 'pt-day1-liberty',
      coordinates: [
        MAP_COORDINATES.GE_TBILISI_NARIKALA,
        { latitude: 41.6894, longitude: 44.8098 },
        { latitude: 41.6914, longitude: 44.8046 },
        MAP_COORDINATES.GE_TBILISI_LIBERTY,
      ],
      distanceMeters: 650,
      durationSeconds: 600,
    },
    {
      fromPlaceId: 'pt-day1-liberty',
      toPlaceId: 'pt-day1-baths',
      coordinates: [
        MAP_COORDINATES.GE_TBILISI_LIBERTY,
        { latitude: 41.6911, longitude: 44.8068 },
        { latitude: 41.6898, longitude: 44.8108 },
        MAP_COORDINATES.GE_TBILISI_SULFUR_BATHS,
      ],
      distanceMeters: 1250,
      durationSeconds: 1080,
    },
  ],
};

export const MOCK_DAY_1_ROUTE_PLAN: RoutePlan = {
  dayId: 'day-1',
  profile: 'walking',
  inputHash: buildRouteInputHash(
    'day-1',
    'walking',
    buildRouteWaypointsFromDayItems(SHARED_PLACES, SHARED_DAY_ITEMS, 'day-1'),
  ),
  status: 'ready',
  geometry: MOCK_DAY_1_ROUTE_GEOMETRY,
  failureReason: null,
  provider: 'mock-routing',
};

export function pickPlaces(ids: string[]): Place[] {
  return ids.map((id) => {
    const place = SHARED_PLACES.find((candidate) => candidate.id === id);
    if (!place) {
      throw new Error(`Unknown fixture place: ${id}`);
    }
    return place;
  });
}

export function dayItemsFor(placeIds: string[]): DayItem[] {
  return SHARED_DAY_ITEMS.filter((item) => placeIds.includes(item.placeId));
}
