CREATE TABLE IF NOT EXISTS auth_rate_limits (
  rate_key VARCHAR(400) PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0,
  first_attempt_at TIMESTAMP WITH TIME ZONE,
  locked_until TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_locked_until ON auth_rate_limits(locked_until);
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_updated_at ON auth_rate_limits(updated_at);
