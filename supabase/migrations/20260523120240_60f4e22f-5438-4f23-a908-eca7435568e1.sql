
-- Tighten profiles UPDATE policy to lock org_id alongside role
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

CREATE POLICY "Users update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (
  id = auth.uid()
  AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  AND org_id IS NOT DISTINCT FROM (SELECT org_id FROM public.profiles WHERE id = auth.uid())
);

-- Defence in depth: trigger blocks org_id changes unless caller is SENCO or service_role
CREATE OR REPLACE FUNCTION public.prevent_org_self_reassignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.org_id IS DISTINCT FROM OLD.org_id THEN
    IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'senco'::app_role) THEN
      RAISE EXCEPTION 'Insufficient privileges to change organisation'
        USING ERRCODE = 'insufficient_privilege';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_org_self_reassignment_trg ON public.profiles;
CREATE TRIGGER prevent_org_self_reassignment_trg
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_org_self_reassignment();
