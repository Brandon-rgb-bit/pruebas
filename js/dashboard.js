import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', async () => {
  const userResponse = await supabase.auth.getUser();
  const user = userResponse.data.user;

  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const userEmail = document.getElementById('user-email');
  const inmueblesList = document.getElementById('mis-inmuebles');
  const editModal = document.getElementById('edit-modal');
  const editForm = document.getElementById('edit-form');

  userEmail.textContent = user.email;

  // Obtener inmuebles del usuario
  const { data: inmuebles, error } = await supabase
    .from('inmuebles')
    .select('*')
    .eq('usuario_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    inmueblesList.innerHTML = '<p>Error al cargar los inmuebles.</p>';
    return;
  }

  if (inmuebles.length === 0) {
    inmueblesList.innerHTML = '<p>No has publicado inmuebles todavía.</p>';
    return;
  }

  // Renderizar inmuebles con botones de edición y eliminación
  inmueblesList.innerHTML = inmuebles.map(inmueble => `
    <div class="inmueble-item" data-id="${inmueble.id}">
      <strong>${inmueble.titulo}</strong><br>
      <img src="${inmueble.imagenes}" alt="Imagen del inmueble" class="inmueble-img"><br>
      ${inmueble.descripcion}<br>
      Precio: $${inmueble.precio}<br>
      <button class="edit-btn">Editar</button>
      <button class="delete-btn">Eliminar</button>
    </div>
  `).join('');

  // Manejo de edición con modal
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', async (event) => {
      const inmuebleId = event.target.parentElement.dataset.id;
      const inmueble = inmuebles.find(i => i.id == inmuebleId);

      // Cargar datos actuales en el modal
      document.getElementById('titulo').value = inmueble.titulo;
      document.getElementById('descripcion').value = inmueble.descripcion;
      document.getElementById('precio').value = inmueble.precio;
      document.getElementById('direccion').value = inmueble.direccion;

      // Cargar imágenes existentes
      const preview = document.getElementById('preview-imagenes');
      preview.innerHTML = inmueble.imagenes.split(',').map(img => `
        <div class="image-container">
          <img src="${img}" class="preview-img">
          <button class="delete-img" data-url="${img}">Eliminar</button>
        </div>
      `).join('');

      // Mostrar el modal
      editModal.style.display = "block";

      // Manejo de eliminación de imágenes
      document.querySelectorAll('.delete-img').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const imgUrl = e.target.dataset.url;

          const nuevasImagenes = inmueble.imagenes.split(',').filter(img => img !== imgUrl).join(',');

          const { error } = await supabase
            .from('inmuebles')
            .update({ imagenes: nuevasImagenes })
            .eq('id', inmuebleId);

          if (!error) {
            alert("Imagen eliminada.");
            e.target.parentElement.remove();
          } else {
            alert("Error al eliminar la imagen.");
          }
        });
      });

      // Guardar cambios en Supabase
      editForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedData = {
          titulo: document.getElementById('titulo').value,
          descripcion: document.getElementById('descripcion').value,
          precio: document.getElementById('precio').value,
          direccion: document.getElementById('direccion').value
        };

        // Subir nuevas imágenes si se seleccionan
        const newImages = document.getElementById('imagenes').files;
        if (newImages.length > 0) {
          const urls = Array.from(newImages).map(file => URL.createObjectURL(file)).join(',');
          updatedData.imagenes = `${inmueble.imagenes},${urls}`;
        }

        const { error } = await supabase
          .from('inmuebles')
          .update(updatedData)
          .eq('id', inmuebleId);

        if (!error) {
          alert("Inmueble actualizado.");
          location.reload();
        } else {
          alert("Error al actualizar el inmueble.");
        }
      });
    });
  });

  // Cerrar modal
  document.querySelector('.close-btn').addEventListener('click', () => {
    editModal.style.display = "none";
  });
});
