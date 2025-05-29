// js/admin.js

document.addEventListener('DOMContentLoaded', async () => {
  const lista = document.getElementById('todos-inmuebles');

  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== 'admin@admin.com') {
    alert('Acceso denegado. Solo el administrador puede ver esta página.');
    window.location.href = 'index.html';
    return;
  }

  const { data, error } = await supabase
    .from('inmuebles')
    .select('*');

  if (error) {
    lista.innerHTML = '<p>Error al cargar los inmuebles.</p>';
    return;
  }

  if (data.length === 0) {
    lista.innerHTML = '<p>No hay inmuebles publicados.</p>';
    return;
  }

  data.forEach(inmueble => {
    const card = document.createElement('div');
    card.className = 'inmueble-card';
    card.innerHTML = `
      <h3>${inmueble.titulo}</h3>
      <p>${inmueble.descripcion}</p>
      <p><strong>Precio:</strong> $${inmueble.precio}</p>
      <p><strong>Ubicación:</strong> ${inmueble.ubicacion}</p>
      <p><strong>ID usuario:</strong> ${inmueble.usuario_id}</p>
    `;
    lista.appendChild(card);
  });
});
