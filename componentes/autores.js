app.component("autores-componente",{
template:`
<div class="card shadow p-4">

<h4>Registro de Autor</h4>

<form @submit.prevent="guardarAutor" class="row g-3">

<div class="col-md-6">
<input v-model="autor.codigo" class="form-control" placeholder="Código" required>
</div>

<div class="col-md-6">
<input v-model="autor.nombre" class="form-control" placeholder="Nombre" required>
</div>

<div class="col-md-6">
<input v-model="autor.pais" class="form-control" placeholder="País" required>
</div>

<div class="col-md-6">
<input v-model="autor.telefono" class="form-control" placeholder="Teléfono">
</div>

<div class="col-12">
<button class="btn btn-success w-100">
{{ autor.idAutor ? 'Modificar' : 'Guardar' }}
</button>
</div>

</form>

<hr>

<input v-model="buscar" class="form-control mb-3" placeholder="Buscar por código, nombre o país">

<table class="table table-bordered">
<thead class="table-dark">
<tr>
<th>Código</th>
<th>Nombre</th>
<th>País</th>
<th>Teléfono</th>
<th>Acciones</th>
</tr>
</thead>

<tbody>
<tr v-for="a in autoresFiltrados" :key="a.idAutor">
<td>{{a.codigo}}</td>
<td>{{a.nombre}}</td>
<td>{{a.pais}}</td>
<td>{{a.telefono}}</td>
<td>
<button class="btn btn-warning btn-sm me-1" @click="editar(a)">Editar</button>
<button class="btn btn-danger btn-sm" @click="eliminar(a.idAutor)">Eliminar</button>
</td>
</tr>
</tbody>
</table>

</div>
`,

data(){
return{
    autor:{},
    autores:[],
    buscar:''
}
},

computed:{
autoresFiltrados(){
    return this.autores.filter(a =>
        a.codigo?.toLowerCase().includes(this.buscar.toLowerCase()) ||
        a.nombre?.toLowerCase().includes(this.buscar.toLowerCase()) ||
        a.pais?.toLowerCase().includes(this.buscar.toLowerCase())
    );
}
},

methods:{
async cargarAutores(){
    this.autores = await db.autores.toArray();
},

async guardarAutor(){
    if(this.autor.idAutor){
        await db.autores.update(this.autor.idAutor,this.autor);
    }else{
        await db.autores.add(this.autor);
    }
    this.autor={};
    this.cargarAutores();
},

editar(a){
    this.autor = {...a};
},

async eliminar(id){
    await db.autores.delete(id);
    this.cargarAutores();
}
},

mounted(){
    this.cargarAutores();
}
});