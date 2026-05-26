export type StriperSeason = {
  id: string;
  months: number[];
  title: string;
  status: string;
  baits: string[];
  notes: string[];
};

export type StationStriperNote = {
  stationId: string;
  areaType: string;
  localRead: string;
  tideTip: string;
};

export const STRIPER_SEASONS: StriperSeason[] = [
  {
    id: 'winter',
    months: [1, 2],
    title: 'Winter Holdover Mode',
    status: 'Cold water. Slower fishing. Look for deeper holes, warm discharges, and patient presentations.',
    baits: ['Small soft plastics', 'Bucktails', 'Slow jigs', 'Bloodworms if fish are feeding'],
    notes: [
      'Move slow and keep expectations realistic.',
      'Warmer afternoons can matter more than sunrise.',
      'Small bait and slow retrieves usually beat loud presentations.',
    ],
  },
  {
    id: 'spring',
    months: [3, 4],
    title: 'Spring Run Building',
    status: 'Migration and spawning activity starts building through the river system.',
    baits: ['Bloodworms', 'Fresh bunker', 'Clams', 'Paddletails'],
    notes: [
      'Moving water around tide changes is the main thing to watch.',
      'Creek mouths and warmer shallows can turn on fast.',
      'Check current regulations before targeting stripers.',
    ],
  },
  {
    id: 'peak',
    months: [5],
    title: 'Peak Spring / Post-Spawn Movement',
    status: 'This is prime time for bigger movement through the Delaware River system.',
    baits: ['Bunker chunks', 'Bloodworms', 'Large paddletails', 'Plugs near active bait'],
    notes: [
      'The best bite can be short and tied to tide movement.',
      'Look for bait, birds, current seams, and cleaner moving water.',
      'Handle big fish carefully and release them fast if required.',
    ],
  },
  {
    id: 'summer',
    months: [6, 7, 8],
    title: 'Summer Resident Pattern',
    status: 'Warmer water. Think low light, night tides, bridges, shadows, and smaller bait.',
    baits: ['Small plugs', 'Soft plastics', 'Paddletails', 'Live or fresh bait where legal'],
    notes: [
      'Night fishing and first/last light usually matter more.',
      'Oxygen, current, and shade become important.',
      'Smaller resident fish may be more active than migrators.',
    ],
  },
  {
    id: 'fall',
    months: [9, 10],
    title: 'Fall Feed Building',
    status: 'Bait movement starts mattering more. Watch for bunker, mullet, rain bait, and birds.',
    baits: ['Paddletails', 'Topwater plugs', 'Bunker', 'Swimming plugs'],
    notes: [
      'Moving bait can make the river light up quickly.',
      'Cover water and watch the surface.',
      'Falling temps can trigger aggressive feeding windows.',
    ],
  },
  {
    id: 'latefall',
    months: [11, 12],
    title: 'Fall Migration / Winter Transition',
    status: 'Late-season fish move through and hold where bait, depth, and current line up.',
    baits: ['Soft plastics', 'Jigs', 'Swimming plugs', 'Bunker if bait is present'],
    notes: [
      'Cold fronts can slow things down fast.',
      'Look for deeper edges and slower presentations.',
      'Good windows may be short, so tide timing matters.',
    ],
  },
];

export const STATION_STRIPER_NOTES: StationStriperNote[] = [
  {
    stationId: '8538369',
    areaType: 'Creek mouth / upper river staging water',
    localRead: 'Pedricktown and Oldmans Creek are useful for watching creek-mouth movement and spring river patterns.',
    tideTip: 'Pay close attention to the first hard movement after slack water.',
  },
  {
    stationId: '8538449',
    areaType: 'Raccoon Creek / South Jersey river edge',
    localRead: 'Bridgeport is a good local read for creek influence, bait movement, and South Jersey-side current.',
    tideTip: 'Moving water around the tide change is usually more important than the exact clock time.',
  },
  {
    stationId: '8538512',
    areaType: 'Mantua Creek / industrial river stretch',
    localRead: 'Paulsboro gives a strong read on the Mantua Creek and lower South Jersey industrial stretch.',
    tideTip: 'Watch current seams, structure, and cleaner water during stronger tide movement.',
  },
  {
    stationId: '8538752',
    areaType: 'Cooper River / Camden influence',
    localRead: 'Pavonia is more urban and structure-heavy, useful for warmwater influence and river edge patterns.',
    tideTip: 'Shade, bridges, and nighttime moving water can matter here.',
  },
  {
    stationId: '8545240',
    areaType: 'Upper tidal Delaware River',
    localRead: 'Philadelphia is a broad upper-river reference point for the tidal Delaware.',
    tideTip: 'Compare this station against the creek stations to understand timing upriver.',
  },
  {
    stationId: '8537979',
    areaType: 'Salem River / lower South Jersey tidal creek',
    localRead: 'Salem gives a good read on Salem River timing, creek-mouth movement, and lower South Jersey striper patterns.',
    tideTip: 'Watch the moving water around the creek mouth and avoid judging the bite only by the clock.',
  },
  {
    stationId: '8537753',
    areaType: 'Alloway Creek / Hancocks Bridge tidal water',
    localRead: 'Hancocks Bridge is useful for Alloway Creek timing, spring bait movement, and lower Salem County river patterns.',
    tideTip: 'Creek tides can lag and swing differently, so use the tide change as a window, not a guarantee.',
  },
  {
    stationId: '8551762',
    areaType: 'Lower river / upper bay transition',
    localRead: 'Delaware City is useful for tracking lower-river and upper-bay movement.',
    tideTip: 'This stretch can hint at fish moving between bay water and river water.',
  },
  {
    stationId: '8551910',
    areaType: 'Reedy Point / C&D Canal transition',
    localRead: 'Reedy Point is a bigger-water migration highway read near the C&D Canal.',
    tideTip: 'Big moving water and bait presence are the key tells here.',
  },
];

export const REPORT_LINKS = [
  {
    title: 'DNREC Delaware Fishing Report',
    url: 'https://dnrec.delaware.gov/fish-wildlife/fishing-report/',
  },
  {
    title: 'On The Water Striper Migration Map',
    url: 'https://onthewater.com/striper-migration-map',
  },
  {
    title: 'NJDEP Delaware River Striped Bass Info',
    url: 'https://dep.nj.gov/njfw/fishing/marine/delaware-river-striped-bass-recruitment-seine-survey/',
  },
];

export function getCurrentStriperSeason(date = new Date()) {
  const month = date.getMonth() + 1;
  return STRIPER_SEASONS.find((season) => season.months.includes(month)) ?? STRIPER_SEASONS[0];
}

export function getStriperNoteForStation(stationId: string) {
  return STATION_STRIPER_NOTES.find((note) => note.stationId === stationId);
}
