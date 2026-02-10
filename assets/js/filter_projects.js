// Filter functionality for project cards
document.addEventListener('DOMContentLoaded', function() {
  const filterToggle = document.getElementById('filter-toggle');
  const filterMenu = document.getElementById('filter-menu');
  const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
  const allButton = document.getElementById('filter-all');
  const projectCards = document.querySelectorAll('.card-wrapper');

  if (!filterToggle || !filterMenu) return;

  // Toggle filter dropdown
  filterToggle.addEventListener('click', function() {
    const isVisible = filterMenu.style.display === 'block';
    filterMenu.style.display = isVisible ? 'none' : 'block';
    filterToggle.textContent = isVisible ? 'Filter ▼' : 'Filter ▲';
  });

  // Close filter when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.project-filter-dropdown')) {
      filterMenu.style.display = 'none';
      filterToggle.textContent = 'Filter ▼';
    }
  });

  // "All" button functionality
  if (allButton) {
    allButton.addEventListener('click', function() {
      const allChecked = Array.from(filterCheckboxes).every(cb => cb.checked);
      
      filterCheckboxes.forEach(checkbox => {
        checkbox.checked = !allChecked;
      });
      
      filterProjects();
    });
  }

  // Filter logic
  filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', filterProjects);
  });

  function filterProjects() {
    const selectedTags = Array.from(filterCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value.toLowerCase());

    projectCards.forEach(card => {
      const projectCard = card.querySelector('.project-card') || card.querySelector('.tag-section');
      if (!projectCard) return;

      const cardTags = projectCard.dataset.tags
        ? projectCard.dataset.tags.split(',').map(t => t.trim().toLowerCase())
        : [];

      // Show card if no filters selected OR if card has ALL selected tags (AND logic)
      if (selectedTags.length === 0 || selectedTags.every(tag => cardTags.includes(tag))) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }
});
