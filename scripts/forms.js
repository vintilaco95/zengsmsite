// Forms Handler for ZengSM Website
// Handles repair submission, status checking, and IMEI verification

// ===============================
// Form Tabs Switching
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    const formTabs = document.querySelectorAll('.form-tab');
    const formContainers = document.querySelectorAll('.form-container');

    formTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and containers
            formTabs.forEach(t => t.classList.remove('active'));
            formContainers.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding form
            const targetForm = document.getElementById(`${targetTab}-form`);
            if (targetForm) {
                targetForm.classList.add('active');
            }
        });
    });
});

// ===============================
// Repair Submission Form Handler
// ===============================
const repairForm = document.getElementById('repairSubmissionForm');

if (repairForm) {
    repairForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        const messageDiv = document.getElementById('form-message');
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Se trimite...</span>';
        messageDiv.innerHTML = '';
        
        // Get form data
        const formData = new FormData(this);
        
        // Convert to JSON object
        const data = {};
        formData.forEach((value, key) => {
            if (key === 'photos') {
                // Handle multiple files
                if (!data.photos) data.photos = [];
                data.photos.push(value);
            } else {
                data[key] = value;
            }
        });
        
        // Submit via EmailJS
        try {
            // Verifică dacă EmailJS este încărcat
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS SDK nu este încărcat');
            }
            
            // Verifică dacă există fotografii încărcate
            const photosInput = document.getElementById('photos');
            const photosCount = photosInput?.files?.length || 0;
            const photosInfo = photosCount > 0 
                ? `${photosCount} ${photosCount === 1 ? 'fotografie' : 'fotografii'} încărcată${photosCount > 1 ? 'e' : ''}` 
                : 'Nu au fost încărcate fotografii';
            
            // Generează cod unic pentru urmărire
            const uniqueCode = 'ZSM-2025-' + Math.random().toString(36).substr(2, 6).toUpperCase();
            
            // Verifică checkbox-urile
            const garantie = document.getElementById('garantie')?.checked ? 'Da' : 'Nu';
            const urgenta = document.getElementById('urgenta')?.checked ? 'Da' : 'Nu';
            const gdpr = document.getElementById('gdpr')?.checked ? 'Da' : 'Nu';
            
            // Pregătește parametrii pentru template EmailJS
            const templateParams = {
                nume: data.nume || 'N/A',
                telefon: data.telefon || 'N/A',
                email: data.email || 'N/A',
                oras: data.oras || 'N/A',
                adresa: data.adresa || 'N/A',
                marca: data.marca || 'N/A',
                model: data.model || 'N/A',
                imei: data.imei || 'Nu a fost furnizat',
                culoare: data.culoare || 'N/A',
                serviciu: data.serviciu || 'N/A',
                descriere: data.descriere || 'N/A',
                garantie: garantie,
                urgenta: urgenta,
                gdpr: gdpr,
                comentarii: data.comentarii || 'N/A',
                fotografii: photosInfo,
                cod_urmare: uniqueCode,
                timestamp: new Date().toLocaleString('ro-RO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
            
            // Trimite email via EmailJS
            // IMPORTANT: Înlocuiește cu ID-urile tale reale de la EmailJS!
            await emailjs.send(
                'service_oc9vzjh',           // ← Service ID (același ca pentru vânzare și contact)
                'template_1co0w1n',  // ← Template ID NOU pentru repair (vezi docs/GHID-INTEGRARE-EMAILJS.md)
                templateParams
            );
            
            // Succes!
            messageDiv.innerHTML = `
                <div class="success-message">
                    <div class="success-icon">✅</div>
                    <h3>Cerere Trimisă cu Succes!</h3>
                    <p>Codul tău unic de urmărire este: <strong>${uniqueCode}</strong></p>
                    <p>Vei primi un email cu instrucțiuni detaliate și AWB pentru expediere în maximum 30 de minute.</p>
                    <p>Păstrează codul pentru a verifica statusul reparației!</p>
                    <a href="#status-form" class="btn btn-primary" onclick="document.querySelector('[data-tab=\"status\"]').click()">Verifică Status</a>
                </div>
            `;
            
            // Reset form
            this.reset();
            
            // Clear file preview
            const filePreview = document.getElementById('file-preview');
            if (filePreview) filePreview.innerHTML = '';
            
            // Scroll to message
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Restore button after delay
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }, 3000);
            
        } catch (error) {
            console.error('Error:', error);
            messageDiv.innerHTML = `
                <div class="error-message">
                    <div class="error-icon">❌</div>
                    <h3>Eroare la Trimitere</h3>
                    <p>Ne pare rău, a apărut o eroare. Te rugăm să încerci din nou sau să ne contactezi telefonic.</p>
                    <a href="contact.html" class="btn btn-secondary">Contactează-ne Direct</a>
                </div>
            `;
            
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}

// ===============================
// File Upload Preview
// ===============================
const fileInput = document.getElementById('photos');
const filePreview = document.getElementById('file-preview');

