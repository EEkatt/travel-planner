import type {
  DayId,
  DayItem,
  EmptyState,
  MapCardView,
  MapMode,
  MapPin,
  MapViewSnapshot,
  Place,
  PlannedRouteLineSnapshot,
  RouteFailureReason,
  RouteGeometrySnapshot,
  RoutePlan,
  RouteProfile,
  RouteStateSnapshot,
  RouteStatus,
} from './types';
import {
  buildRouteInputHash,
  buildRouteWaypointsFromDayItems,
  isDirectWaypointGeometry,
  isRoutePlanStale,
} from './routes';

type BuildMapViewInput = {
  tripId: string;
  mode: MapMode;
  places: Place[];
  dayItems: DayItem[];
  routePlans?: RoutePlan[];
  routeProfile?: RouteProfile;
  onlineSearchAvailable?: boolean;
};

function getDayItemForPlace(dayItems: DayItem[], placeId: string): DayItem | null {
  return dayItems.find((item) => item.placeId === placeId) ?? null;
}

function getPlaceById(places: Place[], placeId: string): Place | null {
  return places.find((place) => place.id === placeId) ?? null;
}

function missingPlaceCard(item: DayItem): MapCardView {
  return {
    kind: 'missing_target',
    pointId: item.placeId,
    title: 'Missing place',
    dayId: item.dayId,
    routeOrder: item.routeOrder,
    reason: 'missing_place',
  };
}

function toCard(place: Place, dayItem: DayItem | null): MapCardView {
  const base = {
    pointId: place.id,
    title: place.title,
    dayId: dayItem?.dayId ?? null,
    routeOrder: dayItem?.routeOrder ?? null,
  };

  if (!place.coordinates) {
    return {
      ...base,
      kind: 'missing_target',
      reason: 'missing_coordinates',
    };
  }

  return {
    ...base,
    kind: 'place',
    shownOnMap: true,
  };
}

function toPin(place: Place, dayItem: DayItem | null, mode: MapMode): MapPin | null {
  if (!place.coordinates) {
    return null;
  }

  const isDayPoint = dayItem !== null;
  if (mode.kind === 'day' && (!dayItem || dayItem.dayId !== mode.dayId)) {
    return null;
  }
  if (mode.kind === 'no_day' && isDayPoint) {
    return null;
  }

  return {
    pointId: place.id,
    coordinates: place.coordinates,
    color: isDayPoint ? 'red' : 'gray',
    label: mode.kind === 'day' && dayItem ? String(dayItem.routeOrder) : null,
    title: place.title,
  };
}

function buildPlannedLine(
  dayId: DayId,
  places: Place[],
  dayItems: DayItem[],
): PlannedRouteLineSnapshot {
  const sortedItems = dayItems
    .filter((item) => item.dayId === dayId)
    .sort((a, b) => a.routeOrder - b.routeOrder);

  const includedPointIds: string[] = [];
  const excludedPointIds: string[] = [];
  const orderedCoordinates: PlannedRouteLineSnapshot['orderedCoordinates'] = [];

  for (const item of sortedItems) {
    const place = getPlaceById(places, item.placeId);
    if (!place || !place.coordinates) {
      excludedPointIds.push(item.placeId);
      continue;
    }
    includedPointIds.push(place.id);
    orderedCoordinates.push(place.coordinates);
  }

  return {
    mode: 'planned_order',
    dayId,
    rendered: false,
    includedPointIds,
    excludedPointIds,
    orderedCoordinates,
    testId: `planned-line-${dayId}`,
  };
}

function findRoutePlan(
  routePlans: RoutePlan[],
  dayId: DayId,
  profile: RouteProfile,
): RoutePlan | null {
  return routePlans.find((plan) => plan.dayId === dayId && plan.profile === profile) ?? null;
}

