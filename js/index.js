let pagina = 1;
const resultadosPorPagina = 6;

document.getElementById('anterior').addEventListener('click', () => {
  if (pagina > 1) {
    pagina--;
    cargarinmuebles();
  }
});

document.getElementById('siguiente').addEventListener('click', () => {
  pagina++;
  cargarinmuebles();
});

async function cargarinmuebles() {
  const buscador = document.getElementById('buscador');
  const filtroTipo = document.getElementById('filtro-tipo');
  const filtroPrecio = document.getElementById('filtro-precio');
  const contenedor = document.getElementById('inmuebles-container');

  let { data, error } = await supabase
    .from('inmuebles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al cargar inmuebles:', error.message);
    contenedor.innerHTML = '<p>Error al cargar inmuebles.</p>';
    return;
  }

  // Filtros
  const textoBusqueda = buscador.value.toLowerCase();
  const tipoSeleccionado = filtroTipo.value;
  const precioSeleccionado = filtroPrecio.value;

  data = data.filter(inmueble => {
    const coincideBusqueda =
      inmueble.titulo.toLowerCase().includes(textoBusqueda) ||
      inmueble.descripcion.toLowerCase().includes(textoBusqueda) ||
      inmueble.municipio.toLowerCase().includes(textoBusqueda);

    const coincideTipo = tipoSeleccionado ? inmueble.tipo === tipoSeleccionado : true;

    const coincidePrecio = (() => {
      if (!precioSeleccionado) return true;
      const [min, max] = precioSeleccionado.split('-').map(Number);
      if (max) return inmueble.precio >= min && inmueble.precio <= max;
      return inmueble.precio >= min;
    })();

    return coincideBusqueda && coincideTipo && coincidePrecio;
  });

  const totalPaginas = Math.ceil(data.length / resultadosPorPagina);
  if (pagina > totalPaginas) pagina = totalPaginas;

  const inicio = (pagina - 1) * resultadosPorPagina;
  const fin = inicio + resultadosPorPagina;
  const paginados = data.slice(inicio, fin);

  contenedor.innerHTML = paginados.length === 0
    ? '<p>No hay inmuebles disponibles con los criterios seleccionados.</p>'
    : paginados.map(inmueble => `
      <div class="inmueble-card">
        <div class="imagen-galeria">
          ${
            (inmueble.imagenes || []).map(url => `
              <img src="${url}" alt="Imagen del inmueble" class="imagen-inmueble" onclick="abrirGaleria('${url}')" />
            `).join('')
          }
        <h3>${inmueble.titulo}</h3>
      <p><strong>Descripción:</strong> ${inmueble.descripcion}</p>
      <p><strong>Precio:</strong> $${inmueble.precio}</p>
      <p><strong>Tipo:</strong> ${inmueble.tipo}</p>
      <p><strong>Operación:</strong> ${inmueble.operacion || 'N/D'}</p>
      <p><strong>Estado:</strong> ${inmueble.estado || 'N/D'}</p>
      <p><strong>Municipio:</strong> ${inmueble.municipio || 'N/D'}</p>
      <p><strong>Dirección:</strong> ${inmueble.direccion || 'N/D'}</p>
      <p><strong>Superficie:</strong> ${inmueble.superficie || 'N/D'} m²</p>
      <p><strong>Habitaciones:</strong> ${inmueble.habitaciones || 'N/D'}</p>
      <p><strong>Baños:</strong> ${inmueble.banos || 'N/D'}</p>
      <p><strong>Estacionamiento:</strong> ${inmueble.estacionamiento || 'N/D'}</p>
      <p><strong>Amenidades:</strong> ${inmueble.amenidades || 'N/D'}</p>
      <p><strong>Amueblado:</strong> ${inmueble.amueblado ? 'Sí' : 'No'}</p>
      <p><strong>Estado de la propiedad:</strong> ${inmueble.estado_propiedad || 'N/D'}</p>
      <p><strong>Servicios:</strong> ${inmueble.servicios || 'N/D'}</p>
      <p><strong>Condiciones de pago:</strong> ${inmueble.condiciones_pago || 'N/D'}</p>
      <p><strong>Reglamentos:</strong> ${inmueble.reglamentos || 'N/D'}</p>
      <p><strong>Contacto:</strong> <a href="tel:${inmueble.contacto}" class="telefono-link">${inmueble.contacto}</a></p>
      <p><strong>Ubicación maps:</strong> 
  ${inmueble.mapa_url ? `<a href="${inmueble.mapa_url}" target="_blank">Ver mapa</a>` : 'N/D'}
</p>

      
    `).join('');

  document.getElementById('pagina-actual').textContent = pagina;
}

// Galería ampliada al hacer clic (opcional)
function abrirGaleria(url) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(0,0,0,0.8)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = 9999;
  overlay.innerHTML = `
    <img src="${url}" style="max-width:90%; max-height:90%; border:5px solid white; border-radius:10px;" />
  `;
  overlay.addEventListener('click', () => document.body.removeChild(overlay));
  document.body.appendChild(overlay);
}

