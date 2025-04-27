CREATE TABLE IF NOT EXISTS "users" (
	"uid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"role" text DEFAULT 'ADMIN' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_mail_unique" UNIQUE("email")
);
