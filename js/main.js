/**
 * Main JS for Horse Hoof Security Services
 */

const initApp = () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    const scrollTopBtn = document.querySelector('.scroll-top');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        if (window.scrollY > 300) {
            scrollTopBtn?.classList.add('show');
        } else {
            scrollTopBtn?.classList.remove('show');
        }
    };

    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll);

    // Scroll to Top
    if(scrollTopBtn) {
        scrollTopBtn.onclick = (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }

    // Animated Counters Logic
    const counters = document.querySelectorAll('.counter-value');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Intersection Observer for Counters
    const metricsSection = document.querySelector('.metrics-section');
    if (metricsSection && counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(metricsSection);
    }

    // Form Validation (Contact Page)
    const forms = document.querySelectorAll('.needs-validation');
    if (forms.length > 0) {
        Array.from(forms).forEach(form => {
            form.onsubmit = (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    event.preventDefault();
                    alert("Thank you for your message. We will get back to you shortly!");
                    form.reset();
                    form.classList.remove('was-validated');
                    return;
                }
                form.classList.add('was-validated');
            };
        });
    }

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }
};

// Initial Load
document.addEventListener("DOMContentLoaded", initApp);

// Re-init on AJAX navigation
window.addEventListener('pageReinitialized', initApp);
