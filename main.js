const { createApp } = Vue;

createApp({
    data() {
        return {
            alumnos: [],
            buscar: '',
            accion: 'nuevo',
            id: 0,
            alumno: {
                codigo: '',
                nombre: '',
                direccion: '',
                municipio: '',
                depto: '',
                fechaNac: '',
                sexo: 'Masculino',
                email: '',
                telefono: ''
            }
        }
    },
    methods: {
        obtenerAlumnos() {
            this.alumnos = [];
            let n = localStorage.length;
            for (let i = 0; i < n; i++) {
                let key = localStorage.key(i);
                if (!isNaN(key)) {
                    let data = JSON.parse(localStorage.getItem(key));
                    // Buscador por nombre o código
                    if (data.nombre.toUpperCase().includes(this.buscar.toUpperCase()) || 
                        data.codigo.toUpperCase().includes(this.buscar.toUpperCase())) {
                        this.alumnos.push(data);
                    }
                }
            }
        },
        guardarAlumno() {
            // Verificar duplicados solo si es nuevo
            if (this.accion === 'nuevo') {
                let duplicado = this.alumnos.find(a => a.codigo === this.alumno.codigo);
                if (duplicado) {
                    alert("El código ya existe para: " + duplicado.nombre);
                    return;
                }
            }

            let datos = {
                id: this.accion === 'modificar' ? this.id : new Date().getTime(),
                ...this.alumno
            };

            localStorage.setItem(datos.id, JSON.stringify(datos));
            this.limpiarFormulario();
            this.obtenerAlumnos();
        },
        modificarAlumno(item) {
            this.accion = 'modificar';
            this.id = item.id;
            // Copiamos los datos al formulario
            this.alumno = { ...item };
        },
        eliminarAlumno(id) {
            if (confirm("¿Seguro que desea eliminar este registro?")) {
                localStorage.removeItem(id);
                this.obtenerAlumnos();
            }
        },
        limpiarFormulario() {
            this.accion = 'nuevo';
            this.id = 0;
            this.alumno = {
                codigo: '',
                nombre: '',
                direccion: '',
                municipio: '',
                depto: '',
                fechaNac: '',
                sexo: 'Masculino',
                email: '',
                telefono: ''
            };
        }
    },
    mounted() {
        this.obtenerAlumnos();
    }
}).mount("#app");