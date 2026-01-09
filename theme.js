document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('themeToggle');
    const toggleIcon = toggleBtn.querySelector('.toggle-icon');

    // Check for saved user preference, if any, on load
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);
    } else {
        // Auto-detect based on time (6am - 6pm = day)
        const hour = new Date().getHours();
        const isDayTime = hour >= 6 && hour < 18;

        if (isDayTime) {
            document.documentElement.setAttribute('data-theme', 'light');
            updateIcon('light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateIcon('dark');
        }
    }

    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });


    function updateIcon(theme) {
        if (theme === 'light') {
            toggleIcon.textContent = '☀️';
            toggleIcon.style.filter = 'drop-shadow(0 0 5px orange)';
        } else {
            toggleIcon.textContent = '🌙';
            toggleIcon.style.filter = 'drop-shadow(0 0 5px white)';
        }
    }

    // --- V2 Animation Logic ---
    const observerOptions = {
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px"
    };

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    // Target elements
    document.querySelectorAll('.kinetic-text, .scroll-reveal').forEach(el => {
        animateOnScroll.observe(el);
    });
});
