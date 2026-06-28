CREATE TABLE IF NOT EXISTS public.admin_user_ai_summaries (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  summary jsonb NOT NULL,
  context_version integer NOT NULL DEFAULT 1,
  model text NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now(),
  generated_by_admin_email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_admin_user_ai_summaries_updated_at
  ON public.admin_user_ai_summaries;
CREATE TRIGGER trg_admin_user_ai_summaries_updated_at
  BEFORE UPDATE ON public.admin_user_ai_summaries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.admin_user_ai_summaries ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.admin_user_ai_summaries IS
  'Cached Gemini-generated admin user summaries. Service role only; no client policies.';
