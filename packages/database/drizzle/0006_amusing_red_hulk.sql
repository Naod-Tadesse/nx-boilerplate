CREATE TABLE "bank_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"deposit_rate_pct" numeric(5, 2) NOT NULL,
	"interest_rate_pct" numeric(5, 2) NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bank_configs_org_id_unique" UNIQUE("org_id")
);
--> statement-breakpoint
ALTER TABLE "bank_configs" ADD CONSTRAINT "bank_configs_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;