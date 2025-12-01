// Particle System for Background
class Particle {
  constructor(x, y, canvas) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.5;
    this.twinkleSpeed = Math.random() * 0.05 + 0.01;
    this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
    this.pulsePhase = Math.random() * Math.PI * 2;
  }

  update() {
    // Move particle
    this.x += this.speedX;
    this.y += this.speedY;

    // Wrap around screen edges
    if (this.x > this.canvas.width + 10) {
      this.x = -10;
    } else if (this.x < -10) {
      this.x = this.canvas.width + 10;
    }

    if (this.y > this.canvas.height + 10) {
      this.y = -10;
    } else if (this.y < -10) {
      this.y = this.canvas.height + 10;
    }

    // Twinkle effect
    this.opacity += this.twinkleSpeed * this.twinkleDirection;
    if (this.opacity >= 1 || this.opacity <= 0.3) {
      this.twinkleDirection *= -1;
    }

    // Pulse effect
    this.pulsePhase += 0.02;
  }

  draw(ctx) {
    // Calculate pulse size
    const pulseSize = this.size * (1 + Math.sin(this.pulsePhase) * 0.3);

    // Draw star
    ctx.save();
    ctx.globalAlpha = this.opacity;

    // Create star shape
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.beginPath();

    // Draw 5-pointed star
    const spikes = 5;
    const outerRadius = pulseSize;
    const innerRadius = pulseSize * 0.4;

    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const x = this.x + Math.cos(angle) * radius;
      const y = this.y + Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.closePath();
    ctx.fill();

    // Draw glow
    ctx.strokeStyle = `rgba(150, 200, 255, ${this.opacity * 0.5})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }
}

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.particleCount = 150;

    this.resize();
    this.init();

    window.addEventListener("resize", () => this.resize());
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      this.particles.push(new Particle(x, y, this.canvas));
    }
  }

  animate() {
    // Clear canvas with semi-transparent background for trail effect
    this.ctx.fillStyle = "rgba(10, 14, 39, 0.05)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    this.particles.forEach((particle) => {
      particle.update();
      particle.draw(this.ctx);
    });

    // Draw occasional connecting lines between close particles
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          this.ctx.save();
          this.ctx.globalAlpha = (1 - distance / 150) * 0.2;
          this.ctx.strokeStyle = "rgba(100, 150, 255, 1)";
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
          this.ctx.restore();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particle system on page load
document.addEventListener("DOMContentLoaded", function () {
  const particleSystem = new ParticleSystem("particleCanvas");
});

// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  navToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerOffset = 70;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Animate Elements on Scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener("DOMContentLoaded", function () {
  const animateElements = document.querySelectorAll(
    ".skill-category, .project-card, .timeline-item, .contact-item"
  );

  animateElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});

// Skill Progress Animation
function animateSkills() {
  const skillProgress = document.querySelectorAll(".skill-progress");

  skillProgress.forEach((progress) => {
    const percentage = progress.style.width;
    progress.style.width = "0%";

    setTimeout(() => {
      progress.style.width = percentage;
    }, 500);
  });
}

// Trigger skill animation when skills section is visible
const skillsObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateSkills();
        skillsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.addEventListener("DOMContentLoaded", function () {
  const skillsSection = document.querySelector(".skills");
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }
});

// Contact Form Handling
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;

      // Simple validation
      if (!name || !email || !subject || !message) {
        showNotification("Mohon lengkapi semua field!", "error");
        return;
      }

      if (!isValidEmail(email)) {
        showNotification("Email tidak valid!", "error");
        return;
      }

      // Send data to Google Sheets
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = "Mengirim...";
      submitBtn.disabled = true;

      const scriptURL =
        "https://script.google.com/macros/s/AKfycbzqM_JUsW6HmT7HFeXVe8IjJk-dNaa0wWLN9a5c4bSI75AqM1MAHykOYGP_a1lFqKdW5g/exec";

      fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          subject: subject,
          message: message,
        }),
      })
        .then((response) => {
          if (response.ok || response.type === "opaque") {
            showNotification(
              "Pesan berhasil dikirim! Terima kasih.",
              "success"
            );
            contactForm.reset();
          } else {
            throw new Error("Network response was not ok");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          showNotification(
            "Terjadi kesalahan saat mengirim pesan. Coba lagi nanti.",
            "error"
          );
        })
        .finally(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
    });
  }
});

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => notification.remove());

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add notification styles
  Object.assign(notification.style, {
    position: "fixed",
    top: "100px",
    right: "20px",
    padding: "15px 20px",
    borderRadius: "10px",
    color: "white",
    fontWeight: "500",
    zIndex: "10000",
    transform: "translateX(100%)",
    transition: "transform 0.3s ease",
    maxWidth: "300px",
    wordWrap: "break-word",
  });

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.background = "#10b981";
      break;
    case "error":
      notification.style.background = "#ef4444";
      break;
    case "warning":
      notification.style.background = "#f59e0b";
      break;
    default:
      notification.style.background = "#3b82f6";
  }

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// Typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";
  element.style.borderRight = "2px solid #3b82f6";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      setTimeout(() => {
        element.style.borderRight = "none";
      }, 1000);
    }
  }

  type();
}

// Initialize typing effect on page load
document.addEventListener("DOMContentLoaded", function () {
  const heroName = document.querySelector(".hero-name");
  if (heroName) {
    // Wait for hero animation to complete
    setTimeout(() => {
      const text = heroName.textContent;
      typeWriter(heroName, text);
    }, 1500);
  }
});

// Add loading animation
window.addEventListener("load", function () {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)";
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    navbar.style.boxShadow = "none";
  }
}, 10);

window.addEventListener("scroll", optimizedScrollHandler);

// Add parallax effect to hero section
window.addEventListener("scroll", function () {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  const heroAvatar = document.querySelector(".hero-avatar");

  if (hero && heroAvatar) {
    const rate = scrolled * -0.5;
    hero.style.transform = `translateY(${rate}px)`;
    heroAvatar.style.transform = `translateY(${rate * 0.3}px)`;
  }
});

// Add hover effects for project cards
document.addEventListener("DOMContentLoaded", function () {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
});

// Add counter animation for stats
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current) + "+";
  }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll(".stat-number");
        statNumbers.forEach((number) => {
          const text = number.textContent;
          const value = parseInt(text.replace(/\D/g, ""));
          animateCounter(number, value);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.addEventListener("DOMContentLoaded", function () {
  const aboutSection = document.querySelector(".about");
  if (aboutSection) {
    statsObserver.observe(aboutSection);
  }
});

// Add keyboard navigation support
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    // Close mobile menu on escape
    const navMenu = document.getElementById("nav-menu");
    const navToggle = document.getElementById("nav-toggle");
    if (navMenu && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  }
});

// Add focus management for accessibility
document.addEventListener("DOMContentLoaded", function () {
  const focusableElements = document.querySelectorAll(
    'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );

  // Add focus styles
  focusableElements.forEach((element) => {
    element.addEventListener("focus", function () {
      this.style.outline = "2px solid #3b82f6";
      this.style.outlineOffset = "2px";
    });

    element.addEventListener("blur", function () {
      this.style.outline = "none";
    });
  });
});

// Add print styles
const printStyles = `
@media print {
    .navbar, .nav-toggle, .hero-social, .footer-social {
        display: none !important;
    }

    .hero {
        background: white !important;
        color: black !important;
    }

    .hero-title, .hero-description {
        color: black !important;
    }

    * {
        box-shadow: none !important;
    }
}
`;

// Inject print styles
const printStyleSheet = document.createElement("style");
printStyleSheet.textContent = printStyles;
document.head.appendChild(printStyleSheet);
