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

    // --- 3D Scroll-Driven Phone Animation ---
    // Make sure GSAP is loaded
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".app-feature-section",
                start: "top top", // When section hits top
                end: "bottom bottom",
                scrub: 1.5, // Smooth scrubbing
                pin: ".phone-pin-wrapper", // Pin the phone
            }
        });

        // 1. Phone Entrance (Fly in from right & rotate)
        tl.fromTo("#floating-phone",
            {
                x: "100vw",
                rotationY: -90,
                rotationX: 10,
                opacity: 0
            },
            {
                x: 0,
                rotationY: 0,
                rotationX: 0,
                opacity: 1,
                duration: 2,
                ease: "power2.out"
            }
        );

        // 2. Parallax Steps (Fade in/out as we scroll)
        const steps = gsap.utils.toArray(".step");
        steps.forEach((step, i) => {
            gsap.fromTo(step,
                { opacity: 0.2, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    scrollTrigger: {
                        trigger: step,
                        start: "top 80%",
                        end: "top 40%",
                        scrub: true,
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }
});
