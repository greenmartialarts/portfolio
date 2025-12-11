document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        updateIcon();
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        // Save preference
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light-mode');
        } else {
            localStorage.removeItem('theme');
        }
        updateIcon();
    });

    function updateIcon() {
        if (body.classList.contains('light-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Cursor Logic
    const cursor = document.querySelector('.cursor');
    const cursor2 = document.querySelector('.cursor2');

    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // Ensure cursor is visible when moving
        cursor.classList.remove('cursor-hidden');
        cursor2.classList.remove('cursor-hidden');

        // Delay for the second cursor
        setTimeout(() => {
            cursor2.style.left = e.clientX + 'px';
            cursor2.style.top = e.clientY + 'px';
        }, 50);
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseout', (e) => {
        if (e.relatedTarget === null) {
            cursor.classList.add('cursor-hidden');
            cursor2.classList.add('cursor-hidden');
        }
    });

    document.addEventListener('mouseenter', () => {
        cursor.classList.remove('cursor-hidden');
        cursor2.classList.remove('cursor-hidden');
    });

    // Cursor Hover Effect
    const links = document.querySelectorAll('a, button, .project-card, .stat-box');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor2.classList.add('cursor-grow');
            cursor.style.transform = 'translate(-50%, -50%) scale(0.5)';
        });
        link.addEventListener('mouseleave', () => {
            cursor2.classList.remove('cursor-grow');
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Enhanced Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                entry.target.classList.remove('hidden'); // Optional, but keeps DOM clean
            }
        });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // Vanilla 3D Tilt Effect
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // Mobile Menu
    const navSlide = () => {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-links li');

        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');

            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            // Burger Animation
            burger.classList.toggle('toggle');
        });
    }

    navSlide();

    // Fetch GitHub Stats
    const fetchGitHubStats = async () => {
        try {
            // Fetch User Profile
            const userRes = await fetch('https://api.github.com/users/greenmartialarts');

            // Fetch Repositories (up to 100)
            const reposRes = await fetch('https://api.github.com/users/greenmartialarts/repos?per_page=100');

            if (userRes.ok && reposRes.ok) {
                const user = await userRes.json();
                const repos = await reposRes.json();

                // 1. Total Repos (from profile is accurate for public)
                document.getElementById('repo-count').innerText = user.public_repos;

                // 2. Years Active
                const createdYear = new Date(user.created_at).getFullYear();
                const currentYear = new Date().getFullYear();
                const years = currentYear - createdYear;
                document.getElementById('years-active').innerText = years > 0 ? years + "+" : "1st Year";

                // 3. Total Stars
                const stars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
                document.getElementById('star-count').innerText = stars;

                // 4. TypeScript Projects
                const tsProjects = repos.filter(repo => repo.language === 'TypeScript').length;
                document.getElementById('ts-repo-count').innerText = tsProjects;

            } else {
                console.error('GitHub API Error');
            }
        } catch (error) {
            console.error('Failed to fetch GitHub stats:', error);
        }
    };

    fetchGitHubStats();
});
