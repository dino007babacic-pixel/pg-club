// Default site data
const defaultSiteData = {
    site: {
        name: 'PG Club',
        tagline: 'Premium No\u0107ni Do\u017eivljaj',
        location: 'Podgorica, Crna Gora',
        address: 'Rasko Trg',
        description: 'PG Club je novo premium mjesto za no\u0107ni \u017eivot u Podgorici.',
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
        subtitle: 'Dobrodo\u0161li u PG Club',
        text1: 'PG Club je novo premium mjesto za no\u0107ni \u017eivot u Podgorici. Smje\u0161ten u samom centru grada, nudimo jedinstveno iskustvo koje spaja eleganciju, zabavu i nezaboravne trenutke.',
        text2: 'Na\u0161 klub je idealno mjesto za privatne proslave, ro\u0111endane, proslave firmi i druge zabave. Tako\u0111e organizujemo velike party doga\u0111aje nekoliko puta godi\u0161nje sa najboljim izvo\u0111a\u010dima iz regiona.',
        capacity: '250',
        vipBoxes: '4',
        drinks: '50'
    },
    services: [
        { icon: 'fa-glass-cheers', title: 'Privatne Proslave', description: 'Ro\u0111endani, godi\u0161njice, vjen\u010danja i drugi posebni trenuci. Osigurajte privatnost i luksuz za Va\u0161e najdra\u017ee.', featured: false },
        { icon: 'fa-music', title: 'Veliki Partyji', description: 'Nekoliko puta godi\u0161nje organizujemo velike doga\u0111aje sa nastupima poznatih pjeva\u010da i influensera iz regiona.', featured: true },
        { icon: 'fa-crown', title: 'VIP Usluga', description: '4 ekskluzivna separea spremna za rezervaciju. Premium atmosfera i personalizovana usluga za na\u0161e najistaknutije goste.', featured: false }
    ],
    events: [
        { title: 'Grand Opening', description: 'Spektakularno otvaranje PG Club-a sa posebnim gostima i iznena\u0111enjima.', date: '15', month: 'SEP', badge: 'Grand Opening', time: '22:00 - 05:00', featured: true },
        { title: 'Halloween Party', description: 'Maskembal najve\u0107eg formata. Pripremite svoje najkreativnije kostime.', date: 'TBD', month: 'OKT', badge: 'Tema', time: '22:00 - 04:00', featured: false },
        { title: "New Year's Eve", description: "Najlu\u0111a no\u0107 u godini provedite u PG Club-u. O\u010dekujte vrhunski provod.", date: '31', month: 'DEC', badge: 'Specijalno', time: '21:00 - 06:00', featured: false }
    ],
    team: [
        { name: 'Marko Petrovi\u0107', role: 'Vlasnik', image: 'pg_club_final_transparent.png' },
        { name: 'Ana Nikoli\u0107', role: 'Manager', image: 'pg_club_final_transparent.png' },
        { name: 'Nikola Vu\u010dkovi\u0107', role: 'Head DJ', image: 'pg_club_final_transparent.png' },
        { name: 'Jelena Markovi\u0107', role: 'PR Menad\u017eer', image: 'pg_club_final_transparent.png' }
    ],
    gallery: [],
    social: {
        instagram: '#',
        facebook: '#',
        tiktok: '#',
        twitter: '#'
    }
};

// Data loaded from Firestore (or localStorage fallback)
let siteData = JSON.parse(JSON.stringify(defaultSiteData));
let dataLoaded = false;

// Current modal state
let modalMode = null;
let modalType = null;
let modalIndex = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    if (sessionStorage.getItem('pgClubAdmin') === 'true') {
        showAdminPanel();
    }
    await loadSiteData();
    loadFormData();
});

// Load site data from Firestore
async function loadSiteData() {
    try {
        const remote = await SiteDB.get();
        if (remote) {
            siteData = remote;
        } else {
            // First time \u2014 save defaults to Firestore
            await SiteDB.save(defaultSiteData);
            siteData = JSON.parse(JSON.stringify(defaultSiteData));
        }
        // Also keep a local backup
        localStorage.setItem('pgClubData', JSON.stringify(siteData));
    } catch (e) {
        console.error('Firestore load failed, using localStorage fallback:', e);
        try {
            siteData = JSON.parse(localStorage.getItem('pgClubData')) || JSON.parse(JSON.stringify(defaultSiteData));
        } catch (err) {
            siteData = JSON.parse(JSON.stringify(defaultSiteData));
        }
    }
    dataLoaded = true;
}

