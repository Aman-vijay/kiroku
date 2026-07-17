DROP INDEX "entry_user_date_idx";--> statement-breakpoint
ALTER TABLE "entry" ADD COLUMN "template_id" text DEFAULT 'minimal-ink' NOT NULL;