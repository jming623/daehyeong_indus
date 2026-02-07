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
        setupContactInfo();
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
     * 연락처 정보 설정 (config.js에서 가져옴)
     */
    function setupContactInfo() {
        if (typeof COMPANY_CONTACT === 'undefined') {
            console.warn('회사 연락처 정보가 설정되지 않았습니다. config.js에 COMPANY_CONTACT를 추가해주세요.');
            return;
        }

        // 연락처 정보를 동적으로 채움
        const phoneElement = document.getElementById('contact-phone');
        const faxElement = document.getElementById('contact-fax');
        const emailElement = document.getElementById('contact-email');
        const addressElement = document.getElementById('contact-address');

        if (phoneElement) phoneElement.textContent = COMPANY_CONTACT.phone || '-';
        if (faxElement) faxElement.textContent = COMPANY_CONTACT.fax || '-';
        if (emailElement) emailElement.textContent = COMPANY_CONTACT.email || '-';
        if (addressElement) addressElement.textContent = COMPANY_CONTACT.address || '-';
    }

    /**
     * Contact form handling with EmailJS
     */
    function setupContactForm() {
        if (!contactForm) return;

        // EmailJS 초기화
        // config.js 파일에서 설정을 가져옵니다
        if (typeof EMAILJS_CONFIG === 'undefined') {
            console.error('EmailJS 설정 파일(config.js)을 찾을 수 없습니다.');
            showNotification('현재 문의 기능을 사용할 수 없습니다. 전화 또는 이메일로 문의해 주세요.', 'error');
            return;
        }

        emailjs.init(EMAILJS_CONFIG.publicKey);
        contactForm.addEventListener('submit', handleFormSubmit);
        setupFieldValidation();
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        // 모든 에러 표시 제거
        clearFormErrors();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // 필수 필드 검증
        let hasError = false;
        const requiredFields = [
            { id: 'name', value: data.name, message: '담당자명을 입력해 주세요.' },
            { id: 'company', value: data.company, message: '기관/회사명을 입력해 주세요.' },
            { id: 'email', value: data.email, message: '이메일을 입력해 주세요.' },
            { id: 'phone', value: data.phone, message: '연락처를 입력해 주세요.' },
            { id: 'message', value: data.message, message: '문의내용을 입력해 주세요.' }
        ];

        requiredFields.forEach(field => {
            if (!field.value || field.value.trim() === '') {
                showFieldError(field.id, field.message);
                hasError = true;
            }
        });

        // 이메일 형식 검증
        if (data.email && !isValidEmail(data.email)) {
            showFieldError('email', '올바른 이메일 주소를 입력해 주세요.');
            hasError = true;
        }

        if (hasError) {
            showNotification('모든 필수 항목을 입력해 주세요.', 'error');
            // 첫 번째 에러 필드로 스크롤
            const firstErrorField = document.querySelector('.form-input.error, .form-textarea.error');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstErrorField.focus();
            }
            return;
        }

        const submitBtn = contactForm.querySelector('.form-submit');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = '전송 중...';
        submitBtn.disabled = true;

        // EmailJS를 통한 이메일 전송
        // config.js 파일에서 Service ID와 Template ID를 가져옵니다
        emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            {
                name: data.name,
                company: data.company,
                email: data.email,
                phone: data.phone || '미입력',
                message: data.message,
                date: new Date().toLocaleString('ko-KR')
            }
        )
        .then(() => {
            showNotification('문의가 성공적으로 전송되었습니다. 담당자가 곧 연락드리겠습니다.', 'success');
            contactForm.reset();
            clearFormErrors();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        })
        .catch((error) => {
            console.error('EmailJS Error:', error);
            showNotification('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * 필드 에러 표시
     */
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);

        if (field) {
            field.classList.add('error');
        }

        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    /**
     * 모든 필드 에러 제거
     */
    function clearFormErrors() {
        const errorFields = contactForm.querySelectorAll('.form-input.error, .form-textarea.error');
        const errorMessages = contactForm.querySelectorAll('.form-error');

        errorFields.forEach(field => {
            field.classList.remove('error');
        });

        errorMessages.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
    }

    /**
     * 입력 시 에러 제거 (실시간 검증)
     */
    function setupFieldValidation() {
        const formFields = contactForm.querySelectorAll('.form-input, .form-textarea');
        
        formFields.forEach(field => {
            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                    const errorElement = document.getElementById(`${this.id}-error`);
                    if (errorElement) {
                        errorElement.textContent = '';
                        errorElement.style.display = 'none';
                    }
                }
            });

            field.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    const fieldId = this.id;
                    const fieldMessages = {
                        'name': '담당자명을 입력해 주세요.',
                        'company': '기관/회사명을 입력해 주세요.',
                        'email': '이메일을 입력해 주세요.',
                        'phone': '연락처를 입력해 주세요.',
                        'message': '문의내용을 입력해 주세요.'
                    };
                    
                    if (fieldId === 'email' && this.value && !isValidEmail(this.value)) {
                        showFieldError(fieldId, '올바른 이메일 주소를 입력해 주세요.');
                    } else if (!this.value.trim()) {
                        showFieldError(fieldId, fieldMessages[fieldId] || '필수 항목입니다.');
                    }
                }
            });
        });
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
