import { pgTable, timestamp, varchar, text, boolean } from 'drizzle-orm/pg-core';
import { relations, type InferSelectModel } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { server } from './server';
import { Island } from '../../src/types/Types';
import { without } from '../../src/utils/object.util';

export const island = pgTable('Island', {
  id: varchar('id', { length: 128 })
    .$defaultFn(() => randomUUID())
    .primaryKey(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  terrainId: varchar('terrainId', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 128 }).notNull(),
  description: text('description'),
  workshopId: varchar('workshopId', { length: 128 }),
  isOfficial: boolean('isOfficial').notNull(),
});

export const usersRelations = relations(island, ({ many }) => ({
  Server: many(server),
}));

export function serialiseIsland(unserialisedIsland: DbIsland): Island {
  const islandModel = without(unserialisedIsland, ['createdAt', 'updatedAt']);
  return {
    ...islandModel,
    createdAt: unserialisedIsland?.createdAt?.toISOString(),
    updatedAt: unserialisedIsland?.updatedAt?.toISOString(),
  };
}

export type DbIsland = InferSelectModel<typeof island>;
