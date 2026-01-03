// ==========================================================================
// LOPEZ FRAGRANCE - ENHANCED JAVASCRIPT (FIXED)
// ==========================================================================

'use strict';

// Utility Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const debounce = (func, wait = 10) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit = 100) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ==========================================================================
// CUSTOM CURSOR
// ==========================================================================
const initCursor = () => {
    if (window.innerWidth <= 768) return;
    
    const cursorDot = $('#cursorDot');
    const cursorOutline = $('#cursorOutline');
    
    if (!cursorDot || !cursorOutline) return;
    
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
    });
    
    const animateOutline = () => {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateOutline);
    };
    
    animateOutline();
    
    const interactiveElements = $$('a, button, .product-card, .story-card, input, textarea, select');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
};

// ==========================================================================
// SPLASH SCREEN
// ==========================================================================
const initSplashScreen = () => {
    const splashScreen = $('#splashScreen');
    const loaderPercentage = $('.loader-percentage');
    const loaderStatus = $('.loader-status');
    
    if (!splashScreen) return;
    
    // Animate percentage
    let percentage = 0;
    const percentInterval = setInterval(() => {
        percentage += 2;
        if (loaderPercentage) {
            loaderPercentage.textContent = percentage + '%';
        }
        
        // Update status text
        if (loaderStatus) {
            if (percentage < 30) {
                loaderStatus.textContent = 'Preparing...';
            } else if (percentage < 60) {
                loaderStatus.textContent = 'Loading assets...';
            } else if (percentage < 90) {
                loaderStatus.textContent = 'Almost there...';
            } else {
                loaderStatus.textContent = 'Ready!';
            }
        }
        
        if (percentage >= 100) {
            clearInterval(percentInterval);
        }
    }, 60);
    
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        setTimeout(() => {
            splashScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 1000);
    }, 5000);
};

// ==========================================================================
// NAVIGATION
// ==========================================================================
const initNavigation = () => {
    const navbar = $('#navbar');
    const navToggle = $('#navToggle');
    const navMenu = $('#navMenu');
    const navLinks = $$('.nav-link');
    
    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', throttle(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, 100));
};

