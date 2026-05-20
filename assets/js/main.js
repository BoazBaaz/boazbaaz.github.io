document.addEventListener('DOMContentLoaded', function() {
  // Mobile nav toggle
  var navToggle = document.querySelector('.navbar-toggle');
  var navLinks = document.querySelector('.navbar-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('open');
    });
  }

  // Theme toggle
  var modeBtn = document.getElementById('mode-toggle');
  if (modeBtn) {
    var icon = modeBtn.querySelector('i');
    var saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      icon.classList.replace('fa-moon', 'fa-sun');
    }
    modeBtn.addEventListener('click', function() {
      var isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // Scroll to top
  var scrollBtn = document.getElementById('scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        scrollBtn.style.opacity = '1';
        scrollBtn.style.pointerEvents = 'auto';
      } else {
        scrollBtn.style.opacity = '0';
        scrollBtn.style.pointerEvents = 'none';
      }
    });
    scrollBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Clickable cards with nested links
  document.querySelectorAll('[data-href]').forEach(function(card) {
    card.addEventListener('click', function(e) {
      if (!e.target.closest('a') && !e.target.closest('[data-tag-href]')) {
        window.location.href = this.dataset.href;
      }
    });
  });

  // Clickable tags (inside cards or standalone)
  document.querySelectorAll('[data-tag-href]').forEach(function(tag) {
    tag.style.cursor = 'pointer';
    tag.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = this.dataset.tagHref;
    });
  });

  // Search
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  if (searchInput && searchResults && window.searchData) {
    searchInput.addEventListener('input', function() {
      var q = this.value.toLowerCase().trim();
      if (q.length < 2) { searchResults.innerHTML = ''; searchResults.style.display = 'none'; return; }
      var matches = window.searchData.filter(function(d) {
        return d.title.toLowerCase().indexOf(q) !== -1 || d.desc.toLowerCase().indexOf(q) !== -1;
      });
      if (matches.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">No results</div>';
      } else {
        searchResults.innerHTML = matches.slice(0, 8).map(function(m) {
          return '<a class="search-result" href="' + m.url + '"><span>' + m.title + '</span><small>' + m.type + '</small></a>';
        }).join('');
      }
      searchResults.style.display = 'block';
    });

    document.addEventListener('click', function(e) {
      if (!e.target.closest('#search-wrapper')) {
        searchResults.style.display = 'none';
      }
    });
  }
});
