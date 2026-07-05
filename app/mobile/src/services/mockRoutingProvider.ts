import type { RouteGeometry, RouteProfile, RouteWaypoint } from '../domain/map';

export type RoutingProviderInput = {
  profile: RouteProfile;
  waypoints: RouteWaypoint[];
};

export class MockRoutingProvider {
  readonly provider = 'mock-routing';

  calculateRoute({ profile, waypoints }: RoutingProviderInput): RouteGeometry {
    const coordinates = waypoints.flatMap((waypoint, index) => {
      if (index === 0) {
        return [waypoint.coordinates];
      }

      const previous = waypoints[index - 1];
      const bend = {
        latitude: (previous.coordinates.latitude + waypoint.coordinates.latitude) / 2 + 0.001,
        longitude: (previous.coordinates.longitude + waypoint.coordinates.longitude) / 2 - 0.001,
      };
      return [bend, waypoint.coordinates];
    });

    return {
      source: 'routing_provider_mock',
      provider: this.provider,
      profile,
      coordinates,
      segments: waypoints.slice(1).map((waypoint, index) => {
        const previous = waypoints[index];
        const bend = {
          latitude: (previous.coordinates.latitude + waypoint.coordinates.latitude) / 2 + 0.001,
          longitude: (previous.coordinates.longitude + waypoint.coordinates.longitude) / 2 - 0.001,
        };
        return {
          fromPlaceId: previous.placeId,
          toPlaceId: waypoint.placeId,
          coordinates: [previous.coordinates, bend, waypoint.coordinates],
          distanceMeters: null,
          durationSeconds: null,
        };
      }),
      distanceMeters: null,
      durationSeconds: null,
      isRoadSnapped: true,
    };
  }
}
