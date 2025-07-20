CREATE TABLE "sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_course_section_title_" UNIQUE("course_id","title")
);
--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sections_course_id_idx" ON "sections" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "sections_course_order_idx" ON "sections" USING btree ("course_id","order");