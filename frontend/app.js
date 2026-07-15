// ===== AOS INIT =====
AOS.init({
    duration: 900,
    once: true,
    offset: 60,
});

// ===== SWIPER =====
const swiper = new Swiper('.mySwiper', {
    loop: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
        768: {
            slidesPerView: 2,
        },
    },
});

// ===== NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close nav on link click (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-number');
const speed = 120;

const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'));
    let current = 0;
    const increment = Math.ceil(target / 40);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = current;
        }
    }, speed);
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            if (!el.classList.contains('counted')) {
                el.classList.add('counted');
                animateCounter(el);
            }
        }
    });
}, { threshold: 0.4 });

counters.forEach(c => observer.observe(c));

// ===== CHART.JS =====
const ctx = document.getElementById('weightChart').getContext('2d');

new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Weight (kg)',
            data: [82, 80, 78, 76, 74, 72],
            borderColor: '#FFD700',
            backgroundColor: 'rgba(255, 215, 0, 0.08)',
            borderWidth: 3,
            tension: 0.3,
            pointBackgroundColor: '#FFD700',
            pointBorderColor: '#0A0A0A',
            pointBorderWidth: 2,
            pointRadius: 5,
            fill: true,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#ffffff',
                    font: {
                        size: 12,
                    }
                }
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)'
                },
                ticks: {
                    color: '#cccccc',
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#cccccc',
                }
            }
        }
    }
});

// ===== PARTICLES =====
const container = document.getElementById('particles');

for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 10 + 's';
    p.style.animationDuration = (14 + Math.random() * 20) + 's';
    p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
    container.appendChild(p);
}

// ===== SCROLL INDICATOR =====
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
    window.scrollBy({
        top: window.innerHeight * 0.9,
        behavior: 'smooth'
    });
});

// ===== BUTTON INTERACTIONS =====
document.getElementById('startBtn')?.addEventListener('click', () => {
    alert('🚀 Welcome to IronForge! Your 7-day trial starts now.');
});

document.getElementById('trialBtn')?.addEventListener('click', () => {
    alert('🎯 Claim your 7-day free trial!');
});

document.getElementById('authBtn')?.addEventListener('click', () => {
    alert('🔐 Login / Register modal would open here.');
});

document.getElementById('learnBtn')?.addEventListener('click', () => {
    document.getElementById('programs').scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a:not(.btn-gold-small)');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== API CONFIG (for backend connection) =====
// Change this to your Render backend URL when deployed
const API_URL = 'https://your-backend.onrender.com/api';

// Example API call (uncomment when backend is ready)
/*
async function fetchDashboard() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log('Dashboard data:', data);
    } catch (error) {
        console.error('API Error:', error);
    }
}
*/

console.log('🏋️ IronForge loaded — gold standard fitness.');
console.log('💪 Built for Vercel deployment');
