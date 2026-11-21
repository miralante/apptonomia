/* {{DISPLAY_EN}} — interface strings, in English. Same keys as strings.es.js:
   scripts/check.js fails when they differ. */
window.App = window.App || {};
if (window.App.i18n) {
  App.i18n.register({
    core: {
      appName: '{{DISPLAY_EN}}',
      chrome: { appName: '{{DISPLAY_EN}}' },
      understood: 'Got it',
      moreGoal: 'Go for more',
      starEarned: 'You earned a new star!',
      roundComplete: 'You finished!',
      rest: 'You have been here a while. You can rest if you want.',
      skipToContent: 'Skip to content'
    },
    home: {
      title: '{{DISPLAY_EN}}',
      intro: 'Welcome. The app content goes here.'
    },
    stars: {
      reached: 'You have {n} stars',
      goal: 'Go for {n} stars'
    },
    achievementNew: 'New achievement: {name}.',
    notFound: {
      title: 'Page not found',
      body: 'This page does not exist. The home page is still available.',
      home: 'Go to the home page'
    },
    about: {
      title: 'About the app',
      body: '{{DISPLAY_EN}} is a free web app of the Apptonomia suite. It works in the browser, with no sign-up and no ads.'
    },
    legal: {
      title: 'Data protection',
      body: '{{DISPLAY_EN}} does not send your data to any server. What you do is saved only in this browser. There are no accounts, no analytics and no ads.',
      rights: 'You can view, change or delete what is saved at any time, without asking us. You can do this from the gear icon in the header.',
      contact: 'If you have any question, write to {{SUPPORT_EMAIL}}.'
    },
    config: {
      title: 'Settings',
      intro: 'Here you can see and delete what {{DISPLAY_EN}} saves in this browser.',
      stored: 'Saved items: {n}',
      empty: 'There is nothing saved.',
      clear: 'Delete the {{DISPLAY_EN}} data',
      confirm: 'Are you sure? The progress in this browser will be deleted. This cannot be undone.',
      confirmYes: 'Yes, delete',
      confirmNo: 'No, go back',
      done: 'Data deleted.'
    }
  }, 'en');
}
