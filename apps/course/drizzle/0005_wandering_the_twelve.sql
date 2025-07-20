ALTER TABLE "courses" DROP CONSTRAINT "courses_slug_unique";--> statement-breakpoint
DROP INDEX "courses_slug_idx";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "slug";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "is_featured";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "learning_objectives";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "prerequisites";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "updated_at";