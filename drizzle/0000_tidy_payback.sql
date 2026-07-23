CREATE TABLE `site_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`legend_enabled` integer DEFAULT true NOT NULL,
	`perfect_enabled` integer DEFAULT true NOT NULL,
	`unlimited_team_spins` integer DEFAULT true NOT NULL,
	`show_coming_soon` integer DEFAULT true NOT NULL,
	`updated_at` integer NOT NULL
);
