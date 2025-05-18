CREATE TABLE "followers" (
	"user_id" serial NOT NULL,
	"target_user_id" serial NOT NULL,
	"liked_at" timestamp DEFAULT now(),
	CONSTRAINT "followers_pkey" PRIMARY KEY("target_user_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_user_id_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_target_user_id_profile_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;