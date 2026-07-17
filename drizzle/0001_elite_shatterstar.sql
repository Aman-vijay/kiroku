CREATE TABLE "entry" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"entry_date" date NOT NULL,
	"title" text,
	"body" text NOT NULL,
	"visibility" text DEFAULT 'private' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "entry" ADD CONSTRAINT "entry_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "entry_user_date_uidx" ON "entry" USING btree ("user_id","entry_date");--> statement-breakpoint
CREATE INDEX "entry_user_date_idx" ON "entry" USING btree ("user_id","entry_date");