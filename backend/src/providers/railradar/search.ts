import { Train } from '../../types/train.js';
import { config } from '../../config/env.js';

const BASE_URL = 'https://api.railradar.in/v1';

const STATION_CODE_MAP: Record<string, string[]> = {
  ndls: ['new delhi', 'delhi'],
  dli: ['old delhi', 'delhi'],
  nzm: ['hazrat nizamuddin', 'delhi', 'nizamuddin'],
  mmct: ['mumbai central', 'mumbai'],
  csmt: ['mumbai csmt', 'csmt', 'mumbai'],
  bct: ['mumbai central', 'mumbai'],
  ltt: ['lokmanya tilak', 'mumbai', 'ltt'],
  bdts: ['bandra terminus', 'mumbai'],
  hwh: ['howrah', 'kolkata'],
  sdah: ['sealdah', 'kolkata'],
  koaa: ['kolkata'],
  mas: ['chennai central', 'chennai', 'madras'],
  ms: ['chennai egmore', 'chennai'],
  sbc: ['ksr bengaluru', 'bengaluru', 'bangalore'],
  ypr: ['yesvantpur', 'bengaluru', 'bangalore'],
  smvb: ['sir m. visvesvaraya', 'bengaluru'],
  hyb: ['hyderabad', 'deccan'],
  sc: ['secunderabad', 'hyderabad'],
  kcg: ['kacheguda', 'hyderabad'],
  adi: ['ahmedabad'],
  pnbe: ['patna'],
  bsb: ['varanasi'],
  ddu: ['pt. deen dayal upadhyaya', 'mughalsarai', 'varanasi'],
  pune: ['pune'],
  lko: ['lucknow'],
  ljn: ['lucknow junction', 'lucknow'],
  cnb: ['kanpur central', 'kanpur'],
  gkp: ['gorakhpur'],
  cdg: ['chandigarh'],
  jat: ['jammu tawi', 'jammu'],
  svdk: ['shri mata vaishno devi katra', 'katra'],
  mao: ['madgaon', 'goa'],
  bpl: ['bhopal'],
  rkmp: ['rani kamlapati', 'habibganj', 'bhopal'],
  ghy: ['guwahati'],
  tvc: ['thiruvananthapuram', 'trivandrum'],
  ers: ['ernakulam', 'kochi'],
  jp: ['jaipur'],
  jai: ['jaipur'],
  agc: ['agra cantt', 'agra'],
  puri: ['puri'],
  bkn: ['bikaner'],
  asr: ['amritsar'],
  r: ['raipur'],
  nag: ['nagpur'],
  ngp: ['nagpur'],
  bsl: ['bhusaval'],
  sur: ['solapur'],
  gwal: ['gwalior'],
  gwl: ['gwalior'],
  vskp: ['visakhapatnam'],
  bza: ['vijayawada'],
};

function getHeaders() {
  return {
    'Authorization': `Bearer ${config.railRadarApiKey}`,
    'Accept': 'application/json',
  };
}

function mapTrainDetails(data: any): Train {
  const t = data.train ?? data;
  const route: any[] = data.route ?? [];
  const firstStop = route[0] ?? {};
  const lastStop = route[route.length - 1] ?? {};

  return {
    id: String(t.number),
    number: String(t.number),
    name: t.name || `Train #${t.number}`,
    type: t.type ?? inferType(t.name || ''),
    origin: {
      code: t.source?.code ?? firstStop.station?.code ?? 'NDLS',
      name: t.source?.name ?? firstStop.station?.name ?? 'New Delhi',
      city: t.source?.name,
      latitude: t.source?.lat ?? firstStop.station?.lat ?? 28.6143,
      longitude: t.source?.lng ?? firstStop.station?.lng ?? 77.2183,
      scheduledDeparture: firstStop.departure,
      distanceKm: 0,
    },
    destination: {
      code: t.destination?.code ?? lastStop.station?.code ?? 'HWH',
      name: t.destination?.name ?? lastStop.station?.name ?? 'Howrah Junction',
      city: t.destination?.name,
      latitude: t.destination?.lat ?? lastStop.station?.lat ?? 22.5851,
      longitude: t.destination?.lng ?? lastStop.station?.lng ?? 88.3415,
      scheduledArrival: lastStop.arrival,
      distanceKm: t.distance ?? lastStop.distance ?? 0,
    },
    totalDistanceKm: t.distance ?? 0,
    runsOnDays: t.runDays ?? ['Daily'],
  };
}

