/* {{DISPLAY_ES}} — textos de la interfaz, en español (fuente de verdad).
   Las claves son código y van en inglés. strings.en.js debe tener las mismas
   claves: scripts/check.js falla si no coinciden. */
window.App = window.App || {};
if (window.App.i18n) {
  App.i18n.register({
    core: {
      appName: '{{DISPLAY_ES}}',
      chrome: { appName: '{{DISPLAY_ES}}' },
      understood: 'Entendido',
      moreGoal: 'A por más',
      starEarned: '¡Has conseguido una nueva estrella!',
      roundComplete: '¡Has terminado!',
      rest: 'Llevas un buen rato. Puedes descansar si quieres.',
      skipToContent: 'Ir al contenido'
    },
    home: {
      title: '{{DISPLAY_ES}}',
      intro: 'Bienvenida. Aquí irá el contenido de la app.'
    },
    stars: {
      reached: 'Ya tienes {n} estrellas',
      goal: 'A por las {n} estrellas'
    },
    achievementNew: 'Nuevo logro: {name}.',
    notFound: {
      title: 'Página no encontrada',
      body: 'Esta página no existe. La página principal sigue disponible.',
      home: 'Ir a la página principal'
    },
    about: {
      title: 'Sobre la app',
      body: '{{DISPLAY_ES}} es una app web gratuita de la suite Apptonomia. Funciona en el navegador, sin registro y sin anuncios.'
    },
    legal: {
      title: 'Protección de datos',
      body: '{{DISPLAY_ES}} no envía tus datos a ningún servidor. Lo que haces se guarda solo en este navegador. No hay cuentas, ni analítica, ni publicidad.',
      contact: 'Para cualquier duda, escribe a {{SUPPORT_EMAIL}}.'
    },
    config: {
      title: 'Ajustes',
      intro: 'Aquí puedes ver y borrar lo que {{DISPLAY_ES}} guarda en este navegador.',
      stored: 'Datos guardados: {n}',
      empty: 'No hay datos guardados.',
      clear: 'Borrar los datos de {{DISPLAY_ES}}',
      confirm: '¿Seguro? Se borrará el progreso de este navegador. No se puede deshacer.',
      confirmYes: 'Sí, borrar',
      confirmNo: 'No, volver',
      done: 'Datos borrados.'
    }
  }, 'es');
}
