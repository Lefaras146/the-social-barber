
-- Security-definer function returning only busy time ranges (no PII).
CREATE OR REPLACE FUNCTION public.get_busy_slots(
  p_barber_ids uuid[],
  p_from timestamptz,
  p_to timestamptz
)
RETURNS TABLE(barber_id uuid, start_at timestamptz, end_at timestamptz, status text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.barber_id, b.start_at, b.end_at, b.status::text
  FROM public.bookings b
  WHERE b.status IN ('pending','confirmed')
    AND b.barber_id = ANY(p_barber_ids)
    AND b.start_at < p_to
    AND b.end_at > p_from;
$$;

REVOKE ALL ON FUNCTION public.get_busy_slots(uuid[], timestamptz, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_busy_slots(uuid[], timestamptz, timestamptz) TO anon, authenticated;

-- Lock down bootstrap trigger function (trigger still fires as table owner).
REVOKE ALL ON FUNCTION public.bootstrap_first_admin() FROM PUBLIC, anon, authenticated;
