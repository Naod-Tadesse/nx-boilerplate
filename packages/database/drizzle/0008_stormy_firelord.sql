CREATE TABLE "application_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"from_status" "application_status",
	"to_status" "application_status" NOT NULL,
	"action" varchar(50) NOT NULL,
	"reason" text,
	"acted_by_staff" uuid,
	"acted_by_customer" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_reset_otp" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_reset_otp_expires" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_phone_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone_verification_otp" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone_verification_expires" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "application_status_history" ADD CONSTRAINT "application_status_history_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_status_history" ADD CONSTRAINT "application_status_history_acted_by_staff_staff_id_fk" FOREIGN KEY ("acted_by_staff") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_status_history" ADD CONSTRAINT "application_status_history_acted_by_customer_customers_id_fk" FOREIGN KEY ("acted_by_customer") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;