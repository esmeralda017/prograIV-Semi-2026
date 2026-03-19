const materias = {
    props: ['forms'],
    data() {
        return {
            idMateria: '',
            codigo: '',
            nombre: '',
            uv: '',
            accion: 'guardar'
        }
    },
    methods: {
        async guardarMateria() {
            if (!this.validarDatos()) return;
            
            // Verificar que dbSQLite esté inicializado
            if (!dbSQLite || !dbSQLite.db) {
                alertify.error('La base de datos no está lista. Espere un momento...');
                return;
            }
            
            try {
                if (this.accion === 'guardar') {
                    this.idMateria = this.generarUUID();
                    dbSQLite.exec(
                        `INSERT INTO materias (idMateria, codigo, nombre, uv) 
                         VALUES (?, ?, ?, ?)`,
                        [this.idMateria, this.codigo, this.nombre, parseInt(this.uv)]
                    );
                    alertify.success('Materia guardada correctamente');
                } else {
                    dbSQLite.exec(
                        `UPDATE materias SET codigo=?, nombre=?, uv=? WHERE idMateria=?`,
                        [this.codigo, this.nombre, parseInt(this.uv), this.idMateria]
                    );
                    alertify.success('Materia modificada correctamente');
                }
                this.limpiar();
            } catch (error) {
                console.error('Error:', error);
                alertify.error('Error: ' + error.message);
            }
        },
        
        async eliminarMateria() {
            if (!this.idMateria) {
                alertify.warning('Debe seleccionar una materia');
                return;
            }
            
            // Verificar que dbSQLite esté inicializado
            if (!dbSQLite || !dbSQLite.db) {
                alertify.error('La base de datos no está lista. Espere un momento...');
                return;
            }
            
            alertify.confirm('Confirmar', '¿Está seguro de eliminar esta materia?',
                () => {
                    try {
                        dbSQLite.exec(
                            'DELETE FROM materias WHERE idMateria = ?',
                            [this.idMateria]
                        );
                        alertify.success('Materia eliminada correctamente');
                        this.limpiar();
                    } catch (error) {
                        console.error('Error:', error);
                        alertify.error('Error: ' + error.message);
                    }
                },
                () => {}
            );
        },
        
        modificarMateria(materia) {
            this.idMateria = materia.idMateria;
            this.codigo = materia.codigo;
            this.nombre = materia.nombre;
            this.uv = materia.uv;
            this.accion = 'modificar';
            this.forms.materias.mostrar = true;
        },
        
        validarDatos() {
            if (!this.codigo.trim()) {
                alertify.warning('El código es obligatorio');
                return false;
            }
            if (!this.nombre.trim()) {
                alertify.warning('El nombre es obligatorio');
                return false;
            }
            if (!this.uv || this.uv < 1) {
                alertify.warning('Las UV deben ser mayor a 0');
                return false;
            }
            return true;
        },
        
        generarUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        
        limpiar() {
            this.idMateria = '';
            this.codigo = '';
            this.nombre = '';
            this.uv = '';
            this.accion = 'guardar';
        }
    },
    template: `
        <div class="container mt-3">
            <div class="card">
                <div class="card-header bg-success text-white">
                    <h5 class="mb-0">Registro de Materias</h5>
                </div>
                <div class="card-body">
                    <form @submit.prevent="guardarMateria">
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Código:</label>
                                <input type="text" class="form-control" v-model="codigo" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Nombre:</label>
                                <input type="text" class="form-control" v-model="nombre" required>
                            </div>
                            <div class="col-md-2 mb-3">
                                <label class="form-label">UV:</label>
                                <input type="number" class="form-control" v-model="uv" min="1" required>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary me-2">
                                    <span v-if="accion==='guardar'">Guardar</span>
                                    <span v-else>Modificar</span>
                                </button>
                                <button type="button" class="btn btn-success me-2" @click="limpiar">Nuevo</button>
                                <button type="button" class="btn btn-danger me-2" @click="eliminarMateria">Eliminar</button>
                                <button type="button" class="btn btn-info" @click="$emit('buscar')">Buscar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
};
