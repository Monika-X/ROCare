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

        // Dynamically add RTL/LTR toggle and Profile options if not present
        if (!navLinks.querySelector('.nav-mobile-actions')) {
            const mobileActions = document.createElement('div');
            mobileActions.className = 'nav-mobile-actions';
            mobileActions.style.borderTop = '1px solid var(--color-border)';
            mobileActions.style.marginTop = '15px';
            mobileActions.style.paddingTop = '15px';
            mobileActions.style.display = 'flex';
            mobileActions.style.flexDirection = 'column';
            mobileActions.style.gap = '6px';

            // 1. RTL/LTR Toggle
            const desktopDirBtn = document.getElementById('dir-toggle');
            if (desktopDirBtn) {
                const mobileDirBtn = document.createElement('button');
                mobileDirBtn.className = 'nav-link nav-mobile-dir-btn';
                mobileDirBtn.style.textAlign = 'left';
                mobileDirBtn.style.background = 'none';
                mobileDirBtn.style.border = 'none';
                mobileDirBtn.style.cursor = 'pointer';
                mobileDirBtn.style.padding = '12px';
                mobileDirBtn.style.width = '100%';
                mobileDirBtn.innerHTML = `<i class="ri-translate-2" style="margin-right: 8px;"></i> Text Direction: <strong style="color: var(--color-primary);">${desktopDirBtn.textContent}</strong>`;
                
                mobileDirBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    desktopDirBtn.click(); // Trigger the desktop btn action
                    mobileDirBtn.querySelector('strong').textContent = desktopDirBtn.textContent;
                });
                mobileActions.appendChild(mobileDirBtn);
            }

            // 2. Profile Links
            const userDropdown = document.getElementById('user-dropdown');
            if (userDropdown) {
                const profileTitle = document.createElement('div');
                profileTitle.style.padding = '12px 12px 4px';
                profileTitle.style.fontSize = '0.75rem';
                profileTitle.style.textTransform = 'uppercase';
                profileTitle.style.letterSpacing = '1px';
                profileTitle.style.color = 'var(--color-text-muted)';
                profileTitle.style.fontWeight = '800';
                profileTitle.textContent = 'Account Concierge';
                mobileActions.appendChild(profileTitle);

                const links = userDropdown.querySelectorAll('a');
                links.forEach(link => {
                    const mobileProfileLink = document.createElement('a');
                    mobileProfileLink.href = link.getAttribute('href');
                    mobileProfileLink.className = 'nav-link';
                    // Add an icon prefix based on text
                    let icon = 'ri-user-line';
                    if (link.textContent.includes('Dashboard')) icon = 'ri-dashboard-line';
                    if (link.textContent.includes('Login')) icon = 'ri-login-box-line';
                    if (link.textContent.includes('Signup')) icon = 'ri-user-add-line';
                    
                    mobileProfileLink.innerHTML = `<i class="${icon}" style="margin-right: 8px;"></i> ${link.textContent}`;
                    mobileActions.appendChild(mobileProfileLink);
                });
            }

            navLinks.appendChild(mobileActions);
        }

        menuBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('show');
            menuBtn.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 6. User Profile Dropdown
    const userProfileBtn = document.getElementById('user-profile');
    const userDropdown = document.getElementById('user-dropdown');

    if (userProfileBtn && userDropdown) {
        userProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userProfileBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }
});
