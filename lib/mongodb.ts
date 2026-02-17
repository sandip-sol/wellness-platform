import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/safespace';
const DB_NAME = 'safespace';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// Cache on globalThis so the connection survives Next.js hot-reloads in dev
declare global {
    var _mongoClient: MongoClient | undefined;
    var _mongoDb: Db | undefined;
}

export async function getDb(): Promise<Db> {
    // Return cached connection if available
    if (cachedDb) return cachedDb;
    if (globalThis._mongoDb) {
        cachedDb = globalThis._mongoDb;
        cachedClient = globalThis._mongoClient!;
        return cachedDb;
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);

    // Cache for re-use
    cachedClient = client;
    cachedDb = db;
    globalThis._mongoClient = client;
    globalThis._mongoDb = db;

    return db;
}
