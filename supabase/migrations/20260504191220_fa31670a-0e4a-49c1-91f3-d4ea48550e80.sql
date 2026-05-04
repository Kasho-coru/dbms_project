
-- Foreign keys (use NOT VALID-safe approach: only add if missing)
DO $$ BEGIN
  ALTER TABLE public.donors ADD CONSTRAINT fk_donors_group FOREIGN KEY (blood_group_id) REFERENCES public.blood_groups(blood_group_id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.blood_stock ADD CONSTRAINT fk_stock_bank FOREIGN KEY (bank_id) REFERENCES public.blood_banks(bank_id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.blood_stock ADD CONSTRAINT fk_stock_group FOREIGN KEY (blood_group_id) REFERENCES public.blood_groups(blood_group_id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.donation_records ADD CONSTRAINT fk_don_donor FOREIGN KEY (donor_id) REFERENCES public.donors(donor_id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.donation_records ADD CONSTRAINT fk_don_bank FOREIGN KEY (bank_id) REFERENCES public.blood_banks(bank_id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.screenings ADD CONSTRAINT fk_screen_donor FOREIGN KEY (donor_id) REFERENCES public.donors(donor_id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.eligibility_logs ADD CONSTRAINT fk_elog_donor FOREIGN KEY (donor_id) REFERENCES public.donors(donor_id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.eligibility_logs ADD CONSTRAINT fk_elog_screen FOREIGN KEY (screening_id) REFERENCES public.screenings(screening_id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.emergency_requests ADD CONSTRAINT fk_er_hosp FOREIGN KEY (hospital_id) REFERENCES public.hospitals(hospital_id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.emergency_requests ADD CONSTRAINT fk_er_group FOREIGN KEY (blood_group_id) REFERENCES public.blood_groups(blood_group_id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.transfer_records ADD CONSTRAINT fk_tr_from FOREIGN KEY (from_bank_id) REFERENCES public.blood_banks(bank_id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.transfer_records ADD CONSTRAINT fk_tr_to FOREIGN KEY (to_bank_id) REFERENCES public.blood_banks(bank_id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE public.transfer_records ADD CONSTRAINT fk_tr_group FOREIGN KEY (blood_group_id) REFERENCES public.blood_groups(blood_group_id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Indices
CREATE INDEX IF NOT EXISTS idx_donors_group ON public.donors(blood_group_id);
CREATE INDEX IF NOT EXISTS idx_donors_status ON public.donors(status);
CREATE INDEX IF NOT EXISTS idx_stock_bank ON public.blood_stock(bank_id);
CREATE INDEX IF NOT EXISTS idx_stock_group ON public.blood_stock(blood_group_id);
CREATE INDEX IF NOT EXISTS idx_stock_status ON public.blood_stock(status);
CREATE INDEX IF NOT EXISTS idx_don_donor ON public.donation_records(donor_id);
CREATE INDEX IF NOT EXISTS idx_don_bank ON public.donation_records(bank_id);
CREATE INDEX IF NOT EXISTS idx_don_date ON public.donation_records(donation_date);
CREATE INDEX IF NOT EXISTS idx_screen_donor ON public.screenings(donor_id);
CREATE INDEX IF NOT EXISTS idx_elog_donor ON public.eligibility_logs(donor_id);
CREATE INDEX IF NOT EXISTS idx_elog_screen ON public.eligibility_logs(screening_id);
CREATE INDEX IF NOT EXISTS idx_er_hosp ON public.emergency_requests(hospital_id);
CREATE INDEX IF NOT EXISTS idx_er_group ON public.emergency_requests(blood_group_id);
CREATE INDEX IF NOT EXISTS idx_er_status ON public.emergency_requests(status);
CREATE INDEX IF NOT EXISTS idx_tr_from ON public.transfer_records(from_bank_id);
CREATE INDEX IF NOT EXISTS idx_tr_to ON public.transfer_records(to_bank_id);

-- Eligibility function
CREATE OR REPLACE FUNCTION public.check_donor_eligibility(_donor_id integer)
RETURNS text
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE d RECORD;
BEGIN
  SELECT * INTO d FROM public.donors WHERE donor_id = _donor_id;
  IF NOT FOUND THEN RETURN 'Not Found'; END IF;
  IF d.age < 18 OR d.age > 65 THEN RETURN 'Ineligible: Age'; END IF;
  IF d.weight < 50 THEN RETURN 'Ineligible: Weight'; END IF;
  IF d.last_donation_date IS NOT NULL AND d.last_donation_date > (CURRENT_DATE - INTERVAL '90 days') THEN
    RETURN 'Ineligible: Recent Donation';
  END IF;
  RETURN 'Eligible';
END $$;

-- Trigger: auto-update blood stock on new donation + update donor last donation
CREATE OR REPLACE FUNCTION public.fn_donation_update_stock()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _group integer;
BEGIN
  SELECT blood_group_id INTO _group FROM public.donors WHERE donor_id = NEW.donor_id;
  IF _group IS NOT NULL AND NEW.bank_id IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM public.blood_stock WHERE bank_id = NEW.bank_id AND blood_group_id = _group) THEN
      UPDATE public.blood_stock
      SET blood_units = blood_units + NEW.units_donated,
          status = CASE WHEN blood_units + NEW.units_donated >= 30 THEN 'Available'
                        WHEN blood_units + NEW.units_donated >= 15 THEN 'Low Stock'
                        ELSE 'Critical' END
      WHERE bank_id = NEW.bank_id AND blood_group_id = _group;
    ELSE
      INSERT INTO public.blood_stock(bank_id, blood_group_id, blood_units, status)
      VALUES (NEW.bank_id, _group, NEW.units_donated, 'Low Stock');
    END IF;
  END IF;
  UPDATE public.donors SET last_donation_date = NEW.donation_date WHERE donor_id = NEW.donor_id;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_donation_stock ON public.donation_records;
CREATE TRIGGER trg_donation_stock
AFTER INSERT ON public.donation_records
FOR EACH ROW EXECUTE FUNCTION public.fn_donation_update_stock();