// ==========================================================================
// SMOOTH SCROLL
// ==========================================================================
const initSmoothScroll = () => {
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = $(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// ==========================================================================
// SCROLL REVEAL ANIMATIONS
// ==========================================================================
const initScrollReveal = () => {
    const revealElements = $$('.reveal');
    
    if (!revealElements.length) return;
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', debounce(revealOnScroll, 20));
    
    setTimeout(revealOnScroll, 100);
    
    setTimeout(() => {
        revealElements.forEach(el => el.classList.add('active'));
    }, 3000);
};

// ==========================================================================
// PARALLAX EFFECTS
// ==========================================================================
const initParallax = () => {
    const parallaxImages = $$('.parallax-image');
    
    const handleParallax = () => {
        parallaxImages.forEach(image => {
            const rect = image.getBoundingClientRect();
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const scrolled = window.pageYOffset;
                const speed = 0.3;
                const yPos = -(scrolled - rect.top - window.pageYOffset) * speed;
                image.style.transform = `translateY(${yPos}px)`;
            }
        });
    };
    
    window.addEventListener('scroll', throttle(handleParallax, 16));
};

// ==========================================================================
// PRODUCT CARDS
// ==========================================================================
const initProductCards = () => {
    const productCards = $$('.product-card');
    
    if (!productCards || productCards.length === 0) {
        console.log('No product cards found');
        return;
    }
    
    console.log('Initializing product cards:', productCards.length);
    
    productCards.forEach(card => {
        if (!card) return;
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `translateY(-15px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
        });
    });
};

// ==========================================================================
// COLLECTION FILTER
// ==========================================================================
const initCollectionFilter = () => {
    const filterBtns = $$('.filter-btn');
    const productCards = $$('.product-card');
    const showMoreBtn = $('#showMoreBtn');
    const showingCount = $('#showingCount');
    const totalCount = $('#totalCount');
    
    if (!filterBtns.length || !productCards.length) {
        console.log('Filter elements not found');
        return;
    }
    
    console.log('Filter initialized with', filterBtns.length, 'buttons and', productCards.length, 'cards');
    
    const ITEMS_TO_SHOW = 6;
    let currentFilter = 'all';
    let showingAll = false;
    
    const updateDisplay = () => {
        let visibleCards = [];
        
        productCards.forEach(card => {
            const categories = card.getAttribute('data-category') || '';
            const shouldShow = currentFilter === 'all' || categories.includes(currentFilter);
            
            if (shouldShow) {
                visibleCards.push(card);
            }
        });
        
        const itemsToDisplay = showingAll ? visibleCards.length : Math.min(ITEMS_TO_SHOW, visibleCards.length);
        
        productCards.forEach(card => card.style.display = 'none');
        
        visibleCards.forEach((card, index) => {
            if (index < itemsToDisplay) {
                card.style.display = 'block';
                setTimeout(() => card.classList.add('active'), index * 50);
            }
        });
        
        if (showingCount) showingCount.textContent = itemsToDisplay;
        if (totalCount) totalCount.textContent = visibleCards.length;
        
        if (showMoreBtn) {
            if (visibleCards.length > ITEMS_TO_SHOW && !showingAll) {
                showMoreBtn.style.display = 'inline-flex';
                const remainingItems = visibleCards.length - ITEMS_TO_SHOW;
                const buttonText = showMoreBtn.querySelector('span');
                if (buttonText) {
                    buttonText.textContent = `Show ${remainingItems} More Fragrance${remainingItems !== 1 ? 's' : ''}`;
                }
            } else {
                showMoreBtn.style.display = 'none';
            }
        }
        
        console.log(`Filter: ${currentFilter}, Showing: ${itemsToDisplay}/${visibleCards.length}`);
    };
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Filter clicked:', this.getAttribute('data-filter'));
            
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-filter') || 'all';
            showingAll = false;
            
            updateDisplay();
            
            const collection = $('#collection');
            if (collection) {
                const rect = collection.getBoundingClientRect();
                if (rect.top < 0) {
                    window.scrollTo({
                        top: collection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            console.log('Show More clicked');
            showingAll = true;
            updateDisplay();
            
            const buttonText = showMoreBtn.querySelector('span');
            if (buttonText) {
                buttonText.textContent = 'Showing All Fragrances';
            }
        });
    }
    
    updateDisplay();
};

// ==========================================================================
// FAQ ACCORDION
// ==========================================================================
const initFAQ = () => {
    const faqItems = $$('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question?.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(i => i.classList.remove('active'));
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
};

// ==========================================================================
// CONTACT FORM
// ==========================================================================
const initContactForm = () => {
    const contactForm = $('#contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<span>Sending...</span>';
        submitButton.disabled = true;
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.style.cssText = `
            background: linear-gradient(135deg, #c9a16e, #8b6f47);
            color: white;
            padding: 1.5rem;
            border-radius: 15px;
            margin-top: 1.5rem;
            text-align: center;
            animation: fadeInUp 0.5s ease;
            box-shadow: 0 10px 30px rgba(201, 161, 110, 0.3);
        `;
        successMessage.innerHTML = `
            <strong>Thank you, ${data.name}!</strong><br>
            We've received your message and will get back to you soon.
        `;
        
        contactForm.appendChild(successMessage);
        contactForm.reset();
        
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        setTimeout(() => {
            successMessage.style.opacity = '0';
            setTimeout(() => successMessage.remove(), 500);
        }, 5000);
    });
};

// ==========================================================================
// NEWSLETTER FORM
// ==========================================================================
const initNewsletterForm = () => {
    const newsletterForm = $('#newsletterForm');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        const button = newsletterForm.querySelector('button');
        const originalText = button.innerHTML;
        button.innerHTML = '<span>Subscribing...</span>';
        button.disabled = true;
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        button.innerHTML = '<span>✓ Subscribed!</span>';
        emailInput.value = '';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 3000);
    });
};

// ==========================================================================
// BACK TO TOP BUTTON
// ==========================================================================
const initBackToTop = () => {
    const backToTop = $('#backToTop');
    
    if (!backToTop) return;
    
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }, 100));
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// ==========================================================================
// SCROLL PROGRESS INDICATOR
// ==========================================================================
const initScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #c9a16e, #8b6f47);
        width: 0%;
        z-index: 10001;
        transition: width 0.1s ease;
        box-shadow: 0 2px 10px rgba(201, 161, 110, 0.5);
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', throttle(() => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }, 16));
};

// ==========================================================================
// BUTTON RIPPLE EFFECT
// ==========================================================================
const initButtonRipple = () => {
    const buttons = $$('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                left: ${x}px;
                top: ${y}px;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
};

// ==========================================================================
// FLOATING ANIMATIONS
// ==========================================================================
const initFloatingAnimations = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatSoft {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-20px);
            }
        }
    `;
    document.head.appendChild(style);
};

// ==========================================================================
// TYPING EFFECT FOR HERO
// ==========================================================================
const initTypingEffect = () => {
    const heroEmphasis = $('.hero-emphasis');
    
    if (!heroEmphasis) return;
    
    const text = heroEmphasis.textContent;
    heroEmphasis.textContent = '';
    let i = 0;
    
    setTimeout(() => {
        const typeWriter = () => {
            if (i < text.length) {
                heroEmphasis.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        typeWriter();
    }, 4500);
};

// ==========================================================================
// IMAGE LAZY LOADING
// ==========================================================================
const initLazyLoading = () => {
    const lazyImages = $$('img[data-src]');
    
    if (!lazyImages.length) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
};

// ==========================================================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ==========================================================================
const initIntersectionObserver = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                const children = entry.target.querySelectorAll('.stat-item, .product-card, .story-card, .feature-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    $$('.reveal').forEach(el => observer.observe(el));
    
    const staggerItems = $$('.stat-item, .product-card, .story-card, .feature-item');
    staggerItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    });
};

// ==========================================================================
// SCROLL INDICATOR
// ==========================================================================
const initScrollIndicator = () => {
    const scrollIndicator = $('.scroll-indicator');
    
    if (!scrollIndicator) return;
    
    scrollIndicator.addEventListener('click', () => {
        const nextSection = $('#philosophy') || $('#about');
        if (nextSection) {
            window.scrollTo({
                top: nextSection.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
    
    window.addEventListener('scroll', debounce(() => {
        if (window.pageYOffset > 200) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    }, 10));
};

// ==========================================================================
// KEYBOARD NAVIGATION
// ==========================================================================
const initKeyboardNavigation = () => {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const navToggle = $('#navToggle');
            const navMenu = $('#navMenu');
            if (navMenu?.classList.contains('active')) {
                navToggle?.classList.remove('active');
                navMenu?.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });
};

// ==========================================================================
// CONSOLE MESSAGE
// ==========================================================================
const showConsoleMessage = () => {
    console.log('%c✨ Lopez Fragrance', 'font-size: 24px; font-weight: bold; color: #c9a16e;');
    console.log('%cWebsite loaded successfully!', 'font-size: 14px; color: #8b6f47;');
    console.log('%cEmpowering through scent since 2018 🌸', 'font-size: 12px; color: #6b6b6b;');
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================
const init = () => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runInit);
    } else {
        runInit();
    }
};

const runInit = () => {
    try {
        initCursor();
        initSplashScreen();
        initNavigation();
        initSmoothScroll();
        initScrollReveal();
        initParallax();
        initProductCards();
        initCollectionFilter();
        initFAQ();
        initContactForm();
        initNewsletterForm();
        initBackToTop();
        initScrollProgress();
        initButtonRipple();
        initFloatingAnimations();
        initTypingEffect();
        initLazyLoading();
        initIntersectionObserver();
        initScrollIndicator();
        initKeyboardNavigation();
        showConsoleMessage();
    } catch (error) {
        console.error('Initialization error:', error);
    }
};

init();