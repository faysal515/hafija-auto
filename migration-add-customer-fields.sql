-- Migration: Add customer fields and advance payment to invoices table
-- Run this in your Supabase SQL editor

-- Add customer fields for INVOICE type
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS customer_address TEXT;

-- Add advance payment field
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS advance_payment NUMERIC DEFAULT 0;

-- Add comment for documentation
COMMENT ON COLUMN invoices.customer_name IS 'Customer name (used for INVOICE type)';
COMMENT ON COLUMN invoices.customer_phone IS 'Customer phone number (used for INVOICE type)';
COMMENT ON COLUMN invoices.customer_address IS 'Customer address (used for INVOICE type)';
COMMENT ON COLUMN invoices.advance_payment IS 'Advance payment amount (used for INVOICE type)';
