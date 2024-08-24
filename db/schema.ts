import { sql } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const projectsTable = pgTable('projects_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  link: text('link').notNull(),
  image: text('image').notNull(),
  tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
  description: text('description').notNull(),
});

export const blogsTable = pgTable('blog_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type InsertProject = typeof projectsTable.$inferInsert;
export type SelectProject = typeof projectsTable.$inferSelect;

export type InsertBlog = typeof blogsTable.$inferInsert;
export type SelectBlog = typeof blogsTable.$inferSelect;