-- Obtener todas las notas con sus checklist items y tags
-- LEFT JOIN porque una nota puede no tener items ni tags
-- FILTER (WHERE ...) evita que json_agg incluya NULLs cuando no hay coincidencias
SELECT 
  n.*,
  json_agg(ci.*) FILTER (WHERE ci.id IS NOT NULL) as items,
  json_agg(nt.tag) FILTER (WHERE nt.id IS NOT NULL) as tags
FROM notes n
LEFT JOIN checklist_items ci ON n.id = ci.note_id
LEFT JOIN note_tags nt ON n.id = nt.note_id
GROUP BY n.id
ORDER BY n.created_at DESC;