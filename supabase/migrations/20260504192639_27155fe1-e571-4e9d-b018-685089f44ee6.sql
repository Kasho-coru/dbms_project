
-- Normalize legacy data
UPDATE public.staff SET role = 'Volunteer' WHERE role NOT IN ('Doctor','Nurse','Volunteer','Technician');
UPDATE public.staff SET availability = 'Available' WHERE availability NOT IN ('Available','Assigned','Off-duty');
DELETE FROM public.eligibility_logs;
DELETE FROM public.emergency_requests;

DROP FUNCTION IF EXISTS public.fn_donation_update_stock() CASCADE;

-- DONORS
ALTER TABLE public.donors DROP COLUMN IF EXISTS last_donation_date;
ALTER TABLE public.donors DROP COLUMN IF EXISTS status;
ALTER TABLE public.donors
  DROP CONSTRAINT IF EXISTS donors_age_check,
  DROP CONSTRAINT IF EXISTS donors_weight_check,
  DROP CONSTRAINT IF EXISTS donors_gender_check,
  DROP CONSTRAINT IF EXISTS donors_contact_unique,
  DROP CONSTRAINT IF EXISTS donors_email_unique;
ALTER TABLE public.donors
  ADD CONSTRAINT donors_age_check CHECK (age >= 18),
  ADD CONSTRAINT donors_weight_check CHECK (weight >= 50),
  ADD CONSTRAINT donors_gender_check CHECK (gender IN ('Male','Female','Other')),
  ADD CONSTRAINT donors_contact_unique UNIQUE (contact_number),
  ADD CONSTRAINT donors_email_unique UNIQUE (email);

-- DONATION_RECORDS
ALTER TABLE public.donation_records RENAME COLUMN units_donated TO quantity;
ALTER TABLE public.donation_records DROP CONSTRAINT IF EXISTS donation_quantity_check;
ALTER TABLE public.donation_records ADD CONSTRAINT donation_quantity_check CHECK (quantity > 0);

-- SCREENINGS
ALTER TABLE public.screenings DROP COLUMN IF EXISTS blood_pressure;
ALTER TABLE public.screenings DROP COLUMN IF EXISTS disease_history;
ALTER TABLE public.screenings DROP COLUMN IF EXISTS temperature;
ALTER TABLE public.screenings DROP COLUMN IF EXISTS status;
ALTER TABLE public.screenings RENAME COLUMN screening_result TO result;
ALTER TABLE public.screenings DROP CONSTRAINT IF EXISTS screening_result_check;
ALTER TABLE public.screenings ADD CONSTRAINT screening_result_check CHECK (result IN ('Pass','Fail'));

-- ELIGIBILITY_LOGS
ALTER TABLE public.eligibility_logs DROP COLUMN IF EXISTS log_date;
ALTER TABLE public.eligibility_logs DROP COLUMN IF EXISTS donor_id;
ALTER TABLE public.eligibility_logs RENAME COLUMN eligibility_status TO status;
ALTER TABLE public.eligibility_logs ADD COLUMN IF NOT EXISTS remarks text;
ALTER TABLE public.eligibility_logs DROP CONSTRAINT IF EXISTS elog_status_check;
ALTER TABLE public.eligibility_logs ADD CONSTRAINT elog_status_check CHECK (status IN ('Eligible','Not Eligible'));

-- BLOOD_GROUPS
ALTER TABLE public.blood_groups DROP CONSTRAINT IF EXISTS bg_name_check;
ALTER TABLE public.blood_groups ADD CONSTRAINT bg_name_check CHECK (group_name IN ('A+','A-','B+','B-','AB+','AB-','O+','O-'));

-- BLOOD_STOCK
ALTER TABLE public.blood_stock DROP COLUMN IF EXISTS status;
ALTER TABLE public.blood_stock DROP COLUMN IF EXISTS storage_location;
ALTER TABLE public.blood_stock RENAME COLUMN blood_units TO units_available;
UPDATE public.blood_stock SET expiry_date = CURRENT_DATE + INTERVAL '60 days' WHERE expiry_date IS NULL;
ALTER TABLE public.blood_stock ALTER COLUMN expiry_date SET NOT NULL;
ALTER TABLE public.blood_stock DROP CONSTRAINT IF EXISTS stock_units_check;
ALTER TABLE public.blood_stock ADD CONSTRAINT stock_units_check CHECK (units_available >= 0);

-- BLOOD_BANKS
ALTER TABLE public.blood_banks DROP CONSTRAINT IF EXISTS bb_contact_unique;
ALTER TABLE public.blood_banks ADD CONSTRAINT bb_contact_unique UNIQUE (contact_number);

-- TRANSFER_RECORDS
ALTER TABLE public.transfer_records RENAME COLUMN from_bank_id TO source_bank_id;
ALTER TABLE public.transfer_records RENAME COLUMN to_bank_id TO destination_bank_id;
ALTER TABLE public.transfer_records DROP CONSTRAINT IF EXISTS tr_units_check;
ALTER TABLE public.transfer_records ADD CONSTRAINT tr_units_check CHECK (units_transferred > 0);

-- HOSPITALS
ALTER TABLE public.hospitals DROP CONSTRAINT IF EXISTS hosp_contact_unique;
ALTER TABLE public.hospitals ADD CONSTRAINT hosp_contact_unique UNIQUE (contact_number);

-- EMERGENCY_REQUESTS
ALTER TABLE public.emergency_requests DROP COLUMN IF EXISTS priority_level;
ALTER TABLE public.emergency_requests DROP COLUMN IF EXISTS request_time;
ALTER TABLE public.emergency_requests ADD COLUMN IF NOT EXISTS request_date date NOT NULL DEFAULT CURRENT_DATE;
ALTER TABLE public.emergency_requests DROP CONSTRAINT IF EXISTS er_units_check;
ALTER TABLE public.emergency_requests DROP CONSTRAINT IF EXISTS er_status_check;
ALTER TABLE public.emergency_requests
  ADD CONSTRAINT er_units_check CHECK (units_required > 0),
  ADD CONSTRAINT er_status_check CHECK (status IN ('Pending','Fulfilled','Cancelled'));

-- CAMPS
ALTER TABLE public.camps DROP COLUMN IF EXISTS organizer;
ALTER TABLE public.camps DROP COLUMN IF EXISTS total_donors;
ALTER TABLE public.camps ADD COLUMN IF NOT EXISTS name text;
UPDATE public.camps SET name = 'Camp' WHERE name IS NULL;
ALTER TABLE public.camps ALTER COLUMN name SET NOT NULL;
ALTER TABLE public.camps RENAME COLUMN camp_date TO date;

-- STAFF
ALTER TABLE public.staff DROP CONSTRAINT IF EXISTS staff_role_check;
ALTER TABLE public.staff DROP CONSTRAINT IF EXISTS staff_avail_check;
ALTER TABLE public.staff DROP CONSTRAINT IF EXISTS staff_email_unique;
ALTER TABLE public.staff DROP CONSTRAINT IF EXISTS staff_contact_unique;
ALTER TABLE public.staff
  ADD CONSTRAINT staff_role_check CHECK (role IN ('Doctor','Nurse','Volunteer','Technician')),
  ADD CONSTRAINT staff_avail_check CHECK (availability IN ('Available','Assigned','Off-duty')),
  ADD CONSTRAINT staff_email_unique UNIQUE (email),
  ADD CONSTRAINT staff_contact_unique UNIQUE (contact_number);
