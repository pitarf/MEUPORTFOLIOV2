-- 09_update_category_titles.sql
-- Atualiza os títulos de categorias corporativas para formatos de alta performance, compactos e profissionais.

-- 1. Atualiza "Desenvolvimento de Sites" para "Sites"
UPDATE categories
SET title = 'Sites'
WHERE slug = 'desenvolvimento-de-sites' OR title = 'Desenvolvimento de Sites';

-- 2. Atualiza "Dashboards em Power BI" para "Power BI"
UPDATE categories
SET title = 'Power BI'
WHERE slug = 'dashboards-em-power-bi' OR title = 'Dashboards em Power BI';

-- 3. Atualiza "Produção com IA" para "Produção IA"
UPDATE categories
SET title = 'Produção IA'
WHERE slug = 'producao-com-ia' OR title = 'Produção com IA';