function buildRouteSnapshots(
  dayId: DayId,
  profile: RouteProfile,
  places: Place[],
  dayItems: DayItem[],
  routePlans: RoutePlan[],
): { routeGeometry: RouteGeometrySnapshot | null; routeState: RouteStateSnapshot } {
  const waypoints = buildRouteWaypointsFromDayItems(places, dayItems, dayId);
  const inputHash = buildRouteInputHash(dayId, profile, waypoints);
  const plan = findRoutePlan(routePlans, dayId, profile);

  let status: RouteStatus = 'idle';
  let failureReason: RouteFailureReason | null = null;
  let routeGeometry: RouteGeometrySnapshot | null = null;
  const isStale = plan ? isRoutePlanStale(plan, inputHash) : false;

  if (waypoints.length < 2) {
    status = 'failed';
    failureReason = 'insufficient_waypoints';
  } else if (!plan) {
    status = 'idle';
  } else if (isStale) {
    status = 'stale';
    failureReason = 'stale_input';
  } else if (plan.status !== 'ready' || !plan.geometry) {
    status = plan.status;
    failureReason = plan.failureReason;
  } else if (!plan.geometry.isRoadSnapped || isDirectWaypointGeometry(plan.geometry, waypoints)) {
    status = 'failed';
    failureReason = 'direct_line_not_route_geometry';
  } else {
    status = 'ready';
    routeGeometry = {
      dayId,
      profile,
      source: plan.geometry.source,
      provider: plan.geometry.provider,
      isRoadSnapped: plan.geometry.isRoadSnapped,
      coordinates: plan.geometry.coordinates,
      segments: plan.geometry.segments,
      distanceMeters: plan.geometry.distanceMeters,
      durationSeconds: plan.geometry.durationSeconds,
      testId: `route-geometry-${dayId}`,
    };
  }

  return {
    routeGeometry,
    routeState: {
      dayId,
      profile,
      status,
      failureReason,
      inputHash,
      planInputHash: plan?.inputHash ?? null,
      isStale,
      provider: plan?.provider ?? plan?.geometry?.provider ?? null,
      testId: `route-state-${dayId}`,
    },
  };
}

function emptyStateFor(
  mode: MapMode,
  cards: MapCardView[],
  places: Place[],
  onlineSearchAvailable: boolean,
): EmptyState | null {
  if (places.length === 0 && mode.kind === 'all') {
    return {
      kind: 'empty_trip',
      actions: onlineSearchAvailable ? ['add_place', 'search_online'] : ['add_place'],
    };
  }

  if (cards.length > 0) {
    return null;
  }

  if (mode.kind === 'no_day') {
    return {
      kind: 'empty_no_day',
      actions: onlineSearchAvailable
        ? ['add_no_day_place', 'switch_all', 'search_online']
        : ['add_no_day_place', 'switch_all'],
    };
  }

  if (mode.kind === 'day') {
    return {
      kind: 'empty_day',
      dayId: mode.dayId,
      actions: ['add_to_day', 'switch_filters', 'open_day_plan'],
    };
  }

  return null;
}

export function buildMapViewSnapshot({
  tripId,
  mode,
  places,
  dayItems,
  routePlans = [],
  routeProfile = 'walking',
  onlineSearchAvailable = true,
}: BuildMapViewInput): MapViewSnapshot {
  const tripPlaces = places.filter((place) => place.tripId === tripId);
  const tripDayItems = dayItems.filter((item) => item.tripId === tripId);
  const tripRoutePlans = routePlans.filter((plan) => plan.tripId === tripId);

  const relevantPlaces = tripPlaces.filter((place) => {
    const dayItem = getDayItemForPlace(tripDayItems, place.id);
    if (mode.kind === 'all') {
      return true;
    }
    if (mode.kind === 'no_day') {
      return dayItem === null;
    }
    return dayItem?.dayId === mode.dayId;
  });

  const cardsFromPlaces = relevantPlaces
    .map((place) => toCard(place, getDayItemForPlace(tripDayItems, place.id)))
  const missingPlaceCards =
    mode.kind === 'day'
      ? tripDayItems
          .filter((item) => item.dayId === mode.dayId && !getPlaceById(tripPlaces, item.placeId))
          .map(missingPlaceCard)
      : [];

  const cards = [...cardsFromPlaces, ...missingPlaceCards].sort((a, b) => {
    if (mode.kind !== 'day') {
      return a.title.localeCompare(b.title);
    }
    return (a.routeOrder ?? Number.MAX_SAFE_INTEGER) - (b.routeOrder ?? Number.MAX_SAFE_INTEGER);
  });

  const pins = relevantPlaces
    .map((place) => toPin(place, getDayItemForPlace(tripDayItems, place.id), mode))
    .filter((pin): pin is MapPin => pin !== null)
    .sort((a, b) => {
      if (mode.kind !== 'day') {
        return a.title.localeCompare(b.title);
      }
      return Number(a.label ?? Number.MAX_SAFE_INTEGER) - Number(b.label ?? Number.MAX_SAFE_INTEGER);
    });

  const plannedLine = mode.kind === 'day' ? buildPlannedLine(mode.dayId, tripPlaces, tripDayItems) : null;
  const routeSnapshots = mode.kind === 'day'
    ? buildRouteSnapshots(mode.dayId, routeProfile, tripPlaces, tripDayItems, tripRoutePlans)
    : { routeGeometry: null, routeState: null };

  return {
    mode,
    cards,
    pins,
    plannedLine,
    routeGeometry: routeSnapshots.routeGeometry,
    routeState: routeSnapshots.routeState,
    emptyState: emptyStateFor(mode, cards, tripPlaces, onlineSearchAvailable),
  };
}
