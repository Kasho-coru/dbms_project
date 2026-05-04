
-- 1. Blood Group
CREATE TABLE public.blood_groups (
  blood_group_id SERIAL PRIMARY KEY,
  group_name TEXT NOT NULL UNIQUE
);

-- 2. Blood Bank
CREATE TABLE public.blood_banks (
  bank_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  contact_number TEXT
);

-- 3. Hospital
CREATE TABLE public.hospitals (
  hospital_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  contact_number TEXT
);

-- 4. Staff
CREATE TABLE public.staff (
  staff_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  contact_number TEXT,
  availability TEXT NOT NULL DEFAULT 'Available'
);

-- 5. Camp
CREATE TABLE public.camps (
  camp_id SERIAL PRIMARY KEY,
  organizer TEXT NOT NULL,
  location TEXT NOT NULL,
  camp_date DATE NOT NULL,
  total_donors INT NOT NULL DEFAULT 0
);

-- 6. Donor
CREATE TABLE public.donors (
  donor_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INT NOT NULL CHECK (age >= 18),
  weight NUMERIC NOT NULL CHECK (weight >= 50),
  gender TEXT NOT NULL,
  blood_group_id INT REFERENCES public.blood_groups(blood_group_id),
  email TEXT,
  contact_number TEXT,
  last_donation_date DATE,
  status TEXT NOT NULL DEFAULT 'Active'
);

-- 7. Donation Record
CREATE TABLE public.donation_records (
  donation_id SERIAL PRIMARY KEY,
  donor_id INT REFERENCES public.donors(donor_id) ON DELETE CASCADE,
  bank_id INT REFERENCES public.blood_banks(bank_id),
  donation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  units_donated INT NOT NULL DEFAULT 1
);

-- 8. Blood Stock
CREATE TABLE public.blood_stock (
  stock_id SERIAL PRIMARY KEY,
  bank_id INT REFERENCES public.blood_banks(bank_id),
  blood_group_id INT REFERENCES public.blood_groups(blood_group_id),
  blood_units INT NOT NULL DEFAULT 0,
  expiry_date DATE,
  storage_location TEXT,
  status TEXT NOT NULL DEFAULT 'Available'
);

-- 9. Screening
CREATE TABLE public.screenings (
  screening_id SERIAL PRIMARY KEY,
  donor_id INT REFERENCES public.donors(donor_id) ON DELETE CASCADE,
  temperature NUMERIC,
  blood_pressure TEXT,
  disease_history TEXT,
  screening_result TEXT NOT NULL DEFAULT 'Pass',
  screening_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Completed'
);

