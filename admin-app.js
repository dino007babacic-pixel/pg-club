// Default data
const defaultData = {
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
        text2: 'Naš klub je idealno mjesto za privatne proslave, rođendane, proslave firmi i druge zabave.',
        capacity: '250',
        vipBoxes: '4',
        drinks: '50'
    },
    services: [
        { icon: 'fa-glass-cheers', title: 'Privatne Proslave', description: 'Rođendani, godišnjice, vjenčanja i drugi posebni trenuci.', featured: false },
        { icon: 'fa-music', title: 'Veliki Partyji', description: 'Nekoliko puta godišnje organizujemo velike događaje sa nastupima poznatih pjevača i influensera iz regiona.', featured: true },
        { icon: 'fa-crown', title: 'VIP Usluga', description: '4 ekskluzivna separea spremna za rezervaciju. Premium atmosfera i personalizovana usluga za naše najistaknutije goste.', featured: false }
    ],
    events: [
        { title: 'Grand Opening', description: 'Spektakularno otvaranje PG Club-a sa posebnim gostima.', date: '15', month: 'SEP', badge: 'Grand Opening', time: '22:00 - 05:00', featured: true },
        { title: 'Halloween Party', description: 'Maskembal najvećeg formata.', date: 'TBD', month: 'OKT', badge: 'Tema', time: '22:00 - 04:00', featured: false }
    ],
    team: [
        { name: 'Marko Petrović', role: 'Vlasnik', image: 'pg_club_final_transparent.png' },
        { name: 'Ana Nikolić', role: 'Manager', image: 'pg_club_final_transparent.png' }
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
let siteData = JSON.parse(localStorage.getItem('pgClubData')) || JSON.parse(JSON.stringify(defaultData));

// Current modal state
let currentModalType = null;
let currentEditIndex = null;

// Login function
function login() {
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;
    
    if (user === 'admin' && pass === 'pgclub2026') {
        document.getElementById('loginBox').style.display = 'none';
        document.getElementById('adminPanel').classList.add('active');
        loadAllData();
        sessionStorage.setItem('pgClubLoggedIn', 'true');
    } else {
        alert('Pogrešni podaci za prijavu!');
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('pgClubLoggedIn');
    document.getElementById('loginBox').style.display = 'block';
    document.getElementById('adminPanel').classList.remove('active');
}

// Check if already logged in
if (sessionStorage.getItem('pgClubLoggedIn') === 'true') {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('adminPanel').classList.add('active');
    loadAllData();
}

// Tab switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById('tab-' + tabName).classList.add('active');
    event.target.classList.add('active');
}

// Load all data to form fields
function loadAllData() {
    // General
    document.getElementById('siteName').value = siteData.site.name;
    document.getElementById('siteTagline').value = siteData.site.tagline;
    document.getElementById('siteLocation').value = siteData.site.location;
    document.getElementById('siteAddress').value = siteData.site.address;
    document.getElementById('siteDescription').value = siteData.site.description;
    document.getElementById('hoursPetak').value = siteData.hours.petak;
    document.getElementById('hoursSubota').value = siteData.hours.subota;
    document.getElementById('openingDate').value = siteData.opening.date;
    document.getElementById('openingLabel').value = siteData.opening.label;
    
    // About
    document.getElementById('aboutTitle').value = siteData.about.title;
    document.getElementById('aboutSubtitle').value = siteData.about.subtitle;
    document.getElementById('aboutText1').value = siteData.about.text1;
    document.getElementById('aboutText2').value = siteData.about.text2;
    document.getElementById('aboutCapacity').value = siteData.about.capacity;
    document.getElementById('aboutVipBoxes').value = siteData.about.vipBoxes;
    document.getElementById('aboutDrinks').value = siteData.about.drinks;
    
    // Contact
    document.getElementById('contactEmail').value = siteData.site.email;
    document.getElementById('contactPhone').value = siteData.site.phone;
    document.getElementById('socialInstagram').value = siteData.social.instagram;
    document.getElementById('socialFacebook').value = siteData.social.facebook;
    document.getElementById('socialTiktok').value = siteData.social.tiktok;
    document.getElementById('socialTwitter').value = siteData.social.twitter;
    
    // Lists
    renderServices();
    renderEvents();
    renderTeam();
    renderGallery();
}

// Save all data
function saveAll() {
    // General
    siteData.site.name = document.getElementById('siteName').value;
    siteData.site.tagline = document.getElementById('siteTagline').value;
    siteData.site.location = document.getElementById('siteLocation').value;
    siteData.site.address = document.getElementById('siteAddress').value;
    siteData.site.description = document.getElementById('siteDescription').value;
    siteData.hours.petak = document.getElementById('hoursPetak').value;
    siteData.hours.subota = document.getElementById('hoursSubota').value;
    siteData.opening.date = document.getElementById('openingDate').value;
    siteData.opening.label = document.getElementById('openingLabel').value;
    
    // About
    siteData.about.title = document.getElementById('aboutTitle').value;
    siteData.about.subtitle = document.getElementById('aboutSubtitle').value;
    siteData.about.text1 = document.getElementById('aboutText1').value;
    siteData.about.text2 = document.getElementById('aboutText2').value;
    siteData.about.capacity = document.getElementById('aboutCapacity').value;
    siteData.about.vipBoxes = document.getElementById('aboutVipBoxes').value;
    siteData.about.drinks = document.getElementById('aboutDrinks').value;
    
    // Contact
    siteData.site.email = document.getElementById('contactEmail').value;
    siteData.site.phone = document.getElementById('contactPhone').value;
    siteData.social.instagram = document.getElementById('socialInstagram').value;
    siteData.social.facebook = document.getElementById('socialFacebook').value;
    siteData.social.tiktok = document.getElementById('socialTiktok').value;
    siteData.social.twitter = document.getElementById('socialTwitter').value;
    
    // Save to localStorage
    localStorage.setItem('pgClubData', JSON.stringify(siteData));
    
    // Show success message
    showAlert('Uspješno sačuvane promjene!', 'success');
}

// Show alert
function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.className = 'alert ' + type;
    setTimeout(() => { alertBox.className = 'alert'; }, 3000);
}

