// Default site data
const defaultSiteData = {
    site: {
        name: 'PG Club',
        tagline: 'Premium Noćni Doživljaj',
        location: 'Podgorica, Crna Gora',
        address: 'Rasko Trg',
        description: 'PG Club je novo premium mjesto za noćni život u Podgorici.',
        email: 'info@pgclub.me',
        phone: '+382 XX XXX XXX'
    },
    opening: {
        date: '2026-09-15',
        label: 'Grand Opening 15.09.2026'
    },
    hours: {
        petak: '22:00 - 04:00',
        subota: '22:00 - 05:00'
    },
    about: {
        title: 'O Clubu',
        subtitle: 'Dobrodošli u PG Club',
        text1: 'PG Club je novo premium mjesto za noćni život u Podgorici. Smješten u samom centru grada, nudimo jedinstveno iskustvo koje spaja eleganciju, zabavu i nezaboravne trenutke.',
        text2: 'Naš klub je idealno mjesto za privatne proslave, rođendane, proslave firmi i druge zabave. Takođe organizujemo velike party događaje nekoliko puta godišnje sa najboljim izvođačima iz regiona.',
        capacity: '250',
        vipBoxes: '4',
        drinks: '50'
    },
    services: [
        { icon: 'fa-glass-cheers', title: 'Privatne Proslave', description: 'Rođendani, godišnjice, vjenčanja i drugi posebni trenuci. Osigurajte privatnost i luksuz za Vaše najdraže.', featured: false },
        { icon: 'fa-music', title: 'Veliki Partyji', description: 'Nekoliko puta godišnje organizujemo velike događaje sa nastupima poznatih pjevača i influensera iz regiona.', featured: true },
        { icon: 'fa-crown', title: 'VIP Usluga', description: '4 ekskluzivna separea spremna za rezervaciju. Premium atmosfera i personalizovana usluga za naše najistaknutije goste.', featured: false }
    ],
    events: [
        { title: 'Grand Opening', description: 'Spektakularno otvaranje PG Club-a sa posebnim gostima i iznenađenjima.', date: '15', month: 'SEP', badge: 'Grand Opening', time: '22:00 - 05:00', featured: true },
        { title: 'Halloween Party', description: 'Maskembal najvećeg formata. Pripremite svoje najkreativnije kostime.', date: 'TBD', month: 'OKT', badge: 'Tema', time: '22:00 - 04:00', featured: false },
        { title: "New Year's Eve", description: "Najluđa noć u godini provedite u PG Club-u. Očekujte vrhunski provod.", date: '31', month: 'DEC', badge: 'Specijalno', time: '21:00 - 06:00', featured: false }
    ],
    team: [
        { name: 'Marko Petrović', role: 'Vlasnik', image: 'pg_club_final_transparent.png' },
        { name: 'Ana Nikolić', role: 'Manager', image: 'pg_club_final_transparent.png' },
        { name: 'Nikola Vučković', role: 'Head DJ', image: 'pg_club_final_transparent.png' },
        { name: 'Jelena Marković', role: 'PR Menadžer', image: 'pg_club_final_transparent.png' }
    ],
    gallery: [],
    social: {
        instagram: '#',
        facebook: '#',
        tiktok: '#',
        twitter: '#'
    }
};

// Load data from localStorage or use defaults
let siteData = JSON.parse(localStorage.getItem('pgClubData')) || JSON.parse(JSON.stringify(defaultSiteData));

// Current modal state
let modalMode = null; // 'add' or 'edit'
let modalType = null; // 'service', 'event', 'team', 'gallery'
let modalIndex = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (sessionStorage.getItem('pgClubAdmin') === 'true') {
        showAdminPanel();
    }
    
    // Load data into forms
    loadFormData();
});

// Login handler
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'admin' && password === 'pgclub2026') {
        sessionStorage.setItem('pgClubAdmin', 'true');
        showAdminPanel();
    } else {
        alert('Pogrešno korisničko ime ili lozinka!');
    }
    return false;
}

// Logout handler
function handleLogout() {
    sessionStorage.removeItem('pgClubAdmin');
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('adminSection').classList.remove('active');
}

