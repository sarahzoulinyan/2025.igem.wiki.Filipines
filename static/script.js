(function(){
  const btn = document.getElementById('entrepreneurshipDropdownBtn');
  const panel = document.getElementById('entrepreneurshipDropdown');
  if (!btn || !panel) return;
  const icon = btn.querySelector('.entrepreneurship-dropdown-icon');
  btn.addEventListener('click', () => {
    const isOpen = panel.style.display === 'block';
    panel.style.display = isOpen ? 'none' : 'block';
    if (icon) icon.textContent = isOpen ? '+' : '−';
  });
})();



/* ---------- Rocket scroll (runs on all pages) ---------- */
function initRocketScroll() {
  const rocket = document.querySelector('.rocket-container');
  const track  = document.querySelector('.rocket-track');
  if (!rocket || !track) return;

  const rocketImg = rocket.querySelector('img');

  function update() {
    const doc = document.documentElement;
    const scrollable = Math.max(1, doc.scrollHeight - window.innerHeight); // avoid /0
    const progress  = Math.min(1, Math.max(0, window.scrollY / scrollable));

    const rocketH = rocket.offsetHeight || 120; // fallback before image loads
    const travel  = Math.max(0, window.innerHeight - rocketH - 20);
    const y = progress * travel;

    rocket.style.transform = `translateY(${y}px)`;
  }

  // Update on common events
  window.addEventListener('scroll',  update, { passive: true });
  window.addEventListener('resize',  update, { passive: true });
  window.addEventListener('load',    update);

  // If the image wasn't loaded yet, recalc once it is
  if (rocketImg && !rocketImg.complete) {
    rocketImg.addEventListener('load', update, { once: true });
  }

  update();
}

document.addEventListener('DOMContentLoaded', () => {
  // ... your existing code ...

  // make the rocket work on all pages
  initRocketScroll();
});

/* ---------- Side Navigation Functions ---------- */

// function openNav() {
//   console.log("openNav function called!");
  
//   try {
//     const sidenav = document.getElementById("mySidenav");
//     const main = document.getElementById("main");
    
//     if (sidenav) {
//       sidenav.style.width = "250px";
//       console.log("Side navigation opened successfully - width set to 250px");
//       console.log("Side navigation element:", sidenav);
//     } else {
//       console.error("Side navigation element not found!");
//       alert("Side navigation element not found! Check console for details.");
//     }
    
//     if (main) {
//       main.style.marginLeft = "250px";
//       console.log("Main content margin set to 250px");
//     } else {
//       console.error("Main element not found!");
//     }
//   } catch (error) {
//     console.error("Error in openNav:", error);
//     alert("Error in openNav: " + error.message);
//   }
// }
// function closeNav() {
//   document.getElementById("mySidenav").style.width = "0";
//   document.getElementById("main").style.marginLeft = "";
// }

