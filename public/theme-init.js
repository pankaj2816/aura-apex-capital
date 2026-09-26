(function () {
  try {
    var allowed = { midnight: 1, alabaster: 1, champagne: 1 };
    var stored = localStorage.getItem('aac-theme');
    var theme = allowed[stored] ? stored : 'midnight';
    var root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme === 'midnight' ? 'dark' : 'light';
  } catch (err) {
    document.documentElement.setAttribute('data-theme', 'midnight');
  }
})();
