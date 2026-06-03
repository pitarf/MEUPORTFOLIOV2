-- Adiciona a coluna display_order na tabela projects se não existir
ALTER TABLE projects ADD COLUMN IF NOT EXISTS display_order INT;

-- Atualiza os registros existentes com uma ordem numérica baseada na data de criação (created_at DESC)
-- Adiciona um offset (+10) para permitir que novos projetos fiquem no topo da lista se ganharem a ordem 0.
WITH ordered_projects AS (
  SELECT id, ROW_NUMBER() OVER(ORDER BY created_at DESC) + 10 as row_num
  FROM projects
)
UPDATE projects
SET display_order = ordered_projects.row_num
FROM ordered_projects
WHERE projects.id = ordered_projects.id;

-- Define o valor padrão para 0, para que novos projetos entrem no topo (ordem menor)
ALTER TABLE projects ALTER COLUMN display_order SET DEFAULT 0;
