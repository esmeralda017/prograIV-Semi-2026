// ══════════════════════════════════════════════
//  componentes/libros.js
//  db_usss017124_OLimpiarivas — Parcial_I
// ══════════════════════════════════════════════

const KEY_AUTORES = 'db_usss017124_OLimpiarivas_autores';
const KEY_LIBROS  = 'db_usss017124_OLimpiarivas_libros';

function loadAutores() { return JSON.parse(localStorage.getItem(KEY_AUTORES) || '[]'); }
function saveAutores(d) { localStorage.setItem(KEY_AUTORES, JSON.stringify(d)); }
function loadLibros()  { return JSON.parse(localStorage.getItem(KEY_LIBROS)  || '[]'); }
function saveLibros(d) { localStorage.setItem(KEY_LIBROS,  JSON.stringify(d)); }

// ── ABRIR / CERRAR MODALES ─────────────────────
function abrir(id) {
  document.getElementById(id).classList.add('abierto');
}
function cerrar(id) {
  document.getElementById(id).classList.remove('abierto');
}

// ══ MODAL AUTOR ════════════════════════════════

function abrirAutor(idEditar) {
  // Limpiar
  document.getElementById('a-id').value     = '';
  document.getElementById('a-codigo').value  = '';
  document.getElementById('a-nombre').value  = '';
  document.getElementById('a-pais').value    = '';
  document.getElementById('a-telefono').value = '';

  if (idEditar) {
    const a = loadAutores().find(x => x.idAutor === idEditar);
    if (!a) return;
    document.getElementById('a-id').value     = a.idAutor;
    document.getElementById('a-codigo').value  = a.codigo;
    document.getElementById('a-nombre').value  = a.nombre;
    document.getElementById('a-pais').value    = a.pais;
    document.getElementById('a-telefono').value = a.telefono || '';
    document.getElementById('titulo-modal-autor').innerHTML =
      '<i class="bi bi-pencil me-2"></i>Editar Autor';
  } else {
    document.getElementById('titulo-modal-autor').innerHTML =
      '<i class="bi bi-person-plus me-2"></i>Nuevo Autor';
  }
  abrir('overlayAutor');
}

function guardarAutor() {
  const codigo   = document.getElementById('a-codigo').value.trim();
  const nombre   = document.getElementById('a-nombre').value.trim();
  const pais     = document.getElementById('a-pais').value.trim();
  const telefono = document.getElementById('a-telefono').value.trim();
  const idEdit   = document.getElementById('a-id').value;

  if (!codigo) return toast('El campo Código es obligatorio.', true);
  if (!nombre) return toast('El campo Nombre es obligatorio.', true);
  if (!pais)   return toast('El campo País es obligatorio.', true);

  let autores = loadAutores();

  if (idEdit) {
    // EDITAR
    const idx = autores.findIndex(a => a.idAutor === parseInt(idEdit));
    if (idx === -1) return;
    autores[idx] = { ...autores[idx], codigo, nombre, pais, telefono };
    toast('✅ Autor "' + nombre + '" actualizado.');
  } else {
    // NUEVO — código único
    if (autores.find(a => a.codigo.toLowerCase() === codigo.toLowerCase()))
      return toast('El código "' + codigo + '" ya existe.', true);
    autores.push({ idAutor: Date.now(), codigo, nombre, pais, telefono });
    toast('✅ Autor "' + nombre + '" registrado.');
  }

  saveAutores(autores);
  cerrar('overlayAutor');
  buscarAutores();
  cargarComboAutores();
}

function eliminarAutor(id) {
  const a = loadAutores().find(x => x.idAutor === id);
  if (!a) return;
  const n = loadLibros().filter(l => l.idAutor === id).length;
  document.getElementById('confirm-msg').textContent =
    n > 0
      ? 'El autor "' + a.nombre + '" tiene ' + n + ' libro(s) asociado(s). ¿Eliminar de todos modos?'
      : '¿Eliminar al autor "' + a.nombre + '"?';
  document.getElementById('confirm-btn').onclick = () => {
    saveAutores(loadAutores().filter(x => x.idAutor !== id));
    if (n > 0)
      saveLibros(loadLibros().map(l => l.idAutor === id ? { ...l, idAutor: null } : l));
    cerrar('overlayConfirm');
    buscarAutores();
    buscarLibros();
    toast('🗑️ Autor "' + a.nombre + '" eliminado.');
  };
  abrir('overlayConfirm');
}

function renderAutores(lista) {
  const autores = lista !== undefined ? lista : loadAutores();
  const libros  = loadLibros();
  document.getElementById('cnt-autores').textContent = loadAutores().length;
  const tbody = document.getElementById('tbody-autores');
  tbody.innerHTML = '';

  if (!autores.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="8">No se encontraron autores.</td></tr>';
    return;
  }

  autores.forEach((a, i) => {
    const nL = libros.filter(l => l.idAutor === a.idAutor).length;
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td class="td-muted">' + (i+1) + '</td>' +
      '<td class="td-muted" style="font-size:.75rem">' + a.idAutor + '</td>' +
      '<td><span class="bdg bdg-gold">' + a.codigo + '</span></td>' +
      '<td style="font-weight:500">' + a.nombre + '</td>' +
      '<td><span class="bdg bdg-green">' + a.pais + '</span></td>' +
      '<td class="td-muted">' + (a.telefono || '—') + '</td>' +
      '<td><span class="bdg bdg-blue">' + nL + '</span></td>' +
      '<td>' +
        '<button class="btn-icon btn-edit me-1" onclick="abrirAutor(' + a.idAutor + ')" title="Editar"><i class="bi bi-pencil"></i></button>' +
        '<button class="btn-icon btn-del" onclick="eliminarAutor(' + a.idAutor + ')" title="Eliminar"><i class="bi bi-trash"></i></button>' +
      '</td>';
    tbody.appendChild(tr);
  });
}

