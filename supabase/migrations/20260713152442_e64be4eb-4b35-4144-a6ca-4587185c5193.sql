
-- Extensions for exclusion constraint on time ranges
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ============ ROLES ============
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'customer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ SHARED updated_at TRIGGER ============
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- ============ BARBERS ============
CREATE TABLE public.barbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  role text,
  bio text,
  image_url text,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.barbers TO anon, authenticated;
GRANT ALL ON public.barbers TO service_role;
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads active barbers" ON public.barbers FOR SELECT TO anon, authenticated USING (active = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins write barbers" ON public.barbers FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_barbers_updated BEFORE UPDATE ON public.barbers FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ SERVICES ============
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads active services" ON public.services FOR SELECT TO anon, authenticated USING (active = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins write services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX services_category_idx ON public.services(category, sort_order);

-- ============ BUSINESS HOURS ============
CREATE TABLE public.business_hours (
  day_of_week smallint PRIMARY KEY CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun ... 6=Sat
  open_time time,
  close_time time,
  closed boolean NOT NULL DEFAULT false,
  CHECK (closed OR (open_time IS NOT NULL AND close_time IS NOT NULL AND close_time > open_time))
);
GRANT SELECT ON public.business_hours TO anon, authenticated;
GRANT ALL ON public.business_hours TO service_role;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads hours" ON public.business_hours FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write hours" ON public.business_hours FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ BARBER SCHEDULES (per-barber overrides of shop hours) ============
CREATE TABLE public.barber_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id uuid NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL CHECK (end_time > start_time),
  active boolean NOT NULL DEFAULT true,
  UNIQUE (barber_id, day_of_week)
);
GRANT SELECT ON public.barber_schedules TO anon, authenticated;
GRANT ALL ON public.barber_schedules TO service_role;
ALTER TABLE public.barber_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads schedules" ON public.barber_schedules FOR SELECT TO anon, authenticated USING (active = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins write schedules" ON public.barber_schedules FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX barber_schedules_barber_idx ON public.barber_schedules(barber_id, day_of_week);

-- ============ BARBER BREAKS (recurring weekly breaks) ============
CREATE TABLE public.barber_breaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id uuid NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL CHECK (end_time > start_time),
  label text
);
GRANT SELECT ON public.barber_breaks TO anon, authenticated;
GRANT ALL ON public.barber_breaks TO service_role;
ALTER TABLE public.barber_breaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads breaks" ON public.barber_breaks FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write breaks" ON public.barber_breaks FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX barber_breaks_barber_idx ON public.barber_breaks(barber_id, day_of_week);

