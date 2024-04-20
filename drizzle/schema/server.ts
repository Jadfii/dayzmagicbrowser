import { pgTable, timestamp, boolean, varchar, integer, json, unique } from 'drizzle-orm/pg-core';
import { relations, type InferSelectModel } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { island, serialiseIsland } from './island';
import { Server } from '../../src/types/Types';
import { without } from '../../src/utils/object.util';

export const server = pgTable(
  'Server',
  {
    id: varchar('id', { length: 128 })
      .$defaultFn(() => randomUUID())
      .primaryKey(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
    modIds: json('modIds').$type<number[]>(),
    queryPort: integer('queryPort').notNull(),
    gamePort: integer('gamePort').notNull(),
    appId: integer('appId').notNull(),
    playerCount: integer('playerCount').default(0).notNull(),
    maxPlayerCount: integer('maxPlayerCount').default(0).notNull(),
    queueCount: integer('queueCount').default(0).notNull(),
    timeAcceleration: varchar('timeAcceleration', { length: 64 }).notNull(),
    ipAddress: varchar('ipAddress', { length: 48 }).notNull(),
    name: varchar('name', { length: 512 }).notNull(),
    version: varchar('version', { length: 48 }).notNull(),
    clockTime: varchar('clockTime', { length: 48 }).notNull(),
    island: varchar('island', { length: 64 }).notNull(),
    relatedIslandTerrainId: varchar('relatedIslandTerrainId', { length: 64 }),
    isFirstPerson: boolean('isFirstPerson').default(false).notNull(),
    isPassword: boolean('isPassword').default(false).notNull(),
    isBattleEye: boolean('isBattleEye').default(false).notNull(),
    isVAC: boolean('isVAC').default(false).notNull(),
    isPublicHive: boolean('isPublicHive').default(false).notNull(),
    isMonetised: boolean('isMonetised').default(false).notNull(),
    isOffline: boolean('isOffline').default(false).notNull(),
    isSpoofed: boolean('isSpoofed').default(false).notNull(),
  },
  (t) => ({
    uniqueAddr: unique().on(t.ipAddress, t.queryPort),
  })
);

export const serverIslandRelations = relations(server, ({ one }) => ({
  relatedIsland: one(island, {
    fields: [server.relatedIslandTerrainId],
    references: [island.terrainId],
  }),
}));

export function serialiseServer(unserialisedServer: DbServer): Server {
  const serverModel = without(unserialisedServer, ['createdAt', 'updatedAt', 'modIds', 'timeAcceleration', 'relatedIsland']);
  return {
    ...serverModel,
    modIds: Array.isArray(unserialisedServer?.modIds) ? unserialisedServer.modIds.map((modId) => Number(modId)) : [],
    timeAcceleration: unserialisedServer?.timeAcceleration?.split(', ').map(Number),
    createdAt: unserialisedServer?.createdAt?.toISOString(),
    updatedAt: unserialisedServer?.updatedAt?.toISOString(),
    ...(unserialisedServer?.relatedIsland ? { relatedIsland: serialiseIsland(unserialisedServer?.relatedIsland) ?? undefined } : {}),
  };
}

export type DbServer = InferSelectModel<typeof server> & { relatedIsland?: InferSelectModel<typeof island> | null };