/* ---------- Typewriter (once) ---------- */
function typeWriterEffect(element, text, typeSpeed = 75) {
  let charIndex = 0;
  function type() {
    if (charIndex < text.length) {
      element.textContent = text.substring(0, charIndex + 1);
      charIndex++;
      setTimeout(type, typeSpeed);
    } else {
      // Typing finished, add done class
      element.classList.add('done');
    }
  }
  type();
}

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Star Navigation System ---------- */
  function initStarNavigation() {
    if (document.querySelector('.no-stars')) return;
    // 🔎 Match /entrepreneurship or /entrepreneurship.html (case-insensitive)
    const onEntrepreneurship = /\/entrepreneurship(?:\.html)?\/?$/i.test(window.location.pathname)
      || window.location.pathname.toLowerCase().includes('/entrepreneurship/');

    // ✅ trying h1/h2 on all pages
    const headers = document.querySelectorAll('main h1, main h2');
    // Remove duplicate headings by normalized text content
    const seenHeaderTexts = new Set();
    const uniqueHeaders = Array.from(headers).filter(h => {
      const norm = (h.textContent || '').trim().replace(/\s+/g, ' ').toLowerCase();
      if (!norm || seenHeaderTexts.has(norm)) return false;
      seenHeaderTexts.add(norm);
      return true;
    });

    const starRail = document.getElementById('star-rail');
    // const sidenavContent = document.getElementById('sidenav-content');
    // const sidenavToggle = document.querySelector('.sidenav-toggle');
    
    if (!starRail || uniqueHeaders.length === 0) return;

    console.log('Found headers:', headers.length, Array.from(headers).map(h => h.textContent));

    // Clear any existing stars (in case of re-init)
    starRail.querySelectorAll('.star').forEach(n => n.remove());
    
    // // Clear any existing side navigation content
    // if (sidenavContent) {
    //   sidenavContent.innerHTML = '';
    // }
    
    // // Attach the toggle button inline inside the first header
    // if (sidenavToggle && uniqueHeaders.length > 0) {
    //   const firstHeader = uniqueHeaders[0];
    //   // Ensure the button appears before the header text
    //   firstHeader.prepend(sidenavToggle);
    //   // Style as inline element next to the header text
    //   sidenavToggle.classList.add('inline');
    //   sidenavToggle.style.display = 'inline-flex';
    //   sidenavToggle.style.position = 'static';
    // }

    // Create stars for each unique header
    uniqueHeaders.forEach((header, index) => {
      if (!header.id) header.id = `header-${index}`;

      const totalHeaders = uniqueHeaders.length;
      let position;
      if (totalHeaders === 1) {
        position = 25;
      } else if (index === 0) {
        position = 25;
      } else {
        position = 35 + ((index - 1) * (50 / (totalHeaders - 2)));
      }

      const star = document.createElement('div');
      star.className = 'star';
      star.style.top = `${position}%`;
      star.dataset.headerId = header.id;
      star.dataset.headerText = header.textContent;

      const tooltip = document.createElement('div');
      tooltip.className = 'star-tooltip';
      tooltip.textContent = header.textContent;
      star.appendChild(tooltip);

      star.addEventListener('click', (e) => {
        e.preventDefault();
        header.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      // Tooltip hover handlers - add/remove class instead of inline styles
      star.addEventListener('mouseenter', () => {
        tooltip.classList.add('show');
        // Show the "Jump to..." heading when hovering over a star
        const heading = document.getElementById('star-nav-heading');
        if (heading) heading.classList.add('show');
        
        // Show the header text in the display area (not on home page)
        const isHomePage = window.location.pathname === '/' || 
                          window.location.pathname === '/home' ||
                          window.location.pathname.includes('/home');
        if (!isHomePage) {
          const headerDisplay = document.getElementById('star-header-display');
          if (headerDisplay) {
            headerDisplay.textContent = header.textContent.trim();
            headerDisplay.classList.add('show');
          }
        }
      });
      
      star.addEventListener('mouseleave', () => {
        tooltip.classList.remove('show');
        // Hide header display
        const headerDisplay = document.getElementById('star-header-display');
        if (headerDisplay) {
          headerDisplay.classList.remove('show');
        }
        // Only hide heading if not hovering over rail or other stars
        const heading = document.getElementById('star-nav-heading');
        const starNav = document.getElementById('star-nav');
        if (heading && starNav && !starNav.matches(':hover')) {
          heading.classList.remove('show');
        }
      });

      starRail.appendChild(star);
      
      // Also add to side navigation
    //   if (sidenavContent) {
    //     const navLink = document.createElement('a');
    //     navLink.href = `#${header.id}`;
    //     navLink.textContent = header.textContent;
    //     navLink.addEventListener('click', (e) => {
    //       e.preventDefault();
    //       header.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //       closeNav(); // Close side nav after clicking
    //     });
    //     sidenavContent.appendChild(navLink);
    //   }
    });

    function highlightCurrentSection() {
      const scrollPos = window.scrollY + 100;
      let current = '';
      uniqueHeaders.forEach(header => {
        if (scrollPos >= header.offsetTop) current = header.id;
      });
      starRail.querySelectorAll('.star').forEach(star => {
        star.classList.toggle('active', star.dataset.headerId === current);
      });
      
      // Also highlight in side navigation
      // if (sidenavContent) {
      //   sidenavContent.querySelectorAll('a').forEach(link => {
      //     const isActive = link.getAttribute('href') === `#${current}`;
      //     link.style.color = isActive ? '#E86B55' : '#e2e0de';
      //     link.style.backgroundColor = isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent';
      //   });
      // }
    }

    // No-op: inline button doesn't need repositioning on scroll/resize
    // function updateButtonPosition() {}

    let ticking = false;
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(() => { 
          highlightCurrentSection(); 
          ticking = false; 
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', requestTick);
    highlightCurrentSection();
  }

  initStarNavigation();

  /* ---------- Star Navigation Heading Hover ---------- */
  const starNav = document.getElementById('star-nav');
  const starRail = document.getElementById('star-rail');
  const starNavHeading = document.getElementById('star-nav-heading');
  const starHeaderDisplay = document.getElementById('star-header-display');
  
  // Check if we're on the home page
  const isHomePage = window.location.pathname === '/' || 
                    window.location.pathname === '/home' ||
                    window.location.pathname.includes('/home');

  if (starNav && starNavHeading) {
    // Show heading when hovering over star-nav area (rail or stars)
    starNav.addEventListener('mouseenter', () => {
      starNavHeading.classList.add('show');
    });

    starNav.addEventListener('mouseleave', () => {
      starNavHeading.classList.remove('show');
      // Hide header display when leaving star nav area (not on home page)
      if (starHeaderDisplay && !isHomePage) {
        starHeaderDisplay.classList.remove('show');
      }
    });
  }
  
  // Hide header display on home page
  if (isHomePage && starHeaderDisplay) {
    starHeaderDisplay.style.display = 'none';
  }
});


  /* ---------- Stars on all pages (DISABLED - using navigation stars only) ---------- */
  // const starContainer = document.querySelector('.stars-container');
  // if (starContainer) {
  //   for (let i = 0; i < 100; i++) {
  //     const star = document.createElement('div');
  //     star.className = 'star';
  //     star.style.top = `${Math.random() * 300}vh`;
  //     star.style.left = `${Math.random() * 100}vw`;
  //     star.style.animationDelay = `${Math.random() * 2}s`;
  //     starContainer.appendChild(star);
  //   }
  // }

 // Runs on pages with <body class="scroll-bg">



  /* ---------- Type hero headings once ---------- */
  const heroHeadings = document.querySelectorAll('.hero-typing');
  heroHeadings.forEach(el => {
    const text = el.textContent.trim();
    el.textContent = '';
    typeWriterEffect(el, text, 75);
  });

// This code was outside the function scope and causing errors
// The typing effect completion is now handled within the typeWriterEffect function
//Human Practices Interview Dropdown from Cornell iGEM 2024
window.toggleRfDropdown = function (dropdownId, button) {
  const content = document.getElementById(dropdownId);
  const icon = button.querySelector(".rf-dropdown-icon");

  // Toggle visibility of the dropdown content
  if (content.style.display === "block") {
    content.style.display = "none";
    icon.innerHTML = "+"; // Change icon to "+"
  } else {
    content.style.display = "block";
    icon.innerHTML = "-"; // Change icon to "-"
  }
};

// Hide the sidenav toggle button on members.html
// if (
//   window.location.pathname.toLowerCase().includes('members.html') ||
//   window.location.pathname.toLowerCase().includes('attributions.html')
// ) {
//   const toggleBtn = document.querySelector('.sidenav-toggle');
//   if (toggleBtn) toggleBtn.style.display = 'none';
// }





