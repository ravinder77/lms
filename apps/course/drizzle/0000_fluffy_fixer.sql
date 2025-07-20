CREATE TYPE "public"."course_status" AS ENUM('draft', 'published', 'archived', 'review');--> statement-breakpoint
CREATE TYPE "public"."difficulty" AS ENUM('beginner', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TYPE "public"."resource_type" AS ENUM('pdf', 'video', 'link', 'doc', 'image', 'other');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"parent_id" integer,
	"is_active" boolean DEFAULT true,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"difficulty" "difficulty" DEFAULT 'beginner' NOT NULL,
	"duration_in_seconds" integer DEFAULT 0 NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"language" varchar(10) DEFAULT 'en' NOT NULL,
	"category_id" integer NOT NULL,
	"instructor_id" varchar NOT NULL,
	"co_instructors" jsonb DEFAULT '[]'::jsonb,
	"price" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"discounted_price" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"status" "course_status" DEFAULT 'draft' NOT NULL,
	"is_featured" boolean DEFAULT false,
	"learning_objectives" jsonb DEFAULT '[]'::jsonb,
	"prerequisites" jsonb DEFAULT '[]'::jsonb,
	"thumbnail_url" varchar(500),
	"preview_video_url" varchar(500),
	"meta_title" varchar(255),
	"meta_description" text,
	"meta_keywords" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"published_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	CONSTRAINT "courses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"title" text NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"content" text,
	"order" integer DEFAULT 0 NOT NULL,
	"duration_in_seconds" integer DEFAULT 0,
	"video_url" varchar(500),
	"is_preview" boolean DEFAULT false,
	"is_published" boolean DEFAULT false,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "lessons_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"type" "resource_type" NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_section_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "categories_parent_id_idx" ON "categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "courses_slug_idx" ON "courses" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "courses_category_id_idx" ON "courses" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "courses_instructor_id_idx" ON "courses" USING btree ("instructor_id");--> statement-breakpoint
CREATE INDEX "courses_featured_idx" ON "courses" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "lessons_section_order_idx" ON "lessons" USING btree ("section_id","order");--> statement-breakpoint
CREATE INDEX "lessons_course_id_idx" ON "lessons" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "lessons_order_idx" ON "lessons" USING btree ("order");--> statement-breakpoint
CREATE INDEX "resources_lesson_id_idx" ON "resources" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "sections_course_id_idx" ON "sections" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "sections_course_order_idx" ON "sections" USING btree ("course_id","order");