-- ============ TIME OFF (vacations / holidays / one-off blocked hours) ============
CREATE TABLE public.time_off (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id uuid REFERENCES public.barbers(id) ON DELETE CASCADE, -- NULL = shop-wide (holiday)
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL CHECK (ends_at > starts_at),
  reason text,
  kind text NOT NULL DEFAULT 'block' CHECK (kind IN ('vacation','holiday','block')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.time_off TO anon, authenticated;
GRANT ALL ON public.time_off TO service_role;
ALTER TABLE public.time_off ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads time off" ON public.time_off FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write time off" ON public.time_off FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX time_off_range_idx ON public.time_off USING gist (tstzrange(starts_at, ends_at, '[)'));
CREATE INDEX time_off_barber_idx ON public.time_off(barber_id);

-- ============ BOOKING SETTINGS (singleton) ============
CREATE TABLE public.booking_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
  horizon_days integer NOT NULL DEFAULT 60 CHECK (horizon_days > 0),
  min_notice_minutes integer NOT NULL DEFAULT 60 CHECK (min_notice_minutes >= 0),
  buffer_minutes integer NOT NULL DEFAULT 5 CHECK (buffer_minutes >= 0),
  slot_step_minutes integer NOT NULL DEFAULT 15 CHECK (slot_step_minutes > 0),
  timezone text NOT NULL DEFAULT 'Europe/Athens',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.booking_settings TO anon, authenticated;
GRANT ALL ON public.booking_settings TO service_role;
ALTER TABLE public.booking_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads settings" ON public.booking_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write settings" ON public.booking_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ BOOKINGS ============
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id uuid NOT NULL REFERENCES public.barbers(id) ON DELETE RESTRICT,
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text NOT NULL,
  notes text,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL CHECK (end_at > start_at),
  price_cents_at_booking integer NOT NULL,
  duration_minutes_at_booking integer NOT NULL,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending','confirmed','cancelled','completed','no_show')),
  confirmation_code text NOT NULL DEFAULT upper(substring(replace(gen_random_uuid()::text,'-','') for 8)),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
-- Prevent double-booking for the same barber (pending/confirmed)
ALTER TABLE public.bookings ADD CONSTRAINT bookings_no_overlap
  EXCLUDE USING gist (
    barber_id WITH =,
    tstzrange(start_at, end_at, '[)') WITH &&
  ) WHERE (status IN ('pending','confirmed'));

CREATE INDEX bookings_barber_start_idx ON public.bookings(barber_id, start_at);
CREATE INDEX bookings_start_idx ON public.bookings(start_at);
CREATE INDEX bookings_email_idx ON public.bookings(customer_email);

GRANT SELECT, INSERT ON public.bookings TO anon, authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
-- Anyone can create a booking; only admins can read/modify/cancel
CREATE POLICY "anyone creates bookings" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read bookings" ON public.bookings FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins update bookings" ON public.bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete bookings" ON public.bookings FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ SEED DATA ============

-- Business hours: 0=Sun ... 6=Sat
INSERT INTO public.business_hours (day_of_week, open_time, close_time, closed) VALUES
  (0, NULL, NULL, true),
  (1, NULL, NULL, true),
  (2, '09:00', '21:00', false),
  (3, '09:00', '15:00', false),
  (4, '09:00', '21:00', false),
  (5, '09:00', '21:00', false),
  (6, '09:00', '15:00', false);

INSERT INTO public.booking_settings (id) VALUES (true);

-- Barbers
INSERT INTO public.barbers (slug, name, role, bio, sort_order) VALUES
  ('efraim', 'Εφραίμ', 'Barber · 13 χρόνια εμπειρίας',
   'Δουλεύω με έμφαση στην ποιότητα, την καθαριότητα και την προσοχή στη λεπτομέρεια.', 1),
  ('camilo', 'Καμίλο', 'Guest Barber',
   'Εκπαίδευση στη σχολή Antonio Eloy (Ισπανία), εμπειρία σε Ελλάδα, Ισπανία και Άμστερνταμ.', 2);

-- Services (prices in cents €, durations in minutes)
INSERT INTO public.services (slug, name, category, price_cents, duration_minutes, sort_order) VALUES
  ('classic',        'Κούρεμα Classic',       'Κουρέματα',        1400, 30, 1),
  ('fade',           'Κούρεμα Fade',          'Κουρέματα',        1400, 40, 2),
  ('cut-wash',       'Κούρεμα & Λούσιμο',     'Κουρέματα',        1600, 40, 3),
  ('kids',           'Παιδικό Κούρεμα',       'Κουρέματα',        1100, 25, 4),
  ('beard-machine',  'Γενειάδα με μηχανή',    'Γένια & Ξύρισμα',   500, 15, 5),
  ('beard-scissor',  'Γενειάδα με ψαλίδι',    'Γένια & Ξύρισμα',   700, 20, 6),
  ('exclusive-beard','Exclusive Γένια',       'Γένια & Ξύρισμα',  1200, 30, 7),
  ('shave',          'Ξύρισμα',               'Γένια & Ξύρισμα',   900, 25, 8),
  ('shave-hot',      'Ξύρισμα με κομπρέσες',  'Γένια & Ξύρισμα',  1200, 35, 9),
  ('threading',      'Αποτρίχωση με κλωστή',  'Περιποίηση',        500, 10, 10),
  ('facial',         'Καθαρισμός προσώπου',   'Περιποίηση',       1400, 30, 11),
  ('wash',           'Λούσιμο',               'Περιποίηση',        500, 15, 12);
