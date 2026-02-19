document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('filter-toggle');
  const menu = document.getElementById('filter-menu');
  const checkboxes = document.querySelectorAll('.filter-tag');
  const allBtn = document.getElementById('filter-all');
  const items = document.querySelectorAll('.card-wrapper');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    const open = menu.style.display === 'block';
    menu.style.display = open ? 'none' : 'block';
    toggle.textContent = open ? 'Filters \u25BC' : 'Filters \u25B2';
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.project-filter-dropdown')) {
      menu.style.display = 'none';
      toggle.textContent = 'Filters \u25BC';
    }
  });

  if (allBtn) {
    allBtn.addEventListener('click', function() {
      const allChecked = Array.from(checkboxes).every(cb => cb.checked);
      checkboxes.forEach(cb => cb.checked = !allChecked);
      filter();
    });
  }

  checkboxes.forEach(cb => cb.addEventListener('change', filter));

  function filter() {
    const selected = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value.toLowerCase());

    items.forEach(item => {
      const tags = item.dataset.tags
        ? item.dataset.tags.split(',').map(t => t.trim().toLowerCase())
        : [];

      if (selected.length === 0 || selected.every(t => tags.includes(t))) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }
});
