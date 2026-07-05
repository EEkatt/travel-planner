import { StatusBar } from 'expo-status-bar';
import { createElement, useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  MOCK_DAY_1_ROUTE_PLAN,
  SHARED_DAY_ITEMS,
  SHARED_PLACES,
  TRIP_ID,
  applyReorderedDayItems,
  buildMapViewSnapshot,
  buildRouteInputHash,
  buildRouteWaypointsFromDayItems,
  type Coordinates,
  type DayId,
  type DayItem,
  type MapCardView,
  type MapMode,
  type MapPin,
  type Place,
  type RouteGeometrySnapshot,
  type RoutePlan,
  type RouteProfile,
  type RouteStateSnapshot,
} from './src/domain/map';
import { MockRoutingProvider } from './src/services/mockRoutingProvider';

type TabId = 'today' | 'days' | 'map';
type MapDay = 'Без дня' | `День ${number}`;
type MapFilter = 'Все' | MapDay;
type TripDay = { id: DayId; label: Exclude<MapDay, 'Без дня'> };

type PlaceSuggestion = {
  address: string;
  countryCode: 'GE';
  id: string;
  latitude: number;
  longitude: number;
  title: string;
};

type AddPlaceInput = {
  address: string | null;
  coordinates: Coordinates | null;
  day: MapDay;
  source: Place['source'];
  title: string;
};

const trip = {
  title: 'Пробная поездка',
  dates: '12-19 мая',
  offlineMapStatus: 'Офлайн-карта не подключена в прототипе',
  savedDetailsStatus: 'Детали поездки сохранены на устройстве',
  nextItem: {
    time: '10:30',
    title: 'Прогулка по старому городу',
    meta: 'Ручной пункт плана, без построения маршрута',
  },
  housing: {
    title: 'Жилье у центра',
    meta: 'Заезд после 15:00, адрес сохранен текстом',
  },
  flight: {
    title: 'Рейс туда',
    meta: 'Время и аэропорты введены вручную',
  },
};

const dayPlan = [
  { time: '09:30', title: 'Завтрак рядом с жильем', type: 'Место' },
  { time: '10:30', title: 'Прогулка по старому городу', type: 'План' },
  { time: '13:00', title: 'Проверить заметки по билетам', type: 'Заметка' },
  { time: '16:00', title: 'Смотровая площадка', type: 'Место' },
];

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'today', label: 'Сегодня' },
  { id: 'days', label: 'Дни' },
  { id: 'map', label: 'Карта' },
];

const quickActions = ['Жилье', 'Рейсы', 'Заметки'];
const routeProfile: RouteProfile = 'walking';
const defaultTripDays: TripDay[] = [
  { id: 'day-1', label: 'День 1' },
  { id: 'day-2', label: 'День 2' },
];

