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