// ══ MODAL LIBRO ════════════════════════════════

function cargarComboAutores(selectedId) {
  const sel = document.getElementById('l-autor');
  if (!sel) return;
  sel.innerHTML = '<option value="">— Seleccione un Autor —</option>';
  loadAutores().forEach(a => {
    const opt = document.createElement('option');
    opt.value = a.idAutor;
    opt.textContent = '[' + a.idAutor + '] ' + a.nombre + ' (' + a.codigo + ')';
    if (selectedId && a.idAutor === selectedId) opt.selected = true;
    sel.appendChild(opt);
  });
}

function abrirLibro(idEditar) {
  // Limpiar
  document.getElementById('l-id').value        = '';
  document.getElementById('l-isbn').value      = '';
  document.getElementById('l-titulo').value    = '';
  document.getElementById('l-editorial').value = '';
  document.getElementById('l-edicion').value   = '';
  cargarComboAutores();

  if (idEditar) {
    const l = loadLibros().find(x => x.idLibro === idEditar);
    if (!l) return;
    document.getElementById('l-id').value        = l.idLibro;
    document.getElementById('l-isbn').value      = l.isbn;
    document.getElementById('l-titulo').value    = l.titulo;
    document.getElementById('l-editorial').value = l.editorial;
    document.getElementById('l-edicion').value   = l.edicion || '';
    cargarComboAutores(l.idAutor);
    document.getElementById('titulo-modal-libro').innerHTML =
      '<i class="bi bi-pencil me-2"></i>Editar Libro';
  } else {
    document.getElementById('titulo-modal-libro').innerHTML =
      '<i class="bi bi-book-half me-2"></i>Nuevo Libro';
  }
  abrir('overlayLibro');
}

function guardarLibro() {
  const isbn      = document.getElementById('l-isbn').value.trim();
  const titulo    = document.getElementById('l-titulo').value.trim();
  const idAutor   = parseInt(document.getElementById('l-autor').value) || null;
  const editorial = document.getElementById('l-editorial').value.trim();
  const edicion   = document.getElementById('l-edicion').value.trim();
  const idEdit    = document.getElementById('l-id').value;

  if (!isbn)      return toast('El campo ISBN es obligatorio.', true);
  if (!titulo)    return toast('El campo Título es obligatorio.', true);
  if (!idAutor)   return toast('Debe seleccionar un Autor.', true);
  if (!editorial) return toast('El campo Editorial es obligatorio.', true);

  let libros = loadLibros();

  if (idEdit) {
    // EDITAR
    const idx = libros.findIndex(l => l.idLibro === parseInt(idEdit));
    if (idx === -1) return;
    libros[idx] = { ...libros[idx], isbn, titulo, idAutor, editorial, edicion };
    toast('✅ Libro "' + titulo + '" actualizado.');
  } else {
    // NUEVO — ISBN único
    if (libros.find(l => l.isbn.toLowerCase() === isbn.toLowerCase()))
      return toast('El ISBN "' + isbn + '" ya existe.', true);
    libros.push({ idLibro: Date.now(), idAutor, isbn, titulo, editorial, edicion });
    toast('📖 Libro "' + titulo + '" registrado.');
  }

  saveLibros(libros);
  cerrar('overlayLibro');
  buscarLibros();
}

function eliminarLibro(id) {
  const l = loadLibros().find(x => x.idLibro === id);
  if (!l) return;
  document.getElementById('confirm-msg').textContent = '¿Eliminar el libro "' + l.titulo + '"?';
  document.getElementById('confirm-btn').onclick = () => {
    saveLibros(loadLibros().filter(x => x.idLibro !== id));
    cerrar('overlayConfirm');
    buscarLibros();
    toast('🗑️ Libro "' + l.titulo + '" eliminado.');
  };
  abrir('overlayConfirm');
}

function renderLibros(lista) {
  const libros  = lista !== undefined ? lista : loadLibros();
  const autores = loadAutores();
  document.getElementById('cnt-libros').textContent = loadLibros().length;
  const tbody = document.getElementById('tbody-libros');
  tbody.innerHTML = '';

  if (!libros.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="8">No se encontraron libros.</td></tr>';
    return;
  }

  libros.forEach((l, i) => {
    const autor = autores.find(a => a.idAutor === l.idAutor);
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td class="td-muted">' + (i+1) + '</td>' +
      '<td class="td-muted" style="font-size:.75rem">' + l.idLibro + '</td>' +
      '<td><span class="bdg bdg-gold">' + l.isbn + '</span></td>' +
      '<td style="font-weight:500">' + l.titulo + '</td>' +
      '<td>' + (autor
        ? autor.nombre + ' <span class="td-muted">[' + l.idAutor + ']</span>'
        : '<span style="color:var(--muted)">Sin autor</span>') + '</td>' +
      '<td class="td-muted">' + l.editorial + '</td>' +
      '<td><span class="bdg bdg-blue">' + (l.edicion || '—') + '</span></td>' +
      '<td>' +
        '<button class="btn-icon btn-edit me-1" onclick="abrirLibro(' + l.idLibro + ')" title="Editar"><i class="bi bi-pencil"></i></button>' +
        '<button class="btn-icon btn-del" onclick="eliminarLibro(' + l.idLibro + ')" title="Eliminar"><i class="bi bi-trash"></i></button>' +
      '</td>';
    tbody.appendChild(tr);
  });
}