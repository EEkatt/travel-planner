import type {
  CoordinateClassification,
  Coordinates,
  DownloadedArea,
  MapPin,
  PlannedRouteLineSnapshot,
  RouteGeometrySnapshot,
  RouteStateSnapshot,
} from '../domain/map';
export { MockRoutingProvider } from './mockRoutingProvider';

export type NormalizedPlaceSearchResult = {
  id: string;
  title: string;
  address: string | null;
  coordinates: Coordinates | null;
  countryCode: string | null;
  provider: 'mock';
};

export type PlaceSearchRequest = {
  query: string;
  autocomplete: false;
};

export type PlaceSearchResponse =
  | { kind: 'success'; query: string; results: NormalizedPlaceSearchResult[] }
  | { kind: 'offline'; query: string; results: [] }
  | { kind: 'empty'; query: string; results: [] }
  | { kind: 'failure'; query: string; reason: 'timeout' | 'quota' | 'malformed'; results: [] };

export type MapDisplayInput = {
  pins: MapPin[];
  plannedLine: PlannedRouteLineSnapshot | null;
  routeGeometry: RouteGeometrySnapshot | null;
  routeState: RouteStateSnapshot | null;
};

export type OfflinePackLifecycle = 'not_downloaded' | 'downloading' | 'available' | 'failed' | 'deleting';
export type OfflinePackProofState = 'mock_only' | 'proof_accepted' | 'blocked';

export type OfflinePackInventory = {
  area: DownloadedArea | null;
  lifecycle: OfflinePackLifecycle;
  proofState: OfflinePackProofState;
  providerPackId: string | null;
};

export type OfflineCoverage = {
  coordinates: Coordinates;
  classification: CoordinateClassification;
};

export type ExternalHandoffTarget =
  | { kind: 'coordinates'; coordinates: Coordinates; title?: string }
  | { kind: 'address'; address: string; title?: string };

export type ExternalHandoffResult =
  | { kind: 'opened'; provider: 'mock_external_map' }
  | { kind: 'unsupported'; reason: 'missing_target' }
  | { kind: 'failed'; reason: 'provider_unavailable' };

export function createSubmittedSearchRequest(query: string): PlaceSearchRequest {
  return {
    query,
    autocomplete: false,
  };
}

export function createEmptySearchResponse(query: string): PlaceSearchResponse {
  return {
    kind: 'empty',
    query,
    results: [],
  };
}

export function createOfflineSearchResponse(query: string): PlaceSearchResponse {
  return {
    kind: 'offline',
    query,
    results: [],
  };
}

export function createFailedSearchResponse(
  query: string,
  reason: 'timeout' | 'quota' | 'malformed',
): PlaceSearchResponse {
  return {
    kind: 'failure',
    query,
    reason,
    results: [],
  };
}

export function createMapDisplayInput(
  pins: MapPin[],
  plannedLine: PlannedRouteLineSnapshot | null,
  routeGeometry: RouteGeometrySnapshot | null = null,
  routeState: RouteStateSnapshot | null = null,
): MapDisplayInput {
  return {
    pins,
    plannedLine,
    routeGeometry,
    routeState,
  };
}

export function createMockOfflineInventory(area: DownloadedArea | null): OfflinePackInventory {
  return {
    area,
    lifecycle: area ? 'available' : 'not_downloaded',
    proofState: 'mock_only',
    providerPackId: null,
  };
}

export function createOfflineCoverage(
  coordinates: Coordinates,
  classification: CoordinateClassification,
): OfflineCoverage {
  return {
    coordinates,
    classification,
  };
}

export function createExternalHandoffResult(
  kind: ExternalHandoffResult['kind'],
): ExternalHandoffResult {
  if (kind === 'opened') {
    return { kind, provider: 'mock_external_map' };
  }
  if (kind === 'unsupported') {
    return { kind, reason: 'missing_target' };
  }
  return { kind, reason: 'provider_unavailable' };
}
