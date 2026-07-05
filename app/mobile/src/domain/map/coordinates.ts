import type {
  CoordinateClassification,
  Coordinates,
  DownloadedArea,
} from './types';

const GEORGIA_BOUNDS = {
  latitudeMin: 41.0,
  latitudeMax: 43.8,
  longitudeMin: 40.0,
  longitudeMax: 46.8,
};

export function parseCoordinates(value: unknown): Coordinates | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const candidate = value as Partial<Record<keyof Coordinates, unknown>>;
  if (
    typeof candidate.latitude !== 'number' ||
    typeof candidate.longitude !== 'number' ||
    !Number.isFinite(candidate.latitude) ||
    !Number.isFinite(candidate.longitude) ||
    candidate.latitude < -90 ||
    candidate.latitude > 90 ||
    candidate.longitude < -180 ||
    candidate.longitude > 180
  ) {
    return null;
  }

  return {
    latitude: candidate.latitude,
    longitude: candidate.longitude,
  };
}

function isInsideBounds(coordinates: Coordinates, bounds: {
  latitudeMin: number;
  latitudeMax: number;
  longitudeMin: number;
  longitudeMax: number;
}): boolean {
  return (
    coordinates.latitude >= bounds.latitudeMin &&
    coordinates.latitude <= bounds.latitudeMax &&
    coordinates.longitude >= bounds.longitudeMin &&
    coordinates.longitude <= bounds.longitudeMax
  );
}

export function classifyCoordinate(
  coordinates: Coordinates | null,
  downloadedArea?: DownloadedArea,
): CoordinateClassification {
  const parsed = parseCoordinates(coordinates);
  if (!parsed) {
    return {
      insideGeorgia: false,
      insideDownloadedArea: false,
      reason: 'invalid_coordinate',
    };
  }

  if (!isInsideBounds(parsed, GEORGIA_BOUNDS)) {
    return {
      insideGeorgia: false,
      insideDownloadedArea: false,
      reason: 'outside_georgia',
    };
  }

  if (!downloadedArea) {
    return {
      insideGeorgia: true,
      insideDownloadedArea: null,
      reason: 'inside_georgia_download_area_unknown',
    };
  }

  const insideDownloadedArea = isInsideBounds(parsed, downloadedArea);
  return {
    insideGeorgia: true,
    insideDownloadedArea,
    reason: insideDownloadedArea
      ? 'inside_georgia_inside_downloaded_area'
      : 'inside_georgia_outside_downloaded_area',
  };
}
