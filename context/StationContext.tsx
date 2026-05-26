import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { DEFAULT_TIDE_STATION, findStationById, type TideStation } from '@/constants/stations';

const SELECTED_STATION_STORAGE_KEY = 'jersey-tides:selected-station-id';

type StationContextValue = {
  selectedStation: TideStation;
  isStationLoading: boolean;
  selectStation: (station: TideStation) => Promise<void>;
};

const StationContext = createContext<StationContextValue | undefined>(undefined);

export function StationProvider({ children }: PropsWithChildren) {
  const [selectedStation, setSelectedStation] = useState(DEFAULT_TIDE_STATION);
  const [isStationLoading, setIsStationLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSelectedStation() {
      try {
        const storedStationId = await AsyncStorage.getItem(SELECTED_STATION_STORAGE_KEY);
        const storedStation = storedStationId ? findStationById(storedStationId) : undefined;

        if (isMounted && storedStation) {
          setSelectedStation(storedStation);
        }
      } finally {
        if (isMounted) {
          setIsStationLoading(false);
        }
      }
    }

    loadSelectedStation();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectStation = useCallback(async (station: TideStation) => {
    setSelectedStation(station);
    await AsyncStorage.setItem(SELECTED_STATION_STORAGE_KEY, station.id);
  }, []);

  const value = useMemo(
    () => ({
      selectedStation,
      isStationLoading,
      selectStation,
    }),
    [isStationLoading, selectStation, selectedStation],
  );

  return <StationContext.Provider value={value}>{children}</StationContext.Provider>;
}

export function useSelectedStation() {
  const context = useContext(StationContext);

  if (!context) {
    throw new Error('useSelectedStation must be used within StationProvider.');
  }

  return context;
}
