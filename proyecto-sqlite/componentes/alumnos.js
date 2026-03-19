const alumnos = {
    props: ['forms'],
    data() {
        return {
            idAlumno: '',
            codigo: '',
            nombre: '',
            direccion: '',
            email: '',
            telefono: '',
            accion: 'guardar'
        }
    },
    methods: {
        async guardarAlumno() {
            if (!this.validarDatos()) return;
            
            // Verificar que dbSQLite esté inicializado
            if (!dbSQLite || !dbSQLite.db) {
                alertify.error('La base de datos no está lista. Espere un momento...');
                return;
            }
            
            try {
                if (this.accion === 'guardar') {
                    this.idAlumno = this.generarUUID();
                    dbSQLite.exec(
                        `INSERT INTO alumnos (idAlumno, codigo, nombre, direccion, email, telefono) 
                         VALUES (?, ?, ?, ?, ?, ?)`,
                        [this.idAlumno, this.codigo, this.nombre, this.direccion, this.email, this.telefono]
                    );
                    alertify.success('Alumno guardado correctamente');
                } else {
                    dbSQLite.exec(
                        `UPDATE alumnos SET codigo=?, nombre=?, direccion=?, email=?, telefono=? 
                         WHERE idAlumno=?`,
                        [this.codigo, this.nombre, this.direccion, this.email, this.telefono, this.idAlumno]
                    );
                    alertify.success('Alumno modificado correctamente');
                }
                this.limpiar();
            } catch (error) {
                console.error('Error:', error);
                alertify.error('Error: ' + error.message);
            }
        },
        
        async eliminarAlumno() {
            if (!this.idAlumno) {
                alertify.warning('Debe seleccionar un alumno');
                return;
            }
            
            // Verificar que dbSQLite esté inicializado
            if (!dbSQLite || !dbSQLite.db) {
                alertify.error('La base de datos no está lista. Espere un momento...');
                return;
            }
            
            alertify.confirm('Confirmar', '¿Está seguro de eliminar este alumno?',
                () => {
                    try {
                        dbSQLite.exec(
                            'DELETE FROM alumnos WHERE idAlumno = ?',
                            [this.idAlumno]
                        );
                        alertify.success('Alumno eliminado correctamente');
                        this.limpiar();
                    } catch (error) {
                        console.error('Error:', error);
                        alertify.error('Error: ' + error.message);
                    }
                },
                () => {}
            );
        },
        
        modificarAlumno(alumno) {
            this.idAlumno = alumno.idAlumno;
            this.codigo = alumno.codigo;
            this.nombre = alumno.nombre;
            this.direccion = alumno.direccion;
            this.email = alumno.email;
            this.telefono = alumno.telefono;
            this.accion = 'modificar';
            this.forms.alumnos.mostrar = true;
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
            this.idAlumno = '';
            this.codigo = '';
            this.nombre = '';
            this.direccion = '';
            this.email = '';
            this.telefono = '';
            this.accion = 'guardar';
        }
    },
    template: `
        <div class="container mt-3">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">Registro de Alumnos</h5>
                </div>
                <div class="card-body">
                    <form @submit.prevent="guardarAlumno">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Código:</label>
                                <input type="text" class="form-control" v-model="codigo" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Nombre:</label>
                                <input type="text" class="form-control" v-model="nombre" required>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 mb-3">
                                <label class="form-label">Dirección:</label>
                                <input type="text" class="form-control" v-model="direccion">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Email:</label>
                                <input type="email" class="form-control" v-model="email">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Teléfono:</label>
                                <input type="text" class="form-control" v-model="telefono">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary me-2">
                                    <span v-if="accion==='guardar'">Guardar</span>
                                    <span v-else>Modificar</span>
                                </button>
                                <button type="button" class="btn btn-success me-2" @click="limpiar">Nuevo</button>
                                <button type="button" class="btn btn-danger me-2" @click="eliminarAlumno">Eliminar</button>
                                <button type="button" class="btn btn-info" @click="$emit('buscar')">Buscar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
};