// Render services list
function renderServices() {
    const container = document.getElementById('servicesList');
    container.innerHTML = siteData.services.map((service, index) => `
        <div class="list-item">
            <div class="list-item-info">
                <i class="fas ${service.icon}" style="font-size: 1.5rem; color: var(--primary);"></i>
                <div>
                    <strong>${service.title}</strong>
                    <p style="color: var(--gray-light); font-size: 0.85rem; margin-top: 5px;">${service.description}</p>
                </div>
            </div>
            <div class="list-item-actions">
                <button class="btn btn-primary btn-sm" onclick="editService(${index})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm" onclick="deleteService(${index})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

// Add service
function addService() {
    currentModalType = 'service';
    currentEditIndex = null;
    
    document.getElementById('modalTitle').textContent = 'Dodaj uslugu';
    document.getElementById('modalBody').innerHTML = `
        <div class="form-group">
            <label>Ikonica</label>
            <select id="modalIcon">
                <option value="fa-glass-cheers">Čaše</option>
                <option value="fa-music">Muzika</option>
                <option value="fa-building">Zgrada</option>
                <option value="fa-crown">Kruna</option>
                <option value="fa-star">Zvijezda</option>
                <option value="fa-heart">Srce</option>
                <option value="fa-fire">Vatra</option>
            </select>
        </div>
        <div class="form-group">
            <label>Naslov</label>
            <input type="text" id="modalTitle2" placeholder="Naziv usluge">
        </div>
        <div class="form-group">
            <label>Opis</label>
            <textarea id="modalDescription" rows="3" placeholder="Opis usluge"></textarea>
        </div>
    `;
    
    document.getElementById('modal').classList.add('active');
}

// Edit service
function editService(index) {
    currentModalType = 'service';
    currentEditIndex = index;
    const service = siteData.services[index];
    
    document.getElementById('modalTitle').textContent = 'Uredi uslugu';
    document.getElementById('modalBody').innerHTML = `
        <div class="form-group">
            <label>Ikonica</label>
            <select id="modalIcon">
                <option value="fa-glass-cheers" ${service.icon === 'fa-glass-cheers' ? 'selected' : ''}>Čaše</option>
                <option value="fa-music" ${service.icon === 'fa-music' ? 'selected' : ''}>Muzika</option>
                <option value="fa-building" ${service.icon === 'fa-building' ? 'selected' : ''}>Zgrada</option>
                <option value="fa-crown" ${service.icon === 'fa-crown' ? 'selected' : ''}>Kruna</option>
                <option value="fa-star" ${service.icon === 'fa-star' ? 'selected' : ''}>Zvijezda</option>
                <option value="fa-heart" ${service.icon === 'fa-heart' ? 'selected' : ''}>Srce</option>
                <option value="fa-fire" ${service.icon === 'fa-fire' ? 'selected' : ''}>Vatra</option>
            </select>
        </div>
        <div class="form-group">
            <label>Naslov</label>
            <input type="text" id="modalTitle2" value="${service.title}">
        </div>
        <div class="form-group">
            <label>Opis</label>
            <textarea id="modalDescription" rows="3">${service.description}</textarea>
        </div>
    `;
    
    document.getElementById('modal').classList.add('active');
}

// Delete service
function deleteService(index) {
    if (confirm('Da li ste sigurni da želite ovo da obrišete?')) {
        siteData.services.splice(index, 1);
        renderServices();
        showAlert('Usluga obrisana!', 'success');
    }
}

// Render events list
function renderEvents() {
    const container = document.getElementById('eventsList');
    container.innerHTML = siteData.events.map((event, index) => `
        <div class="list-item">
            <div class="list-item-info">
                <div style="text-align: center; min-width: 60px;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary);">${event.date}</div>
                    <div style="font-size: 0.8rem; color: var(--gray-light);">${event.month}</div>
                </div>
                <div>
                    <strong>${event.title}</strong>
                    <p style="color: var(--gray-light); font-size: 0.85rem; margin-top: 5px;">${event.badge}</p>
                </div>
            </div>
            <div class="list-item-actions">
                <button class="btn btn-primary btn-sm" onclick="editEvent(${index})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm" onclick="deleteEvent(${index})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

// Add event
function addEvent() {
    currentModalType = 'event';
    currentEditIndex = null;
    
    document.getElementById('modalTitle').textContent = 'Dodaj događaj';
    document.getElementById('modalBody').innerHTML = `
        <div class="form-group">
            <label>Naslov</label>
            <input type="text" id="modalTitle2" placeholder="Naziv događaja">
        </div>
        <div class="form-group">
            <label>Opis</label>
            <textarea id="modalDescription" rows="3" placeholder="Opis događaja"></textarea>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div class="form-group">
                <label>Dan</label>
                <input type="text" id="modalDate" placeholder="15 ili TBD">
            </div>
            <div class="form-group">
                <label>Mjesec</label>
                <select id="modalMonth">
                    <option value="JAN">Januar</option>
                    <option value="FEB">Februar</option>
                    <option value="MAR">Mart</option>
                    <option value="APR">April</option>
                    <option value="MAJ">Maj</option>
                    <option value="JUN">Juni</option>
                    <option value="JUL">Juli</option>
                    <option value="AVG">August</option>
                    <option value="SEP">Septembar</option>
                    <option value="OKT">Oktobar</option>
                    <option value="NOV">Novembar</option>
                    <option value="DEC">Decembar</option>
                </select>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div class="form-group">
                <label>Oznaka</label>
                <input type="text" id="modalBadge" placeholder="Premium, Tema...">
            </div>
            <div class="form-group">
                <label>Vrijeme</label>
                <input type="text" id="modalTime" placeholder="22:00 - 04:00">
            </div>
        </div>
    `;
    
    document.getElementById('modal').classList.add('active');
}

// Edit event
function editEvent(index) {
    currentModalType = 'event';
    currentEditIndex = index;
    const event = siteData.events[index];
    
    document.getElementById('modalTitle').textContent = 'Uredi događaj';
    document.getElementById('modalBody').innerHTML = `
        <div class="form-group">
            <label>Naslov</label>
            <input type="text" id="modalTitle2" value="${event.title}">
        </div>
        <div class="form-group">
            <label>Opis</label>
            <textarea id="modalDescription" rows="3">${event.description}</textarea>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div class="form-group">
                <label>Dan</label>
                <input type="text" id="modalDate" value="${event.date}">
            </div>
            <div class="form-group">
                <label>Mjesec</label>
                <select id="modalMonth">
                    ${['JAN','FEB','MAR','APR','MAJ','JUN','JUL','AVG','SEP','OKT','NOV','DEC'].map(m => 
                        `<option value="${m}" ${event.month === m ? 'selected' : ''}>${m}</option>`
                    ).join('')}
                </select>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div class="form-group">
                <label>Oznaka</label>
                <input type="text" id="modalBadge" value="${event.badge}">
            </div>
            <div class="form-group">
                <label>Vrijeme</label>
                <input type="text" id="modalTime" value="${event.time}">
            </div>
        </div>
    `;
    
    document.getElementById('modal').classList.add('active');
}

// Delete event
function deleteEvent(index) {
    if (confirm('Da li ste sigurni da želite ovo da obrišete?')) {
        siteData.events.splice(index, 1);
        renderEvents();
        showAlert('Događaj obrisan!', 'success');
    }
}

// Render team list
function renderTeam() {
    const container = document.getElementById('teamList');
    container.innerHTML = siteData.team.map((member, index) => `
        <div class="list-item">
            <div class="list-item-info">
                <img src="${member.image}" alt="${member.name}">
                <div>
                    <strong>${member.name}</strong>
                    <p style="color: var(--gray-light); font-size: 0.85rem; margin-top: 5px;">${member.role}</p>
                </div>
            </div>
            <div class="list-item-actions">
                <button class="btn btn-primary btn-sm" onclick="editMember(${index})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm" onclick="deleteMember(${index})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

// Add member
function addMember() {
    currentModalType = 'member';
    currentEditIndex = null;
    
    document.getElementById('modalTitle').textContent = 'Dodaj člana tima';
    document.getElementById('modalBody').innerHTML = `
        <div class="form-group">
            <label>Ime i prezime</label>
            <input type="text" id="modalName" placeholder="Puno ime">
        </div>
        <div class="form-group">
            <label>Uloga</label>
            <input type="text" id="modalRole" placeholder="Manager, DJ...">
        </div>
        <div class="form-group">
            <label>Slika URL</label>
            <input type="url" id="modalImage" placeholder="https://...">
        </div>
    `;
    
    document.getElementById('modal').classList.add('active');
}

// Edit member
function editMember(index) {
    currentModalType = 'member';
    currentEditIndex = index;
    const member = siteData.team[index];
    
    document.getElementById('modalTitle').textContent = 'Uredi člana tima';
    document.getElementById('modalBody').innerHTML = `
        <div class="form-group">
            <label>Ime i prezime</label>
            <input type="text" id="modalName" value="${member.name}">
        </div>
        <div class="form-group">
            <label>Uloga</label>
            <input type="text" id="modalRole" value="${member.role}">
        </div>
        <div class="form-group">
            <label>Slika URL</label>
            <input type="url" id="modalImage" value="${member.image}">
        </div>
    `;
    
    document.getElementById('modal').classList.add('active');
}

// Delete member
function deleteMember(index) {
    if (confirm('Da li ste sigurni da želite ovo da obrišete?')) {
        siteData.team.splice(index, 1);
        renderTeam();
        showAlert('Član tima obrisan!', 'success');
    }
}

// Render gallery list
function renderGallery() {
    const container = document.getElementById('galleryList');
    container.innerHTML = siteData.gallery.map((image, index) => `
        <div style="position: relative; border-radius: 10px; overflow: hidden; aspect-ratio: 1; border: 2px solid var(--border);">
            <img src="${image.url}" alt="${image.title}" style="width: 100%; height: 100%; object-fit: cover;">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 10px; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); display: flex; justify-content: space-between; align-items: flex-end;">
                <span style="font-size: 0.85rem;">${image.title}</span>
                <button class="btn btn-danger btn-sm" onclick="deleteImage(${index})" style="padding: 5px 10px;"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

// Add image
function addImage() {
    currentModalType = 'image';
    currentEditIndex = null;
    
    document.getElementById('modalTitle').textContent = 'Dodaj sliku';
    document.getElementById('modalBody').innerHTML = `
        <div class="form-group">
            <label>URL slike</label>
            <input type="url" id="modalImageUrl" placeholder="https://images.unsplash.com/...">
        </div>
        <div class="form-group">
            <label>Naslov</label>
            <input type="text" id="modalImageTitle" placeholder="Naziv slike">
        </div>
        <div class="form-group">
            <label>Kategorija</label>
            <select id="modalImageCategory">
                <option value="interijer">Interijer</option>
                <option value="atmosfera">Atmosfera</option>
                <option value="dogadjaji">Događaji</option>
            </select>
        </div>
    `;
    
    document.getElementById('modal').classList.add('active');
}

// Delete image
function deleteImage(index) {
    if (confirm('Da li ste sigurni da želite ovo da obrišete?')) {
        siteData.gallery.splice(index, 1);
        renderGallery();
        showAlert('Slika obrisana!', 'success');
    }
}

// Save modal data
function saveModal() {
    if (currentModalType === 'service') {
        const serviceData = {
            icon: document.getElementById('modalIcon').value,
            title: document.getElementById('modalTitle2').value,
            description: document.getElementById('modalDescription').value,
            featured: false
        };
        
        if (currentEditIndex !== null) {
            siteData.services[currentEditIndex] = serviceData;
        } else {
            siteData.services.push(serviceData);
        }
        renderServices();
    } 
    else if (currentModalType === 'event') {
        const eventData = {
            title: document.getElementById('modalTitle2').value,
            description: document.getElementById('modalDescription').value,
            date: document.getElementById('modalDate').value,
            month: document.getElementById('modalMonth').value,
            badge: document.getElementById('modalBadge').value,
            time: document.getElementById('modalTime').value,
            featured: false
        };
        
        if (currentEditIndex !== null) {
            siteData.events[currentEditIndex] = eventData;
        } else {
            siteData.events.push(eventData);
        }
        renderEvents();
    }
    else if (currentModalType === 'member') {
        const memberData = {
            name: document.getElementById('modalName').value,
            role: document.getElementById('modalRole').value,
            image: document.getElementById('modalImage').value
        };
        
        if (currentEditIndex !== null) {
            siteData.team[currentEditIndex] = memberData;
        } else {
            siteData.team.push(memberData);
        }
        renderTeam();
    }
    else if (currentModalType === 'image') {
        const imageData = {
            url: document.getElementById('modalImageUrl').value,
            title: document.getElementById('modalImageTitle').value,
            category: document.getElementById('modalImageCategory').value
        };
        
        siteData.gallery.push(imageData);
        renderGallery();
    }
    
    closeModal();
    showAlert('Uspješno sačuvano!', 'success');
}

// Close modal
function closeModal() {
    document.getElementById('modal').classList.remove('active');
    currentModalType = null;
    currentEditIndex = null;
}

// Close modal on outside click
document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveAll();
    }
});

// Enter key to login
document.getElementById('loginPass').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') login();
});
