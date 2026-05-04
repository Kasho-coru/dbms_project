
ALTER TABLE IF EXISTS public.donor RENAME TO donors;
ALTER TABLE IF EXISTS public.blood_bank RENAME TO blood_banks;
ALTER TABLE IF EXISTS public.blood_group RENAME TO blood_groups;
ALTER TABLE IF EXISTS public.donation_record RENAME TO donation_records;
ALTER TABLE IF EXISTS public.screening RENAME TO screenings;
ALTER TABLE IF EXISTS public.emergency_request RENAME TO emergency_requests;
ALTER TABLE IF EXISTS public.hospital RENAME TO hospitals;
ALTER TABLE IF EXISTS public.transfer_record RENAME TO transfer_records;
ALTER TABLE IF EXISTS public.camp RENAME TO camps;
ALTER TABLE IF EXISTS public.eligibility_log RENAME TO eligibility_logs;