function inferType(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('rajdhani')) return 'Rajdhani Express';
  if (n.includes('shatabdi')) return 'Shatabdi Express';
  if (n.includes('vande bharat')) return 'Vande Bharat';
  if (n.includes('duronto')) return 'Duronto Express';
  if (n.includes('garib rath')) return 'Garib Rath';
  if (n.includes('amrit bharat')) return 'Amrit Bharat Express';
  if (n.includes('superfast') || n.includes(' sf ') || n.includes('sf express')) return 'Superfast Express';
  if (n.includes('mail')) return 'Mail Express';
  return 'Express';
}

let cachedCatalog: Record<string, string> | null = null;
let catalogFetchedAt = 0;
const CATALOG_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function getTrainCatalog(): Promise<Record<string, string> | null> {
  const now = Date.now();
  if (cachedCatalog && now - catalogFetchedAt < CATALOG_TTL) {
    return cachedCatalog;
  }

  try {
    const res = await fetch(`${BASE_URL}/lookup/trains`, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const body = await res.json() as any;
      if (body.success && body.data) {
        cachedCatalog = body.data as Record<string, string>;
        catalogFetchedAt = now;
        return cachedCatalog;
      }
    }
  } catch (_) {}

  return cachedCatalog;
}

export async function searchTrains(query: string): Promise<Train[]> {
  const cleanQuery = query
    .trim()
    .replace(/^#+/, '')
    .replace(/^train\s+/i, '')
    .trim();

  if (!cleanQuery) return [];

  const rawDigits = cleanQuery.replace(/\D/g, '');
  const isNumberQuery = rawDigits.length >= 4 && rawDigits.length <= 5 && /^\d+$/.test(cleanQuery);

  if (isNumberQuery || (rawDigits.length >= 4 && rawDigits.length <= 5 && cleanQuery === rawDigits)) {
    const trainNum = rawDigits;
    try {
      const res = await fetch(`${BASE_URL}/trains/${trainNum}`, {
        headers: getHeaders(),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const body = await res.json() as any;
        if (body.success && body.data) {
          return [mapTrainDetails(body.data)];
        }
      }
    } catch (_) {}
  }

  // Name / partial number / station search using in-memory catalog
  const catalog = await getTrainCatalog();
  if (catalog) {
    const lowerQ = cleanQuery.toLowerCase();
    const stationExpansions = STATION_CODE_MAP[lowerQ] || [];
    const searchTerms = [lowerQ, ...stationExpansions];

    const entries = Object.entries(catalog);
    const matched = entries.filter(([num, name]) => {
      const lowerName = (name as string).toLowerCase();
      if (num.includes(cleanQuery) || (rawDigits.length >= 3 && num.includes(rawDigits))) {
        return true;
      }
      return searchTerms.some((term) => lowerName.includes(term));
    }).slice(0, 12);

    if (matched.length > 0) {
      return matched.map(([num, name]) => ({
        id: num,
        number: num,
        name: name as string,
        type: inferType(name as string),
        origin: { code: '?', name: 'Check live route', latitude: 20.5937, longitude: 78.9629 },
        destination: { code: '?', name: 'Check live route', latitude: 20.5937, longitude: 78.9629 },
        totalDistanceKm: 0,
        runsOnDays: ['Daily'],
      }));
    }
  }

  // Final fallback: accept any 4-5 digit number as a valid train to look up
  if (rawDigits.length >= 4 && rawDigits.length <= 5) {
    return [{
      id: rawDigits,
      number: rawDigits,
      name: `Train #${rawDigits}`,
      type: 'Express',
      origin: { code: '?', name: 'Loading schedule...', latitude: 20.5937, longitude: 78.9629 },
      destination: { code: '?', name: 'Loading schedule...', latitude: 20.5937, longitude: 78.9629 },
      totalDistanceKm: 0,
      runsOnDays: ['Daily'],
    }];
  }

  return [];
}
