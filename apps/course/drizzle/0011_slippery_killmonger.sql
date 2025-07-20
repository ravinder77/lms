ALTER TABLE "courses" ALTER COLUMN "language" SET DATA TYPE varchar(2);--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "language" SET DEFAULT 'en';--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "co_instructors" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "cover_image_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "preview_video_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "discounted_price" numeric(10, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
CREATE INDEX "courses_instructor_id_idx" ON "courses" USING btree ("instructor_id");--> statement-breakpoint
CREATE INDEX "courses_status_idx" ON "courses" USING btree ("status");--> statement-breakpoint
CREATE INDEX "courses_is_featured_idx" ON "courses" USING btree ("is_featured");