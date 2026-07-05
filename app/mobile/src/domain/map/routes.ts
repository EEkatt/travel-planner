import type {
  Coordinates,
  DayId,
  DayItem,
  Place,
  RouteGeometry,
  RoutePlan,
  RouteProfile,
  RouteWaypoint,
} from './types';

function stableCoordinate(coordinates: Coordinates): string {
  return `${coordinates.latitude.toFixed(6)},${coordinates.longitude.toFixed(6)}`;
}

function fnv1a(input: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function buildRouteInputHash(
  dayId: DayId,
  profile: RouteProfile,
  waypoints: RouteWaypoint[],
): string {
  const payload = waypoints
    .map((waypoint) => `${waypoint.placeId}@${stableCoordinate(waypoint.coordinates)}`)
    .join('|');
  return `route-v1:${fnv1a(`${dayId}:${profile}:${payload}`)}`;
}

export function buildRouteWaypointsFromDayItems(
  places: Place[],
  dayItems: DayItem[],
  dayId: DayId,
): RouteWaypoint[] {
  return dayItems
    .filter((item) => item.dayId === dayId)
    .sort((a, b) => {
      if (a.routeOrder !== b.routeOrder) {
        return a.routeOrder - b.routeOrder;
      }
      return a.id.localeCompare(b.id);
    })
    .flatMap((item) => {
      const place = places.find((candidate) => candidate.id === item.placeId);
      if (!place?.coordinates) {
        return [];
      }
      return [{
        placeId: item.placeId,
        coordinates: place.coordinates,
        routeOrder: item.routeOrder,
      }];
    });
}

export function isRoutePlanStale(plan: RoutePlan, currentInputHash: string): boolean {
  return plan.inputHash !== currentInputHash;
}

export function applyReorderedDayItems(
  dayItems: DayItem[],
  dayId: DayId,
  orderedPlaceIds: string[],
): DayItem[] {
  const seenPlaceIds = new Set<string>();
  const uniqueOrderedPlaceIds = orderedPlaceIds.filter((placeId) => {
    if (seenPlaceIds.has(placeId)) {
      return false;
    }
    seenPlaceIds.add(placeId);
    return true;
  });

  const targetItems = dayItems.filter((item) => item.dayId === dayId);
  const itemsByPlaceId = new Map(targetItems.map((item) => [item.placeId, item]));
  const reorderedItems = uniqueOrderedPlaceIds
    .map((placeId) => itemsByPlaceId.get(placeId))
    .filter((item): item is DayItem => item !== undefined);

  const explicitlyOrderedIds = new Set(reorderedItems.map((item) => item.id));
  const remainingItems = targetItems
    .filter((item) => !explicitlyOrderedIds.has(item.id))
    .sort((a, b) => {
      if (a.routeOrder !== b.routeOrder) {
        return a.routeOrder - b.routeOrder;
      }
      return a.id.localeCompare(b.id);
    });

  const nextOrderById = new Map<string, number>();
  [...reorderedItems, ...remainingItems].forEach((item, index) => {
    nextOrderById.set(item.id, index + 1);
  });

  return dayItems.map((item) => {
    const routeOrder = nextOrderById.get(item.id);
    if (routeOrder === undefined) {
      return item;
    }
    return {
      ...item,
      routeOrder,
    };
  });
}

export function isDirectWaypointGeometry(
  geometry: RouteGeometry,
  waypoints: RouteWaypoint[],
): boolean {
  if (geometry.coordinates.length !== waypoints.length) {
    return false;
  }

  return geometry.coordinates.every((coordinates, index) => (
    stableCoordinate(coordinates) === stableCoordinate(waypoints[index].coordinates)
  ));
}
