CREATE TABLE IF NOT EXISTS sites (
  id UUID PRIMARY KEY,
  owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  site_slug VARCHAR(160) NOT NULL UNIQUE,
  site_path VARCHAR(180) NOT NULL UNIQUE,
  template_id VARCHAR(120) NOT NULL,
  template_slug VARCHAR(160) NOT NULL,
  template_path VARCHAR(180) NOT NULL,
  name VARCHAR(160) NOT NULL,
  description VARCHAR(500) NOT NULL DEFAULT '',
  customization_json TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sites_owner_user_id ON sites(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_sites_updated_at ON sites(updated_at);
CREATE INDEX IF NOT EXISTS idx_sites_template_id ON sites(template_id);

CREATE OR REPLACE FUNCTION set_updated_at_sites()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_updated_at_sites ON sites;
CREATE TRIGGER trg_set_updated_at_sites
BEFORE UPDATE ON sites
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_sites();
