CREATE TYPE "public"."application_status" AS ENUM('DRAFT', 'NEW', 'AGENT_REVIEW', 'AGENT_REJECTED', 'INSURER_REVIEW', 'INSURER_REJECTED', 'QUOTATION_SENT', 'QUOTATION_REJECTED', 'QUOTATION_APPROVED', 'BANK_REVIEW', 'BANK_REJECTED', 'BANK_APPROVED', 'DISBURSED', 'POLICY_ISSUED', 'ACTIVE', 'LAPSED', 'CLAIMED');--> statement-breakpoint
CREATE TYPE "public"."applied_from" AS ENUM('MOBILE', 'WEB');--> statement-breakpoint
CREATE TYPE "public"."insurance_product_type" AS ENUM('MOTOR');--> statement-breakpoint
CREATE TYPE "public"."vehicle_body_type" AS ENUM('SEDAN', 'SUV', 'PICKUP', 'MINIBUS', 'TRUCK', 'MOTORCYCLE', 'OTHER');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"insurer_org_id" uuid NOT NULL,
	"bank_org_id" uuid NOT NULL,
	"product_type" "insurance_product_type" NOT NULL,
	"subtype_id" uuid NOT NULL,
	"product_detail_id" uuid NOT NULL,
	"applied_from" "applied_from" NOT NULL,
	"applied_by_staff" uuid,
	"insured_value" numeric(15, 2),
	"premium_rate_pct" numeric(5, 2),
	"premium_amount" numeric(15, 2),
	"deposit_rate_pct" numeric(5, 2),
	"deposit_amount" numeric(15, 2),
	"financed_amount" numeric(15, 2),
	"interest_rate_pct" numeric(5, 2),
	"tenure_months" integer,
	"original_insured_value" numeric(15, 2),
	"original_premium_rate_pct" numeric(5, 2),
	"status" "application_status" DEFAULT 'DRAFT' NOT NULL,
	"rejection_reason" text,
	"agent_assigned_to" uuid,
	"agent_assigned_at" timestamp with time zone,
	"agent_reviewed_by" uuid,
	"agent_reviewed_at" timestamp with time zone,
	"insurer_assigned_to" uuid,
	"insurer_assigned_at" timestamp with time zone,
	"insurer_reviewed_by" uuid,
	"insurer_reviewed_at" timestamp with time zone,
	"quotation_sent_at" timestamp with time zone,
	"quotation_responded_at" timestamp with time zone,
	"quotation_approved_by" uuid,
	"deposit_paid_at" timestamp with time zone,
	"bank_assigned_to" uuid,
	"bank_assigned_at" timestamp with time zone,
	"bank_reviewed_by" uuid,
	"bank_reviewed_at" timestamp with time zone,
	"disbursed_at" timestamp with time zone,
	"policy_issued_at" timestamp with time zone,
	"activated_at" timestamp with time zone,
	"lapsed_at" timestamp with time zone,
	"claimed_at" timestamp with time zone,
	"submitted_at" timestamp with time zone,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plate_number" varchar(50) NOT NULL,
	"chassis_number" varchar(100) NOT NULL,
	"engine_number" varchar(100) NOT NULL,
	"vehicle_make" varchar(100) NOT NULL,
	"body_type" "vehicle_body_type" NOT NULL,
	"horse_power_or_cc" integer NOT NULL,
	"year_of_manufacture" integer NOT NULL,
	"carrying_capacity" integer NOT NULL,
	"year_purchased" integer NOT NULL,
	"price_paid" numeric(15, 2) NOT NULL,
	"present_estimated_value" numeric(15, 2) NOT NULL,
	"title_deed_url" text,
	"drivers_license_url" text,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_detail_id" uuid NOT NULL,
	"url" text NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "insurance_products" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "insurance_products" CASCADE;--> statement-breakpoint
ALTER TABLE "bank_product_configs" DROP CONSTRAINT "uq_bank_product";--> statement-breakpoint
ALTER TABLE "bank_product_configs" DROP CONSTRAINT "bank_product_configs_product_id_insurance_products_id_fk";
--> statement-breakpoint
ALTER TABLE "insurance_product_subtypes" DROP CONSTRAINT "insurance_product_subtypes_product_id_insurance_products_id_fk";
--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "org_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."org_type";--> statement-breakpoint
CREATE TYPE "public"."org_type" AS ENUM('SYSTEM', 'AGENT', 'BANK', 'INSURER');--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "org_type" SET DATA TYPE "public"."org_type" USING "org_type"::"public"."org_type";--> statement-breakpoint
ALTER TABLE "bank_product_configs" ADD COLUMN "product_type" "insurance_product_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "insurance_product_subtypes" ADD COLUMN "product_type" "insurance_product_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_insurer_org_id_organizations_id_fk" FOREIGN KEY ("insurer_org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_bank_org_id_organizations_id_fk" FOREIGN KEY ("bank_org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_subtype_id_insurance_product_subtypes_id_fk" FOREIGN KEY ("subtype_id") REFERENCES "public"."insurance_product_subtypes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_product_detail_id_vehicle_details_id_fk" FOREIGN KEY ("product_detail_id") REFERENCES "public"."vehicle_details"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_applied_by_staff_staff_id_fk" FOREIGN KEY ("applied_by_staff") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_agent_assigned_to_staff_id_fk" FOREIGN KEY ("agent_assigned_to") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_agent_reviewed_by_staff_id_fk" FOREIGN KEY ("agent_reviewed_by") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_insurer_assigned_to_staff_id_fk" FOREIGN KEY ("insurer_assigned_to") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_insurer_reviewed_by_staff_id_fk" FOREIGN KEY ("insurer_reviewed_by") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_quotation_approved_by_staff_id_fk" FOREIGN KEY ("quotation_approved_by") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_bank_assigned_to_staff_id_fk" FOREIGN KEY ("bank_assigned_to") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_bank_reviewed_by_staff_id_fk" FOREIGN KEY ("bank_reviewed_by") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_photos" ADD CONSTRAINT "vehicle_photos_vehicle_detail_id_vehicle_details_id_fk" FOREIGN KEY ("vehicle_detail_id") REFERENCES "public"."vehicle_details"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_product_configs" DROP COLUMN "product_id";--> statement-breakpoint
ALTER TABLE "insurance_product_subtypes" DROP COLUMN "product_id";--> statement-breakpoint
ALTER TABLE "bank_product_configs" ADD CONSTRAINT "uq_bank_product" UNIQUE("bank_org_id","product_type");--> statement-breakpoint
ALTER TABLE "insurance_product_subtypes" ADD CONSTRAINT "uq_product_type_name" UNIQUE("product_type","name");