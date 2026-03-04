// ══════════════════════════════════════════════
//  componentes/busqueda_libros.js
//  db_usss017124_OLimpiarivas — Parcial_I
//  autor  → codigo, nombre, pais, telefono
//  libros → isbn, titulo, editorial, edicion, nombre autor
// ══════════════════════════════════════════════

function buscarAutores() {
  const q = document.getElementById('search-autor').value.toLowerCase().trim();
  const todos = loadAutores();
  const resultado = !q ? todos : todos.filter(a =>
    a.codigo.toLowerCase().includes(q)          ||
    a.nombre.toLowerCase().includes(q)          ||
    a.pais.toLowerCase().includes(q)            ||
    (a.telefono || '').toLowerCase().includes(q)
  );
  renderAutores(resultado);
}

function buscarLibros() {
  const q       = document.getElementById('search-libro').value.toLowerCase().trim();
  const todos   = loadLibros();
  const autores = loadAutores();
  const resultado = !q ? todos : todos.filter(l => {
    const autor = autores.find(a => a.idAutor === l.idAutor);
    return (
      l.isbn.toLowerCase().includes(q)             ||
      l.titulo.toLowerCase().includes(q)           ||
      l.editorial.toLowerCase().includes(q)        ||
      (l.edicion || '').toLowerCase().includes(q)  ||
      (autor ? autor.nombre.toLowerCase().includes(q) : false)
    );
  });
  renderLibros(resultado);
}