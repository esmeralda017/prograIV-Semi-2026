# Sistema Académico - SQLite WASM

Proyecto de práctica evaluada para Programación Computacional IV.

## 🚀 Tecnologías Utilizadas

- **SQLite WASM (sql.js)**: Base de datos SQLite compilada a WebAssembly
- **Vue.js 3**: Framework JavaScript para la interfaz
- **Bootstrap 5**: Framework CSS para el diseño
- **Alertify.js**: Notificaciones y alertas

## 📁 Estructura del Proyecto

```
proyecto-sqlite/
├── index.html              # Página principal
├── main.js                 # Lógica principal de Vue.js + SQLite WASM
├── worker.js               # (No utilizado actualmente)
├── componentes/
│   ├── alumnos.js          # CRUD de Alumnos
│   ├── busqueda_alumnos.js # Búsqueda de Alumnos
│   ├── materias.js         # CRUD de Materias
│   ├── busqueda_materias.js# Búsqueda de Materias
│   ├── docentes.js         # CRUD de Docentes
│   └── busqueda_docentes.js# Búsqueda de Docentes
└── README.md
```

## ✅ Funcionalidades Implementadas

### Alumnos
- ✅ Crear alumno (Guardar)
- ✅ Leer alumnos (Buscar)
- ✅ Actualizar alumno (Modificar)
- ✅ Eliminar alumno (Eliminar)

### Materias
- ✅ Crear materia (Guardar)
- ✅ Leer materias (Buscar)
- ✅ Actualizar materia (Modificar)
- ✅ Eliminar materia (Eliminar)

### Docentes
- ✅ Crear docente (Guardar)
- ✅ Leer docentes (Buscar)
- ✅ Actualizar docente (Modificar)
- ✅ Eliminar docente (Eliminar)

## 🌐 URL del Proyecto Desplegado

https://ost6bnrzun5yo.ok.kimi.link

## 📝 Qué Debería Ver Cuando Funciona

### 1. Mensaje de Éxito al Cargar
```
┌─────────────────────────────────────┐
│  Sistema cargado correctamente      │
│  SQLite WASM activo                 │
└─────────────────────────────────────┘
```

### 2. Barra de Navegación
```
┌─────────────────────────────────────────────────────────┐
│ ::.. SISTEMA ACADEMICO ..::    Alumnos | Materias | Docentes│
└─────────────────────────────────────────────────────────┘
```

### 3. Formulario de Alumnos
```
┌────────────────────────────────────────┐
│      Registro de Alumnos               │
├────────────────────────────────────────┤
│  Código:    [________________]        │
│  Nombre:    [________________]        │
│  Dirección: [________________]        │
│  Email:     [________________]        │
│  Teléfono:  [________________]        │
│                                        │
│  [Guardar] [Nuevo] [Eliminar] [Buscar]│
└────────────────────────────────────────┘
```

### 4. Tabla de Búsqueda
```
┌────────────────────────────────────────────────────────┐
│              Búsqueda de Alumnos                       │
├────────────────────────────────────────────────────────┤
│ Buscar: [________________] [Buscar] [Cerrar]          │
├────────────────────────────────────────────────────────┤
│ Código  | Nombre | Dirección | Email | Teléfono | Acc │
├─────────┼────────┼───────────┼───────┼──────────┼─────┤
│ ALM001  | Juan   | Calle 1   | j@... | 1234     | [Sel│
└────────────────────────────────────────────────────────┘
```

### 5. Mensajes de Alerta
- 🟢 **Verde**: "Alumno guardado correctamente"
- 🟢 **Verde**: "Alumno modificado correctamente"
- 🟢 **Verde**: "Alumno eliminado correctamente"
- 🟡 **Amarillo**: "Debe seleccionar un alumno"
- 🔴 **Rojo**: "Error: [mensaje]"

## 🔧 Cómo Probar

1. **Abrir la URL**: https://ost6bnrzun5yo.ok.kimi.link
2. **Esperar** a que aparezca el mensaje "Sistema cargado correctamente"
3. **Hacer clic** en "Alumnos" en el menú
4. **Llenar el formulario**:
   - Código: ALM001
   - Nombre: Juan Pérez
   - Dirección: Calle Principal #123
   - Email: juan@email.com
   - Teléfono: 7890-1234
5. **Hacer clic** en "Guardar"
6. **Ver el mensaje** "Alumno guardado correctamente"
7. **Hacer clic** en "Buscar" para ver el registro en la tabla

## 💾 Persistencia de Datos

- Los datos se guardan en **memoria** usando SQLite WASM (sql.js)
- Nota: sql.js no soporta OPFS (Origin Private File System) directamente
- Los datos persisten durante la sesión del navegador
- Al recargar la página, los datos se reinician

## 📋 Requisitos del Sistema

- Navegador moderno (Chrome, Edge, Firefox)
- Soporte para WebAssembly
- Conexión a Internet (para cargar CDN)

## ⚠️ Notas Importantes

1. **SQLite WASM** funciona completamente en el navegador
2. Los datos se almacenan en memoria (no en disco)
3. Cada recarga de página reinicia la base de datos
4. Para persistencia real se necesitaría implementar guardado/carga de la base de datos
