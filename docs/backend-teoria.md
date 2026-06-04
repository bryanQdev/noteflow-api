# Teoría del Backend y Base de Datos - NoteFlow

## Patrón Cliente-Servidor y API REST
El patrón **Cliente-Servidor** es un modelo de diseño de software donde las tareas se reparten entre los proveedores de recursos o servicios (servidores) y los demandantes (clientes).

* **Cliente (App Móvil):** Se encarga exclusivamente de la interfaz de usuario y la experiencia de uso. Nunca debe contener credenciales críticas ni comunicarse directamente con la base de datos.
* **Servidor (API Next.js):** Actúa como guardián y cerebro de la aplicación. Centraliza las reglas de negocio, valida que los datos sean correctos y gestiona las autorizaciones.
* **Base de Datos (PostgreSQL en Neon):** Almacena de forma persistente y segura la información estructurada.

Una **API REST** (Representational State Transfer) es un servicio que expone recursos a través de URLs utilizando los métodos estandarizados del protocolo HTTP.

### Métodos HTTP y Códigos de Estado
Mapeamos las operaciones CRUD directamente a los verbos HTTP:

| Método HTTP | Operación de Datos | Código de Estado Común |
| :--- | :--- | :--- |
| **GET** | Leer datos | 200 OK / 404 Not Found |
| **POST** | Crear datos | 201 Created / 400 Bad Request |
| **PATCH** | Modificar parcialmente | 200 OK / 400 Bad Request |
| **DELETE** | Eliminar datos | 204 No Content |

> **Regla de Oro:** Nunca devolvemos el error interno de la base de datos (ej. un fallo de sintaxis de PostgreSQL) al cliente, ya que revela la estructura interna del sistema a posibles atacantes. En su lugar, devolvemos un genérico `500 Internal Server Error`.

---

## Bases de Datos Relacionales y Propiedades ACID
Organizamos la información en tablas compuestas por filas (registros) y columnas (atributos), interconectadas mediante relaciones lógicas.

### ACID: Transacciones Fiables
Para asegurar la integridad, la base de datos cumple con cuatro propiedades fundamentales:
* **Atomicidad:** Todo o nada. Si falla la inserción de un elemento del checklist, se revierte la creación de la nota completa.
* **Consistencia:** La base de datos pasa de un estado válido a otro estado válido, respetando las restricciones (como los tipos de datos).
* **Aislamiento:** Las operaciones concurrentes no se interfieren entre sí.
* **Durabilidad:** Una vez confirmada la transacción, los datos persisten aunque el servidor sufra un apagón.

### Claves y Relaciones
* **Primary Key (PK):** Identificador único. Usamos **UUID** porque el cliente móvil puede generarlo de forma local sin conexión a internet, facilitando la sincronización offline posterior sin colisiones de ID.
* **Foreign Key (FK):** Una columna que vincula una fila con la PK de otra tabla. Al usar `ON DELETE CASCADE`, garantizamos que si una nota se borra, todos sus ítems y etiquetas vinculados se eliminan automáticamente de forma limpia.

### DDL vs DML
* **DDL (Data Definition Language):** Define la estructura (esquema) del almacén de datos. Comandos: `CREATE`, `ALTER`, `DROP`.
* **DML (Data Manipulation Language):** Manipula los registros de las estructuras ya creadas. Comandos: `SELECT`, `INSERT`, `UPDATE`, `DELETE`.

---

## Diagrama Entidad-Relación (ERD)

+----------------------------------+
|              NOTES               |
+----------------------------------+
| PK | id         : UUID (Default) |
|    | title      : VARCHAR(255)   |
|    | content    : TEXT           |
|    | type       : VARCHAR(50)    |
|    | color      : VARCHAR(7)     |
|    | created_at : TIMESTAMPTZ    |
|    | updated_at : TIMESTAMPTZ    |
+----------------------------------+
|
+---------+---------+
| (1)               | (1)
|                   |
| (N)               | (N)
+------v-----------+   +---v--------------+
| CHECKLIST_ITEMS  |   |    NOTE_TAGS     |
+------------------+   +------------------+
| PK | id          |   | PK | id          |
| FK | note_id     |   | FK | note_id     |
|    | text        |   |    | tag         |
|    | is_completed|   +------------------+
+------------------+

### INNER JOIN vs LEFT JOIN
* **INNER JOIN:** Devuelve filas únicamente cuando hay una coincidencia exacta en ambas tablas. Si una nota no tiene ningún tag, usar `INNER JOIN` haría que esa nota desapareciera por completo del resultado.
* **LEFT JOIN:** Devuelve todas las filas de la tabla izquierda (`notes`), y combina los datos de la derecha (`checklist_items`). Si no hay coincidencia, rellena los campos con `NULL`. Es el ideal para NoteFlow porque queremos listar la nota incluso si no tiene tareas asignadas.