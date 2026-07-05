import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

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

async function getObjectJson<T>(bucket: string, key: string): Promise<T | null> {
  const client = createClient();

  try {
    const response = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const body = await streamToString(response.Body);

    return JSON.parse(body) as T;
  } catch (error: unknown) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
}

export async function getIndex(): Promise<IndexEntry[]> {
  const bucket = requireEnv('R2_BUCKET');
  const result = await getObjectJson<IndexEntry[]>(bucket, INDEX_OBJECT_KEY);

  return result ?? [];
}

export async function getLeague(name: string): Promise<LeagueDataResponse | null> {
  const bucket = requireEnv('R2_BUCKET');
  const key = `leagues/${encodeURIComponent(name)}.json`;

  return getObjectJson<LeagueDataResponse>(bucket, key);
}
