CREATE TABLE "bank_product_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bank_org_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"tenure_months" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_bank_product" UNIQUE("bank_org_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "insurance_product_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"insurer_org_id" uuid NOT NULL,
	"subtype_id" uuid NOT NULL,
	"premium_rate_pct" numeric(5, 2) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_insurer_subtype" UNIQUE("insurer_org_id","subtype_id")
);
--> statement-breakpoint
ALTER TABLE "insurance_products" DROP CONSTRAINT "insurance_products_insurer_org_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "bank_product_configs" ADD CONSTRAINT "bank_product_configs_bank_org_id_organizations_id_fk" FOREIGN KEY ("bank_org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_product_configs" ADD CONSTRAINT "bank_product_configs_product_id_insurance_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."insurance_products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insurance_product_configs" ADD CONSTRAINT "insurance_product_configs_insurer_org_id_organizations_id_fk" FOREIGN KEY ("insurer_org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insurance_product_configs" ADD CONSTRAINT "insurance_product_configs_subtype_id_insurance_product_subtypes_id_fk" FOREIGN KEY ("subtype_id") REFERENCES "public"."insurance_product_subtypes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "insurance_product_subtypes" DROP COLUMN "premium_rate_pct";--> statement-breakpoint
ALTER TABLE "insurance_products" DROP COLUMN "insurer_org_id";--> statement-breakpoint
ALTER TABLE "insurance_products" DROP COLUMN "tenure_months";