ALTER TABLE "applications" DROP CONSTRAINT "applications_insurer_reviewed_by_staff_id_fk";
--> statement-breakpoint
ALTER TABLE "applications" DROP CONSTRAINT "applications_quotation_approved_by_staff_id_fk";
--> statement-breakpoint
ALTER TABLE "applications" DROP CONSTRAINT "applications_bank_assigned_to_staff_id_fk";
--> statement-breakpoint
ALTER TABLE "applications" DROP CONSTRAINT "applications_bank_reviewed_by_staff_id_fk";
--> statement-breakpoint
ALTER TABLE "application_status_history" ALTER COLUMN "from_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "application_status_history" ALTER COLUMN "to_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "status" SET DEFAULT 'DRAFT'::text;--> statement-breakpoint
DROP TYPE "public"."application_status";--> statement-breakpoint
CREATE TYPE "public"."application_status" AS ENUM('DRAFT', 'NEW', 'AGENT_REVIEW', 'AGENT_ACCEPTED', 'AGENT_REJECTED', 'QUOTATION_GENERATED', 'QUOTATION_REJECTED', 'QUOTATION_APPROVED', 'CUSTOMER_ACCEPTED');--> statement-breakpoint
ALTER TABLE "application_status_history" ALTER COLUMN "from_status" SET DATA TYPE "public"."application_status" USING "from_status"::"public"."application_status";--> statement-breakpoint
ALTER TABLE "application_status_history" ALTER COLUMN "to_status" SET DATA TYPE "public"."application_status" USING "to_status"::"public"."application_status";--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "status" SET DEFAULT 'DRAFT'::"public"."application_status";--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "status" SET DATA TYPE "public"."application_status" USING "status"::"public"."application_status";--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "vat_rate_pct" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "total_repayment" numeric(15, 2);--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "monthly_payment" numeric(15, 2);--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "quotation_generated_by" uuid;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "quotation_generated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "quotation_reviewed_by" uuid;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "quotation_reviewed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "bank_configs" ADD COLUMN "vat_rate_pct" numeric(5, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_quotation_generated_by_staff_id_fk" FOREIGN KEY ("quotation_generated_by") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_quotation_reviewed_by_staff_id_fk" FOREIGN KEY ("quotation_reviewed_by") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "insurer_reviewed_by";--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "insurer_reviewed_at";--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "quotation_sent_at";--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "quotation_responded_at";--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "quotation_approved_by";--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "deposit_paid_at";--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "bank_assigned_to";--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "bank_assigned_at";--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "bank_reviewed_by";--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "bank_reviewed_at";--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "disbursed_at";--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "policy_issued_at";--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "activated_at";--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "lapsed_at";--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN "claimed_at";