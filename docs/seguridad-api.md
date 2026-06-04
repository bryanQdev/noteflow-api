# Seguridad en la API – NoteFlow

## 1. SQL Injection (Inyección SQL)

La **inyección SQL** ocurre cuando la aplicación toma datos introducidos por el usuario y los concatena directamente dentro de una consulta SQL sin validarlos ni parametrizarlos.  
Esto permite que un atacante altere la consulta original e incluso ejecute comandos peligrosos sobre la base de datos.

### Ejemplo vulnerable (concatenación directa)

```javascript
const title = req.body.title; 
// Si el atacante envía en el título: "'; DROP TABLE notes;--"
const query = "SELECT * FROM notes WHERE title = '" + title + "'";
// El motor ejecutará:
// SELECT * FROM notes WHERE title = ''; DROP TABLE notes;--'
```

En este caso, el atacante puede manipular la consulta para borrar tablas, leer datos privados o modificar información sin autorización.

---

## 2. Prevención: Consultas Parametrizadas

Las **consultas parametrizadas** separan estrictamente el código SQL de los datos enviados por el usuario.  
La base de datos compila primero la estructura de la consulta y luego inserta los valores como datos literales, nunca como código ejecutable.

Esto elimina la posibilidad de que un atacante inyecte comandos SQL.

### Ejemplo seguro

```javascript
// Solución segura
const query = "SELECT * FROM notes WHERE title = $1";
await db.query(query, [req.body.title]);
```

Ventajas:

- Los parámetros no pueden alterar la estructura del SQL.
- El motor SQL trata los valores como texto literal.
- Previene inyecciones incluso si el atacante envía payloads maliciosos.

---

## 3. Variables de Entorno

Las **variables de entorno** permiten almacenar información sensible fuera del código fuente.  
Son esenciales para mantener la seguridad del backend.

### ¿Qué tipo de información deben contener?

- Connection string de PostgreSQL  
- Secretos de JWT  
- Tokens de servicios externos  
- Claves privadas  
- Configuración sensible del servidor  

### Ejemplo de `.env.example`

```
DATABASE_URL=
JWT_SECRET=
```

### ¿Por qué son necesarias?

Porque si estos valores se incluyen en el código:

- Podrían filtrarse en GitHub.
- Cualquier persona con acceso al repositorio podría verlos.
- Un atacante podría conectarse directamente a tu base de datos.
- Podrían comprometer toda la infraestructura.

---

## 4. Por qué el Connection String Nunca Debe Aparecer en el Código

El connection string contiene:

- Usuario de la base de datos  
- Contraseña  
- Host  
- Puerto  
- Nombre de la base de datos  

Si este valor aparece en el código:

- Cualquiera que vea el repositorio puede acceder a la base de datos.
- Si está embebido en una app móvil, cualquiera puede descompilarla y obtenerlo.
- Permite acceso total: lectura, escritura, borrado y modificación de datos.

### Arquitectura correcta

```
App móvil → API (servidor) → Base de datos
```

La API actúa como **capa de seguridad**:

- Valida datos  
- Aplica permisos  
- Previene ataques  
- Protege la base de datos de accesos directos  

---

## 5. Resumen de Buenas Prácticas

- Usar siempre consultas parametrizadas.  
- Validar todos los datos antes de procesarlos.  
- No exponer información sensible en respuestas de error.  
- Usar variables de entorno para secretos.  
- Nunca incluir el connection string en el código.  
- No permitir que el frontend o la app móvil accedan directamente a la base de datos.  
- Mantener la API como única puerta de entrada controlada.  
