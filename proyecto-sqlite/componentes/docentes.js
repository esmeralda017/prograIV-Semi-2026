const docentes = {
    props: ['forms'],
    data() {
        return {
            idDocente: '',
            codigo: '',
            nombre: '',
            direccion: '',
            email: '',
            telefono: '',
            escalafon: '',
            accion: 'guardar'
        }
    },
    methods: {
        async guardarDocente() {
            if (!this.validarDatos()) return;
            
            // Verificar que dbSQLite esté inicializado
            if (!dbSQLite || !dbSQLite.db) {
                alertify.error('La base de datos no está lista. Espere un momento...');
                return;
            }
            
            try {
                if (this.accion === 'guardar') {
                    this.idDocente = this.generarUUID();
                    dbSQLite.exec(
                        `INSERT INTO docentes (idDocente, codigo, nombre, direccion, email, telefono, escalafon) 
                         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [this.idDocente, this.codigo, this.nombre, this.direccion, this.email, this.telefono, this.escalafon]
                    );
                    alertify.success('Docente guardado correctamente');
                } else {
                    dbSQLite.exec(
                        `UPDATE docentes SET codigo=?, nombre=?, direccion=?, email=?, telefono=?, escalafon=? 
                         WHERE idDocente=?`,
                        [this.codigo, this.nombre, this.direccion, this.email, this.telefono, this.escalafon, this.idDocente]
                    );
                    alertify.success('Docente modificado correctamente');
                }
                this.limpiar();
            } catch (error) {
                console.error('Error:', error);
                alertify.error('Error: ' + error.message);
            }
        },
        
        async eliminarDocente() {
            if (!this.idDocente) {
                alertify.warning('Debe seleccionar un docente');
                return;
            }
            
            // Verificar que dbSQLite esté inicializado
            if (!dbSQLite || !dbSQLite.db) {
                alertify.error('La base de datos no está lista. Espere un momento...');
                return;
            }
            
            alertify.confirm('Confirmar', '¿Está seguro de eliminar este docente?',
                () => {
                    try {
                        dbSQLite.exec(
                            'DELETE FROM docentes WHERE idDocente = ?',
                            [this.idDocente]
                        );
                        alertify.success('Docente eliminado correctamente');
                        this.limpiar();
                    } catch (error) {
                        console.error('Error:', error);
                        alertify.error('Error: ' + error.message);
                    }
                },
                () => {}
            );
        },
        
        modificarDocente(docente) {
            this.idDocente = docente.idDocente;
            this.codigo = docente.codigo;
            this.nombre = docente.nombre;
            this.direccion = docente.direccion;
            this.email = docente.email;
            this.telefono = docente.telefono;
            this.escalafon = docente.escalafon;
            this.accion = 'modificar';
            this.forms.docentes.mostrar = true;
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
            this.idDocente = '';
            this.codigo = '';
            this.nombre = '';
            this.direccion = '';
            this.email = '';
            this.telefono = '';
            this.escalafon = '';
            this.accion = 'guardar';
        }
    },
    template: `
        <div class="container mt-3">
            <div class="card">
                <div class="card-header bg-warning text-dark">
                    <h5 class="mb-0">Registro de Docentes</h5>
                </div>
                <div class="card-body">
                    <form @submit.prevent="guardarDocente">
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
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Email:</label>
                                <input type="email" class="form-control" v-model="email">
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Teléfono:</label>
                                <input type="text" class="form-control" v-model="telefono">
                            </div>
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Escalafón:</label>
                                <input type="text" class="form-control" v-model="escalafon">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary me-2">
                                    <span v-if="accion==='guardar'">Guardar</span>
                                    <span v-else>Modificar</span>
                                </button>
                                <button type="button" class="btn btn-success me-2" @click="limpiar">Nuevo</button>
                                <button type="button" class="btn btn-danger me-2" @click="eliminarDocente">Eliminar</button>
                                <button type="button" class="btn btn-info" @click="$emit('buscar')">Buscar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
};
