// Hamburgermeny funksjonalitet
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('active');
            
            // Oppdater aria-expanded for tilgjengelighet
            const isExpanded = menu.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            
            // Endre hamburgerikon
            menuToggle.innerHTML = isExpanded ? '✕' : '☰';
        });
        
        // Lukk meny når man klikker på en lenke
        const menuLinks = menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                menu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.innerHTML = '☰';
            });
        });
        
        // Lukk meny ved klikk utenfor
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !menu.contains(event.target)) {
                menu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.innerHTML = '☰';
            }
        });
        
        // Håndter ESC-tast for å lukke meny
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && menu.classList.contains('active')) {
                menu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.innerHTML = '☰';
                menuToggle.focus();
            }
        });
    }
});
