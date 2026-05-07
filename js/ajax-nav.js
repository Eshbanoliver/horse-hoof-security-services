/**
 * AJAX Navigation System for Horse Hoof Security Services
 * Handles smooth page transitions without full reloads
 */

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('page-content');
    const navbarNav = document.getElementById('navbarNav');
    const bsCollapse = navbarNav ? new bootstrap.Collapse(navbarNav, { toggle: false }) : null;

    // Handle link clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        
        // Only handle internal links that are not fragments or target="_blank"
        if (link && 
            link.hostname === window.location.hostname && 
            !link.hash && 
            link.target !== '_blank' &&
            !link.getAttribute('href').startsWith('tel:') &&
            !link.getAttribute('href').startsWith('mailto:') &&
            !link.getAttribute('href').startsWith('javascript:')) {
            
            e.preventDefault();
            const url = link.getAttribute('href');
            loadPage(url);
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.url) {
            loadPage(e.state.url, false);
        } else {
            loadPage(window.location.pathname, false);
        }
    });

    /**
     * Fetch and load page content
     * @param {string} url - Target URL
     * @param {boolean} pushState - Whether to push to browser history
     */
    async function loadPage(url, pushState = true) {
        try {
            // Show loading state (optional)
            document.body.classList.add('loading');
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Page not found');
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract new content
            const newContent = doc.getElementById('page-content');
            const newTitle = doc.title;
            
            if (!newContent) {
                // Fallback to full reload if page structure is different
                window.location.href = url;
                return;
            }

            // Start transition
            mainContent.style.opacity = '0';
            
            setTimeout(() => {
                // Update content and title
                mainContent.innerHTML = newContent.innerHTML;
                document.title = newTitle;
                
                // Update active link in navbar
                updateActiveLink(url);
                
                // Push state
                if (pushState) {
                    window.history.pushState({ url }, newTitle, url);
                }

                // Close mobile menu if open
                if (navbarNav && navbarNav.classList.contains('show')) {
                    bsCollapse.hide();
                }

                // Scroll to top
                window.scrollTo(0, 0);
                
                // Re-initialize scripts
                reinitializeScripts();
                
                // End transition
                mainContent.style.opacity = '1';
                document.body.classList.remove('loading');
            }, 300);

        } catch (error) {
            console.error('AJAX Load Error:', error);
            window.location.href = url; // Fallback
        }
    }

    function updateActiveLink(url) {
        const fileName = url.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(navLink => {
            const href = navLink.getAttribute('href');
            if (href === fileName) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        });
    }

    function reinitializeScripts() {
        // Re-init AOS
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
            // Sometimes full init is needed for new elements
            AOS.init({
                duration: 800,
                once: true,
                offset: 100
            });
        }

        // Re-init Bootstrap Carousels
        const carousels = document.querySelectorAll('.carousel');
        carousels.forEach(c => {
            new bootstrap.Carousel(c);
        });

        // Re-init counters (via custom event or direct call)
        window.dispatchEvent(new Event('pageReinitialized'));
    }
});
