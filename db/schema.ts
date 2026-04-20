import { sql } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const projectsTable = pgTable('projects_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  link: text('link').notNull(),
  image: text('image').notNull(),
  tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
  description: text('description').notNull(),
  extendedDescription: text('extended_description').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const blogsTable = pgTable('blog_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
  description: text('description').notNull(),
  contentUrl: text('content_url').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const penguinCounterTable = pgTable('penguin_counter_table', {
  id: serial('id').primaryKey(),
  count: integer('count').notNull().default(0),
});

export type InsertProject = typeof projectsTable.$inferInsert;
export type SelectProject = typeof projectsTable.$inferSelect;

export type InsertBlog = typeof blogsTable.$inferInsert;
export type SelectBlog = typeof blogsTable.$inferSelect;