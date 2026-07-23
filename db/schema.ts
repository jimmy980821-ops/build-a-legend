import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const siteSettings = sqliteTable("site_settings", {
  id: text("id").primaryKey(),
  legendEnabled: integer("legend_enabled", { mode: "boolean" }).notNull().default(true),
  perfectEnabled: integer("perfect_enabled", { mode: "boolean" }).notNull().default(true),
  unlimitedTeamSpins: integer("unlimited_team_spins", { mode: "boolean" }).notNull().default(true),
  showComingSoon: integer("show_coming_soon", { mode: "boolean" }).notNull().default(true),
  updatedAt: integer("updated_at").notNull(),
});

export const adminLoginAttempts = sqliteTable("admin_login_attempts", {
  clientId: text("client_id").primaryKey(),
  failures: integer("failures").notNull().default(0),
  windowStartedAt: integer("window_started_at").notNull(),
});
