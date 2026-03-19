const busqueda_alumnos = {
    data() {
        return {
            busqueda: '',
            alumnos: []
        }
    },
    methods: {
        async obtenerAlumnos() {
            // Verificar que dbSQLite esté inicializado
            if (!dbSQLite || !dbSQLite.db) {
                alertify.error('La base de datos no está lista. Espere un momento...');
                return;
            }
            
            try {
                let sql = 'SELECT * FROM alumnos';
                let params = [];
                
                if (this.busqueda.trim()) {
                    sql += ' WHERE codigo LIKE ? OR nombre LIKE ?';
                    params = [`%${this.busqueda}%`, `%${this.busqueda}%`];
                }
                
                sql += ' ORDER BY nombre';
                
                this.alumnos = dbSQLite.select(sql, params);
            } catch (error) {
                console.error('Error:', error);
                alertify.error('Error al obtener alumnos: ' + error.message);
            }
        },
        
        seleccionarAlumno(alumno) {
            this.$emit('modificar', alumno);
        },
        
        cerrar() {
            this.busqueda = '';
            this.alumnos = [];
        }
    },
    template: `
        <div class="container mt-3">
            <div class="card">
                <div class="card-header bg-info text-white">
                    <h5 class="mb-0">Búsqueda de Alumnos</h5>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-8">
                            <input type="text" class="form-control" v-model="busqueda" 
                                   placeholder="Buscar por código o nombre..." @keyup.enter="obtenerAlumnos">
                        </div>
                        <div class="col-md-4">
                            <button class="btn btn-primary me-2" @click="obtenerAlumnos">Buscar</button>
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
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="alumno in alumnos" :key="alumno.idAlumno">
                                    <td>{{ alumno.codigo }}</td>
                                    <td>{{ alumno.nombre }}</td>
                                    <td>{{ alumno.direccion }}</td>
                                    <td>{{ alumno.email }}</td>
                                    <td>{{ alumno.telefono }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-warning" @click="seleccionarAlumno(alumno)">
                                            Seleccionar
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="alumnos.length === 0">
                                    <td colspan="6" class="text-center">No se encontraron registros</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
};
