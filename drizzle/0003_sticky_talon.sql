ALTER TABLE "entry" ADD COLUMN "share_slug" text;--> statement-breakpoint
CREATE UNIQUE INDEX "entry_share_slug_uidx" ON "entry" USING btree ("share_slug");