document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const contenedor = document.getElementById('inmueble-detalle');

  if (!id) {
    contenedor.innerHTML = '<p>Inmueble no encontrado.</p>';
    return;
  }

  const { data, error } = await supabase
    .from('inmuebles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    contenedor.innerHTML = '<p>Error al cargar el inmueble.</p>';
    return;
  }

  const imagenesHTML = (data.imagenes || [])
    .map(url => `<img src="${url}" alt="Imagen del inmueble" />`)
    .join('');

  contenedor.innerHTML = `
    <h2>${data.titulo}</h2>
    <div class="galeria-detalle">${imagenesHTML}</div>
    <p><strong>Descripción:</strong> ${data.descripcion}</p>
    <p><strong>Precio:</strong> $${data.precio}</p>
    <p><strong>Tipo:</strong> ${data.tipo}</p>
    <p><strong>Operación:</strong> ${data.operacion || 'N/D'}</p>
    <p><strong>Estado:</strong> ${data.estado || 'N/D'}</p>
    <p><strong>Municipio:</strong> ${data.municipio || 'N/D'}</p>
    <p><strong>Dirección:</strong> ${data.direccion || 'N/D'}</p>
    <p><strong>Superficie:</strong> ${data.superficie || 'N/D'} m²</p>
    <p><strong>Habitaciones:</strong> ${data.habitaciones || 'N/D'}</p>
    <p><strong>Baños:</strong> ${data.banos || 'N/D'}</p>
    <p><strong>Estacionamiento:</strong> ${data.estacionamiento || 'N/D'}</p>
    <p><strong>Amenidades:</strong> ${data.amenidades || 'N/D'}</p>
    <p><strong>Amueblado:</strong> ${data.amueblado ? 'Sí' : 'No'}</p>
    <p><strong>Estado de la propiedad:</strong> ${data.estado_propiedad || 'N/D'}</p>
    <p><strong>Servicios:</strong> ${data.servicios || 'N/D'}</p>
    <p><strong>Condiciones de pago:</strong> ${data.condiciones_pago || 'N/D'}</p>
    <p><strong>Reglamentos:</strong> ${data.reglamentos || 'N/D'}</p>
    <p><strong>Contacto:</strong> <a href="tel:${data.contacto}">${data.contacto}</a></p>
    <p><strong>Ubicación Maps:</strong> ${
      data.mapa_url ? `<a href="${data.mapa_url}" target="_blank">Ver en mapa</a>` : 'N/D'
    }</p>
  `;
});

function copiarEnlace() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    alert('¡Enlace copiado al portapapeles!');
  });
}
