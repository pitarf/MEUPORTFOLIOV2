-- Create table for landing page dynamic content
create table public.landing_page_content (
  id uuid default gen_random_uuid() primary key,
  page_slug text not null unique,
  hero_title text,
  hero_subtitle text,
  hero_image_url text,
  specialties jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.landing_page_content enable row level security;

-- Policies
create policy "Public can view landing page content"
  on public.landing_page_content for select
  using (true);

create policy "Admins can update landing page content"
  on public.landing_page_content for update
  using (auth.role() = 'authenticated'); -- Adjust if you have specific admin role checks

create policy "Admins can insert landing page content"
  on public.landing_page_content for insert
  with check (auth.role() = 'authenticated');

-- Insert initial data for Photography page
insert into public.landing_page_content (page_slug, hero_title, hero_subtitle, hero_image_url, specialties)
values (
  'fotografia',
  'Capturando Momentos Eternos',
  'Mais do que fotos, entregamos memórias. Um olhar artístico para os momentos mais importantes da sua vida e do seu negócio.',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4',
  '[
    {
      "title": "Casamentos",
      "description": "Eternizando o sim com sensibilidade e arte.",
      "image": "https://images.unsplash.com/photo-1511285560982-1351cdeb9821"
    },
    {
      "title": "Eventos",
      "description": "Cobertura completa para eventos corporativos e sociais.",
      "image": "https://images.unsplash.com/photo-1511578314322-379afb476865"
    },
    {
      "title": "Ensaios",
      "description": "Retratos que capturam sua essência e personalidade.",
      "image": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04"
    }
  ]'::jsonb
);
