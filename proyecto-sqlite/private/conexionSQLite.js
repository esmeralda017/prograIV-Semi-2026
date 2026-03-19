// Clase para manejar la conexión SQLite WASM con OPFS
class ConexionSQLite {
    constructor() {
        this.worker = null;
        this.messageId = 0;
        this.pendingPromises = new Map();
    }

    async init() {
        return new Promise((resolve, reject) => {
            this.worker = new Worker('worker.js');
            
            this.worker.onmessage = (e) => {
                const { action, result, error, id } = e.data;
                
                if (id && this.pendingPromises.has(id)) {
                    const { resolve, reject } = this.pendingPromises.get(id);
                    this.pendingPromises.delete(id);
                    
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(result);
                    }
                }
                
                if (action === 'init' && !id) {
                    resolve(result);
                }
            };
            
            this.worker.onerror = (error) => {
                console.error('Worker error:', error);
                reject(error);
            };
            
            // Inicializar la base de datos
            this.sendMessage('init').then(resolve).catch(reject);
        });
    }

    sendMessage(action, data = {}) {
        return new Promise((resolve, reject) => {
            const id = ++this.messageId;
            this.pendingPromises.set(id, { resolve, reject });
            this.worker.postMessage({ action, data, id });
        });
    }

    async exec(sql, params = []) {
        return this.sendMessage('exec', { sql, params });
    }

    async select(sql, params = []) {
        return this.sendMessage('select', { sql, params });
    }

    async close() {
        return this.sendMessage('close');
    }
}

// Instancia global
const dbSQLite = new ConexionSQLite();
