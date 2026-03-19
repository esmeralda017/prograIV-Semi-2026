// Worker para SQLite WASM con OPFS
let db = null;

self.onmessage = async function(e) {
    const { action, data, id } = e.data;
    
    try {
        switch(action) {
            case 'init':
                await initDB();
                self.postMessage({ action: 'init', result: 'OK', id });
                break;
                
            case 'exec':
                const execResult = execSQL(data.sql, data.params);
                self.postMessage({ action: 'exec', result: execResult, id });
                break;
                
            case 'select':
                const rows = selectSQL(data.sql, data.params);
                self.postMessage({ action: 'select', result: rows, id });
                break;
                
            case 'close':
                if (db) {
                    db.close();
                    db = null;
                }
                self.postMessage({ action: 'close', result: 'OK', id });
                break;
                
            default:
                self.postMessage({ action, error: 'Acción no válida', id });
        }
    } catch (error) {
        console.error('Worker error:', error);
        self.postMessage({ action, error: error.message, id });
    }
};

async function initDB() {
    if (db) return;
    
    try {
        // Importar SQLite3 dinámicamente
        const sqlite3Module = await import('https://cdn.jsdelivr.net/npm/@sqlite.org/sqlite-wasm@3.48.0/sqlite3.mjs');
        const sqlite3 = sqlite3Module.default;
        
        console.log('SQLite3 módulo cargado');
        
        // Usar OPFS si está disponible
        if (sqlite3.oo1.OpfsDb) {
            db = new sqlite3.oo1.OpfsDb('/db_academica.db');
            console.log('Base de datos OPFS creada/abierta');
        } else {
            // Fallback a memoria
            db = new sqlite3.oo1.DB(':memory:');
            console.log('Base de datos en memoria creada');
        }
        
        // Crear tablas
        crearTablas();
        
    } catch (error) {
        console.error('Error al inicializar SQLite:', error);
        throw error;
    }
}

function crearTablas() {
    try {
        // Tabla alumnos
        db.exec(`
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
        db.exec(`
            CREATE TABLE IF NOT EXISTS materias (
                idMateria TEXT PRIMARY KEY,
                codigo TEXT UNIQUE NOT NULL,
                nombre TEXT NOT NULL,
                uv INTEGER NOT NULL
            )
        `);
        
        // Tabla docentes
        db.exec(`
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

function execSQL(sql, params = []) {
    try {
        if (params && params.length > 0) {
            const stmt = db.prepare(sql);
            stmt.bind(params);
            stmt.step();
            stmt.finalize();
        } else {
            db.exec(sql);
        }
        return { success: true };
    } catch (error) {
        throw error;
    }
}

function selectSQL(sql, params = []) {
    try {
        const rows = [];
        const stmt = db.prepare(sql);
        
        if (params && params.length > 0) {
            stmt.bind(params);
        }
        
        while (stmt.step()) {
            const row = stmt.get({}).result;
            const obj = {};
            for (let i = 0; i < stmt.columnCount; i++) {
                const colName = stmt.columnName(i);
                obj[colName] = row[i];
            }
            rows.push(obj);
        }
        
        stmt.finalize();
        return rows;
    } catch (error) {
        throw error;
    }
}
