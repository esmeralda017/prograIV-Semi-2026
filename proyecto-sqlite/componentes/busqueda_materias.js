const busqueda_materias = {
    data() {
        return {
            busqueda: '',
            materias: []
        }
    },
    methods: {
        async obtenerMaterias() {
            // Verificar que dbSQLite esté inicializado
            if (!dbSQLite || !dbSQLite.db) {
                alertify.error('La base de datos no está lista. Espere un momento...');
                return;
            }
            
            try {
                let sql = 'SELECT * FROM materias';
                let params = [];
                
                if (this.busqueda.trim()) {
                    sql += ' WHERE codigo LIKE ? OR nombre LIKE ?';
                    params = [`%${this.busqueda}%`, `%${this.busqueda}%`];
                }
                
                sql += ' ORDER BY nombre';
                
                this.materias = dbSQLite.select(sql, params);
            } catch (error) {
                console.error('Error:', error);
                alertify.error('Error al obtener materias: ' + error.message);
            }
        },
        
        seleccionarMateria(materia) {
            this.$emit('modificar', materia);
        },
        
        cerrar() {
            this.busqueda = '';
            this.materias = [];
        }
    },
    template: `
        <div class="container mt-3">
            <div class="card">
                <div class="card-header bg-info text-white">
                    <h5 class="mb-0">Búsqueda de Materias</h5>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-8">
                            <input type="text" class="form-control" v-model="busqueda" 
                                   placeholder="Buscar por código o nombre..." @keyup.enter="obtenerMaterias">
                        </div>
                        <div class="col-md-4">
                            <button class="btn btn-primary me-2" @click="obtenerMaterias">Buscar</button>
                            <button class="btn btn-secondary" @click="cerrar">Cerrar</button>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>UV</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="materia in materias" :key="materia.idMateria">
                                    <td>{{ materia.codigo }}</td>
                                    <td>{{ materia.nombre }}</td>
                                    <td>{{ materia.uv }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-warning" @click="seleccionarMateria(materia)">
                                            Seleccionar
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="materias.length === 0">
                                    <td colspan="4" class="text-center">No se encontraron registros</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
};
