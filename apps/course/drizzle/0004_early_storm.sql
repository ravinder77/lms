ALTER TABLE "categories" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "lessons" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "resources" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sections" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "categories" CASCADE;--> statement-breakpoint
DROP TABLE "lessons" CASCADE;--> statement-breakpoint
DROP TABLE "resources" CASCADE;--> statement-breakpoint
DROP TABLE "sections" CASCADE;--> statement-breakpoint
DROP INDEX "courses_instructor_id_idx";--> statement-breakpoint
DROP INDEX "courses_featured_idx";