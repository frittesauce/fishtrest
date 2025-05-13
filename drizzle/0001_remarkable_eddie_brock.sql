ALTER TABLE "likes" DROP CONSTRAINT "likes_user_id_unique";--> statement-breakpoint
ALTER TABLE "likes" DROP CONSTRAINT "likes_post_id_unique";--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_pkey" PRIMARY KEY("post_id","user_id");