if (fileInput && filePreview) {
    fileInput.addEventListener('change', function(e) {
        filePreview.innerHTML = '';
        const files = Array.from(e.target.files);
        
        if (files.length > 0) {
            files.forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        const preview = document.createElement('div');
                        preview.className = 'file-preview-item';
                        preview.innerHTML = `
                            <img src="${e.target.result}" alt="Preview">
                            <button type="button" class="remove-file" data-index="${index}">×</button>
                            <p>${file.name}</p>
                        `;
                        filePreview.appendChild(preview);
                    };
                    
                    reader.readAsDataURL(file);
                }
            });
        }
    });
    
    // Remove file from preview
    filePreview.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-file')) {
            e.target.parentElement.remove();
        }
    });
}

// ===============================
// Status Check Form (ServiceTelefoaneMobile.ro API)
// ===============================
const statusForm = document.getElementById('statusCheckForm');

if (statusForm) {
    // Configuration - ID Client ServiceTelefoaneMobile.ro
    var id_client = 1277; // ID Client ZengSM
    
    const codInput = document.getElementById('cod');
    const rezultatDiv = document.getElementById('rezultat');
    
    // Check on Enter key
    $("#cod").on("keydown", function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            verifica(id_client);
        }
    });
    
    // Form submission
    statusForm.addEventListener('submit', function(e) {
        e.preventDefault();
        verifica(id_client);
    });
    
    // Check if code is in URL parameter
    var cod = urlParam('cod');
    if (cod) {
        $("#cod").val(cod);
        verifica(id_client);
    }
    
    function verifica(id_client) {
        const cod = $("#cod").val().trim();
        
        if (!cod) {
            rezultatDiv.innerHTML = `
                <div class="alert-box warning">
                    <p>Te rugăm să introduci un cod valid de urmărire.</p>
                </div>
            `;
            return;
        }
        
        // Show loading
        rezultatDiv.innerHTML = `
            <div class="loading-status">
                <div class="spinner"></div>
                <p>Se verifică statusul...</p>
            </div>
        `;
        
        // API Call to ServiceTelefoaneMobile.ro
        $.get(
            "https://servicetelefoanemobile.ro/api-table-html.php?id=" + id_client + "&cod=" + cod,
            function(data) {
                if (data && data.trim() !== '') {
                    rezultatDiv.innerHTML = `
                        <div class="status-result-box">
                            <h3>📋 Status Reparație: <span class="code-highlight">${cod}</span></h3>
                            ${data}
                            <div class="result-actions">
                                <a href="contact.html" class="btn btn-secondary">Contactează-ne</a>
                                <button onclick="location.reload()" class="btn btn-outline">Verifică Alt Cod</button>
                            </div>
                        </div>
                    `;
                } else {
                    rezultatDiv.innerHTML = `
                        <div class="alert-box error">
                            <h4>❌ Cod Inexistent</h4>
                            <p>Nu am găsit nicio reparație cu codul <strong>${cod}</strong></p>
                            <p>Verifică dacă ai introdus corect codul sau contactează-ne pentru asistență.</p>
                            <div class="result-actions">
                                <a href="contact.html" class="btn btn-primary">Contactează-ne</a>
                            </div>
                        </div>
                    `;
                }
            }
        ).fail(function() {
            rezultatDiv.innerHTML = `
                <div class="alert-box error">
                    <h4>⚠️ Eroare de Conexiune</h4>
                    <p>Nu am putut verifica statusul în acest moment. Te rugăm să încerci din nou sau să ne contactezi telefonic.</p>
                    <div class="result-actions">
                        <button onclick="verifica(${id_client})" class="btn btn-primary">Încearcă Din Nou</button>
                        <a href="contact.html" class="btn btn-secondary">Contactează-ne</a>
                    </div>
                </div>
            `;
        });
    }
    
    // Make verifica global
    window.verifica = verifica;
}

// ===============================
// IMEI Check Form
// ===============================
const imeiForm = document.getElementById('imeiCheckForm');

