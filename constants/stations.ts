export type TideStation = {
  id: string;
  name: string;
  area: string;
  note?: string;
};

export const TIDE_STATIONS: TideStation[] = [
  {
    // Exact station from desktop Delaware Tides app.
    id: '8538369',
    name: 'Pedricktown, Oldmans Creek',
    area: 'Delaware River / Oldmans Creek',
    note: 'Primary focus station from the desktop app.',
  },
  {
    // Exact station from desktop Delaware Tides app.
    id: '8538449',
    name: 'Bridgeport, Raccoon Creek',
    area: 'Delaware River / Raccoon Creek',
    note: 'Focus station from the desktop app.',
  },
  {
    // Exact station from desktop Delaware Tides app.
    id: '8538512',
    name: 'Paulsboro, Mantua Creek',
    area: 'Delaware River / Mantua Creek',
    note: 'Focus station from the desktop app.',
  },
  {
    // Exact station from desktop Delaware Tides app.
    id: '8538752',
    name: 'Pavonia, Cooper River',
    area: 'Delaware River / Cooper River',
  },
  {
    // Exact station from desktop Delaware Tides app.
    id: '8545240',
    name: 'Philadelphia, PA',
    area: 'Delaware River',
  },
  {
    // User-facing Pennsville location using the closest practical NOAA Delaware River station.
    id: '8551762',
    name: 'Pennsville',
    area: 'Delaware River / Pennsville area',
    note: 'Uses Delaware City NOAA station as the closest lower river reference.',
  },
  {
    // NOAA CO-OPS station for Salem, NJ on the Salem River.
    id: '8537979',
    name: 'Salem',
    area: 'Salem River / Delaware River',
    note: 'Useful for Salem River timing and lower South Jersey river movement.',
  },
  {
    // NOAA CO-OPS station for Hancocks Bridge, Alloway Creek, NJ.
    id: '8537753',
    name: 'Hancocks Bridge',
    area: 'Alloway Creek / Delaware River',
    note: 'Useful for Alloway Creek and lower Salem County tide timing.',
  },
  {
    // Exact station from desktop Delaware Tides app.
    id: '8551762',
    name: 'Delaware City, DE',
    area: 'Delaware River',
  },
  {
    // Exact station from desktop Delaware Tides app.
    id: '8551910',
    name: 'Reedy Point, DE',
    area: 'Delaware River',
  },
];

export const DEFAULT_TIDE_STATION = TIDE_STATIONS[0];

export function findStationById(stationId: string) {
  return TIDE_STATIONS.find((station) => station.id === stationId);
}