// Login handler
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'admin' && password === 'pgclub2026') {
        sessionStorage.setItem('pgClubAdmin', 'true');
        showAdminPanel();
    } else {
        alert('Pogre\u0161no korisni\u010dko ime ili lozinka!');
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
    document.querySelectorAll('[data-key]').forEach(input => {
        const key = input.dataset.key;
        const value = getNestedValue(siteData, key);
        if (value !== undefined) {
            input.value = value;
        }
    });
    
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

// Save all data to Firestore + localStorage
async function saveAllData() {
    document.querySelectorAll('[data-key]').forEach(input => {
        setNestedValue(siteData, input.dataset.key, input.value);
    });
    
    localStorage.setItem('pgClubData', JSON.stringify(siteData));
    
    try {
        await SiteDB.save(siteData);
        showAlert('Uspje\u0161no sa\u010duvane promjene! (Cloud + lokalna kopija)', 'success');
    } catch (e) {
        console.error('Firestore save failed:', e);
        showAlert('Sa\u010duvano lokalno (cloud gre\u0161ka \u2014 poku\u0161ajte ponovo kasnije)', 'success');
    }
}

// Show alert
function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    alertBox.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    alertBox.className = 'alert alert-' + type + ' show';
    setTimeout(() => { alertBox.classList.remove('show'); }, 4000);
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
    if (confirm('Da li ste sigurni da \u017eelite obrisati ovu uslugu?')) {
        siteData.services.splice(index, 1);
        renderServices();
        showAlert('Usluga uspje\u0161no obrisana!', 'success');
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
    
    document.getElementById('modalTitle').textContent = index !== null ? 'Uredi doga\u0111aj' : 'Dodaj doga\u0111aj';
    
    const event = index !== null ? siteData.events[index] : { title: '', description: '', date: '', month: 'SEP', badge: '', time: '' };
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAJ', 'JUN', 'JUL', 'AVG', 'SEP', 'OKT', 'NOV', 'DEC'];
    
    document.getElementById('modalBody').innerHTML = `
        <div class="form-group">
            <label>Naslov</label>
            <input type="text" id="modalEventTitle" value="${event.title}" placeholder="Naziv doga\u0111aja">
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
                <input type="text" id="modalEventTime" value="${event.time}" placeholder="22:00 - 05:00">
            </div>
        </div>
    `;
    
    document.getElementById('modalOverlay').classList.add('active');
}

// Delete event
function deleteEvent(index) {
    if (confirm('Da li ste sigurni da \u017eelite obrisati ovaj doga\u0111aj?')) {
        siteData.events.splice(index, 1);
        renderEvents();
        showAlert('Doga\u0111aj uspje\u0161no obrisan!', 'success');
    }
}

// Render team
function renderTeam() {
    const container = document.getElementById('teamList');
    container.innerHTML = siteData.team.map((member, index) => `
        <div class="list-item">
            <div class="list-item-info">
                <div class="list-item-icon" style="width:50px;height:50px;border-radius:50%;overflow:hidden;">
                    <img src="../${member.image}" alt="${member.name}" style="width:100%;height:100%;object-fit:cover;">
                </div>
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
    
    document.getElementById('modalTitle').textContent = index !== null ? 'Uredi \u010dlana' : 'Dodaj \u010dlana';
    
    const member = index !== null ? siteData.team[index] : { name: '', role: '', image: 'pg_club_final_transparent.png' };
    
    document.getElementById('modalBody').innerHTML = `
        <div class="form-group">
            <label>Ime i prezime</label>
            <input type="text" id="modalMemberName" value="${member.name}" placeholder="Puno ime">
        </div>
        <div class="form-group">
            <label>Uloga</label>
            <input type="text" id="modalMemberRole" value="${member.role}" placeholder="npr. Manager, DJ...">
        </div>
        <div class="form-group">
            <label>Slika (URL ili naziv fajla)</label>
            <input type="text" id="modalMemberImage" value="${member.image}" placeholder="pg_club_final_transparent.png">
        </div>
    `;
    
    document.getElementById('modalOverlay').classList.add('active');
}

// Delete team member
function deleteTeamMember(index) {
    if (confirm('Da li ste sigurni da \u017eelite obrisati ovog \u010dlana?')) {
        siteData.team.splice(index, 1);
        renderTeam();
        showAlert('\u010clan tima uspje\u0161no obrisan!', 'success');
    }
}

// Render gallery
function renderGallery() {
    const container = document.getElementById('galleryList');
    if (!container) return;
    
    if (siteData.gallery.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--gray-light);padding:40px 0;">Nema slika u galeriji.</p>';
        return;
    }
    
    container.innerHTML = siteData.gallery.map((img, index) => `
        <div class="list-item">
            <div class="list-item-info">
                <div class="list-item-icon" style="width:60px;height:60px;border-radius:8px;overflow:hidden;">
                    <img src="${img.url}" alt="${img.title}" style="width:100%;height:100%;object-fit:cover;">
                </div>
                <div class="list-item-details">
                    <h4>${img.title}</h4>
                    <p>Kategorija: ${img.category || 'General'}</p>
                </div>
            </div>
            <div class="list-item-actions">
                <button class="action-btn action-btn-delete" onclick="deleteGalleryImage(${index})">
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
            <input type="url" id="modalGalleryUrl" placeholder="https://...">
        </div>
        <div class="form-group">
            <label>Naslov</label>
            <input type="text" id="modalGalleryTitle" placeholder="Naziv slike">
        </div>
        <div class="form-group">
            <label>Kategorija</label>
            <select id="modalGalleryCategory">
                <option value="General">General</option>
                <option value="Event">Event</option>
                <option value="VIP">VIP</option>
                <option value="Ambijent">Ambijent</option>
            </select>
        </div>
    `;
    
    document.getElementById('modalOverlay').classList.add('active');
}

// Delete gallery image
function deleteGalleryImage(index) {
    if (confirm('Da li ste sigurni da \u017eelite obrisati ovu sliku?')) {
        siteData.gallery.splice(index, 1);
        renderGallery();
        showAlert('Slika uspje\u0161no obrisana!', 'success');
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
    
    // Save to Firestore + localStorage
    localStorage.setItem('pgClubData', JSON.stringify(siteData));
    SiteDB.save(siteData).catch(e => console.error('Firestore save error:', e));
    closeModal();
    showAlert('Uspje\u0161no sa\u010duvano!', 'success');
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

// Render bookings from Firestore
async function renderBookings() {
    const container = document.getElementById('bookingsList');
    if (!container) return;
    
    container.innerHTML = '<p style="text-align:center;color:var(--gold);padding:40px 0;"><i class="fas fa-spinner fa-spin"></i> U\u010ditavanje rezervacija...</p>';
    
    let bookings;
    try {
        bookings = await BookingsDB.getAll();
    } catch (e) {
        console.error('Firestore load failed:', e);
        try { bookings = JSON.parse(localStorage.getItem('pgClubBookings')) || []; } catch (err) { bookings = []; }
    }
    
    if (bookings.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--gray-light);padding:40px 0;">Nema zakazanih rezervacija.</p>';
        return;
    }
    
    const statusColors = {
        'cekanje': { bg: 'rgba(201,162,39,0.15)', border: 'rgba(201,162,39,0.4)', color: '#c9a227', label: 'Na \u010dekanju' },
        'potvrdjena': { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', color: '#10b981', label: 'Potvr\u0111ena' },
        'odbita': { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', color: '#ef4444', label: 'Odbijena' }
    };
    
    container.innerHTML = bookings.map(b => {
        const s = statusColors[b.status] || statusColors['cekanje'];
        
        const addonsList = (b.addons && b.addons.length > 0)
            ? b.addons.map(a => a.name + ' (+' + a.pricePerPerson + '\u20ac/os)').join(', ')
            : 'Bez dodataka';
        
        const timeLabel = b.timeSlot === 'morning' ? '09:00 - 15:00 (jutarnji)' : '18:00 - 02:00 (ve\u010dernji)';
        
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
                    '<button class="action-btn action-btn-edit" onclick="changeBookingStatus(\'' + b.id + '\',\'potvrdjena\')" title="Potvrdi"><i class="fas fa-check"></i></button>' +
                    '<button class="action-btn action-btn-delete" onclick="changeBookingStatus(\'' + b.id + '\',\'odbita\')" title="Odbij"><i class="fas fa-times"></i></button>' +
                '</div>' +
            '</div>' +
            '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;width:100%;padding:10px 15px;background:rgba(255,255,255,0.02);border-radius:8px;font-size:0.8rem;">' +
                '<div><span style="color:var(--gray-light);">Telefon:</span> <strong>' + b.phone + '</strong></div>' +
                '<div><span style="color:var(--gray-light);">Email:</span> <strong>' + b.email + '</strong></div>' +
                '<div><span style="color:var(--gray-light);">Vrsta:</span> <strong>' + b.eventType + '</strong></div>' +
                '<div><span style="color:var(--gray-light);">JMBG:</span> <strong>' + b.jmbg + '</strong></div>' +
                '<div><span style="color:var(--gray-light);">Ukupno:</span> <strong style="color:var(--gold);">\u20ac' + b.totalPrice + '</strong></div>' +
                '<div><span style="color:var(--gray-light);">Avans (50%):</span> <strong style="color:var(--gold);">\u20ac' + b.advanceAmount + '</strong></div>' +
                '<div style="grid-column:1/-1;"><span style="color:var(--gray-light);">Dodaci:</span> <strong>' + addonsList + '</strong></div>' +
            '</div>' +
        '</div>';
    }).join('');
}

// Change booking status in Firestore
async function changeBookingStatus(id, newStatus) {
    const statusLabel = newStatus === 'potvrdjena' ? 'potvrditi' : 'odbiti';
    if (!confirm('Da li ste sigurni da \u017eelite ' + statusLabel + ' ovu rezervaciju?')) return;
    
    try {
        await BookingsDB.updateStatus(id, newStatus);
        showAlert('Rezervacija uspje\u0161no ' + (newStatus === 'potvrdjena' ? 'potvr\u0111ena' : 'odba\u010dena') + '!', 'success');
    } catch (e) {
        console.error('Firestore update failed:', e);
        // Fallback: update local storage
        try {
            const bookings = JSON.parse(localStorage.getItem('pgClubBookings')) || [];
            const idx = bookings.findIndex(b => b.id === id);
            if (idx !== -1) {
                bookings[idx].status = newStatus;
                localStorage.setItem('pgClubBookings', JSON.stringify(bookings));
            }
        } catch (err) {}
        showAlert('A\u017eurirano lokalno (cloud gre\u0161ka)', 'success');
    }
    renderBookings();
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveAllData();
    }
});
