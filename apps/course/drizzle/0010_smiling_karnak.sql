ALTER TABLE "courses" ALTER COLUMN "currency" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "language" varchar(10) DEFAULT 'en' NOT NULL;