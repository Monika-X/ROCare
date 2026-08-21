document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    
    // Check local storage for theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.setAttribute('data-theme', 'dark');
            updateThemeIcon('dark');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        if (theme === 'dark') {
            themeToggleBtn.innerHTML = '<i class="ri-sun-line"></i>'; // Requires RemixIcon
        } else {
            themeToggleBtn.innerHTML = '<i class="ri-moon-line"></i>';
        }
    }

    // 2. RTL/LTR Toggle
    const dirToggleBtn = document.getElementById('dir-toggle');
    const savedDir = localStorage.getItem('dir');
    if (savedDir) {
        root.setAttribute('dir', savedDir);
        updateDirIcon(savedDir);
    } else {
        updateDirIcon('ltr');
    }

    if (dirToggleBtn) {
        dirToggleBtn.addEventListener('click', () => {
            const currentDir = root.getAttribute('dir') || 'ltr';
            const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
            root.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
            updateDirIcon(newDir);
        });
    }

    function updateDirIcon(dir) {
        if (!dirToggleBtn) return;
        if (dir === 'rtl') {
            dirToggleBtn.textContent = 'RTL';
        } else {
            dirToggleBtn.textContent = 'LTR';
        }
    }

    // 3. Sticky Navbar
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 4. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 5. Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        // Dynamically add Book Now link to mobile menu if not present
        const desktopBookBtn = document.querySelector('.nav-actions .cta-btn');
        if (desktopBookBtn && !navLinks.querySelector('.nav-book-btn')) {
            const mobileBookBtn = document.createElement('a');
            mobileBookBtn.href = desktopBookBtn.getAttribute('href');
            mobileBookBtn.className = 'nav-link nav-book-btn';
            mobileBookBtn.textContent = desktopBookBtn.textContent || 'Book Now';
            navLinks.appendChild(mobileBookBtn);
        }



        menuBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('show');
            menuBtn.setAttribute('aria-expanded', String(isOpen));
            menuBtn.innerHTML = isOpen ? '<i class="ri-close-line"></i>' : '<i class="ri-menu-line"></i>';
            document.body.classList.toggle('menu-open', isOpen);
            document.documentElement.classList.toggle('menu-open', isOpen);
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.innerHTML = '<i class="ri-menu-line"></i>';
                document.body.classList.remove('menu-open');
                document.documentElement.classList.remove('menu-open');
            });
        });

        // Bulletproof scroll locking for mobile Safari
        document.addEventListener('touchmove', (e) => {
            if (document.body.classList.contains('menu-open') && !navLinks.contains(e.target)) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // 6. User Profile Dropdown
    const userProfileBtn = document.getElementById('user-profile');
    const userDropdown = document.getElementById('user-dropdown');

    if (userProfileBtn && userDropdown) {
        userProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = userDropdown.classList.toggle('show');
            userProfileBtn.setAttribute('aria-expanded', String(isOpen));
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userProfileBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('show');
                userProfileBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Reset UI state so back/forward navigation doesn't restore an open dropdown
        const resetDropdownState = () => {
            userDropdown.classList.remove('show');
            userProfileBtn.setAttribute('aria-expanded', 'false');
            if (navLinks) {
                navLinks.classList.remove('show');
            }
            if (menuBtn) {
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.innerHTML = '<i class="ri-menu-line"></i>';
            }
            document.body.classList.remove('menu-open');
            document.documentElement.classList.remove('menu-open');
        };

        window.addEventListener('pagehide', resetDropdownState);
        window.addEventListener('pageshow', (e) => {
            if (e.persisted) {
                resetDropdownState();
            }
        });
    }

    // 7. Password Visibility Toggle
    const passwordToggles = document.querySelectorAll('.auth-input-icon');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling;
            if (input && input.tagName === 'INPUT') {
                if (input.type === 'password') {
                    input.type = 'text';
                    toggle.classList.remove('ri-eye-off-line');
                    toggle.classList.add('ri-eye-line');
                } else {
                    input.type = 'password';
                    toggle.classList.remove('ri-eye-line');
                    toggle.classList.add('ri-eye-off-line');
                }
            }
        });
    });
});
