document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.admin-section');
    const pageTitle = document.getElementById('pageTitle');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.dataset.section;
            
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
            
            pageTitle.textContent = this.querySelector('span').textContent;
        });
    });
    
    // Mobile Menu
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
    
    // Save Form
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', function() {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'save.php';
        
        const inputs = document.querySelectorAll('input[name], textarea[name], select[name]');
        inputs.forEach(input => {
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = input.name;
            hiddenInput.value = input.value;
            form.appendChild(hiddenInput);
        });
        
        document.body.appendChild(form);
        form.submit();
    });
    
    // Modal
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const modalSave = document.getElementById('modalSave');
    
    let currentEditType = null;
    let currentEditIndex = null;
    
    function openModal(title, content, type, index) {
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        currentEditType = type;
        currentEditIndex = index;
        modal.classList.add('active');
    }
    
    function closeModal() {
        modal.classList.remove('active');
        currentEditType = null;
        currentEditIndex = null;
    }
    
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    
    // Add Service
    document.getElementById('addService').addEventListener('click', function() {
        const content = `
            <div class="form-group">
                <label>Ikonica (FontAwesome)</label>
                <select name="icon">
                    <option value="fa-glass-cheers">Čaše</option>
                    <option value="fa-music">Muzika</option>
                    <option value="fa-building">Zgrada</option>
                    <option value="fa-crown">Kruna</option>
                    <option value="fa-star">Zvijezda</option>
                    <option value="fa-heart">Srce</option>
                    <option value="fa-fire">Vatra</option>
                    <option value="fa-gem">Dijamant</option>
                </select>
            </div>
            <div class="form-group">
                <label>Naslov</label>
                <input type="text" name="title" placeholder="Naziv usluge">
            </div>
            <div class="form-group">
                <label>Opis</label>
                <textarea name="description" rows="3" placeholder="Opis usluge"></textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" name="featured" value="1"> Istaknuto
                </label>
            </div>
        `;
        openModal('Dodaj uslugu', content, 'service', null);
    });
    
    // Add Event
    document.getElementById('addEvent').addEventListener('click', function() {
        const content = `
            <div class="form-group">
                <label>Naslov</label>
                <input type="text" name="title" placeholder="Naziv događaja">
            </div>
            <div class="form-group">
                <label>Opis</label>
                <textarea name="description" rows="3" placeholder="Opis događaja"></textarea>
            </div>
            <div class="form-group">
                <label>Dan</label>
                <input type="text" name="date" placeholder="npr. 15 ili TBD">
            </div>
            <div class="form-group">
                <label>Mjesec</label>
                <select name="month">
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
            <div class="form-group">
                <label>Oznaka</label>
                <input type="text" name="badge" placeholder="npr. Premium, Tema">
            </div>
            <div class="form-group">
                <label>Vrijeme</label>
                <input type="text" name="time" placeholder="npr. 22:00 - 04:00">
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" name="featured" value="1"> Istaknuto
                </label>
            </div>
        `;
        openModal('Dodaj događaj', content, 'event', null);
    });
    
    // Add Team Member
    document.getElementById('addMember').addEventListener('click', function() {
        const content = `
            <div class="form-group">
                <label>Ime i prezime</label>
                <input type="text" name="name" placeholder="Puno ime">
            </div>
            <div class="form-group">
                <label>Uloga</label>
                <input type="text" name="role" placeholder="npr. Manager, DJ">
            </div>
            <div class="form-group">
                <label>Slika URL</label>
                <input type="url" name="image" placeholder="https://...">
            </div>
        `;
        openModal('Dodaj člana tima', content, 'member', null);
    });
    
    // Add Gallery Image
    document.getElementById('addImage').addEventListener('click', function() {
        const content = `
            <div class="form-group">
                <label>URL slike</label>
                <input type="url" name="url" placeholder="https://images.unsplash.com/...">
            </div>
            <div class="form-group">
                <label>Naslov</label>
                <input type="text" name="title" placeholder="Naziv slike">
            </div>
            <div class="form-group">
                <label>Kategorija</label>
                <select name="category">
                    <option value="interijer">Interijer</option>
                    <option value="atmosfera">Atmosfera</option>
                    <option value="dogadjaji">Događaji</option>
                </select>
            </div>
        `;
        openModal('Dodaj sliku', content, 'image', null);
    });
    
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.type;
            const index = parseInt(this.dataset.index);
            const item = this.closest('.list-item');
            
            let content = '';
            let title = '';
            
            if (type === 'service') {
                const icon = item.querySelector('input[name*="[icon]"]').value;
                const serviceTitle = item.querySelector('input[name*="[title]"]').value;
                const description = item.querySelector('input[name*="[description]"]').value;
                const featured = item.querySelector('input[name*="[featured]"]').value;
                
                title = 'Uredi uslugu';
                content = `
                    <div class="form-group">
                        <label>Ikonica</label>
                        <select name="icon">
                            <option value="fa-glass-cheers" ${icon === 'fa-glass-cheers' ? 'selected' : ''}>Čaše</option>
                            <option value="fa-music" ${icon === 'fa-music' ? 'selected' : ''}>Muzika</option>
                            <option value="fa-building" ${icon === 'fa-building' ? 'selected' : ''}>Zgrada</option>
                            <option value="fa-crown" ${icon === 'fa-crown' ? 'selected' : ''}>Kruna</option>
                            <option value="fa-star" ${icon === 'fa-star' ? 'selected' : ''}>Zvijezda</option>
                            <option value="fa-heart" ${icon === 'fa-heart' ? 'selected' : ''}>Srce</option>
                            <option value="fa-fire" ${icon === 'fa-fire' ? 'selected' : ''}>Vatra</option>
                            <option value="fa-gem" ${icon === 'fa-gem' ? 'selected' : ''}>Dijamant</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Naslov</label>
                        <input type="text" name="title" value="${serviceTitle}">
                    </div>
                    <div class="form-group">
                        <label>Opis</label>
                        <textarea name="description" rows="3">${description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" name="featured" value="1" ${featured === '1' ? 'checked' : ''}> Istaknuto
                        </label>
                    </div>
                `;
            } else if (type === 'event') {
                const eventTitle = item.querySelector('input[name*="[title]"]').value;
                const description = item.querySelector('input[name*="[description]"]').value;
                const date = item.querySelector('input[name*="[date]"]').value;
                const month = item.querySelector('input[name*="[month]"]').value;
                const badge = item.querySelector('input[name*="[badge]"]').value;
                const time = item.querySelector('input[name*="[time]"]').value;
                const featured = item.querySelector('input[name*="[featured]"]').value;
                
                title = 'Uredi događaj';
                content = `
                    <div class="form-group">
                        <label>Naslov</label>
                        <input type="text" name="title" value="${eventTitle}">
                    </div>
                    <div class="form-group">
                        <label>Opis</label>
                        <textarea name="description" rows="3">${description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Dan</label>
                        <input type="text" name="date" value="${date}">
                    </div>
                    <div class="form-group">
                        <label>Mjesec</label>
                        <select name="month">
                            <option value="JAN" ${month === 'JAN' ? 'selected' : ''}>Januar</option>
                            <option value="FEB" ${month === 'FEB' ? 'selected' : ''}>Februar</option>
                            <option value="MAR" ${month === 'MAR' ? 'selected' : ''}>Mart</option>
                            <option value="APR" ${month === 'APR' ? 'selected' : ''}>April</option>
                            <option value="MAJ" ${month === 'MAJ' ? 'selected' : ''}>Maj</option>
                            <option value="JUN" ${month === 'JUN' ? 'selected' : ''}>Juni</option>
                            <option value="JUL" ${month === 'JUL' ? 'selected' : ''}>Juli</option>
                            <option value="AVG" ${month === 'AVG' ? 'selected' : ''}>August</option>
                            <option value="SEP" ${month === 'SEP' ? 'selected' : ''}>Septembar</option>
                            <option value="OKT" ${month === 'OKT' ? 'selected' : ''}>Oktobar</option>
                            <option value="NOV" ${month === 'NOV' ? 'selected' : ''}>Novembar</option>
                            <option value="DEC" ${month === 'DEC' ? 'selected' : ''}>Decembar</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Oznaka</label>
                        <input type="text" name="badge" value="${badge}">
                    </div>
                    <div class="form-group">
                        <label>Vrijeme</label>
                        <input type="text" name="time" value="${time}">
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" name="featured" value="1" ${featured === '1' ? 'checked' : ''}> Istaknuto
                        </label>
                    </div>
                `;
            } else if (type === 'member') {
                const name = item.querySelector('input[name*="[name]"]').value;
                const role = item.querySelector('input[name*="[role]"]').value;
                const image = item.querySelector('input[name*="[image]"]').value;
                
                title = 'Uredi člana tima';
                content = `
                    <div class="form-group">
                        <label>Ime i prezime</label>
                        <input type="text" name="name" value="${name}">
                    </div>
                    <div class="form-group">
                        <label>Uloga</label>
                        <input type="text" name="role" value="${role}">
                    </div>
                    <div class="form-group">
                        <label>Slika URL</label>
                        <input type="url" name="image" value="${image}">
                    </div>
                `;
            }
            
            openModal(title, content, type, index);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const type = this.dataset.type;
            const index = parseInt(this.dataset.index);
            
            if (confirm('Da li ste sigurni da želite ovo da obrišete?')) {
                const item = this.closest('.list-item, .gallery-item');
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                setTimeout(() => item.remove(), 300);
            }
        });
    });
    
    // Modal Save
    modalSave.addEventListener('click', function() {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'save.php';
        
        // Get all form data including hidden inputs
        const inputs = document.querySelectorAll('input[name], textarea[name], select[name]');
        inputs.forEach(input => {
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = input.name;
            
            if (input.type === 'checkbox') {
                hiddenInput.value = input.checked ? '1' : '0';
            } else {
                hiddenInput.value = input.value;
            }
            
            form.appendChild(hiddenInput);
        });
        
        document.body.appendChild(form);
        form.submit();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveBtn.click();
        }
    });
});
