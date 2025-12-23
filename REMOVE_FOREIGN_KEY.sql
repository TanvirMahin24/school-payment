-- SQL script to remove the foreign key constraint from payments table
-- This is needed because userId in payments table refers to student ID from primary-coaching project,
-- NOT a user ID in the school-payment database

-- First, check the constraint name (it might be different)
-- SHOW CREATE TABLE payments;

-- Drop the foreign key constraint
ALTER TABLE payments DROP FOREIGN KEY payments_ibfk_1;

-- Verify the constraint is removed
-- SHOW CREATE TABLE payments;