const georgiaPlaceSuggestions: PlaceSuggestion[] = [
  {
    address: 'Тбилиси, Грузия',
    countryCode: 'GE',
    id: 'ge-narikala',
    latitude: 41.6886,
    longitude: 44.8086,
    title: 'Крепость Нарикала',
  },
  {
    address: 'Парк Рике, Тбилиси, Грузия',
    countryCode: 'GE',
    id: 'ge-rike',
    latitude: 41.6937,
    longitude: 44.8106,
    title: 'Парк Рике',
  },
  {
    address: 'Площадь Свободы, Тбилиси, Грузия',
    countryCode: 'GE',
    id: 'ge-freedom-square',
    latitude: 41.693,
    longitude: 44.8015,
    title: 'Площадь Свободы',
  },
  {
    address: 'Абанотубани, Тбилиси, Грузия',
    countryCode: 'GE',
    id: 'ge-sulfur-baths',
    latitude: 41.6879,
    longitude: 44.8112,
    title: 'Серные бани',
  },
  {
    address: 'Мцхета, Грузия',
    countryCode: 'GE',
    id: 'ge-svetitskhoveli',
    latitude: 41.8418,
    longitude: 44.721,
    title: 'Собор Светицховели',
  },
  {
    address: 'Батуми, Грузия',
    countryCode: 'GE',
    id: 'ge-batumi-boulevard',
    latitude: 41.6509,
    longitude: 41.636,
    title: 'Батумский бульвар',
  },
  {
    address: 'Батуми, Грузия',
    countryCode: 'GE',
    id: 'ge-ali-nino',
    latitude: 41.6557,
    longitude: 41.6412,
    title: 'Статуя Али и Нино',
  },
  {
    address: 'Кутаиси, Грузия',
    countryCode: 'GE',
    id: 'ge-kutaisi',
    latitude: 42.2679,
    longitude: 42.6946,
    title: 'Кутаиси',
  },
  {
    address: 'Кутаиси, Грузия',
    countryCode: 'GE',
    id: 'ge-bagrati',
    latitude: 42.2776,
    longitude: 42.7045,
    title: 'Храм Баграта',
  },
  {
    address: 'Имеретия, Грузия',
    countryCode: 'GE',
    id: 'ge-prometheus-cave',
    latitude: 42.3762,
    longitude: 42.6007,
    title: 'Пещера Прометея',
  },
  {
    address: 'Кахетия, Грузия',
    countryCode: 'GE',
    id: 'ge-sighnaghi',
    latitude: 41.617,
    longitude: 45.9218,
    title: 'Сигнахи',
  },
  {
    address: 'Кахетия, Грузия',
    countryCode: 'GE',
    id: 'ge-bodbe',
    latitude: 41.6066,
    longitude: 45.9342,
    title: 'Монастырь Бодбе',
  },
  {
    address: 'Казбеги, Грузия',
    countryCode: 'GE',
    id: 'ge-kazbegi',
    latitude: 42.6575,
    longitude: 44.6414,
    title: 'Степанцминда',
  },
  {
    address: 'Казбеги, Грузия',
    countryCode: 'GE',
    id: 'ge-gergeti',
    latitude: 42.6625,
    longitude: 44.6206,
    title: 'Троицкая церковь Гергети',
  },
  {
    address: 'Гори, Грузия',
    countryCode: 'GE',
    id: 'ge-gori',
    latitude: 41.9854,
    longitude: 44.1089,
    title: 'Гори',
  },
  {
    address: 'Шида-Картли, Грузия',
    countryCode: 'GE',
    id: 'ge-uplistsikhe',
    latitude: 41.9677,
    longitude: 44.2072,
    title: 'Уплисцихе',
  },
  {
    address: 'Мцхета, Грузия',
    countryCode: 'GE',
    id: 'ge-jvari',
    latitude: 41.8386,
    longitude: 44.7341,
    title: 'Монастырь Джвари',
  },
  {
    address: 'Аджария, Грузия',
    countryCode: 'GE',
    id: 'ge-mtirala',
    latitude: 41.6786,
    longitude: 41.8734,
    title: 'Национальный парк Мтирала',
  },
  {
    address: 'Боржоми, Грузия',
    countryCode: 'GE',
    id: 'ge-borjomi',
    latitude: 41.8412,
    longitude: 43.3823,
    title: 'Боржоми',
  },
  {
    address: 'Самцхе-Джавахети, Грузия',
    countryCode: 'GE',
    id: 'ge-vardzia',
    latitude: 41.3812,
    longitude: 43.2841,
    title: 'Вардзия',
  },
  {
    address: 'Сванетия, Грузия',
    countryCode: 'GE',
    id: 'ge-mestia',
    latitude: 43.0453,
    longitude: 42.7293,
    title: 'Местия',
  },
  {
    address: 'Сванетия, Грузия',
    countryCode: 'GE',
    id: 'ge-ushguli',
    latitude: 42.9167,
    longitude: 43.0167,
    title: 'Ушгули',
  },
  {
    address: 'Тбилиси, Грузия',
    countryCode: 'GE',
    id: 'ge-rustaveli',
    latitude: 41.7031,
    longitude: 44.7898,
    title: 'Проспект Руставели',
  },
  {
    address: 'Тбилиси, Грузия',
    countryCode: 'GE',
    id: 'ge-chronicle',
    latitude: 41.7706,
    longitude: 44.8102,
    title: 'Летопись Грузии',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('map');
  const [places, setPlaces] = useState<Place[]>(SHARED_PLACES);
  const [dayItems, setDayItems] = useState<DayItem[]>(SHARED_DAY_ITEMS);
  const [days, setDays] = useState<TripDay[]>(defaultTripDays);
  const [routePlans, setRoutePlans] = useState<RoutePlan[]>([MOCK_DAY_1_ROUTE_PLAN]);
  const routingProvider = useMemo(() => new MockRoutingProvider(), []);

  const addDay = () => {
    setDays((currentDays) => {
      const nextNumber = Math.max(
        0,
        ...currentDays.map((day) => Number(day.id.replace('day-', ''))).filter(Number.isFinite),
      ) + 1;
      return [
        ...currentDays,
        { id: `day-${nextNumber}`, label: `День ${nextNumber}` },
      ];
    });
  };

  const deleteDay = (dayId: DayId) => {
    setDays((currentDays) => {
      if (currentDays.length <= 1) {
        return currentDays;
      }
      return currentDays.filter((day) => day.id !== dayId);
    });
    setDayItems((currentItems) => currentItems.filter((item) => item.dayId !== dayId));
    setRoutePlans((currentPlans) => currentPlans.filter((plan) => plan.dayId !== dayId));
  };

  const refreshMockRoute = (dayId: DayId, nextPlaces = places, nextDayItems = dayItems) => {
    setRoutePlans((currentPlans) => replaceRoutePlan(currentPlans, buildMockRoutePlan(
      routingProvider,
      nextPlaces,
      nextDayItems,
      dayId,
    )));
  };

  const addPlace = (input: AddPlaceInput) => {
    const placeId = `local-${Date.now()}`;
    const nextPlace: Place = {
      id: placeId,
      tripId: TRIP_ID,
      title: input.title,
      address: input.address,
      note: null,
      coordinates: input.coordinates,
      countryCode: input.coordinates ? 'GE' : null,
      source: input.source,
      provider: input.source === 'search_result' ? 'mock-local-georgia' : undefined,
      providerPlaceId: undefined,
      providerAttribution: input.source === 'search_result' ? 'local fixture' : undefined,
    };
    const nextPlaces = [...places, nextPlace];
    let nextDayItems = dayItems;
    const dayId = input.day === 'Без дня' ? null : dayIdForLabel(input.day, days);

    if (dayId) {
      const nextRouteOrder = Math.max(
        0,
        ...dayItems.filter((item) => item.dayId === dayId).map((item) => item.routeOrder),
      ) + 1;
      nextDayItems = [
        ...dayItems,
        {
          id: `day-item-${placeId}`,
          tripId: TRIP_ID,
          dayId,
          placeId,
          routeOrder: nextRouteOrder,
        },
      ];
    }

    setPlaces(nextPlaces);
    setDayItems(nextDayItems);

    if (dayId) {
      setRoutePlans((currentPlans) => replaceRoutePlan(currentPlans, buildMockRoutePlan(
        routingProvider,
        nextPlaces,
        nextDayItems,
        dayId,
      )));
    }
  };

  const reorderDayCard = (dayId: DayId, pointId: string, direction: -1 | 1) => {
    const snapshot = buildMapViewSnapshot({
      tripId: TRIP_ID,
      mode: { kind: 'day', dayId },
      places,
      dayItems,
      routePlans,
      routeProfile,
      onlineSearchAvailable: false,
    });
    const orderedPointIds = snapshot.cards.map((card) => card.pointId);
    const currentIndex = orderedPointIds.indexOf(pointId);
    const nextIndex = currentIndex + direction;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= orderedPointIds.length) {
      return;
    }

    const nextOrderedPointIds = [...orderedPointIds];
    [nextOrderedPointIds[currentIndex], nextOrderedPointIds[nextIndex]] = [
      nextOrderedPointIds[nextIndex],
      nextOrderedPointIds[currentIndex],
    ];
    const nextDayItems = applyReorderedDayItems(dayItems, dayId, nextOrderedPointIds);

    setDayItems(nextDayItems);
    setRoutePlans((currentPlans) => replaceRoutePlan(currentPlans, buildMockRoutePlan(
      routingProvider,
      places,
      nextDayItems,
      dayId,
    )));
  };

  const assignPlaceToDay = (placeId: string, dayId: DayId) => {
    const nextRouteOrder = Math.max(
      0,
      ...dayItems.filter((item) => item.dayId === dayId).map((item) => item.routeOrder),
    ) + 1;
    const nextDayItems = [
      ...dayItems.filter((item) => item.placeId !== placeId),
      {
        id: `day-item-${placeId}-${dayId}`,
        tripId: TRIP_ID,
        dayId,
        placeId,
        routeOrder: nextRouteOrder,
      },
    ];

    setDayItems(nextDayItems);
    setRoutePlans((currentPlans) => replaceRoutePlan(currentPlans, buildMockRoutePlan(
      routingProvider,
      places,
      nextDayItems,
      dayId,
    )));
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.tripLabel}>Текущая поездка</Text>
            <Text style={styles.tripTitle}>{trip.title}</Text>
            <Text style={styles.tripDates}>{trip.dates}</Text>
          </View>
          <View style={styles.modeBadge}>
            <Text style={styles.modeText}>Планирование</Text>
          </View>
        </View>

        <View style={styles.statusPanel}>
          <Text style={styles.statusTitle}>{trip.savedDetailsStatus}</Text>
          <Text style={styles.statusText}>{trip.offlineMapStatus}. Списки и детали доступны в текущем состоянии экрана.</Text>
        </View>

        <View style={styles.tabs} accessibilityRole="tablist">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, isActive && styles.activeTab]}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {activeTab === 'today' && <TodayView />}
        {activeTab === 'days' && (
          <DaysView
            days={days}
            dayItems={dayItems}
            onAddDay={addDay}
            onDeleteDay={deleteDay}
            places={places}
          />
        )}
        {activeTab === 'map' && (
          <MapView
            dayItems={dayItems}
            days={days}
            onAddPlace={addPlace}
            onAddDay={addDay}
            onAssignPlaceToDay={assignPlaceToDay}
            onMoveDayCard={reorderDayCard}
            onRefreshRoute={refreshMockRoute}
            places={places}
            routePlans={routePlans}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function TodayView() {
  return (
    <>
      <View style={styles.nextPanel}>
        <Text style={styles.sectionLabel}>Следующий пункт</Text>
        <Text style={styles.nextTime}>{trip.nextItem.time}</Text>
        <Text style={styles.nextTitle}>{trip.nextItem.title}</Text>
        <Text style={styles.nextMeta}>{trip.nextItem.meta}</Text>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Открыть во внешних картах</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity key={action} style={styles.quickButton}>
            <Text style={styles.quickButtonText}>{action}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>План на сегодня</Text>
        <TouchableOpacity>
          <Text style={styles.sectionAction}>Добавить</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timeline}>
        {dayPlan.map((item) => (
          <View key={`${item.time}-${item.title}`} style={styles.timelineItem}>
            <Text style={styles.timelineTime}>{item.time}</Text>
            <View style={styles.timelineCard}>
              <Text style={styles.timelineType}>{item.type}</Text>
              <Text style={styles.timelineTitle}>{item.title}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Жилье</Text>
          <Text style={styles.detailTitle}>{trip.housing.title}</Text>
          <Text style={styles.detailMeta}>{trip.housing.meta}</Text>
        </View>
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Рейс</Text>
          <Text style={styles.detailTitle}>{trip.flight.title}</Text>
          <Text style={styles.detailMeta}>{trip.flight.meta}</Text>
        </View>
      </View>
    </>
  );
}

function DaysView({
  dayItems,
  days,
  onAddDay,
  onDeleteDay,
  places,
}: {
  dayItems: DayItem[];
  days: TripDay[];
  onAddDay: () => void;
  onDeleteDay: (dayId: DayId) => void;
  places: Place[];
}) {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Дни поездки</Text>
        <TouchableOpacity onPress={onAddDay}>
          <Text style={styles.sectionAction}>Добавить день</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dayList}>
        {days.map((day) => {
          const items = dayItems
            .filter((item) => item.dayId === day.id)
            .sort((a, b) => a.routeOrder - b.routeOrder)
            .map((item) => ({
              item,
              place: places.find((place) => place.id === item.placeId) ?? null,
            }));

          return (
            <View key={day.id} style={styles.dayCard}>
              <View style={styles.dayCardContent}>
                <View style={styles.dayCardHeader}>
                  <View>
                    <Text style={styles.dayTitle}>{day.label}</Text>
                    <Text style={styles.dayMeta}>{items.length > 0 ? `${items.length} пунктов в плане` : 'План можно заполнить позже'}</Text>
                  </View>
                  <Text style={styles.dayCount}>{items.length}</Text>
                </View>
                {items.length > 0 ? (
                  <View style={styles.dayPlanList}>
                    {items.map(({ item, place }) => (
                      <View key={item.id} style={styles.dayPlanRow}>
                        <Text style={styles.dayPlanNumber}>{item.routeOrder}</Text>
                        <View style={styles.placeText}>
                          <Text style={styles.dayPlanTitle}>{place?.title ?? 'Место не найдено'}</Text>
                          <Text style={styles.dayPlanMeta}>
                            {place?.address ?? 'Адрес не указан'}{place?.coordinates ? '' : ' - без точки на карте'}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ) : null}
                {days.length > 1 ? (
                  <TouchableOpacity style={styles.deleteDayButton} onPress={() => onDeleteDay(day.id)}>
                    <Text style={styles.deleteDayButtonText}>Удалить день</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </>
  );
}

function MapView({
  dayItems,
  days,
  onAddPlace,
  onAddDay,
  onAssignPlaceToDay,
  onMoveDayCard,
  onRefreshRoute,
  places,
  routePlans,
}: {
  dayItems: DayItem[];
  days: TripDay[];
  onAddPlace: (place: AddPlaceInput) => void;
  onAddDay: () => void;
  onAssignPlaceToDay: (placeId: string, dayId: DayId) => void;
  onMoveDayCard: (dayId: DayId, pointId: string, direction: -1 | 1) => void;
  onRefreshRoute: (dayId: DayId) => void;
  places: Place[];
  routePlans: RoutePlan[];
}) {
  const [selectedFilter, setSelectedFilter] = useState<MapFilter>('Все');
  const [zoom, setZoom] = useState(100);
  const [addQuery, setAddQuery] = useState('');
  const [addDay, setAddDay] = useState<MapDay>('Без дня');
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null);
  const [draftCoordinates, setDraftCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapCanvasSize, setMapCanvasSize] = useState({ height: 0, width: 0 });
  const mapFilters: MapFilter[] = useMemo(() => ['Все', 'Без дня', ...days.map((day) => day.label)], [days]);
  const pointDayOptions: MapDay[] = useMemo(() => ['Без дня', ...days.map((day) => day.label)], [days]);
  const mode = useMemo(() => mapFilterToMode(selectedFilter, days), [days, selectedFilter]);

  useEffect(() => {
    if (!mapFilters.includes(selectedFilter)) {
      setSelectedFilter('Все');
    }
    if (!pointDayOptions.includes(addDay)) {
      setAddDay('Без дня');
    }
  }, [addDay, mapFilters, pointDayOptions, selectedFilter]);

  const snapshot = useMemo(() => buildMapViewSnapshot({
    tripId: TRIP_ID,
    mode,
    places,
    dayItems,
    routePlans,
    routeProfile,
    onlineSearchAvailable: false,
  }), [dayItems, mode, places, routePlans]);
  const hiddenCards = snapshot.cards.filter((card) => card.kind === 'missing_target');
  const visibleCards = snapshot.cards.filter((card) => card.kind === 'place');
  const selectedDayId = mode.kind === 'day' ? mode.dayId : null;
  const routeStatusCopy = getRouteStatusCopy(snapshot.routeState, snapshot.routeGeometry);
  const routePreviewSegments = useMemo(
    () => buildRoutePreviewSegments(snapshot.routeGeometry?.coordinates ?? []),
    [snapshot.routeGeometry],
  );
  const webMapHtml = useMemo(
    () => buildLeafletMapHtml(snapshot.pins, snapshot.routeGeometry),
    [snapshot.pins, snapshot.routeGeometry],
  );
  const normalizedQuery = normalizeSuggestionText(addQuery);
  const shownSuggestions = useMemo(() => {
    if (!normalizedQuery) {
      return georgiaPlaceSuggestions.slice(0, 3);
    }

    return georgiaPlaceSuggestions
      .filter((suggestion) => {
        const searchableText = normalizeSuggestionText(`${suggestion.title} ${suggestion.address}`);

        return searchableText.includes(normalizedQuery);
      })
      .slice(0, 5);
  }, [normalizedQuery]);
  const selectedSuggestion = selectedSuggestionId
    ? georgiaPlaceSuggestions.find((suggestion) => suggestion.id === selectedSuggestionId) ?? null
    : null;
  const draftCoordinateInsideGeorgia = draftCoordinates ? isInsideGeorgiaCoordinate(draftCoordinates) : true;
  const trimmedQuery = addQuery.trim();
  const canSaveAddPlace = Boolean(selectedSuggestion) || trimmedQuery.length > 0;

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return undefined;
    }

    const handleMapMessage = (event: MessageEvent) => {
      const payload = event.data;

      if (!payload || payload.type !== 'trip-map-click') {
        return;
      }

      const latitude = Number(payload.latitude);
      const longitude = Number(payload.longitude);

      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        setDraftCoordinates({ latitude, longitude });
        setSelectedSuggestionId(null);
      }
    };

    window.addEventListener('message', handleMapMessage);

    return () => {
      window.removeEventListener('message', handleMapMessage);
    };
  }, []);

  const updateAddQuery = (value: string) => {
    setAddQuery(value);
    setSelectedSuggestionId(null);
  };

  const selectSuggestion = (suggestion: PlaceSuggestion) => {
    setAddQuery(suggestion.title);
    setSelectedSuggestionId(suggestion.id);
    setDraftCoordinates(null);
  };

  const handleNativeMapTap = (locationX: number, locationY: number) => {
    if (mapCanvasSize.width <= 0 || mapCanvasSize.height <= 0) {
      return;
    }

    setDraftCoordinates(previewPositionToCoordinate(
      (locationX / mapCanvasSize.width) * 100,
      (locationY / mapCanvasSize.height) * 100,
    ));
    setSelectedSuggestionId(null);
  };

  const saveAddPlace = () => {
    if (!canSaveAddPlace) {
      return;
    }

    const coordinateSource = selectedSuggestion ?? draftCoordinates;
    const canUseCoordinates = selectedSuggestion !== null || (draftCoordinates !== null && draftCoordinateInsideGeorgia);
    const title = selectedSuggestion?.title ?? trimmedQuery;

    onAddPlace({
      title,
      address: selectedSuggestion?.address ?? null,
      coordinates: canUseCoordinates && coordinateSource
        ? { latitude: coordinateSource.latitude, longitude: coordinateSource.longitude }
        : null,
      day: addDay,
      source: selectedSuggestion ? 'search_result' : draftCoordinates ? 'manual_map_tap' : 'manual_text',
    });
    setSelectedFilter(addDay === 'Без дня' ? 'Все' : addDay);
    setAddQuery('');
    setAddDay('Без дня');
    setSelectedSuggestionId(null);
    setDraftCoordinates(null);
  };

  return (
    <>
      <View style={styles.mapHeader}>
        <View>
          <Text style={styles.sectionTitle}>Карта поездки</Text>
          <Text style={styles.mapSubtitle}>{snapshot.pins.length} точки показаны, {hiddenCards.length} нужно уточнить</Text>
        </View>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Прототип</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapModeGrid}>
        <View style={styles.mapModeCard}>
          <Text style={styles.mapModeTitle}>Прототип</Text>
          <Text style={styles.mapModeText}>Один локальный mock-поиск по Грузии, добавление точек и текстовых мест.</Text>
        </View>
        <View style={styles.mapModeCard}>
          <Text style={styles.mapModeTitle}>Маршрут</Text>
          <Text style={styles.mapModeText}>{routeStatusCopy}</Text>
        </View>
      </View>

      <View style={styles.mapToolbar}>
        <View style={styles.filterTabs}>
          {mapFilters.map((filter) => {
            const isActive = selectedFilter === filter;

            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterTab, isActive && styles.activeFilterTab]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[styles.filterText, isActive && styles.activeFilterText]}>{filter}</Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity style={styles.addDayFilterButton} onPress={onAddDay}>
            <Text style={styles.addDayFilterText}>+ День</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton} onPress={() => setZoom((value) => Math.max(80, value - 20))}>
            <Text style={styles.zoomButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.zoomValue}>{zoom}%</Text>
          <TouchableOpacity style={styles.zoomButton} onPress={() => setZoom((value) => Math.min(160, value + 20))}>
            <Text style={styles.zoomButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={styles.mapCanvas}
        onLayout={(event) => {
          setMapCanvasSize({
            height: event.nativeEvent.layout.height,
            width: event.nativeEvent.layout.width,
          });
        }}
      >
        {Platform.OS === 'web' ? (
          createElement('iframe', {
            srcDoc: webMapHtml,
            title: 'Карта поездки',
            style: {
              border: 0,
              height: '100%',
              width: '100%',
            },
          })
        ) : (
          <Pressable
            style={styles.mapLayer}
            onPress={(event) => handleNativeMapTap(event.nativeEvent.locationX, event.nativeEvent.locationY)}
          >
            <View style={[styles.mapLayer, { transform: [{ scale: zoom / 100 }] }]}>
              <View style={[styles.mapRoad, styles.mapRoadMain]} />
              <View style={[styles.mapRoad, styles.mapRoadSide]} />
              <View style={[styles.mapArea, styles.mapAreaOne]} />
              <View style={[styles.mapArea, styles.mapAreaTwo]} />
              {routePreviewSegments.map((segment) => (
                <View
                  key={segment.id}
                  style={[
                    styles.routeSegment,
                    {
                      left: segment.left,
                      top: segment.top,
                      transform: [{ rotate: segment.rotate }],
                      width: segment.width,
                    },
                  ]}
                />
              ))}
              {snapshot.pins.map((pin) => {
                const position = coordinateToPreviewPosition(pin.coordinates.latitude, pin.coordinates.longitude);

                return (
                <View
                  key={pin.pointId}
                  style={[
                    styles.mapMarker,
                    pin.color === 'gray' ? styles.unscheduledMarker : styles.scheduledMarker,
                    { left: position.left, top: position.top },
                  ]}
                >
                  <Text style={styles.mapMarkerText}>{pin.label ?? ''}</Text>
                </View>
                );
              })}
            </View>
          </Pressable>
        )}
        <View style={styles.mapLegend}>
          <Text style={styles.mapLegendTitle}>Легенда</Text>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, styles.legendNoDayDot]} />
            <Text style={styles.mapLegendText}>Серые - без дня</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, styles.legendDayDot]} />
            <Text style={styles.mapLegendText}>Красные - точки выбранного дня</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendRouteLine} />
            <Text style={styles.mapLegendText}>Синяя линия - route geometry</Text>
          </View>
        </View>
      </View>

      <View style={styles.addPointPanel}>
        <Text style={styles.addPointTitle}>Поиск и добавление места</Text>
        <Text style={styles.addPointHint}>
          Это prototype: подсказки только из local/mock списка Грузии. Production online search подключим после provider proof.
        </Text>
        <TextInput
          style={styles.textInput}
          onChangeText={updateAddQuery}
          placeholder="Искать место в локальном mock по Грузии"
          placeholderTextColor="#8b9489"
          value={addQuery}
        />
        <View style={styles.dayPicker}>
          {pointDayOptions.map((day) => {
            const isActive = addDay === day;

            return (
              <TouchableOpacity
                key={day}
                style={[styles.dayPickerButton, isActive && styles.activeDayPickerButton]}
                onPress={() => setAddDay(day)}
              >
                <Text style={[styles.dayPickerText, isActive && styles.activeDayPickerText]}>{day}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.suggestionSection}>
          <Text style={styles.suggestionLabel}>Локальные подсказки по Грузии</Text>
          {shownSuggestions.length > 0 ? (
            <View style={styles.suggestionList}>
              {shownSuggestions.map((suggestion) => {
                const isSelected = selectedSuggestionId === suggestion.id;

                return (
                  <TouchableOpacity
                    key={suggestion.id}
                    style={[styles.suggestionCard, isSelected && styles.activeSuggestionCard]}
                    onPress={() => selectSuggestion(suggestion)}
                  >
                    <View style={styles.placeText}>
                      <Text style={styles.placeTitle}>{suggestion.title}</Text>
                      <Text style={styles.placeMeta}>{suggestion.address}</Text>
                    </View>
                    <Text style={[styles.suggestionCountry, isSelected && styles.activeSuggestionCountry]}>
                      GE
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <Text style={styles.emptySuggestionText}>По локальным местам Грузии ничего не найдено. Можно сохранить как текстовую заметку.</Text>
          )}
        </View>

        <View style={styles.coordinateBox}>
          <Text style={styles.coordinateText}>
            {draftCoordinates
              ? `${draftCoordinates.latitude.toFixed(5)}, ${draftCoordinates.longitude.toFixed(5)}`
              : selectedSuggestion
                ? `${selectedSuggestion.latitude.toFixed(5)}, ${selectedSuggestion.longitude.toFixed(5)}`
                : 'Тап по карте добавит координаты; без координат место сохранится только в списке'}
          </Text>
          {draftCoordinates && !draftCoordinateInsideGeorgia ? (
            <Text style={styles.errorText}>Эта точка вне MVP-карты Грузии. Сохраним как текстовую заметку без пина.</Text>
          ) : null}
        </View>

        <View style={styles.addPlaceActions}>
          {draftCoordinates ? (
            <TouchableOpacity style={styles.secondaryOutlineButton} onPress={() => setDraftCoordinates(null)}>
              <Text style={styles.secondaryOutlineButtonText}>Очистить координаты</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={[styles.savePointButton, !canSaveAddPlace && styles.disabledButton]}
            disabled={!canSaveAddPlace}
            onPress={saveAddPlace}
          >
            <Text style={styles.savePointButtonText}>
              {selectedSuggestion || (draftCoordinates && draftCoordinateInsideGeorgia) ? 'Сохранить место' : 'Сохранить текстом'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapNotice}>
        <Text style={styles.mapNoticeTitle}>Сейчас это прототип карты</Text>
        <Text style={styles.mapNoticeText}>
          Подсказки берутся только из локальных фикстур Грузии. Route line строится из domain RouteGeometry/mock provider geometry, без прямой линии между точками.
        </Text>
      </View>

      {selectedDayId && (
        <View style={styles.routeStatusPanel}>
          <View style={styles.routeStatusHeader}>
            <View>
              <Text style={styles.routeStatusTitle}>{dayLabelForId(selectedDayId, days)}: {routeStatusCopy}</Text>
              <Text style={styles.routeStatusText}>
                {snapshot.routeGeometry
                  ? 'Показана mock route для прототипа, не ETA и не traffic.'
                  : 'Линия маршрута не рисуется как success без route geometry.'}
              </Text>
            </View>
            <TouchableOpacity style={styles.secondaryOutlineButton} onPress={() => onRefreshRoute(selectedDayId)}>
              <Text style={styles.secondaryOutlineButtonText}>Обновить mock route</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{selectedDayId ? 'Порядок дня' : 'Точки на карте'}</Text>
        <Text style={styles.sectionMeta}>{visibleCards.length}</Text>
      </View>
      <View style={styles.placeList}>
        {snapshot.cards.map((card, index) => (
          <MapPlaceCard
            key={card.pointId}
            card={card}
            isFirst={index === 0}
            isLast={index === snapshot.cards.length - 1}
            mode={mode}
            onAssignPlaceToDay={onAssignPlaceToDay}
            onMoveDayCard={onMoveDayCard}
            place={places.find((candidate) => candidate.id === card.pointId) ?? null}
            tripDays={days}
          />
        ))}
      </View>

      {snapshot.emptyState && (
        <View style={styles.mapNotice}>
          <Text style={styles.mapNoticeTitle}>Пока пусто</Text>
          <Text style={styles.mapNoticeText}>Добавьте место через локальный mock-поиск или текстом.</Text>
        </View>
      )}
    </>
  );
}

function MapPlaceCard({
  card,
  isFirst,
  isLast,
  mode,
  onAssignPlaceToDay,
  onMoveDayCard,
  place,
  tripDays,
}: {
  card: MapCardView;
  isFirst: boolean;
  isLast: boolean;
  mode: MapMode;
  onAssignPlaceToDay: (placeId: string, dayId: DayId) => void;
  onMoveDayCard: (dayId: DayId, pointId: string, direction: -1 | 1) => void;
  place: Place | null;
  tripDays: TripDay[];
}) {
  const dayId = mode.kind === 'day' ? mode.dayId : null;
  const lastDragDirection = useRef<0 | -1 | 1>(0);
  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => Boolean(dayId) && Math.abs(gestureState.dy) > 8,
    onPanResponderGrant: () => {
      lastDragDirection.current = 0;
    },
    onPanResponderMove: (_, gestureState) => {
      if (!dayId) {
        return;
      }

      const direction = gestureState.dy < -42 ? -1 : gestureState.dy > 42 ? 1 : 0;
      if (direction === 0 || direction === lastDragDirection.current) {
        return;
      }
      if ((direction === -1 && isFirst) || (direction === 1 && isLast)) {
        return;
      }

      lastDragDirection.current = direction;
      onMoveDayCard(dayId, card.pointId, direction);
    },
    onPanResponderRelease: () => {
      lastDragDirection.current = 0;
    },
    onPanResponderTerminate: () => {
      lastDragDirection.current = 0;
    },
  }), [card.pointId, dayId, isFirst, isLast, onMoveDayCard]);
  const coordinatesCopy = place?.coordinates
    ? `${place.coordinates.latitude.toFixed(5)}, ${place.coordinates.longitude.toFixed(5)}`
    : 'координаты нужно уточнить';
  const dayCopy = card.dayId ? dayLabelForId(card.dayId, tripDays) : 'Без дня';

  return (
    <View style={[styles.placeCard, dayId && styles.draggablePlaceCard]} {...(dayId ? panResponder.panHandlers : {})}>
      {card.kind === 'place' ? (
        <View style={[styles.placeNumber, !card.dayId && styles.unscheduledPlaceNumber]}>
          <Text style={styles.placeNumberText}>{card.routeOrder ?? ''}</Text>
        </View>
      ) : (
        <View style={styles.missingDot} />
      )}
      <View style={styles.placeText}>
        <Text style={styles.placeTitle}>{card.title}</Text>
        <Text style={styles.placeMeta}>
          {dayCopy} - {coordinatesCopy}{dayId ? ' - потяните карточку, чтобы изменить порядок' : ''}
        </Text>
      </View>
      {dayId && (
        <View style={styles.dragHandle}>
          <Text style={styles.dragHandleText}>☰</Text>
        </View>
      )}
      {!card.dayId && tripDays.length > 0 ? (
        <View style={styles.assignDayActions}>
          {tripDays.map((day) => (
            <TouchableOpacity key={day.id} style={styles.assignDayButton} onPress={() => onAssignPlaceToDay(card.pointId, day.id)}>
              <Text style={styles.assignDayButtonText}>В {day.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function buildLeafletMapHtml(pins: MapPin[], routeGeometry: RouteGeometrySnapshot | null) {
  const mapPoints = pins.map((pin) => ({
    label: pin.label ?? '',
    lat: pin.coordinates.latitude,
    lng: pin.coordinates.longitude,
    markerColor: pin.color === 'gray' ? '#5f6770' : '#d92d20',
    title: pin.title,
  }));
  const routeCoordinates = routeGeometry?.coordinates.map((coordinate) => [
    coordinate.latitude,
    coordinate.longitude,
  ]) ?? [];
  const encodedPoints = JSON.stringify(mapPoints).replace(/</g, '\\u003c');
  const encodedRoute = JSON.stringify(routeCoordinates).replace(/</g, '\\u003c');

  return `
<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
  <style>
    html, body, #map { height: 100%; margin: 0; width: 100%; }
    .leaflet-container { background: #dce7db; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .leaflet-popup-content { color: #1d261f; font-size: 13px; line-height: 1.35; margin: 10px 12px; }
    .trip-pin {
      align-items: center;
      background: #e6563f;
      border: 3px solid #fff;
      border-radius: 999px;
      color: #fff;
      display: flex;
      font-size: 12px;
      font-weight: 900;
      height: 24px;
      justify-content: center;
      width: 24px;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const points = ${encodedPoints};
    const routeLatlngs = ${encodedRoute};
    const fallbackCenter = [41.695, 44.802];
    const map = L.map('map', { zoomControl: true }).setView(fallbackCenter, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    const latlngs = [];
    points.forEach((point, index) => {
      if (typeof point.lat !== 'number' || typeof point.lng !== 'number') return;
      const latlng = [point.lat, point.lng];
      latlngs.push(latlng);
      const icon = L.divIcon({
        className: '',
        html: '<div class="trip-pin" style="background:' + point.markerColor + '">' + point.label + '</div>',
        iconAnchor: [15, 15],
        iconSize: [30, 30],
        popupAnchor: [0, -16]
      });
      L.marker(latlng, { icon })
        .bindPopup('<strong>' + point.title + '</strong>')
        .addTo(map);
    });

    if (routeLatlngs.length > 1) {
      L.polyline(routeLatlngs, { color: '#2563eb', opacity: 0.9, weight: 5 }).addTo(map);
      routeLatlngs.forEach((latlng) => latlngs.push(latlng));
    }

    map.on('click', (event) => {
      window.parent.postMessage({
        type: 'trip-map-click',
        latitude: event.latlng.lat,
        longitude: event.latlng.lng
      }, '*');
    });

    if (latlngs.length > 1) {
      map.fitBounds(latlngs, { padding: [36, 36], maxZoom: 16 });
    } else if (latlngs.length === 1) {
      map.setView(latlngs[0], 16);
    }
  </script>
</body>
</html>
`;
}

function normalizeSuggestionText(value: string) {
  return value.trim().toLocaleLowerCase('ru-RU');
}

function coordinateToPreviewPosition(latitude: number, longitude: number) {
  const position = coordinateToPreviewPositionNumbers(latitude, longitude);

  return {
    left: `${Math.round(position.left)}%` as `${number}%`,
    top: `${Math.round(position.top)}%` as `${number}%`,
  };
}

function coordinateToPreviewPositionNumbers(latitude: number, longitude: number) {
  const left = clamp(50 + (longitude - 44.802) * 800, 18, 82);
  const top = clamp(50 - (latitude - 41.695) * 800, 18, 82);

  return {
    left,
    top,
  };
}

function previewPositionToCoordinate(leftPercent: number, topPercent: number) {
  return {
    latitude: 41.695 - (topPercent - 50) / 800,
    longitude: 44.802 + (leftPercent - 50) / 800,
  };
}

function isInsideGeorgiaCoordinate(coordinates: { latitude: number; longitude: number }) {
  return (
    coordinates.latitude >= 41.0 &&
    coordinates.latitude <= 43.8 &&
    coordinates.longitude >= 40.0 &&
    coordinates.longitude <= 46.8
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function mapFilterToMode(filter: MapFilter, days: TripDay[]): MapMode {
  if (filter === 'Все') {
    return { kind: 'all' };
  }
  if (filter === 'Без дня') {
    return { kind: 'no_day' };
  }
  return { kind: 'day', dayId: dayIdForLabel(filter, days) };
}

function dayIdForLabel(label: Exclude<MapDay, 'Без дня'>, days: TripDay[]) {
  return days.find((day) => day.label === label)?.id ?? `day-${days.length + 1}`;
}

function dayLabelForId(dayId: DayId, days: TripDay[]) {
  return days.find((day) => day.id === dayId)?.label ?? `День ${dayId.replace('day-', '')}`;
}

function buildMockRoutePlan(
  routingProvider: MockRoutingProvider,
  places: Place[],
  dayItems: DayItem[],
  dayId: DayId,
): RoutePlan | null {
  const waypoints = buildRouteWaypointsFromDayItems(places, dayItems, dayId);

  if (waypoints.length < 2) {
    return null;
  }

  return {
    dayId,
    profile: routeProfile,
    inputHash: buildRouteInputHash(dayId, routeProfile, waypoints),
    status: 'ready',
    geometry: routingProvider.calculateRoute({ profile: routeProfile, waypoints }),
    failureReason: null,
    provider: routingProvider.provider,
  };
}

function replaceRoutePlan(routePlans: RoutePlan[], nextPlan: RoutePlan | null) {
  if (!nextPlan) {
    return routePlans;
  }

  return [
    ...routePlans.filter((plan) => plan.dayId !== nextPlan.dayId || plan.profile !== nextPlan.profile),
    nextPlan,
  ];
}

function getRouteStatusCopy(
  routeState: RouteStateSnapshot | null,
  routeGeometry: RouteGeometrySnapshot | null,
) {
  if (!routeState) {
    return 'В режиме Все route line не показывается';
  }
  if (routeState.failureReason === 'insufficient_waypoints') {
    return 'недостаточно точек';
  }
  if (routeState.status === 'ready' && routeGeometry?.source === 'routing_provider_mock') {
    return 'маршрут рассчитан - mock route для прототипа';
  }
  if (routeState.status === 'ready') {
    return 'маршрут рассчитан';
  }

  return 'маршрут нужно обновить онлайн';
}

function buildRoutePreviewSegments(coordinates: Coordinates[]) {
  return coordinates.slice(1).map((coordinate, index) => {
    const previous = coordinateToPreviewPositionNumbers(
      coordinates[index].latitude,
      coordinates[index].longitude,
    );
    const current = coordinateToPreviewPositionNumbers(coordinate.latitude, coordinate.longitude);
    const deltaX = current.left - previous.left;
    const deltaY = current.top - previous.top;
    const width = Math.max(4, Math.sqrt(deltaX * deltaX + deltaY * deltaY));

    return {
      id: `route-preview-${index}`,
      left: `${previous.left}%` as `${number}%`,
      top: `${previous.top}%` as `${number}%`,
      rotate: `${Math.atan2(deltaY, deltaX) * (180 / Math.PI)}deg`,
      width: `${width}%` as `${number}%`,
    };
  });
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f7f4',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerText: {
    flex: 1,
  },
  tripLabel: {
    color: '#657063',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  tripTitle: {
    color: '#1d261f',
    fontSize: 29,
    fontWeight: '800',
  },
  tripDates: {
    color: '#657063',
    fontSize: 16,
    marginTop: 4,
  },
  modeBadge: {
    backgroundColor: '#d8eadb',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  modeText: {
    color: '#1f6b3a',
    fontSize: 13,
    fontWeight: '700',
  },
  statusPanel: {
    backgroundColor: '#ffffff',
    borderColor: '#dce3da',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
    padding: 14,
  },
  statusTitle: {
    color: '#1d261f',
    fontSize: 15,
    fontWeight: '800',
  },
  statusText: {
    color: '#657063',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  tabs: {
    backgroundColor: '#e7ece5',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    marginBottom: 16,
    padding: 4,
  },
  tab: {
    alignItems: 'center',
    borderRadius: 6,
    flex: 1,
    paddingVertical: 10,
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    color: '#657063',
    fontSize: 15,
    fontWeight: '700',
  },
  activeTabText: {
    color: '#1d261f',
  },
  nextPanel: {
    backgroundColor: '#233528',
    borderRadius: 8,
    marginBottom: 14,
    padding: 18,
  },
  sectionLabel: {
    color: '#b8cbbd',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  nextTime: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '800',
  },
  nextTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  nextMeta: {
    color: '#dce8df',
    fontSize: 15,
    lineHeight: 21,
    marginTop: 6,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 7,
    marginTop: 16,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#1d261f',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#243126',
    borderRadius: 7,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  quickButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#dce3da',
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: '30%',
    flexGrow: 1,
    paddingVertical: 14,
  },
  quickButtonText: {
    color: '#243126',
    fontSize: 15,
    fontWeight: '800',
  },
  mapHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mapModeGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  mapModeCard: {
    backgroundColor: '#ffffff',
    borderColor: '#dce3da',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 12,
  },
  mapModeTitle: {
    color: '#1d261f',
    fontSize: 14,
    fontWeight: '800',
  },
  mapModeText: {
    color: '#657063',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  mapToolbar: {
    gap: 10,
    marginBottom: 12,
  },
  filterTabs: {
    backgroundColor: '#e7ece5',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  filterTab: {
    alignItems: 'center',
    borderRadius: 6,
    flex: 1,
    paddingVertical: 9,
  },
  addDayFilterButton: {
    alignItems: 'center',
    backgroundColor: '#243126',
    borderRadius: 6,
    minWidth: 74,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  addDayFilterText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  activeFilterTab: {
    backgroundColor: '#ffffff',
  },
  filterText: {
    color: '#657063',
    fontSize: 14,
    fontWeight: '800',
  },
  activeFilterText: {
    color: '#1d261f',
  },
  zoomControls: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderColor: '#dce3da',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  zoomButton: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    width: 42,
  },
  zoomButtonText: {
    color: '#1d261f',
    fontSize: 22,
    fontWeight: '900',
  },
  zoomValue: {
    color: '#657063',
    fontSize: 13,
    fontWeight: '800',
    minWidth: 48,
    textAlign: 'center',
  },
  mapCanvas: {
    aspectRatio: 0.9,
    backgroundColor: '#dce7db',
    borderColor: '#cbd8c9',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  mapLayer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  mapRoad: {
    backgroundColor: '#eef4ec',
    borderRadius: 999,
    position: 'absolute',
  },
  mapRoadMain: {
    height: 22,
    left: '-10%',
    top: '52%',
    transform: [{ rotate: '-18deg' }],
    width: '120%',
  },
  mapRoadSide: {
    height: 16,
    left: '22%',
    top: '18%',
    transform: [{ rotate: '58deg' }],
    width: '78%',
  },
  mapArea: {
    backgroundColor: '#cfe1cf',
    borderRadius: 8,
    position: 'absolute',
  },
  mapAreaOne: {
    height: '28%',
    left: '8%',
    top: '12%',
    width: '32%',
  },
  mapAreaTwo: {
    height: '22%',
    right: '9%',
    top: '62%',
    width: '36%',
  },
  mapMarker: {
    alignItems: 'center',
    borderColor: '#ffffff',
    borderRadius: 999,
    borderWidth: 3,
    height: 28,
    justifyContent: 'center',
    marginLeft: -14,
    marginTop: -14,
    position: 'absolute',
    width: 28,
  },
  scheduledMarker: {
    backgroundColor: '#d92d20',
  },
  unscheduledMarker: {
    backgroundColor: '#5f6770',
  },
  routeSegment: {
    backgroundColor: '#2563eb',
    borderRadius: 999,
    height: 6,
    opacity: 0.9,
    position: 'absolute',
  },
  mapMarkerText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  mapLegend: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    bottom: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    position: 'absolute',
    right: 12,
  },
  legendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 5,
  },
  legendDot: {
    borderColor: '#ffffff',
    borderRadius: 999,
    borderWidth: 2,
    height: 14,
    width: 14,
  },
  legendNoDayDot: {
    backgroundColor: '#5f6770',
  },
  legendDayDot: {
    backgroundColor: '#d92d20',
  },
  legendRouteLine: {
    backgroundColor: '#2563eb',
    borderRadius: 999,
    height: 5,
    width: 22,
  },
  mapLegendTitle: {
    color: '#1d261f',
    fontSize: 13,
    fontWeight: '800',
  },
  mapLegendText: {
    color: '#657063',
    fontSize: 13,
  },
  mapNotice: {
    backgroundColor: '#fff8df',
    borderColor: '#eadca3',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 18,
    padding: 14,
  },
  mapNoticeTitle: {
    color: '#3e3215',
    fontSize: 15,
    fontWeight: '800',
  },
  mapNoticeText: {
    color: '#6d613d',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  routeStatusPanel: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    padding: 14,
  },
  routeStatusHeader: {
    alignItems: 'flex-start',
    gap: 10,
  },
  routeStatusTitle: {
    color: '#1e3a8a',
    fontSize: 15,
    fontWeight: '900',
  },
  routeStatusText: {
    color: '#334155',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  mapSubtitle: {
    color: '#566357',
    fontSize: 14,
    marginTop: 3,
  },
  addPointPanel: {
    backgroundColor: '#ffffff',
    borderColor: '#dce3da',
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    marginBottom: 16,
    padding: 14,
  },
  suggestionSection: {
    gap: 8,
  },
  suggestionLabel: {
    color: '#657063',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  suggestionList: {
    gap: 8,
  },
  suggestionCard: {
    alignItems: 'center',
    backgroundColor: '#f5f7f4',
    borderColor: '#dce3da',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 10,
  },
  activeSuggestionCard: {
    backgroundColor: '#e4f0e5',
    borderColor: '#2b7344',
  },
  suggestionCountry: {
    color: '#657063',
    fontSize: 13,
    fontWeight: '900',
  },
  activeSuggestionCountry: {
    color: '#1f6b3a',
  },
  emptySuggestionText: {
    color: '#657063',
    fontSize: 13,
    lineHeight: 18,
  },
  errorText: {
    color: '#9b3a2f',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  addPointTitle: {
    color: '#1d261f',
    fontSize: 18,
    fontWeight: '800',
  },
  addPointHint: {
    color: '#657063',
    fontSize: 13,
    lineHeight: 18,
  },
  coordinateBox: {
    backgroundColor: '#f5f7f4',
    borderColor: '#dce3da',
    borderRadius: 7,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  coordinateText: {
    color: '#566357',
    fontSize: 13,
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderColor: '#cdd8cb',
    borderRadius: 7,
    borderWidth: 1,
    color: '#1d261f',
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  dayPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayPickerButton: {
    backgroundColor: '#eef2ec',
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  activeDayPickerButton: {
    backgroundColor: '#243126',
  },
  dayPickerText: {
    color: '#657063',
    fontSize: 13,
    fontWeight: '800',
  },
  activeDayPickerText: {
    color: '#ffffff',
  },
  addPlaceActions: {
    alignItems: 'stretch',
    gap: 8,
  },
  secondaryOutlineButton: {
    alignItems: 'center',
    borderColor: '#cdd8cb',
    borderRadius: 7,
    borderWidth: 1,
    paddingVertical: 11,
  },
  secondaryOutlineButtonText: {
    color: '#243126',
    fontSize: 14,
    fontWeight: '900',
  },
  savePointButton: {
    alignItems: 'center',
    backgroundColor: '#2b7344',
    borderRadius: 7,
    paddingVertical: 12,
  },
  disabledButton: {
    backgroundColor: '#aeb8ab',
  },
  savePointButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#1d261f',
    fontSize: 21,
    fontWeight: '800',
  },
  sectionAction: {
    color: '#2b7344',
    fontSize: 16,
    fontWeight: '800',
  },
  sectionMeta: {
    color: '#657063',
    fontSize: 15,
    fontWeight: '800',
  },
  timeline: {
    gap: 10,
    marginBottom: 18,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineTime: {
    color: '#657063',
    fontSize: 14,
    fontWeight: '800',
    paddingTop: 14,
    width: 52,
  },
  timelineCard: {
    backgroundColor: '#ffffff',
    borderColor: '#dce3da',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 14,
  },
  timelineType: {
    color: '#6b756b',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  timelineTitle: {
    color: '#1d261f',
    fontSize: 16,
    fontWeight: '800',
  },
  detailsRow: {
    gap: 10,
  },
  detailCard: {
    backgroundColor: '#ffffff',
    borderColor: '#dce3da',
    borderRadius: 8,
    borderWidth: 1,
    padding: 15,
  },
  detailLabel: {
    color: '#657063',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  detailTitle: {
    color: '#1d261f',
    fontSize: 17,
    fontWeight: '800',
  },
  detailMeta: {
    color: '#657063',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  placeList: {
    gap: 10,
    marginBottom: 18,
  },
  placeCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#dce3da',
    borderRadius: 8,
    borderWidth: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 12,
    padding: 13,
  },
  draggablePlaceCard: {
    borderColor: '#bfdbfe',
  },
  placeNumber: {
    alignItems: 'center',
    backgroundColor: '#d92d20',
    borderRadius: 999,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  unscheduledPlaceNumber: {
    backgroundColor: '#5f6770',
  },
  placeNumberText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  missingDot: {
    backgroundColor: '#a3aaa1',
    borderRadius: 999,
    height: 14,
    marginHorizontal: 7,
    width: 14,
  },
  placeText: {
    flex: 1,
  },
  placeTitle: {
    color: '#1d261f',
    fontSize: 16,
    fontWeight: '800',
  },
  placeMeta: {
    color: '#657063',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
  dragHandle: {
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderColor: '#c7d2fe',
    borderRadius: 6,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  dragHandleText: {
    color: '#1d4ed8',
    fontSize: 18,
    fontWeight: '900',
  },
  assignDayActions: {
    flexBasis: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingLeft: 40,
  },
  assignDayButton: {
    backgroundColor: '#eef2ff',
    borderColor: '#c7d2fe',
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  assignDayButtonText: {
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: '900',
  },
  dayList: {
    gap: 10,
  },
  dayCard: {
    backgroundColor: '#ffffff',
    borderColor: '#dce3da',
    borderRadius: 8,
    borderWidth: 1,
    padding: 15,
  },
  dayCardContent: {
    gap: 12,
  },
  dayCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayPlanList: {
    gap: 8,
  },
  dayPlanRow: {
    alignItems: 'flex-start',
    backgroundColor: '#f5f7f4',
    borderColor: '#dce3da',
    borderRadius: 7,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    padding: 10,
  },
  dayPlanNumber: {
    backgroundColor: '#d92d20',
    borderRadius: 999,
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    height: 24,
    lineHeight: 24,
    overflow: 'hidden',
    textAlign: 'center',
    width: 24,
  },
  dayPlanTitle: {
    color: '#1d261f',
    fontSize: 14,
    fontWeight: '800',
  },
  dayPlanMeta: {
    color: '#657063',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  deleteDayButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  deleteDayButtonText: {
    color: '#be123c',
    fontSize: 12,
    fontWeight: '900',
  },
  dayTitle: {
    color: '#1d261f',
    fontSize: 18,
    fontWeight: '800',
  },
  dayMeta: {
    color: '#657063',
    fontSize: 14,
    marginTop: 4,
  },
  dayCount: {
    color: '#2b7344',
    fontSize: 20,
    fontWeight: '900',
  },
});
