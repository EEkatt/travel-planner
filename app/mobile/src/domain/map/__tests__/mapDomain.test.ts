import {
  APPROVED_RUSSIAN_MAP_TERMS,
  MAP_COORDINATES,
  MOCK_DAY_1_ROUTE_GEOMETRY,
  MOCK_DAY_1_ROUTE_PLAN,
  PROHIBITED_RUSSIAN_MAP_TERMS,
  SHARED_DAY_ITEMS,
  TBILISI_PROOF_AREA,
  TRIP_ID,
  applyReorderedDayItems,
  buildRouteInputHash,
  buildMapViewSnapshot,
  buildRouteWaypointsFromDayItems,
  classifyCoordinate,
  dayItemsFor,
  isRoutePlanStale,
  isApprovedMapCopyTerm,
  isProhibitedMapCopyTerm,
  parseCoordinates,
  pickPlaces,
} from '../index';
import {
  createEmptySearchResponse,
  createExternalHandoffResult,
  createFailedSearchResponse,
  createMapDisplayInput,
  createOfflineCoverage,
  createMockOfflineInventory,
  createOfflineSearchResponse,
  createSubmittedSearchRequest,
  type PlaceSearchResponse,
} from '../../../services/mapAdapters';
import { MockRoutingProvider } from '../../../services/mockRoutingProvider';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${String(expected)}, got ${String(actual)}`);
  }
}

function assertDeepEqual(actual: unknown, expected: unknown, message: string): void {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(`${message}: expected ${expectedJson}, got ${actualJson}`);
  }
}

function test(name: string, run: () => void): void {
  try {
    run();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`not ok ${name}`);
    throw error;
  }
}

test('parseCoordinates rejects invalid coordinate shapes', () => {
  const invalidValues = [
    null,
    undefined,
    '41.6886,44.8086',
    {},
    { latitude: '41.6886', longitude: 44.8086 },
    { latitude: Number.NaN, longitude: 44.8086 },
    { latitude: Number.POSITIVE_INFINITY, longitude: 44.8086 },
    { latitude: 91, longitude: 44.8086 },
    { latitude: 41.6886, longitude: 181 },
  ];

  for (const value of invalidValues) {
    assertEqual(parseCoordinates(value), null, `invalid coordinate rejected: ${String(value)}`);
  }
});

test('parseCoordinates preserves valid-range swapped-looking coordinates', () => {
  const parsed = parseCoordinates({ latitude: 44.8086, longitude: 41.6886 });
  assertDeepEqual(
    parsed,
    { latitude: 44.8086, longitude: 41.6886 },
    'valid-range swapped-looking coordinate is preserved',
  );
});

test('classifyCoordinate covers MAP-02A fixtures without downloaded area', () => {
  const georgiaIds = [
    'GE_TBILISI_NARIKALA',
    'GE_TBILISI_RIKE',
    'GE_TBILISI_LIBERTY',
    'GE_TBILISI_SULFUR_BATHS',
    'GE_MTSKHETA_CATHEDRAL',
    'GE_BATUMI_BOULEVARD',
  ] as const;

  for (const id of georgiaIds) {
    assertDeepEqual(
      classifyCoordinate(MAP_COORDINATES[id]),
      {
        insideGeorgia: true,
        insideDownloadedArea: null,
        reason: 'inside_georgia_download_area_unknown',
      },
      `${id} classified inside Georgia without downloaded area`,
    );
  }

  for (const id of ['OUTSIDE_GE_YEREVAN_CASCADE', 'OUTSIDE_GE_TRABZON_CENTER'] as const) {
    assertDeepEqual(
      classifyCoordinate(MAP_COORDINATES[id]),
      {
        insideGeorgia: false,
        insideDownloadedArea: false,
        reason: 'outside_georgia',
      },
      `${id} classified outside Georgia`,
    );
  }
});

test('classifyCoordinate covers MAP-02A fixtures with TBILISI_PROOF_AREA', () => {
  for (const id of [
    'GE_TBILISI_NARIKALA',
    'GE_TBILISI_RIKE',
    'GE_TBILISI_LIBERTY',
    'GE_TBILISI_SULFUR_BATHS',
  ] as const) {
    assertEqual(
      classifyCoordinate(MAP_COORDINATES[id], TBILISI_PROOF_AREA).reason,
      'inside_georgia_inside_downloaded_area',
      `${id} classified inside downloaded area`,
    );
  }

  for (const id of ['GE_MTSKHETA_CATHEDRAL', 'GE_BATUMI_BOULEVARD'] as const) {
    assertEqual(
      classifyCoordinate(MAP_COORDINATES[id], TBILISI_PROOF_AREA).reason,
      'inside_georgia_outside_downloaded_area',
      `${id} classified outside downloaded area`,
    );
  }

  for (const id of ['OUTSIDE_GE_YEREVAN_CASCADE', 'OUTSIDE_GE_TRABZON_CENTER'] as const) {
    assertDeepEqual(
      classifyCoordinate(MAP_COORDINATES[id], TBILISI_PROOF_AREA),
      {
        insideGeorgia: false,
        insideDownloadedArea: false,
        reason: 'outside_georgia',
      },
      `${id} remains outside Georgia even when downloaded area is provided`,
    );
  }
});

test('map_empty_trip produces empty trip state', () => {
  const snapshot = buildMapViewSnapshot({
    tripId: 'trip-georgia-empty',
    mode: { kind: 'all' },
    places: [],
    dayItems: [],
  });

  assertEqual(snapshot.pins.length, 0, 'empty trip has no pins');
  assertEqual(snapshot.cards.length, 0, 'empty trip has no cards');
  assertEqual(snapshot.plannedLine, null, 'empty trip has no planned line');
  assertEqual(snapshot.emptyState?.kind, 'empty_trip', 'empty trip state is exposed');
});

test('map_all_mixed_points renders coordinate-backed pins and no route line', () => {
  const places = pickPlaces([
    'pt-noday-rike',
    'pt-noday-text',
    'pt-day1-narikala',
    'pt-day1-no-coord',
    'pt-day1-liberty',
    'pt-day2-mtskheta',
  ]);
  const snapshot = buildMapViewSnapshot({
    tripId: TRIP_ID,
    mode: { kind: 'all' },
    places,
    dayItems: dayItemsFor(places.map((place) => place.id)),
  });

  assertDeepEqual(
    snapshot.pins.map((pin) => [pin.pointId, pin.color, pin.label]),
    [
      ['pt-day1-liberty', 'red', null],
      ['pt-day1-narikala', 'red', null],
      ['pt-noday-rike', 'gray', null],
      ['pt-day2-mtskheta', 'red', null],
    ],
    'all mode pins match coordinate-backed points',
  );
  assertEqual(snapshot.plannedLine, null, 'all mode has no route line');
  assert(snapshot.cards.some((card) => card.pointId === 'pt-day1-no-coord'), 'no-coordinate day card is visible');
});

test('map_no_day_mixed renders only no-day records', () => {
  const places = pickPlaces(['pt-noday-rike', 'pt-noday-text', 'pt-address-no-coord', 'pt-day1-narikala']);
  const snapshot = buildMapViewSnapshot({
    tripId: TRIP_ID,
    mode: { kind: 'no_day' },
    places,
    dayItems: dayItemsFor(['pt-day1-narikala']),
  });

  assertDeepEqual(snapshot.pins.map((pin) => pin.pointId), ['pt-noday-rike'], 'only no-day coordinate pin renders');
  assert(snapshot.cards.some((card) => card.pointId === 'pt-noday-text'), 'no-day text card remains visible');
  assert(snapshot.cards.every((card) => card.dayId === null), 'all no-day cards have no day');
});

test('map_no_day_empty exposes empty no-day state', () => {
  const places = pickPlaces(['pt-day1-narikala', 'pt-day1-liberty', 'pt-day2-mtskheta']);
  const snapshot = buildMapViewSnapshot({
    tripId: TRIP_ID,
    mode: { kind: 'no_day' },
    places,
    dayItems: dayItemsFor(places.map((place) => place.id)),
  });

  assertEqual(snapshot.cards.length, 0, 'no-day empty has no cards');
  assertEqual(snapshot.pins.length, 0, 'no-day empty has no pins');
  assertEqual(snapshot.plannedLine, null, 'no-day empty has no planned line');
  assertEqual(snapshot.emptyState?.kind, 'empty_no_day', 'no-day empty state is exposed');
  assertEqual(snapshot.mode.kind, 'no_day', 'no-day empty keeps no-day mode');
  assertDeepEqual(
    snapshot.emptyState?.actions,
    ['add_no_day_place', 'switch_all', 'search_online'],
    'online no-day empty actions are explicit',
  );

  const offlineSnapshot = buildMapViewSnapshot({
    tripId: TRIP_ID,
    mode: { kind: 'no_day' },
    places,
    dayItems: dayItemsFor(places.map((place) => place.id)),
    onlineSearchAvailable: false,
  });
  assertDeepEqual(
    offlineSnapshot.emptyState?.actions,
    ['add_no_day_place', 'switch_all'],
    'offline no-day empty does not offer online search',
  );
});

test('map_day_empty exposes empty selected-day state', () => {
  const places = pickPlaces(['pt-noday-rike', 'pt-day2-mtskheta']);
  const snapshot = buildMapViewSnapshot({
    tripId: TRIP_ID,
    mode: { kind: 'day', dayId: 'day-1' },
    places,
    dayItems: dayItemsFor(['pt-day2-mtskheta']),
  });

  assertEqual(snapshot.pins.length, 0, 'empty day has no pins');
  assertEqual(snapshot.cards.length, 0, 'empty day has no cards');
  assertEqual(snapshot.plannedLine?.rendered, false, 'empty day line snapshot is not rendered');
  assertEqual(snapshot.emptyState?.kind, 'empty_day', 'empty day state is exposed');
});

test('map_day_three_coordinate_points exposes selected-day order without direct route rendering', () => {
  const places = pickPlaces(['pt-day1-narikala', 'pt-day1-liberty', 'pt-day1-baths']);
  const dayItems = [
    { ...SHARED_DAY_ITEMS.find((item) => item.placeId === 'pt-day1-narikala')!, routeOrder: 1 },
    { ...SHARED_DAY_ITEMS.find((item) => item.placeId === 'pt-day1-liberty')!, routeOrder: 2 },
    { ...SHARED_DAY_ITEMS.find((item) => item.placeId === 'pt-day1-baths')!, routeOrder: 3 },
  ];

  const snapshot = buildMapViewSnapshot({
    tripId: TRIP_ID,
    mode: { kind: 'day', dayId: 'day-1' },
    places,
    dayItems,
  });

  assertDeepEqual(snapshot.mode, { kind: 'day', dayId: 'day-1' }, 'selected day mode is preserved');
  assertDeepEqual(
    snapshot.cards.map((card) => card.pointId),
    ['pt-day1-narikala', 'pt-day1-liberty', 'pt-day1-baths'],
    'day cards are ordered',
  );
  assertDeepEqual(
    snapshot.pins.map((pin) => [pin.pointId, pin.color, pin.label]),
    [
      ['pt-day1-narikala', 'red', '1'],
      ['pt-day1-liberty', 'red', '2'],
      ['pt-day1-baths', 'red', '3'],
    ],
    'day pins are red and numbered 1..3',
  );
  assertEqual(snapshot.plannedLine?.rendered, false, 'legacy direct planned line is not renderable route geometry');
  assertDeepEqual(
    snapshot.plannedLine?.includedPointIds,
    ['pt-day1-narikala', 'pt-day1-liberty', 'pt-day1-baths'],
    'planned line includes coordinate points',
  );
  assertDeepEqual(snapshot.plannedLine?.excludedPointIds, [], 'planned line excludes no points');
  assertDeepEqual(
    snapshot.plannedLine?.orderedCoordinates,
    [
      MAP_COORDINATES.GE_TBILISI_NARIKALA,
      MAP_COORDINATES.GE_TBILISI_LIBERTY,
      MAP_COORDINATES.GE_TBILISI_SULFUR_BATHS,
    ],
    'planned line ordered coordinates match clean route',
  );
  assert(!snapshot.pins.some((pin) => pin.pointId === 'pt-noday-rike'), 'selected day excludes no-day pins');
});

test('map_day_order_with_missing_coordinate preserves card orders and pin gaps', () => {
  const places = pickPlaces(['pt-day1-narikala', 'pt-day1-no-coord', 'pt-day1-liberty', 'pt-day1-baths']);
  const snapshot = buildMapViewSnapshot({
    tripId: TRIP_ID,
    mode: { kind: 'day', dayId: 'day-1' },
    places,
    dayItems: dayItemsFor(places.map((place) => place.id)),
  });

  assertDeepEqual(
    snapshot.cards.map((card) => [card.pointId, card.routeOrder, card.kind]),
    [
      ['pt-day1-narikala', 1, 'place'],
      ['pt-day1-no-coord', 2, 'missing_target'],
      ['pt-day1-liberty', 3, 'place'],
      ['pt-day1-baths', 4, 'place'],
    ],
    'missing coordinate card stays in order',
  );
  assertDeepEqual(snapshot.pins.map((pin) => pin.label), ['1', '3', '4'], 'pin labels keep route-order gap');
  assertDeepEqual(snapshot.plannedLine?.excludedPointIds, ['pt-day1-no-coord'], 'missing coordinate is excluded from line');
  assertDeepEqual(
    snapshot.plannedLine?.includedPointIds,
    ['pt-day1-narikala', 'pt-day1-liberty', 'pt-day1-baths'],
    'line includes only coordinate-backed points in card order',
  );
  assertDeepEqual(
    snapshot.plannedLine?.orderedCoordinates,
    [
      MAP_COORDINATES.GE_TBILISI_NARIKALA,
      MAP_COORDINATES.GE_TBILISI_LIBERTY,
      MAP_COORDINATES.GE_TBILISI_SULFUR_BATHS,
    ],
    'line coordinates skip missing coordinate card without compaction',
  );
});

test('orphan day item remains visible as a missing target card', () => {
  const snapshot = buildMapViewSnapshot({
    tripId: TRIP_ID,
    mode: { kind: 'day', dayId: 'day-1' },
    places: pickPlaces(['pt-day1-narikala']),
    dayItems: [
      {
        id: 'day-item-narikala',
        tripId: TRIP_ID,
        dayId: 'day-1',
        placeId: 'pt-day1-narikala',
        routeOrder: 1,
      },
      {
        id: 'day-item-orphan',
        tripId: TRIP_ID,
        dayId: 'day-1',
        placeId: 'pt-missing-place',
        routeOrder: 2,
      },
    ],
  });

  assertDeepEqual(
    snapshot.cards.map((card) => [card.pointId, card.routeOrder, card.kind]),
    [
      ['pt-day1-narikala', 1, 'place'],
      ['pt-missing-place', 2, 'missing_target'],
    ],
    'orphan day item is visible in card order',
  );
  const orphanCard = snapshot.cards.find((card) => card.pointId === 'pt-missing-place');
  assert(orphanCard?.kind === 'missing_target', 'orphan card uses missing target kind');
  assertEqual(orphanCard.reason, 'missing_place', 'orphan card distinguishes missing place');
  assertDeepEqual(snapshot.pins.map((pin) => pin.pointId), ['pt-day1-narikala'], 'orphan creates no pin');
  assertDeepEqual(snapshot.plannedLine?.excludedPointIds, ['pt-missing-place'], 'orphan is observable as excluded');
});

test('map_reorder_day_cards uses reordered input as source of truth', () => {
  const places = pickPlaces(['pt-day1-narikala', 'pt-day1-liberty', 'pt-day1-baths']);
  const dayItems = [
    { id: 'reordered-liberty', tripId: TRIP_ID, dayId: 'day-1' as const, placeId: 'pt-day1-liberty', routeOrder: 1 },
    { id: 'reordered-narikala', tripId: TRIP_ID, dayId: 'day-1' as const, placeId: 'pt-day1-narikala', routeOrder: 2 },
    { id: 'reordered-baths', tripId: TRIP_ID, dayId: 'day-1' as const, placeId: 'pt-day1-baths', routeOrder: 3 },
  ];
  const snapshot = buildMapViewSnapshot({
    tripId: TRIP_ID,
    mode: { kind: 'day', dayId: 'day-1' },
    places,
    dayItems,
  });

  assertDeepEqual(
    snapshot.plannedLine?.includedPointIds,
    ['pt-day1-liberty', 'pt-day1-narikala', 'pt-day1-baths'],
    'planned line follows reordered card input',
  );
});

test('applyReorderedDayItems deterministically recalculates selected day routeOrder', () => {
  const reordered = applyReorderedDayItems(
    SHARED_DAY_ITEMS,
    'day-1',
    ['pt-day1-baths', 'pt-day1-narikala', 'pt-day1-liberty'],
  );

  assertDeepEqual(
    reordered
      .filter((item) => item.dayId === 'day-1')
      .sort((a, b) => a.routeOrder - b.routeOrder)
      .map((item) => [item.placeId, item.routeOrder]),
    [
      ['pt-day1-baths', 1],
      ['pt-day1-narikala', 2],
      ['pt-day1-liberty', 3],
      ['pt-day1-no-coord', 4],
    ],
    'selected day routeOrder follows requested order then stable remainder',
  );
  assertDeepEqual(
    reordered.filter((item) => item.dayId === 'day-2'),
    SHARED_DAY_ITEMS.filter((item) => item.dayId === 'day-2'),
    'other day items are preserved',
  );
});

test('route input hash changes after reorder', () => {
  const places = pickPlaces(['pt-day1-narikala', 'pt-day1-liberty', 'pt-day1-baths']);
  const originalHash = buildRouteInputHash(
    'day-1',
    'walking',
    buildRouteWaypointsFromDayItems(places, SHARED_DAY_ITEMS, 'day-1'),
  );
  const reordered = applyReorderedDayItems(
    SHARED_DAY_ITEMS,
    'day-1',
    ['pt-day1-baths', 'pt-day1-liberty', 'pt-day1-narikala'],
  );
  const reorderedHash = buildRouteInputHash(
    'day-1',
    'walking',
    buildRouteWaypointsFromDayItems(places, reordered, 'day-1'),
  );

  assert(originalHash !== reorderedHash, 'route hash changes when coordinate-backed waypoint order changes');
});

test('ready route with matching hash renders routeGeometry from provider plan', () => {
  const snapshot = buildMapViewSnapshot({
    tripId: TRIP_ID,
    mode: { kind: 'day', dayId: 'day-1' },
    places: pickPlaces(['pt-day1-narikala', 'pt-day1-no-coord', 'pt-day1-liberty', 'pt-day1-baths']),
    dayItems: dayItemsFor(['pt-day1-narikala', 'pt-day1-no-coord', 'pt-day1-liberty', 'pt-day1-baths']),
    routePlans: [MOCK_DAY_1_ROUTE_PLAN],
  });

  assertEqual(snapshot.routeState?.status, 'ready', 'matching ready route is exposed as ready');
  assertEqual(snapshot.routeState?.isStale, false, 'matching ready route is not stale');
  assertEqual(snapshot.routeGeometry?.source, 'routing_provider_mock', 'route geometry keeps provider source');
  assertEqual(snapshot.routeGeometry?.provider, 'mock-routing', 'route geometry keeps provider identity');
  assertEqual(snapshot.routeGeometry?.isRoadSnapped, true, 'route geometry is road-snapped');
  assertDeepEqual(
    snapshot.routeGeometry?.coordinates,
    MOCK_DAY_1_ROUTE_GEOMETRY.coordinates,
    'route geometry comes from RoutePlan geometry',
  );
});

test('stale route is detected after order changes', () => {
  const places = pickPlaces(['pt-day1-narikala', 'pt-day1-no-coord', 'pt-day1-liberty', 'pt-day1-baths']);
  const reordered = applyReorderedDayItems(
    dayItemsFor(['pt-day1-narikala', 'pt-day1-no-coord', 'pt-day1-liberty', 'pt-day1-baths']),
    'day-1',
    ['pt-day1-baths', 'pt-day1-liberty', 'pt-day1-narikala'],
  );
  const currentHash = buildRouteInputHash(
    'day-1',
    'walking',
    buildRouteWaypointsFromDayItems(places, reordered, 'day-1'),
  );
  const snapshot = buildMapViewSnapshot({
    tripId: TRIP_ID,
    mode: { kind: 'day', dayId: 'day-1' },
    places,
    dayItems: reordered,
    routePlans: [MOCK_DAY_1_ROUTE_PLAN],
  });

  assertEqual(isRoutePlanStale(MOCK_DAY_1_ROUTE_PLAN, currentHash), true, 'helper detects stale plan');
  assertEqual(snapshot.routeState?.status, 'stale', 'selector exposes stale route state');
  assertEqual(snapshot.routeState?.failureReason, 'stale_input', 'stale route has explicit reason');
  assertEqual(snapshot.routeGeometry, null, 'stale route geometry is not rendered');
});

test('mock route geometry is not equal to direct waypoint list and is road-snapped', () => {
  const waypoints = buildRouteWaypointsFromDayItems(
    pickPlaces(['pt-day1-narikala', 'pt-day1-liberty', 'pt-day1-baths']),
    [
      { id: 'route-narikala', tripId: TRIP_ID, dayId: 'day-1', placeId: 'pt-day1-narikala', routeOrder: 1 },
      { id: 'route-liberty', tripId: TRIP_ID, dayId: 'day-1', placeId: 'pt-day1-liberty', routeOrder: 2 },
      { id: 'route-baths', tripId: TRIP_ID, dayId: 'day-1', placeId: 'pt-day1-baths', routeOrder: 3 },
    ],
    'day-1',
  );
  const geometry = new MockRoutingProvider().calculateRoute({ profile: 'walking', waypoints });

  assertEqual(geometry.source, 'routing_provider_mock', 'mock provider is explicitly marked');
  assertEqual(geometry.provider, 'mock-routing', 'mock provider is not production');
  assertEqual(geometry.isRoadSnapped, true, 'mock route is marked road-snapped');
  assert(
    JSON.stringify(geometry.coordinates) !== JSON.stringify(waypoints.map((waypoint) => waypoint.coordinates)),
    'mock geometry has intermediate points and is not a direct waypoint list',
  );
});

test('direct plannedLine is not accepted as successful route geometry', () => {
  const places = pickPlaces(['pt-day1-narikala', 'pt-day1-liberty', 'pt-day1-baths']);
  const dayItems = [
    { id: 'route-narikala', tripId: TRIP_ID, dayId: 'day-1' as const, placeId: 'pt-day1-narikala', routeOrder: 1 },
    { id: 'route-liberty', tripId: TRIP_ID, dayId: 'day-1' as const, placeId: 'pt-day1-liberty', routeOrder: 2 },
    { id: 'route-baths', tripId: TRIP_ID, dayId: 'day-1' as const, placeId: 'pt-day1-baths', routeOrder: 3 },
  ];
  const waypoints = buildRouteWaypointsFromDayItems(places, dayItems, 'day-1');
  const directCoordinates = waypoints.map((waypoint) => waypoint.coordinates);
  const inputHash = buildRouteInputHash('day-1', 'walking', waypoints);
  const snapshot = buildMapViewSnapshot({
    tripId: TRIP_ID,
    mode: { kind: 'day', dayId: 'day-1' },
    places,
    dayItems,
    routePlans: [{
      dayId: 'day-1',
      profile: 'walking',
      inputHash,
      status: 'ready',
      geometry: {
        source: 'routing_provider_mock',
        provider: 'mock-routing',
        profile: 'walking',
        coordinates: directCoordinates,
        segments: [],
        distanceMeters: null,
        durationSeconds: null,
        isRoadSnapped: true,
      },
      failureReason: null,
      provider: 'mock-routing',
    }],
  });

  assertEqual(snapshot.plannedLine?.rendered, false, 'legacy direct plannedLine remains non-renderable');
  assertDeepEqual(snapshot.plannedLine?.orderedCoordinates, directCoordinates, 'legacy plannedLine is direct');
  assertEqual(snapshot.routeState?.status, 'failed', 'direct geometry does not pass as route success');
  assertEqual(
    snapshot.routeState?.failureReason,
    'direct_line_not_route_geometry',
    'direct geometry failure reason is explicit',
  );
  assertEqual(snapshot.routeGeometry, null, 'direct geometry is not rendered as route geometry');
});

test('fewer-than-two route points still expose non-rendered line snapshot', () => {
  const places = pickPlaces(['pt-day1-narikala']);
  const snapshot = buildMapViewSnapshot({
    tripId: TRIP_ID,
    mode: { kind: 'day', dayId: 'day-1' },
    places,
    dayItems: dayItemsFor(['pt-day1-narikala']),
  });

  assertEqual(snapshot.plannedLine?.rendered, false, 'single coordinate day does not draw line');
  assertDeepEqual(snapshot.plannedLine?.includedPointIds, ['pt-day1-narikala'], 'single coordinate remains observable');
  assertDeepEqual(snapshot.plannedLine?.excludedPointIds, [], 'single coordinate has no excluded points');
  assertDeepEqual(
    snapshot.plannedLine?.orderedCoordinates,
    [MAP_COORDINATES.GE_TBILISI_NARIKALA],
    'single coordinate remains in ordered coordinates',
  );
  assertEqual(snapshot.plannedLine?.testId, 'planned-line-day-1', 'non-rendered line remains testable');
});

test('mock adapter contracts expose normalized boundaries only', () => {
  const request = createSubmittedSearchRequest('Narikala Fortress');
  assertEqual(request.autocomplete, false, 'submitted search disables autocomplete');

  const searchResponse: PlaceSearchResponse = {
    kind: 'success',
    query: request.query,
    results: [
      {
        id: 'mock-ge-narikala',
        title: 'Narikala Fortress',
        address: 'Tbilisi, Georgia',
        coordinates: MAP_COORDINATES.GE_TBILISI_NARIKALA,
        countryCode: 'GE',
        provider: 'mock',
      },
    ],
  };
  assert(!('rawPayload' in searchResponse.results[0]), 'search result has no raw payload');

  for (const response of [
    createEmptySearchResponse('Atlantis Tbilisi'),
    createOfflineSearchResponse('Narikala Fortress'),
    createFailedSearchResponse('Narikala Fortress', 'timeout'),
    createFailedSearchResponse('Narikala Fortress', 'quota'),
    createFailedSearchResponse('Narikala Fortress', 'malformed'),
  ]) {
    assertEqual(response.results.length, 0, `${response.kind} search has no partial results`);
    assert('query' in response && response.query.length > 0, `${response.kind} search preserves query`);
    assert(!('savedPoint' in response), `${response.kind} search does not create saved point`);
    assert(!('rawPayload' in response), `${response.kind} search has no raw provider payload`);
  }

  const snapshot = buildMapViewSnapshot({
    tripId: TRIP_ID,
    mode: { kind: 'day', dayId: 'day-1' },
    places: pickPlaces(['pt-day1-narikala', 'pt-day1-liberty']),
    dayItems: dayItemsFor(['pt-day1-narikala', 'pt-day1-liberty']),
  });
  const displayInput = createMapDisplayInput(snapshot.pins, snapshot.plannedLine);
  assertEqual(displayInput.pins.length, 2, 'map display input uses app-owned pins');

  const inventory = createMockOfflineInventory(TBILISI_PROOF_AREA);
  assertEqual(inventory.lifecycle, 'available', 'offline inventory lifecycle is separate');
  assertEqual(inventory.proofState, 'mock_only', 'offline proof state is separate');
  assertEqual(inventory.providerPackId, null, 'mock inventory has no provider internals');

  const coverage = createOfflineCoverage(
    MAP_COORDINATES.GE_TBILISI_NARIKALA,
    classifyCoordinate(MAP_COORDINATES.GE_TBILISI_NARIKALA, TBILISI_PROOF_AREA),
  );
  assertEqual(coverage.classification.reason, 'inside_georgia_inside_downloaded_area', 'coverage keeps classification separate');

  assertDeepEqual(
    createExternalHandoffResult('opened'),
    { kind: 'opened', provider: 'mock_external_map' },
    'handoff opened result is generic',
  );
  assertDeepEqual(
    createExternalHandoffResult('unsupported'),
    { kind: 'unsupported', reason: 'missing_target' },
    'handoff unsupported result is generic',
  );
  assertDeepEqual(
    createExternalHandoffResult('failed'),
    { kind: 'failed', reason: 'provider_unavailable' },
    'handoff failure result is generic',
  );
});

test('copy-negative foundations expose distinct approved and prohibited Russian terms', () => {
  for (const term of PROHIBITED_RUSSIAN_MAP_TERMS) {
    assert(isProhibitedMapCopyTerm(term), `prohibited term exported: ${term}`);
    assert(!isApprovedMapCopyTerm(term), `prohibited term not approved: ${term}`);
  }

  for (const term of APPROVED_RUSSIAN_MAP_TERMS) {
    assert(isApprovedMapCopyTerm(term), `approved term exported: ${term}`);
    assert(!isProhibitedMapCopyTerm(term), `approved term not prohibited: ${term}`);
  }

  for (const term of [
    'линия плана на день',
    'просмотр скачанной карты',
    'сохраненные данные доступны',
    'онлайн-поиск недоступен офлайн',
    'место за пределами Грузии',
    'место за пределами скачанной области',
    'открыть во внешней карте',
  ]) {
    assert(isApprovedMapCopyTerm(term), `MAP-02A approved term covered: ${term}`);
  }

  for (const term of [
    'офлайн-поиск',
    'офлайн-геокодинг',
    'офлайн-маршрут',
    'навигация',
    'оптимальный маршрут',
    'пробки',
    'ETA',
    'перестроение маршрута',
    'работает везде',
    'Яндекс Карты всегда откроются',
  ]) {
    assert(isProhibitedMapCopyTerm(term), `MAP-02A prohibited term covered: ${term}`);
  }
});
