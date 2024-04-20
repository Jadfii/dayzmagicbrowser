import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as serverSchema from '../../drizzle/schema/server';
import * as islandSchema from '../../drizzle/schema/island';

const connection = neon(process.env.DATABASE_URL as string);

const db = drizzle(connection, { schema: { ...serverSchema, ...islandSchema }, logger: true });

export { db };
