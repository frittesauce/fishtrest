CREATE TABLE "profile" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"handle" text NOT NULL,
	"avatar_url" text,
	"bio" text DEFAULT 'hello i like cats!',
	"user_id" text NOT NULL,
	CONSTRAINT "profile_id_unique" UNIQUE("id"),
	CONSTRAINT "profile_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_handle_unique";--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "handle";