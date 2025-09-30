// === CONFIGURATION GLOBALE ===
const CONFIG = {
    SITE_NAME: "ElectroLearn",
    VERSION: "1.0.0",
    API_BASE_URL: "https://api.electrolearn.fr/v1"
};

// === INITIALISATION DE L'APPLICATION ===
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialiser la navigation mobile
    initMobileNavigation();
    
    // Initialiser les animations au scroll
    initScrollAnimations();
    
    // Initialiser les compteurs animés
    initAnimatedCounters();
    
    // Initialiser les modals
    initModals();
    
    // Initialiser les formulaires
    initForms();
    
    // Vérifier l'état de connexion
    checkAuthStatus();
    
    // Charger le thème sauvegardé
    loadSavedTheme();
    
    console.log(`${CONFIG.SITE_NAME} v${CONFIG.VERSION} initialisé`);
}

// === GESTION DE LA NAVIGATION MOBILE ===
function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animation des barres du hamburger
            const bars = this.querySelectorAll('.bar');
            if (navMenu.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
        
        // Fermer le menu en cliquant sur un lien
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                resetMobileMenuAnimation();
            });
        });
        
        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                resetMobileMenuAnimation();
            }
        });
    }
}

function resetMobileMenuAnimation() {
    const bars = document.querySelectorAll('.bar');
    bars[0].style.transform = 'none';
    bars[1].style.opacity = '1';
    bars[2].style.transform = 'none';
}

// === ANIMATIONS AU SCROLL ===
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.6s ease forwards`;
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);

    // Observer les éléments avec la classe 'animate-on-scroll'
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
    });
    
    // Gestion du scroll de la navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
    });
}

// === COMPTEURS ANIMÉS ===
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current).toLocaleString();
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        // Démarrer l'animation quand l'élément est visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// === GESTION DES MODALS ===
function initModals() {
    // Fermer les modals en cliquant à l'extérieur
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Fermer avec la touche Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// === GESTION DES FORMULAIRES ===
function initForms() {
    // Validation d'email
    window.isValidEmail = function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };
    
    // Affichage des messages de notification
    window.showNotification = function(message, type = 'info', duration = 5000) {
        // Supprimer les notifications existantes
        document.querySelectorAll('.custom-notification').forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `custom-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Styles pour la notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Fermer la notification
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.remove();
        });
        
        // Fermer automatiquement après la durée spécifiée
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    };
    
    function getNotificationColor(type) {
        const colors = {
            'success': '#48BB78',
            'error': '#F56565',
            'warning': '#ED8936',
            'info': '#4299E1'
        };
        return colors[type] || colors.info;
    }
}

// === GESTION DE L'AUTHENTIFICATION ===
function checkAuthStatus() {
    const user = getCurrentUser();
    updateUIForAuthStatus(user);
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('electrolearn_user')) || null;
}

function setCurrentUser(user) {
    localStorage.setItem('electrolearn_user', JSON.stringify(user));
    updateUIForAuthStatus(user);
}

