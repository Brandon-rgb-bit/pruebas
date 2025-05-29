import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('publicar-form');
  const volverBtn = document.getElementById('volver-btn');

  if (!form) {
    console.error("No se encontró el formulario con ID 'publicar-form'");
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("Debes iniciar sesión para publicar.");
      console.error("Error de autenticación:", authError);
      return;
    }

    try {
      // Obtener campos del formulario de forma segura
      const getValue = (id) => {
        const el = document.getElementById(id);
        if (!el) throw new Error(`No se encontró el elemento con ID '${id}'`);
        return el.value.trim();
      };

      const titulo = getValue('titulo');
      const tipo = getValue('tipo-propiedad');
      const operacion = getValue('operacion');
      const estado = getValue('estado');
      const municipio = getValue('municipio');
      const direccion = getValue('direccion');
      const precio = parseFloat(getValue('precio')) || 0;
      const superficie = parseFloat(getValue('superficie')) || 0;
      const habitaciones = parseInt(getValue('habitaciones')) || 0;
      const banos = parseInt(getValue('banos')) || 0;
      const estacionamiento = parseInt(getValue('estacionamiento')) || 0;
      const amenidades = getValue('amenidades');
      const amueblado = getValue('amueblado') === "true";
      const estado_propiedad = getValue('estado_propiedad');
      const servicios = getValue('servicios');
      const condiciones_pago = getValue('condiciones_pago');
      const reglamentos = getValue('reglamentos');
      const descripcion = getValue('descripcion');
      const mapa_url = getValue('mapa_url');
      const contacto = getValue('contacto');

      if (!titulo || !tipo || !operacion || !estado || !municipio || !direccion) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
      }

 // Subir múltiples imágenes
let imagenesUrls = [];
const imagenInput = document.getElementById('fotografias'); // Corregido aquí
const imagenesArchivos = imagenInput?.files;

if (imagenesArchivos && imagenesArchivos.length > 0) {
  for (let i = 0; i < imagenesArchivos.length; i++) {
    const imagenArchivo = imagenesArchivos[i];
    const fileName = `${user.id}/${Date.now()}_${imagenArchivo.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('inmuebles')
      .upload(fileName, imagenArchivo, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error al subir imagen:', uploadError);
      alert('Error al subir la imagen: ' + uploadError.message);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('inmuebles')
      .getPublicUrl(fileName);

    imagenesUrls.push(publicUrlData.publicUrl);
  }
}


      // Datos a insertar
      const inmuebleData = {
        titulo,
        tipo,
        operacion,
        estado,
        municipio,
        direccion,
        precio,
        superficie,
        habitaciones,
        banos,
        estacionamiento,
        amenidades: amenidades || null,
        amueblado,
        estado_propiedad,
        servicios: servicios || null,
        condiciones_pago: condiciones_pago || null,
        reglamentos: reglamentos || null,
        descripcion: descripcion || null,
        imagenes: imagenesUrls,
        mapa_url: mapa_url || null,
        contacto: contacto || null,
        usuario_id: user.id,
        publicado: true
      };

      const { data, error } = await supabase
        .from('inmuebles')
        .insert([inmuebleData])
        .select();

      if (error) {
        console.error("Error al insertar en Supabase:", error);
        alert('Error al publicar: ' + error.message);
        return;
      }

      showCelebration();
      form.reset();

    } catch (error) {
      console.error("Error inesperado:", error);
      alert('Error inesperado: ' + error.message);
    }
  });

  if (volverBtn) {
    volverBtn.addEventListener('click', () => {
      window.location.href = 'dashboard.html';
    });
  }
});

// Animación de celebración
function showCelebration() {
  const celebration = document.createElement('div');
  celebration.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; 
                width: 100vw; height: 100vh; 
                background: rgba(0, 0, 0, 0.5); 
                display: flex; justify-content: center; align-items: center; 
                z-index: 9999;">
      <div style="text-align: center; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #28a745; margin-bottom: 15px;">¡Publicado con éxito! 🎉</h2>
        <p style="margin-bottom: 20px;">Tu inmueble ha sido publicado correctamente.</p>
        <button id="cerrar-celebracion" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Aceptar</button>
      </div>
    </div>
  `;
  document.body.appendChild(celebration);

  document.getElementById('cerrar-celebracion').addEventListener('click', () => {
    celebration.remove();
  });
}
