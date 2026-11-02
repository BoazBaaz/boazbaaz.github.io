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

  // Tag filtering on listing pages (projects, articles)
  var filterTags = document.querySelectorAll('.clickable-tag');
  if (filterTags.length > 0) {
    var filterItems = document.querySelectorAll('.card-wrapper[data-tags], .blog-card[data-tags]');

    var filterByTag = function(tag) {
      filterItems.forEach(function(item) {
        if (!tag) {
          item.style.display = '';
          return;
        }
        var tags = item.dataset.tags ? item.dataset.tags.split(',') : [];
        item.style.display = tags.indexOf(tag) === -1 ? 'none' : '';
      });
      filterTags.forEach(function(t) {
        t.classList.toggle('tag-active', t.dataset.tag === tag);
      });
    };

    filterTags.forEach(function(tagEl) {
      tagEl.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var params = new URLSearchParams(window.location.search);
        var t = this.dataset.tag;
        if (params.get('tag') === t) {
          params.delete('tag');
          filterByTag(null);
        } else {
          params.set('tag', t);
          filterByTag(t);
        }
        var query = params.toString();
        history.replaceState(null, '', window.location.pathname + (query ? '?' + query : ''));
      });
    });

    var initialTag = new URLSearchParams(window.location.search).get('tag');
    if (initialTag) filterByTag(initialTag);
  }

  // Table of contents in the info column, built from the headings in the content
  var toc = document.querySelector('.info-toc');
  var tocContent = document.querySelector('.detail-main .project-body, .detail-main .blog-content');
  if (toc && tocContent) {
    var headings = Array.prototype.slice.call(tocContent.querySelectorAll('h1, h2, h3'));

    if (headings.length > 1) {
      var list = toc.querySelector('ul');
      var topLevel = Math.min.apply(null, headings.map(function(h) { return parseInt(h.tagName[1], 10); }));
      var links = [];
      var usedIds = {};

      headings.forEach(function(heading) {
        // kramdown already gives headings an id, this is a fallback for headings written as HTML
        if (!heading.id) {
          var base = heading.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          var id = base;
          var n = 2;
          while (usedIds[id] || document.getElementById(id)) { id = base + '-' + n++; }
          heading.id = id;
        }
        usedIds[heading.id] = true;

        var item = document.createElement('li');
        item.className = 'toc-level-' + (parseInt(heading.tagName[1], 10) - topLevel);

        var link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        item.appendChild(link);
        list.appendChild(item);
        links.push(link);
      });

      toc.hidden = false;

      // Highlight the section you're currently reading
      var setActive = function() {
        var offset = 120;
        var current = 0;
        headings.forEach(function(heading, i) {
          if (heading.getBoundingClientRect().top - offset <= 0) current = i;
        });
        links.forEach(function(link, i) { link.classList.toggle('active', i === current); });
      };

      window.addEventListener('scroll', setActive, { passive: true });
      setActive();
    }
  }
});
