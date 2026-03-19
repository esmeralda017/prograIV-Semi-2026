const busqueda_docentes = {
    data() {
        return {
            busqueda: '',
            docentes: []
        }
    },
    methods: {
        async obtenerDocentes() {
            // Verificar que dbSQLite esté inicializado
            if (!dbSQLite || !dbSQLite.db) {
                alertify.error('La base de datos no está lista. Espere un momento...');
                return;
            }
            
            try {
                let sql = 'SELECT * FROM docentes';
                let params = [];
                
                if (this.busqueda.trim()) {
                    sql += ' WHERE codigo LIKE ? OR nombre LIKE ?';
                    params = [`%${this.busqueda}%`, `%${this.busqueda}%`];
                }
                
                sql += ' ORDER BY nombre';
                
                this.docentes = dbSQLite.select(sql, params);
            } catch (error) {
                console.error('Error:', error);
                alertify.error('Error al obtener docentes: ' + error.message);
            }
        },
        
        seleccionarDocente(docente) {
            this.$emit('modificar', docente);
        },
        
        cerrar() {
            this.busqueda = '';
            this.docentes = [];
        }
    },
    template: `
        <div class="container mt-3">
            <div class="card">
               úmero<div class="card-header bg-info text-white">
                    <h5 class="mb-0">Búsqueda de Docentes</h5>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-8">
                            <input type="text" class="form-control" v-model="busqueda" 
                                   placeholder="Buscar por código o nombre..." @keyup.enter="obtenerDocentes">
                        </div>
                        <div class="col-md-4">
                            <button class="btn btn-primary me-2" @click="obtenerDocentes">Buscar</button>
                            <button class="btn btn-secondary" @click="cerrar">Cerrar</button>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Dirección</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th>Escalafón</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="docente in docentes" :key="docente.idDocente">
                                    <td>{{ docente.codigo }}</td>
                                    <td>{{ docente.nombre }}</td>
                                    <td>{{ docente.direccion }}</td>
                                    <td>{{ docente.email }}</td>
                                    <td>{{ docente.telefono }}</td>
                                    <td>{{ docente.escalafon }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-warning" @click="seleccionarDocente(docente)">
                                            Seleccionar
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="docentes.length === 0">
                                    <td colspan="7" class="text-center">No se encontraron registros</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
};
