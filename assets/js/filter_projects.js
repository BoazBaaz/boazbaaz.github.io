// Filter functionality for projects and blog
document.addEventListener('DOMContentLoaded', function() {
  const filterToggle = document.getElementById('filter-toggle');
  const filterMenu = document.getElementById('filter-menu');
  const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
  const categoryCheckboxes = document.querySelectorAll('.filter-category');
  const tagCheckboxes = document.querySelectorAll('.filter-tag');
  const allButton = document.getElementById('filter-all');
  const items = document.querySelectorAll('.card-wrapper');

  if (!filterToggle || !filterMenu) return;

  // Toggle filter dropdown
  filterToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    const isVisible = filterMenu.style.display === 'block';
    filterMenu.style.display = isVisible ? 'none' : 'block';
    filterToggle.textContent = isVisible ? 'Filters ▼' : 'Filters ▲';
  });

  // Close filter when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.project-filter-dropdown') && 
        !event.target.closest('.blog-filter-dropdown')) {
      filterMenu.style.display = 'none';
      if (filterToggle) filterToggle.textContent = 'Filters ▼';
    }
  });

  // "All" button functionality
  if (allButton) {
    allButton.addEventListener('click', function() {
      const allChecked = Array.from(filterCheckboxes).every(cb => cb.checked);
      filterCheckboxes.forEach(checkbox => {
        checkbox.checked = !allChecked;
      });
      filterItems();
    });
  }

  // Filter logic
  filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', filterItems);
  });

  function filterItems() {
    const selectedCategories = Array.from(categoryCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value.toLowerCase());
      
    const selectedTags = Array.from(tagCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value.toLowerCase());

    items.forEach(item => {
      const itemCategories = item.dataset.categories
        ? item.dataset.categories.split(',').map(c => c.trim().toLowerCase())
        : [];
        
      const itemTags = item.dataset.tags
        ? item.dataset.tags.split(',').map(t => t.trim().toLowerCase())
        : [];

      // Show if no filters OR (all selected categories match AND all selected tags match)
      const categoryMatch = selectedCategories.length === 0 || 
                           selectedCategories.every(cat => itemCategories.includes(cat));
      const tagMatch = selectedTags.length === 0 || 
                      selectedTags.every(tag => itemTags.includes(tag));

      if (categoryMatch && tagMatch) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }
});
