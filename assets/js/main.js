document.addEventListener('DOMContentLoaded', () => {
    const contenedorPersonajes = document.getElementById('personajes');
    // Obtener el contenedor donde se mostrarán los personajes
    const rangos = {
        "rango-1-5": [1, 2, 3, 4, 5],
        "rango-6-11": [6, 7, 8, 9, 10, 11],
        "rango-12-17": [12, 13, 14, 15, 16, 17],
    };
    // Definir los colores asociados a cada rango
    const colores = {
        "rango-1-5": 'color-rojo',
        "rango-6-11": 'color-verde',
        "rango-12-17": 'color-azul',
    };
    //obtener los datos de un personaje de la API
    const fetchPersonaje = async (id) => {
        try {
            // Realizar la solicitud a la API con el ID del personaje
            const respuesta = await fetch(`https://swapi.dev/api/people/${id}/`);
            if (!respuesta.ok) throw new Error('Error en la respuesta de la API');
            // Convertir la respuesta a formato JSON
            const datos = await respuesta.json();
            // Retorno un objeto con los datos del personaje
            return {
                nombre: datos.name || 'Desconocido',
                altura: datos.height !== "unknown" ? datos.height : "N/A",
                peso: datos.mass !== "unknown" ? datos.mass : "N/A",
                colorClase: colores[id] || 'color-default'
            };
          // Manejar cualquier error que ocurra durante la solicitud
        } catch (error) {
            console.error("Error al obtener datos: ", error);
            return null;
        }
    };
    // mostrar los personajes en el DOM
    const mostrarPersonajes = async (idsPersonajes, colorClase) => {
        const fragmento = document.createDocumentFragment();
        const limite = 5;//la cantidad de personajes a mostrar es 5 por rango
        // Iterar sobre los IDs de personajes, hasta el límite establecido
        for (const id of idsPersonajes.slice(0, limite)) {
            const personaje = await fetchPersonaje(id);//Obtener los datos de cada personaje
            if (personaje) {
                const personajeElemento = document.createElement('div');
                personajeElemento.classList.add('col-md-6', 'col-lg-4', 'mb-4');
                // Configurar el contenido HTML del div, incluir nombre, altura, peso y color del circulo
                personajeElemento.innerHTML = `
                <div class="personaje-card ${colorClase}">
                    <div class="circulo ${colorClase}"></div>
                    <h5>${personaje.nombre}</h5>
                    <p>Estatura: ${personaje.altura} cm</p>
                    <p>Peso: ${personaje.peso} kg</p>
                </div>
                `;
                fragmento.appendChild(personajeElemento);
            }
        }

        contenedorPersonajes.innerHTML = '';
        contenedorPersonajes.appendChild(fragmento);
    };
    // Función para manejar el evento de mouseenter en un rango específico
    const manejarEventoRango = (idRango) => {
        // Asociar el evento mouseenter al elemento con el ID del rango
        document.getElementById(idRango).addEventListener('mouseenter', () => {
            const idsPersonajes = rangos[idRango];
            const colorClase = colores[idRango];
            mostrarPersonajes(idsPersonajes, colorClase);
        });
    };
    // Asignar el evento de mouseenter a cada rango
    Object.keys(rangos).forEach(manejarEventoRango);
});