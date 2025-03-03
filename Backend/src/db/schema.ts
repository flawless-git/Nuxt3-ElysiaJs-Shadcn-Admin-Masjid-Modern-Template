import {
  integer,
  pgTable,
  varchar,
  timestamp,
  boolean,
  text,
  date,
} from "drizzle-orm/pg-core";

// Tabel User untuk autentikasi
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  isAdmin: boolean().notNull().default(false),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Tabel untuk kategori transaksi
export const categoryTable = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
});

// Tabel untuk mencatat transaksi kas
export const cashFlowTable = pgTable("cashFlow", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  amount: integer().notNull(),
  description: text().notNull(),
  userId: integer()
    .references(() => usersTable.id)
    .notNull(),
  categoryId: integer()
    .references(() => categoryTable.id)
    .notNull(),
  balanceId: integer()
    .references(() => balanceTable.id)
    .notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

// Tabel untuk menyimpan saldo
export const balanceTable = pgTable("balance", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  amount: integer().notNull().default(0),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const khatibScheduleTable = pgTable("khatib_schedule", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  date: date().notNull(),
  title: varchar({ length: 255 }).notNull(),
});

export const kajianTable = pgTable("kajian", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  date: date().notNull(),
  title: varchar({ length: 255 }).notNull(),
});

export const imageTable = pgTable("image", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  path: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});
