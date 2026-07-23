CREATE TABLE `admin_login_attempts` (
	`client_id` text PRIMARY KEY NOT NULL,
	`failures` integer DEFAULT 0 NOT NULL,
	`window_started_at` integer NOT NULL
);
