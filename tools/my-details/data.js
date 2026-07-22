/* ============================================================
   Datos: Mis Datos (memoria: dirección propia/familiar y
   teléfono propio/familiar, configurados por quien gestiona el
   dispositivo en /settings/ — nunca datos de ejemplo).
   Este archivo NO contiene ningún dato personal real: solo la
   semilla de nombres de calle usada para fabricar un señuelo
   cuando la dirección real no tiene ningún número que desplazar
   (ver buildAddressDecoys en app.js). Los datos reales viven
   exclusivamente en localStorage (App.storage 'my-details'),
   nunca en este archivo ni en ningún sitio fuera del dispositivo.
   ============================================================ */
var DATA = {
  decoyStreets: {
    es: ['Calle Mayor', 'Avenida de la Paz', 'Calle del Sol', 'Calle Real', 'Paseo de la Estación', 'Calle Nueva'],
    en: ['Main Street', 'Oak Avenue', 'Elm Street', 'Park Road', 'Station Street', 'Mill Lane']
  }
};
