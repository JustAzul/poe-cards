import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { encodeLeagueName } from './league-name';

export type IndexEntry = {
  name: string,
  ladder: string,
  updatedAt: string,
};

export type ProfitTableRowDto = {
  card: {
    name: string,
    stack: number,
    chaosPrice: number,
    details: {
      artFilename: string,
      rewardName: string,
      rewardClass: string,
      isCorrupted: boolean,
      flavour: string,
    },
  },
  reward: {
    name: string,
    chaosPrice: number,
  },
  setChaosPrice: number,
  chaosProfit: number,
  isCurrency: boolean,
};

export type LeagueDataResponse = {
  data: ProfitTableRowDto[],
  currencyRates: {
    exalted: number,
    divine: number,
    annul: number,
    mirror: number,
  },
  updatedAt: string,
  entryCount: number,
};

const INDEX_OBJECT_KEY = 'index.json';

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) throw new Error(`r2-client: missing required env var ${name}`);
  return value;
}

function resolveEndpoint(): string {
  const explicitEndpoint = process.env.R2_ENDPOINT;
  if (explicitEndpoint) return explicitEndpoint;

  return `https://${requireEnv('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`;
}

function createClient(): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: resolveEndpoint(),
    credentials: {
      accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
      secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
    },
  });
}

async function streamToString(body: unknown): Promise<string> {
  // The GetObjectCommand response body's concrete shape depends on the runtime
  // (Node.js Readable vs. web ReadableStream) — the SDK typings expose it as a
  // union that doesn't statically carry `transformToString`, though every
  // runtime this app targets (Node.js server, Vercel serverless) implements it.
  // @ts-expect-error - runtime-provided helper not present on the SDK's static Body type.
  return body.transformToString();
}

function isNotFoundError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.name === 'NoSuchKey' || error.name === 'NotFound';
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidIndexEntry(value: unknown): value is IndexEntry {
  return (
    isPlainObject(value)
    && typeof value.name === 'string'
    && typeof value.ladder === 'string'
    && typeof value.updatedAt === 'string'
  );
}

function isValidIndex(value: unknown): value is IndexEntry[] {
  return Array.isArray(value) && value.every(isValidIndexEntry);
}

function isValidCurrencyRates(value: unknown): value is LeagueDataResponse['currencyRates'] {
  return (
    isPlainObject(value)
    && typeof value.exalted === 'number'
    && typeof value.divine === 'number'
    && typeof value.annul === 'number'
    && typeof value.mirror === 'number'
  );
}

function isValidLeagueDataResponse(value: unknown): value is LeagueDataResponse {
  return (
    isPlainObject(value)
    && Array.isArray(value.data)
    && isValidCurrencyRates(value.currencyRates)
    && typeof value.updatedAt === 'string'
    && typeof value.entryCount === 'number'
  );
}

async function getObjectRaw(bucket: string, key: string): Promise<unknown | null> {
  const client = createClient();

  try {
    const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const body = await streamToString(response.Body);

    return JSON.parse(body);
  } catch (error: unknown) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
}

export async function getIndex(): Promise<IndexEntry[]> {
  const bucket = requireEnv('R2_BUCKET');
  const raw = await getObjectRaw(bucket, INDEX_OBJECT_KEY);

  if (raw === null) return [];

  if (!isValidIndex(raw)) {
    // eslint-disable-next-line no-console
    console.warn(`r2-client: ${INDEX_OBJECT_KEY} failed shape validation — returning empty index`);
    return [];
  }

  return raw;
}

export async function getLeague(name: string): Promise<LeagueDataResponse | null> {
  const bucket = requireEnv('R2_BUCKET');
  const key = `leagues/${encodeLeagueName(name)}.json`;
  const raw = await getObjectRaw(bucket, key);

  if (raw === null) return null;

  if (!isValidLeagueDataResponse(raw)) {
    // eslint-disable-next-line no-console
    console.warn(`r2-client: ${key} failed shape validation — treating as not found`);
    return null;
  }

  return raw;
}
