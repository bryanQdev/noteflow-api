# NoteFlow API

Backend REST para la aplicación NoteFlow. Construido con Next.js y PostgreSQL en Neon.

## Tecnologías

- Next.js 15 (App Router)
- PostgreSQL (Neon)
- Zod (validación)
- TypeScript

## Setup

1. Clona el repositorio
2. Instala las dependencias:
```bash
   npm install
```
3. Crea `.env.local` con tu connection string:
```bash
   DATABASE_URL=tu_connection_string_de_neon
```
4. Ejecuta el schema en la consola SQL de Neon:
```bash
   sql/schema.sql
```
5. Inicia el servidor de desarrollo:
```bash
   npm run dev
```

## Endpoints

### Notas

| Método | Ruta | Body | Respuesta |
|--------|------|------|-----------|
| GET | `/api/notes` | — | Array de notas |
| POST | `/api/notes` | `{ title, type, content?, color? }` | Nota creada (201) |
| GET | `/api/notes/:id` | — | Nota por id |
| PATCH | `/api/notes/:id` | `{ title?, content?, color? }` | Nota actualizada |
| DELETE | `/api/notes/:id` | — | 204 No Content |

### Checklist Items

| Método | Ruta | Body | Respuesta |
|--------|------|------|-----------|
| GET | `/api/notes/:id/checklist-items` | — | Array de items |
| POST | `/api/notes/:id/checklist-items` | `{ text }` | Item creado (201) |
| PATCH | `/api/checklist-items/:itemId` | `{ is_completed }` | Item actualizado |
| DELETE | `/api/checklist-items/:itemId` | — | 204 No Content |

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string de PostgreSQL en Neon |

## Despliegue

Desplegado en Vercel. Añade `DATABASE_URL` en el panel de variables de entorno antes de desplegar.