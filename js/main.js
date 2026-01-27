/**
 * 대형산업 - 지진계측 시스템 전문기업
 * Main JavaScript
 */

(function() {
    'use strict';

    // DOM Elements
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    const sections = document.querySelectorAll('.section');

    // State
    let lastScrollY = 0;
    let isMenuOpen = false;

    /**
     * Initialize all functionality
     */
    function init() {
        setupScrollHandler();
        setupMobileMenu();
        setupSmoothScroll();
        setupContactForm();
        setupScrollReveal();
        setupActiveNavigation();
    }

    /**
     * Header scroll behavior
     */
    function setupScrollHandler() {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    function handleScroll() {
        const currentScrollY = window.scrollY;

        // Add/remove scrolled class
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    }

    /**
     * Mobile menu toggle
     */
    function setupMobileMenu() {
        if (!mobileMenuBtn) return;

        mobileMenuBtn.addEventListener('click', toggleMobileMenu);

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMobileMenu();
            }
        });
    }

    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        mobileMenuBtn.classList.toggle('active', isMenuOpen);
        nav.classList.toggle('active', isMenuOpen);
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';

        // Update aria-label
        mobileMenuBtn.setAttribute('aria-label', isMenuOpen ? '메뉴 닫기' : '메뉴 열기');
    }

    function closeMobileMenu() {
        isMenuOpen = false;
        mobileMenuBtn.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
        mobileMenuBtn.setAttribute('aria-label', '메뉴 열기');
    }

    /**
     * Smooth scroll for anchor links
     */
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Contact form handling
     */
    function setupContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', handleFormSubmit);
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Validate required fields
        if (!data.name || !data.company || !data.email || !data.message) {
            showNotification('모든 필수 항목을 입력해 주세요.', 'error');
            return;
        }

        // Email validation
        if (!isValidEmail(data.email)) {
            showNotification('올바른 이메일 주소를 입력해 주세요.', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('.form-submit');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = '전송 중...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            showNotification('문의가 성공적으로 전송되었습니다. 담당자가 곧 연락드리겠습니다.', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showNotification(message, type) {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Styles
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '16px 24px',
            backgroundColor: type === 'success' ? '#1e3a5f' : '#dc2626',
            color: '#ffffff',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '9999',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            animation: 'fadeInUp 0.3s ease'
        });

        document.body.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            notification.style.animation = 'fadeOutDown 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    /**
     * Scroll reveal animation
     */
    function setupScrollReveal() {
        // Add reveal class to sections
        sections.forEach(section => {
            const children = section.querySelectorAll('.section-header, .about-content, .tech-card, .product-main, .product-list, .app-card, .contact-content');
            children.forEach(child => {
                child.classList.add('reveal');
            });
        });

        // Intersection Observer for reveal
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach(el => {
            revealObserver.observe(el);
        });
    }

    /**
     * Active navigation based on scroll position
     */
    function setupActiveNavigation() {
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    setActiveNavLink(id);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            navObserver.observe(section);
        });
    }

    function setActiveNavLink(id) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }

    // Add CSS animation keyframes
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            @keyframes fadeOutDown {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addAnimationStyles();
            init();
        });
    } else {
        addAnimationStyles();
        init();
    }
})();
