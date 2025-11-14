-- ========================================
-- Add Bounty Timing Fields
-- ========================================
-- Adds time_left_when_killed and active_period to bounties table

-- Add new columns
ALTER TABLE public.bounties
ADD COLUMN IF NOT EXISTS time_left_when_killed INTEGER,
ADD COLUMN IF NOT EXISTS active_period TEXT CHECK (active_period IN ('24h', '1week', 'unlimited'));

-- Add comment for documentation
COMMENT ON COLUMN public.bounties.time_left_when_killed IS 'Minutes left in game session when target was killed';
COMMENT ON COLUMN public.bounties.active_period IS 'How long the bounty stays active: 24h, 1week, or unlimited';

-- Update existing bounties to have default active_period
UPDATE public.bounties
SET active_period = 'unlimited'
WHERE active_period IS NULL;

-- Make active_period NOT NULL with default
ALTER TABLE public.bounties
ALTER COLUMN active_period SET DEFAULT 'unlimited',
ALTER COLUMN active_period SET NOT NULL;