// Show admin panel
function showAdminPanel() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminSection').classList.add('active');
    loadFormData();
}

// Load form data from siteData
function loadFormData() {
    // Set values using data-key attributes
    document.querySelectorAll('[data-key]').forEach(input => {
        const key = input.dataset.key;
        const value = getNestedValue(siteData, key);
        if (value !== undefined) {
            input.value = value;
        }
    });
    
    // Render lists
    renderServices();
    renderEvents();
    renderTeam();
    renderGallery();
    renderBookings();
}

// Get nested object value
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
}

// Set nested object value
function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const lastObj = keys.reduce((current, key) => {
        if (!current[key]) current[key] = {};
        return current[key];
    }, obj);
    lastObj[lastKey] = value;
}

// Tab switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById('tab-' + tabName).classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'bookings') renderBookings();
}

// Save all data
function saveAllData() {
    // Save form fields
    document.querySelectorAll('[data-key]').forEach(input => {
        setNestedValue(siteData, input.dataset.key, input.value);
    });
    
    // Save to localStorage
    localStorage.setItem('pgClubData', JSON.stringify(siteData));
    
    showAlert('Uspješno sačuvane promjene!', 'success');
}

// Show alert
function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    alertBox.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    alertBox.className = 'alert alert-' + type + ' show';
    setTimeout(() => { alertBox.classList.remove('show'); }, 3000);
}

