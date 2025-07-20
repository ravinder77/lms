ALTER TABLE "courses" DROP CONSTRAINT "courses_category_id_categories_id_fk";
--> statement-breakpoint
DROP INDEX "courses_category_id_idx";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "category_id";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "thumbnail_url";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "preview_video_url";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "meta_title";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "meta_description";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "meta_keywords";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "published_at";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "metadata";