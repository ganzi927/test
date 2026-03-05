CREATE TABLE public.portfolio (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  stock_name text NOT NULL,
  current_price text,
  target_price text,
  stop_loss text,
  disparity_ratio text,
  risk_factors text,
  trigger_material text,
  status text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.portfolio ADD CONSTRAINT portfolio_stock_name_key UNIQUE (stock_name);

ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.portfolio FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.portfolio FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.portfolio FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.portfolio FOR DELETE USING (true);