if (imeiForm) {
    imeiForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const imeiInput = document.getElementById('imei_check');
        const imeiValue = imeiInput.value.trim().replace(/\s/g, '');
        const resultDiv = document.getElementById('imei-result');
        const submitButton = this.querySelector('button[type="submit"]');
        
        // Validate IMEI format (15 digits)
        if (!/^\d{15}$/.test(imeiValue)) {
            resultDiv.innerHTML = `
                <div class="alert-box error">
                    <h4>❌ IMEI Invalid</h4>
                    <p>IMEI-ul trebuie să conțină exact 15 cifre. Te rugăm să verifici și să încerci din nou.</p>
                </div>
            `;
            return;
        }
        
        // Show loading
        submitButton.disabled = true;
        resultDiv.innerHTML = `
            <div class="loading-status">
                <div class="spinner"></div>
                <p>Se verifică IMEI-ul...</p>
            </div>
        `;
        
        try {
            // TODO: Replace with your actual IMEI API endpoint and key
            // This is a placeholder implementation
            
            // Example API call structure:
            // const response = await fetch(`YOUR_IMEI_API_ENDPOINT?imei=${imeiValue}&key=YOUR_API_KEY`);
            // const data = await response.json();
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simulated response (Replace with actual API data)
            const mockData = {
                success: true,
                imei: imeiValue,
                brand: 'Apple', // This would come from API
                model: 'iPhone 13 Pro', // This would come from API
                status: 'Clean', // Clean, Blacklisted, etc.
                simlock: 'Unlocked', // Locked, Unlocked
                country: 'România',
                warranty: 'Expirat'
            };
            
            if (mockData.success) {
                const statusColor = mockData.status === 'Clean' ? 'success' : 'error';
                const simlockColor = mockData.simlock === 'Unlocked' ? 'success' : 'warning';
                
                resultDiv.innerHTML = `
                    <div class="imei-result-box">
                        <h3>✅ Rezultate Verificare IMEI</h3>
                        <div class="imei-details">
                            <div class="imei-detail-item">
                                <span class="detail-label">IMEI:</span>
                                <span class="detail-value code-highlight">${mockData.imei}</span>
                            </div>
                            <div class="imei-detail-item">
                                <span class="detail-label">Marcă:</span>
                                <span class="detail-value">${mockData.brand}</span>
                            </div>
                            <div class="imei-detail-item">
                                <span class="detail-label">Model:</span>
                                <span class="detail-value">${mockData.model}</span>
                            </div>
                            <div class="imei-detail-item">
                                <span class="detail-label">Status:</span>
                                <span class="detail-value badge-${statusColor}">${mockData.status}</span>
                            </div>
                            <div class="imei-detail-item">
                                <span class="detail-label">SIM Lock:</span>
                                <span class="detail-value badge-${simlockColor}">${mockData.simlock}</span>
                            </div>
                            <div class="imei-detail-item">
                                <span class="detail-label">Țară:</span>
                                <span class="detail-value">${mockData.country}</span>
                            </div>
                            <div class="imei-detail-item">
                                <span class="detail-label">Garanție:</span>
                                <span class="detail-value">${mockData.warranty}</span>
                            </div>
                        </div>
                        
                        <div class="alert-box info">
                            <p><strong>📝 Notă:</strong> Aceasta este o verificare de bază. Pentru informații complete despre garanție Apple sau Samsung, te rugăm să contactezi direct producătorul.</p>
                        </div>
                        
                        <div class="result-actions">
                            <a href="formulare.html" class="btn btn-primary">Trimite în Service</a>
                            <button onclick="location.reload()" class="btn btn-outline">Verifică Alt IMEI</button>
                        </div>
                    </div>
                `;
            }
            
        } catch (error) {
            console.error('IMEI Check Error:', error);
            resultDiv.innerHTML = `
                <div class="alert-box error">
                    <h4>⚠️ Eroare la Verificare</h4>
                    <p>Nu am putut verifica IMEI-ul în acest moment. Te rugăm să încerci din nou mai târziu.</p>
                    <p>Pentru verificări urgente, te rugăm să ne contactezi telefonic.</p>
                    <div class="result-actions">
                        <a href="contact.html" class="btn btn-primary">Contactează-ne</a>
                    </div>
                </div>
            `;
        } finally {
            submitButton.disabled = false;
        }
    });
}

// ===============================
// Utility Functions
// ===============================
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// URL param parser for status check from URL
function urlParam(k) {
    var p = {};
    location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(s, k, v) {
        p[k] = v;
    });
    return k ? p[k] : p;
}

// ===============================
// Form Validation Helpers
// ===============================

// Phone number validation
function validatePhoneNumber(phone) {
    const phoneRegex = /^(\+4|0)[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add real-time validation to phone input
const phoneInput = document.getElementById('telefon');
if (phoneInput) {
    phoneInput.addEventListener('blur', function() {
        if (this.value && !validatePhoneNumber(this.value)) {
            this.setCustomValidity('Număr de telefon invalid. Format acceptat: 07XXXXXXXX');
        } else {
            this.setCustomValidity('');
        }
    });
}

// Add real-time validation to email input
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.setCustomValidity('Adresă de email invalidă');
        } else {
            this.setCustomValidity('');
        }
    });
}

// ===============================
// Console Info
// ===============================
console.log('%c📱 ZengSM Forms Module Loaded', 'background: #6366f1; color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold;');
console.log('%c⚙️ API Configuration:', 'color: #6366f1; font-weight: bold;');
console.log('Status Check API: servicetelefoanemobile.ro');
console.log('IMEI Check API: [Configure with your API key]');
console.log('%c⚠️ Remember to replace placeholder API endpoints with your actual backend URLs!', 'color: #f59e0b; font-weight: bold;');
