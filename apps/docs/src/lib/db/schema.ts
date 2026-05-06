import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// Landing Page Love it / Hate it tablosu
export const feedbacks = pgTable('feedbacks', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  type: varchar('type', { length: 20 }).notNull(), // 'love', 'hate'
  message: text('message').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }), // IPv4 / IPv6
  createdAt: timestamp('created_at').defaultNow(),
});

// Satın alınan lisanslar tablosu (Lemon Squeezy entegrasyonu)
export const licenses = pgTable('licenses', {
  id: varchar('id', { length: 255 }).primaryKey(), // Lemon Squeezy'den gelen sipariş ID'si
  key: varchar('key', { length: 255 }).notNull().unique(), // Kullanılacak API anahtarı
  status: varchar('status', { length: 50 }).notNull().default('active'), // active, expired, cancelled
  credits: integer('credits').notNull().default(500), // Örneğin başlangıçta 500 TTS çeviri hakkı
  createdAt: timestamp('created_at').defaultNow(),
});

// TTS (Ses) Önbellekleme Tablosu
export const ttsCache = pgTable(
  'tts_cache',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    hash: varchar('hash', { length: 255 }).notNull(), // md5(text + speaker + language + style + model)
    prompt: text('prompt').notNull(),
    text: text('text').notNull(),
    speaker: varchar('speaker', { length: 100 }).notNull(),
    style: text('style').notNull().default(''),
    model: varchar('model', { length: 100 }).notNull().default('gemini-2.5-flash-preview-tts'),
    language: varchar('language', { length: 10 }).notNull().default('tr'),
    audioUrl: text('audio_url').notNull(), // Vercel Blob URL'si
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [uniqueIndex('hash_idx').on(table.hash)],
);
