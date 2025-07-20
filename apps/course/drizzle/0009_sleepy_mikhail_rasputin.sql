ALTER TABLE "courses" ALTER COLUMN "price" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "price" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "price" DROP NOT NULL;