-- 10. Eligibility Log
CREATE TABLE public.eligibility_logs (
  log_id SERIAL PRIMARY KEY,
  screening_id INT REFERENCES public.screenings(screening_id) ON DELETE CASCADE,
  donor_id INT REFERENCES public.donors(donor_id) ON DELETE CASCADE,
  eligibility_status TEXT NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 11. Emergency Request
CREATE TABLE public.emergency_requests (
  request_id SERIAL PRIMARY KEY,
  hospital_id INT REFERENCES public.hospitals(hospital_id),
  blood_group_id INT REFERENCES public.blood_groups(blood_group_id),
  units_required INT NOT NULL,
  priority_level TEXT NOT NULL DEFAULT 'Medium',
  request_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'Pending'
);

-- 12. Transfer Record
CREATE TABLE public.transfer_records (
  transfer_id SERIAL PRIMARY KEY,
  from_bank_id INT REFERENCES public.blood_banks(bank_id),
  to_bank_id INT REFERENCES public.blood_banks(bank_id),
  blood_group_id INT REFERENCES public.blood_groups(blood_group_id),
  units_transferred INT NOT NULL,
  transfer_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- RLS: enable, demo-public access
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['blood_groups','blood_banks','hospitals','staff','camps','donors','donation_records','blood_stock','screenings','eligibility_logs','emergency_requests','transfer_records']) LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('CREATE POLICY "public_read_%1$s" ON public.%1$I FOR SELECT USING (true);', t);
    EXECUTE format('CREATE POLICY "public_insert_%1$s" ON public.%1$I FOR INSERT WITH CHECK (true);', t);
    EXECUTE format('CREATE POLICY "public_update_%1$s" ON public.%1$I FOR UPDATE USING (true);', t);
    EXECUTE format('CREATE POLICY "public_delete_%1$s" ON public.%1$I FOR DELETE USING (true);', t);
  END LOOP;
END $$;

-- Seed data
INSERT INTO public.blood_groups (group_name) VALUES
  ('A+'),('A-'),('B+'),('B-'),('AB+'),('AB-'),('O+'),('O-');

INSERT INTO public.blood_banks (name, location, contact_number) VALUES
  ('Central Blood Bank','Downtown Medical District','+1-555-0101'),
  ('Northside Blood Center','North Avenue 245','+1-555-0102'),
  ('Westend Hematology','West Plaza 88','+1-555-0103'),
  ('Eastside Blood Services','East Boulevard 12','+1-555-0104');

INSERT INTO public.hospitals (name, location, contact_number) VALUES
  ('St. Jude General Hospital','Downtown','+1-555-0201'),
  ('Metropolitan Clinic','Midtown','+1-555-0202'),
  ('City General Hospital','Riverside','+1-555-0203'),
  ('Northside Pediatric','North District','+1-555-0204');

INSERT INTO public.staff (name, role, email, contact_number, availability) VALUES
  ('Dr. Sarah Chen','Doctor','sarah.chen@hemacare.org','+1-555-0301','Available'),
  ('Marcus Holloway','Technician','marcus@hemacare.org','+1-555-0302','Assigned'),
  ('Priya Patel','Nurse','priya@hemacare.org','+1-555-0303','Available'),
  ('Diego Romero','Volunteer','diego@hemacare.org','+1-555-0304','Off-duty'),
  ('Admin User','Admin','admin@hemacare.org','+1-555-0305','Available');

INSERT INTO public.camps (organizer, location, camp_date, total_donors) VALUES
  ('Red Cross Society','Civic Center','2026-06-15',120),
  ('University Health Drive','State University','2026-07-02',85),
  ('Tech Park Initiative','Innovation Hub','2026-05-20',60);

INSERT INTO public.donors (name, age, weight, gender, blood_group_id, email, contact_number, last_donation_date, status) VALUES
  ('Marcus Holloway',28,75,'Male',7,'marcus.h@mail.com','+1-555-1001','2026-04-15','Active'),
  ('Sarah Jenkins',32,62,'Female',1,'sarah.j@mail.com','+1-555-1002','2026-04-20','Active'),
  ('Aiden Cole',45,80,'Male',8,'aiden@mail.com','+1-555-1003','2026-03-10','Active'),
  ('Lina Park',26,55,'Female',3,'lina@mail.com','+1-555-1004','2026-04-01','Active'),
  ('Omar Khalid',38,90,'Male',5,'omar@mail.com','+1-555-1005','2026-02-28','Deferred'),
  ('Yuki Tanaka',24,52,'Female',6,'yuki@mail.com','+1-555-1006',NULL,'Active');

INSERT INTO public.blood_stock (bank_id, blood_group_id, blood_units, expiry_date, storage_location, status) VALUES
  (1,1,82,'2026-06-15','Cold Room A','Available'),
  (1,8,12,'2026-05-25','Cold Room B','Critical'),
  (1,3,45,'2026-06-10','Cold Room A','Available'),
  (2,5,62,'2026-07-01','Vault 1','Available'),
  (2,2,28,'2026-05-30','Vault 2','Low Stock'),
  (3,4,8,'2026-05-20','Cold Room C','Critical'),
  (3,7,55,'2026-06-22','Cold Room A','Available'),
  (4,6,18,'2026-06-05','Vault 1','Low Stock');

INSERT INTO public.donation_records (donor_id, bank_id, donation_date, units_donated) VALUES
  (1,1,'2026-04-15',1),
  (2,1,'2026-04-20',1),
  (3,2,'2026-03-10',2),
  (4,3,'2026-04-01',1);

INSERT INTO public.screenings (donor_id, temperature, blood_pressure, disease_history, screening_result) VALUES
  (1,98.6,'120/80','None','Pass'),
  (2,98.4,'118/76','None','Pass'),
  (5,99.8,'140/90','Hypertension','Fail');

INSERT INTO public.eligibility_logs (screening_id, donor_id, eligibility_status) VALUES
  (1,1,'Eligible'),
  (2,2,'Eligible'),
  (3,5,'Temporary Deferral');

INSERT INTO public.emergency_requests (hospital_id, blood_group_id, units_required, priority_level, status) VALUES
  (1,8,4,'High','Pending'),
  (2,5,2,'Medium','In Transit'),
  (3,1,3,'Low','Fulfilled');

INSERT INTO public.transfer_records (from_bank_id, to_bank_id, blood_group_id, units_transferred, transfer_date) VALUES
  (1,2,1,5,'2026-04-22'),
  (2,3,5,3,'2026-04-25');
