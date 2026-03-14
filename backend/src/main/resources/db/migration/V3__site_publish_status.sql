ALTER TABLE sites
  ADD COLUMN IF NOT EXISTS lifecycle_status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN IF NOT EXISTS published_slug VARCHAR(180),
  ADD COLUMN IF NOT EXISTS custom_domain VARCHAR(255),
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

CREATE UNIQUE INDEX IF NOT EXISTS idx_sites_published_slug_unique
  ON sites(published_slug)
  WHERE published_slug IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_sites_custom_domain_unique
  ON sites(custom_domain)
  WHERE custom_domain IS NOT NULL;