function updateUIForAuthStatus(user) {
    const loginBtn = document.querySelector('.nav-cta');
    
    if (user && loginBtn) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${user.name}`;
        loginBtn.href = '#';
        loginBtn.onclick = showUserMenu;
    }
}

function showUserMenu() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Créer un menu utilisateur
    const menu = document.createElement('div');
    menu.style.cssText = `
        position: absolute;
        top: 70px;
        right: 20px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        padding: 1rem;
        min-width: 200px;
        z-index: 1000;
        animation: fadeInUp 0.3s ease;
    `;
    
    menu.innerHTML = `
        <div style="padding: 0.5rem; border-bottom: 1px solid #e2e8f0;">
            <strong>${user.name}</strong>
            <div style="font-size: 0.8rem; color: var(--gray);">${user.email}</div>
        </div>
        <div style="padding: 0.5rem;">
            <button onclick="window.location.href='cours-details.html'" style="width: 100%; text-align: left; padding: 0.5rem; background: none; border: none; cursor: pointer;">
                <i class="fas fa-book"></i> Mes cours
            </button>
            <button onclick="window.location.href='galerie-projets.html'" style="width: 100%; text-align: left; padding: 0.5rem; background: none; border: none; cursor: pointer;">
                <i class="fas fa-project-diagram"></i> Mes projets
            </button>
            <button onclick="logout()" style="width: 100%; text-align: left; padding: 0.5rem; background: none; border: none; cursor: pointer; color: var(--secondary);">
                <i class="fas fa-sign-out-alt"></i> Déconnexion
            </button>
        </div>
    `;
    
    document.body.appendChild(menu);
    
    // Fermer le menu en cliquant à l'extérieur
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !e.target.closest('.nav-cta')) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

function logout() {
    localStorage.removeItem('electrolearn_user');
    window.location.reload();
}

// === UTILITAIRES ===
// Scroll fluide vers une section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Formatage des nombres
function formatNumber(num) {
    return new Intl.NumberFormat('fr-FR').format(num);
}

// Détection du type d'appareil
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Gestion des thèmes (sombre/clair)
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('electrolearn_theme', newTheme);
    
    showNotification(`Thème ${newTheme === 'dark' ? 'sombre' : 'clair'} activé`, 'info');
}

// Charger le thème sauvegardé
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('electrolearn_theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
}

// === GESTION DES PRÉFÉRENCES UTILISATEUR ===
function saveUserPreference(key, value) {
    const preferences = JSON.parse(localStorage.getItem('electrolearn_preferences')) || {};
    preferences[key] = value;
    localStorage.setItem('electrolearn_preferences', JSON.stringify(preferences));
}

function getUserPreference(key, defaultValue = null) {
    const preferences = JSON.parse(localStorage.getItem('electrolearn_preferences')) || {};
    return preferences[key] || defaultValue;
}

// === GESTION DES COURS ET PROGRESSION ===
function saveCourseProgress(courseId, lessonId, progress) {
    const courseProgress = JSON.parse(localStorage.getItem('electrolearn_course_progress')) || {};
    
    if (!courseProgress[courseId]) {
        courseProgress[courseId] = {};
    }
    
    courseProgress[courseId][lessonId] = progress;
    localStorage.setItem('electrolearn_course_progress', JSON.stringify(courseProgress));
}

function getCourseProgress(courseId, lessonId = null) {
    const courseProgress = JSON.parse(localStorage.getItem('electrolearn_course_progress')) || {};
    
    if (lessonId) {
        return courseProgress[courseId]?.[lessonId] || 0;
    }
    
    return courseProgress[courseId] || {};
}

// === ANIMATIONS CSS SUPPLEMENTAIRES ===
const additionalStyles = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

[data-theme="dark"] {
    --dark: #F7FAFC;
    --light: #2D3748;
    --gray: #A0AEC0;
}

.custom-notification {
    font-family: inherit;
}

.animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
}

.animate-on-scroll.animated {
    opacity: 1;
    transform: translateY(0);
}
`;

// Injecter les styles supplémentaires
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// === EXPORT DES FONCTIONS GLOBALES ===
window.ElectroLearn = {
    config: CONFIG,
    utils: {
        scrollToSection,
        formatNumber,
        isMobileDevice,
        toggleTheme,
        loadSavedTheme
    },
    auth: {
        getCurrentUser,
        setCurrentUser,
        logout
    },
    courses: {
        saveProgress: saveCourseProgress,
        getProgress: getCourseProgress
    },
    preferences: {
        save: saveUserPreference,
        get: getUserPreference
    },
    ui: {
        showNotification: showNotification,
        openModal,
        closeModal
    }
};

// === COMPATIBILITÉ ET POLYFILLS ===
// Polyfill pour les anciens navigateurs
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        if (typeof start !== 'number') {
            start = 0;
        }
        if (start + search.length > this.length) {
            return false;
        }
        return this.indexOf(search, start) !== -1;
    };
}

// Export global pour la compatibilité
window.initElectroLearn = initializeApp;
// === FONCTIONS ADMIN ===
function checkAdminAuth() {
    return localStorage.getItem('electrolearn_admin') === 'true';
}

function requireAdminAuth() {
    if (!checkAdminAuth()) {
        window.location.href = 'admin-login.html';
        return false;
    }
    return true;
}

function adminLogin(credentials) {
    // Simulation - en réel, vérifier avec le backend
    if (credentials.email === 'admin@electrolearn.fr' && credentials.password === 'admin123') {
        localStorage.setItem('electrolearn
