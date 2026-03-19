// Sistema Académico con SQLite WASM
const { createApp } = Vue;

// Variable global para la base de datos SQLite
let dbSQLite = null;

// Clase para manejar SQLite WASM usando sql.js
class ConexionSQLite {
    constructor() {
        this.db = null;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return true;
        
        try {
            console.log('Inicializando SQLite WASM (sql.js)...');
            
            // Inicializar sql.js - la función initSqlJs está disponible globalmente
            const SQL = await initSqlJs({
                locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`
            });
            
            console.log('SQL.js inicializado');
            
            // Crear base de datos en memoria
            this.db = new SQL.Database();
            console.log('Base de datos en memoria creada');
            
            // Crear tablas
            this.crearTablas();
            
            this.initialized = true;
            console.log('SQLite WASM inicializado correctamente');
            return true;
            
        } catch (error) {
            console.error('Error al inicializar SQLite:', error);
            throw error;
        }
    }

    crearTablas() {
        try {
            // Tabla alumnos
            this.db.run(`
                CREATE TABLE IF NOT EXISTS alumnos (
                    idAlumno TEXT PRIMARY KEY,
                    codigo TEXT UNIQUE NOT NULL,
                    nombre TEXT NOT NULL,
                    direccion TEXT,
                    email TEXT,
                    telefono TEXT
                )
            `);
            
            // Tabla materias
            this.db.run(`
                CREATE TABLE IF NOT EXISTS materias (
                    idMateria TEXT PRIMARY KEY,
                    codigo TEXT UNIQUE NOT NULL,
                    nombre TEXT NOT NULL,
                    uv INTEGER NOT NULL
                )
            `);
            
            // Tabla docentes
            this.db.run(`
                CREATE TABLE IF NOT EXISTS docentes (
                    idDocente TEXT PRIMARY KEY,
                    codigo TEXT UNIQUE NOT NULL,
                    nombre TEXT NOT NULL,
                    direccion TEXT,
                    email TEXT,
                    telefono TEXT,
                    escalafon TEXT
                )
            `);
            
            console.log('Tablas creadas/verificadas correctamente');
        } catch (error) {
            console.error('Error al crear tablas:', error);
            throw error;
        }
    }

    exec(sql, params = []) {
        if (!this.db) {
            throw new Error('Base de datos no inicializada');
        }
        try {
            if (params && params.length > 0) {
                const stmt = this.db.prepare(sql);
                stmt.run(params);
                stmt.free();
            } else {
                this.db.run(sql);
            }
            return { success: true };
        } catch (error) {
            throw error;
        }
    }

    select(sql, params = []) {
        if (!this.db) {
            throw new Error('Base de datos no inicializada');
        }
        try {
            const stmt = this.db.prepare(sql);
            
            if (params && params.length > 0) {
                stmt.bind(params);
            }
            
            const rows = [];
            while (stmt.step()) {
                const row = stmt.getAsObject();
                rows.push(row);
            }
            
            stmt.free();
            return rows;
        } catch (error) {
            throw error;
        }
    }

    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}

// Inicializar la base de datos global
dbSQLite = new ConexionSQLite();

// Inicializar la aplicación Vue
createApp({
    components:{
        alumnos,
        busqueda_alumnos,
        materias,
        busqueda_materias,
        docentes,
        busqueda_docentes
    },
    data(){
        return{
            forms:{
                alumnos:{mostrar:false},
                busqueda_alumnos:{mostrar:false},
                materias:{mostrar:false},
                busqueda_materias:{mostrar:false},
                docentes:{mostrar:false},
                busqueda_docentes:{mostrar:false},
                matriculas:{mostrar:false},
                inscripciones:{mostrar:false}
            },
            cargando: true,
            error: null
        }
    },
    methods:{
        buscar(ventana, metodo){
            this.forms[ventana].mostrar = true;
            this.$nextTick(() => {
                if (this.$refs[ventana] && this.$refs[ventana][metodo]) {
                    this.$refs[ventana][metodo]();
                }
            });
        },
        abrirVentana(ventana){
            this.forms[ventana].mostrar = !this.forms[ventana].mostrar;
        },
        modificar(ventana, metodo, data){
            this.$refs[ventana][metodo](data);
        }
    },
    async mounted(){
        // Inicializar SQLite WASM
        try {
            await dbSQLite.init();
            this.cargando = false;
            alertify.success('Sistema cargado correctamente - SQLite WASM activo');
        } catch (error) {
            console.error('Error al inicializar SQLite:', error);
            this.error = error.message;
            this.cargando = false;
            alertify.error('Error al cargar la base de datos: ' + error.message);
        }
    }
}).mount("#app");