// Render services
function renderServices() {
    const container = document.getElementById('servicesList');
    container.innerHTML = siteData.services.map((service, index) => `
        <div class="list-item">
            <div class="list-item-info">
                <div class="list-item-icon">
                    <i class="fas ${service.icon}"></i>
                </div>
                <div class="list-item-details">
                    <h4>${service.title}</h4>
                    <p>${service.description.substring(0, 60)}...</p>
                </div>
            </div>
            <div class="list-item-actions">
                <button class="action-btn action-btn-edit" onclick="openServiceModal(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn action-btn-delete" onclick="deleteService(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Open service modal
function openServiceModal(index = null) {
    modalType = 'service';
    modalIndex = index;
    modalMode = index !== null ? 'edit' : 'add';
    
    document.getElementById('modalTitle').textContent = index !== null ? 'Uredi uslugu' : 'Dodaj uslugu';
    
    const service = index !== null ? siteData.services[index] : { icon: 'fa-music', title: '', description: '' };
    
    document.getElementById('modalBody').innerHTML = `
        <div class="form-group">
            <label>Ikonica</label>
            <select id="modalIcon">
                ${['fa-glass-cheers', 'fa-music', 'fa-building', 'fa-crown', 'fa-star', 'fa-heart', 'fa-fire', 'fa-gem'].map(icon => 
                    `<option value="${icon}" ${service.icon === icon ? 'selected' : ''}>${icon.replace('fa-', '')}</option>`
                ).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Naslov</label>
            <input type="text" id="modalTitle2" value="${service.title}" placeholder="Naziv usluge">
        </div>
        <div class="form-group">
            <label>Opis</label>
            <textarea id="modalDescription" rows="4">${service.description}</textarea>
        </div>
    `;
    
    document.getElementById('modalOverlay').classList.add('active');
}

// Delete service
function deleteService(index) {
    if (confirm('Da li ste sigurni da želite obrisati ovu uslugu?')) {
        siteData.services.splice(index, 1);
        renderServices();
        showAlert('Usluga uspješno obrisana!', 'success');
    }
}

// Render events
function renderEvents() {
    const container = document.getElementById('eventsList');
    container.innerHTML = siteData.events.map((event, index) => `
        <div class="list-item">
            <div class="list-item-info">
                <div class="list-item-icon" style="flex-direction: column; min-width: 60px;">
                    <span style="font-size: 1.5rem; font-weight: bold;">${event.date}</span>
                    <span style="font-size: 0.75rem;">${event.month}</span>
                </div>
                <div class="list-item-details">
                    <h4>${event.title} <span style="background: var(--gold); color: var(--dark); padding: 3px 10px; border-radius: 15px; font-size: 0.7rem; margin-left: 10px;">${event.badge}</span></h4>
                    <p>${event.time}</p>
                </div>
            </div>
            <div class="list-item-actions">
                <button class="action-btn action-btn-edit" onclick="openEventModal(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn action-btn-delete" onclick="deleteEvent(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Open event modal
function openEventModal(index = null) {
    modalType = 'event';
    modalIndex = index;
    modalMode = index !== null ? 'edit' : 'add';
    
    document.getElementById('modalTitle').textContent = index !== null ? 'Uredi događaj' : 'Dodaj događaj';
    
    const event = index !== null ? siteData.events[index] : { title: '', description: '', date: '', month: 'SEP', badge: '', time: '' };
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAJ', 'JUN', 'JUL', 'AVG', 'SEP', 'OKT', 'NOV', 'DEC'];
    
    document.getElementById('modalBody').innerHTML = `
        <div class="form-group">
            <label>Naslov</label>
            <input type="text" id="modalEventTitle" value="${event.title}" placeholder="Naziv događaja">
        </div>
        <div class="form-group">
            <label>Opis</label>
            <textarea id="modalEventDesc" rows="3">${event.description}</textarea>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="form-group">
                <label>Dan</label>
                <input type="text" id="modalEventDate" value="${event.date}" placeholder="15 ili TBD">
            </div>
            <div class="form-group">
                <label>Mjesec</label>
                <select id="modalEventMonth">
                    ${months.map(m => `<option value="${m}" ${event.month === m ? 'selected' : ''}>${m}</option>`).join('')}
                </select>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="form-group">
                <label>Oznaka</label>
                <input type="text" id="modalEventBadge" value="${event.badge}" placeholder="Premium, Tema...">
            </div>
            <div class="form-group">
                <label>Vrijeme</label>
                <input type="text" id="modalEventTime" value="${event.time}" placeholder="22:00 - 04:00">
            </div>
        </div>
    `;
    
    document.getElementById('modalOverlay').classList.add('active');
}

// Delete event
function deleteEvent(index) {
    if (confirm('Da li ste sigurni da želite obrisati ovaj događaj?')) {
        siteData.events.splice(index, 1);
        renderEvents();
        showAlert('Događaj uspješno obrisan!', 'success');
    }
}

// Render team
function renderTeam() {
    const container = document.getElementById('teamList');
    container.innerHTML = siteData.team.map((member, index) => `
        <div class="list-item">
            <div class="list-item-info">
                <img src="${member.image}" alt="${member.name}" onerror="this.src='https://via.placeholder.com/55'">
                <div class="list-item-details">
                    <h4>${member.name}</h4>
                    <p>${member.role}</p>
                </div>
            </div>
            <div class="list-item-actions">
                <button class="action-btn action-btn-edit" onclick="openTeamModal(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn action-btn-delete" onclick="deleteTeamMember(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Open team modal
function openTeamModal(index = null) {
    modalType = 'team';
    modalIndex = index;
    modalMode = index !== null ? 'edit' : 'add';
    
    document.getElementById('modalTitle').textContent = index !== null ? 'Uredi člana' : 'Dodaj člana tima';
    
    const member = index !== null ? siteData.team[index] : { name: '', role: '', image: '' };
    
    document.getElementById('modalBody').innerHTML = `
        <div class="form-group">
            <label>Ime i prezime</label>
            <input type="text" id="modalMemberName" value="${member.name}" placeholder="Puno ime">
        </div>
        <div class="form-group">
            <label>Uloga</label>
            <input type="text" id="modalMemberRole" value="${member.role}" placeholder="Manager, DJ...">
        </div>
        <div class="form-group">
            <label>Slika URL</label>
            <input type="url" id="modalMemberImage" value="${member.image}" placeholder="https://images.unsplash.com/...">
        </div>
    `;
    
    document.getElementById('modalOverlay').classList.add('active');
}

// Delete team member
function deleteTeamMember(index) {
    if (confirm('Da li ste sigurni da želite obrisati ovog člana?')) {
        siteData.team.splice(index, 1);
        renderTeam();
        showAlert('Član tima uspješno obrisan!', 'success');
    }
}

// Render gallery
function renderGallery() {
    const container = document.getElementById('galleryList');
    container.innerHTML = siteData.gallery.map((image, index) => `
        <div class="gallery-item">
            <img src="${image.url}" alt="${image.title}" onerror="this.src='https://via.placeholder.com/200'">
            <div class="gallery-item-overlay">
                <span class="gallery-item-title">${image.title}</span>
                <button class="action-btn action-btn-delete" onclick="deleteGalleryImage(${index})" style="width: 35px; height: 35px;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Open gallery modal
function openGalleryModal() {
    modalType = 'gallery';
    modalIndex = null;
    modalMode = 'add';
    
    document.getElementById('modalTitle').textContent = 'Dodaj sliku';
    
    document.getElementById('modalBody').innerHTML = `
        <div class="form-group">
            <label>URL slike</label>
            <input type="url" id="modalGalleryUrl" placeholder="https://images.unsplash.com/...">
        </div>
        <div class="form-group">
            <label>Naslov</label>
            <input type="text" id="modalGalleryTitle" placeholder="Naziv slike">
        </div>
        <div class="form-group">
            <label>Kategorija</label>
            <select id="modalGalleryCategory">
                <option value="interijer">Interijer</option>
                <option value="atmosfera">Atmosfera</option>
                <option value="dogadjaji">Događaji</option>
            </select>
        </div>
    `;
    
    document.getElementById('modalOverlay').classList.add('active');
}

// Delete gallery image
function deleteGalleryImage(index) {
    if (confirm('Da li ste sigurni da želite obrisati ovu sliku?')) {
        siteData.gallery.splice(index, 1);
        renderGallery();
        showAlert('Slika uspješno obrisana!', 'success');
    }
}

// Save modal data
function saveModalData() {
    if (modalType === 'service') {
        const serviceData = {
            icon: document.getElementById('modalIcon').value,
            title: document.getElementById('modalTitle2').value,
            description: document.getElementById('modalDescription').value,
            featured: false
        };
        
        if (modalMode === 'edit') {
            siteData.services[modalIndex] = serviceData;
        } else {
            siteData.services.push(serviceData);
        }
        renderServices();
    }
    else if (modalType === 'event') {
        const eventData = {
            title: document.getElementById('modalEventTitle').value,
            description: document.getElementById('modalEventDesc').value,
            date: document.getElementById('modalEventDate').value,
            month: document.getElementById('modalEventMonth').value,
            badge: document.getElementById('modalEventBadge').value,
            time: document.getElementById('modalEventTime').value,
            featured: false
        };
        
        if (modalMode === 'edit') {
            siteData.events[modalIndex] = eventData;
        } else {
            siteData.events.push(eventData);
        }
        renderEvents();
    }
    else if (modalType === 'team') {
        const memberData = {
            name: document.getElementById('modalMemberName').value,
            role: document.getElementById('modalMemberRole').value,
            image: document.getElementById('modalMemberImage').value
        };
        
        if (modalMode === 'edit') {
            siteData.team[modalIndex] = memberData;
        } else {
            siteData.team.push(memberData);
        }
        renderTeam();
    }
    else if (modalType === 'gallery') {
        const imageData = {
            url: document.getElementById('modalGalleryUrl').value,
            title: document.getElementById('modalGalleryTitle').value,
            category: document.getElementById('modalGalleryCategory').value
        };
        
        siteData.gallery.push(imageData);
        renderGallery();
    }
    
    // Save to localStorage
    localStorage.setItem('pgClubData', JSON.stringify(siteData));
    closeModal();
    showAlert('Uspješno sačuvano!', 'success');
}

// Close modal
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    modalMode = null;
    modalType = null;
    modalIndex = null;
}

// Close modal on outside click
document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

// Render bookings
function renderBookings() {
    const container = document.getElementById('bookingsList');
    if (!container) return;
    
    const bookings = JSON.parse(localStorage.getItem('pgClubBookings')) || [];
    
    if (bookings.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--gray-light);padding:40px 0;">Nema zakazanih rezervacija.</p>';
        return;
    }
    
    const sorted = bookings.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    container.innerHTML = sorted.map((b, i) => {
        const statusColors = {
            'cekanje': { bg: 'rgba(201,162,39,0.15)', border: 'rgba(201,162,39,0.4)', color: '#c9a227', label: 'Na čekanju' },
            'potvrdjena': { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', color: '#10b981', label: 'Potvrđena' },
            'odbita': { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', color: '#ef4444', label: 'Odbijena' }
        };
        const s = statusColors[b.status] || statusColors['cekanje'];
        
        const addonsList = (b.addons && b.addons.length > 0)
            ? b.addons.map(a => a.name + ' (+' + a.pricePerPerson + '€/os)').join(', ')
            : 'Bez dodataka';
        
        const timeLabel = b.timeSlot === 'morning' ? '09:00 - 15:00 (jutarnji)' : '18:00 - 02:00 (večernji)';
        
        return '<div class="list-item" style="flex-direction:column;align-items:flex-start;gap:15px;">' +
            '<div style="display:flex;justify-content:space-between;width:100%;align-items:flex-start;">' +
                '<div class="list-item-info" style="flex:1;">' +
                    '<div class="list-item-icon" style="flex-direction:column;min-width:55px;">' +
                        '<span style="font-size:1.2rem;font-weight:bold;">' + b.date.split('-')[2] + '.' + b.date.split('-')[1] + '</span>' +
                        '<span style="font-size:0.7rem;">' + b.date.split('-')[0] + '</span>' +
                    '</div>' +
                    '<div class="list-item-details">' +
                        '<h4>' + b.name + ' <span style="background:' + s.bg + ';border:1px solid ' + s.border + ';color:' + s.color + ';padding:3px 10px;border-radius:15px;font-size:0.7rem;margin-left:10px;">' + s.label + '</span></h4>' +
                        '<p>' + b.packageName + ' | ' + timeLabel + ' | ' + b.guests + ' gostiju</p>' +
                    '</div>' +
                '</div>' +
                '<div class="list-item-actions" style="flex-shrink:0;">' +
                    '<button class="action-btn action-btn-edit" onclick="changeBookingStatus(' + bookings.indexOf(b) + ',\'potvrdjena\')" title="Potvrdi"><i class="fas fa-check"></i></button>' +
                    '<button class="action-btn action-btn-delete" onclick="changeBookingStatus(' + bookings.indexOf(b) + ',\'odbita\')" title="Odbij"><i class="fas fa-times"></i></button>' +
                '</div>' +
            '</div>' +
            '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;width:100%;padding:10px 15px;background:rgba(255,255,255,0.02);border-radius:8px;font-size:0.8rem;">' +
                '<div><span style="color:var(--gray-light);">Telefon:</span> <strong>' + b.phone + '</strong></div>' +
                '<div><span style="color:var(--gray-light);">Email:</span> <strong>' + b.email + '</strong></div>' +
                '<div><span style="color:var(--gray-light);">Vrsta:</span> <strong>' + b.eventType + '</strong></div>' +
                '<div><span style="color:var(--gray-light);">JMBG:</span> <strong>' + b.jmbg + '</strong></div>' +
                '<div><span style="color:var(--gray-light);">Ukupno:</span> <strong style="color:var(--gold);">€' + b.totalPrice + '</strong></div>' +
                '<div><span style="color:var(--gray-light);">Avans (50%):</span> <strong style="color:var(--gold);">€' + b.advanceAmount + '</strong></div>' +
                '<div style="grid-column:1/-1;"><span style="color:var(--gray-light);">Dodaci:</span> <strong>' + addonsList + '</strong></div>' +
            '</div>' +
        '</div>';
    }).join('');
}

// Change booking status
function changeBookingStatus(index, newStatus) {
    const bookings = JSON.parse(localStorage.getItem('pgClubBookings')) || [];
    if (bookings[index]) {
        const statusLabel = newStatus === 'potvrdjena' ? 'potvrditi' : 'odbiti';
        if (confirm('Da li ste sigurni da želite ' + statusLabel + ' ovu rezervaciju?')) {
            bookings[index].status = newStatus;
            localStorage.setItem('pgClubBookings', JSON.stringify(bookings));
            renderBookings();
            showAlert('Rezervacija uspješno ' + (newStatus === 'potvrdjena' ? 'potvrđena' : 'odbačena') + '!', 'success');
        }
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveAllData();
    }
});
