
-- CreateTable
CREATE TABLE "property_availability" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "property_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "price" DOUBLE PRECISION,
    "booking_id" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_availability_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint to prevent duplicate dates for same property
CREATE UNIQUE INDEX "property_availability_property_id_date_key" ON "property_availability"("property_id", "date");

-- Add foreign key to property table
ALTER TABLE "property_availability" ADD CONSTRAINT "property_availability_property_id_fkey"
    FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Optional: Add foreign key to booking table if booking_id is provided
ALTER TABLE "property_availability" ADD CONSTRAINT "property_availability_booking_id_fkey"
    FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
