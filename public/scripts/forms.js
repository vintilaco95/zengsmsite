// Forms Handler for ZengSM Website
// Event delegation pe document.body — compatibil cu Next.js (HTML reinserat la navigare client).

// ===============================
// Utility Functions
// ===============================
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function urlParam(k) {
    var p = {};
    location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (s, key, v) {
        p[key] = v;
    });
    return k ? p[k] : p;
}

function validatePhoneNumber(phone) {
    const phoneRegex = /^(\+4|0)[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const STATUS_API_ID_CLIENT = 1277;

// ===============================
// Status Check (ServiceTelefoaneMobile.ro)
// ===============================
function verifica(id_client) {
    const rezultatDiv = document.getElementById('rezultat');
    if (!rezultatDiv) return;

    var cod = '';
    if (typeof $ !== 'undefined' && $('#cod').length) {
        cod = String($('#cod').val() || '').trim();
    } else {
        var el = document.getElementById('cod');
        cod = el && el.value ? String(el.value).trim() : '';
    }

    if (!cod) {
        rezultatDiv.innerHTML = `
                <div class="alert-box warning">
                    <p>Te rugăm să introduci un cod valid de urmărire.</p>
                </div>
            `;
        return;
    }

    rezultatDiv.innerHTML = `
            <div class="loading-status">
                <div class="spinner"></div>
                <p>Se verifică statusul...</p>
            </div>
        `;

    $.get(
        'https://servicetelefoanemobile.ro/api-table-html.php?id=' +
            id_client +
            '&cod=' +
            encodeURIComponent(cod),
        function (data) {
            if (data && data.trim() !== '') {
                rezultatDiv.innerHTML = `
                        <div class="status-result-box">
                            <h3>📋 Status Reparație: <span class="code-highlight">${cod}</span></h3>
                            ${data}
                            <div class="result-actions">
                                <a href="/contact/" class="btn btn-secondary">Contactează-ne</a>
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
                                <a href="/contact/" class="btn btn-primary">Contactează-ne</a>
                            </div>
                        </div>
                    `;
            }
        }
    ).fail(function () {
        rezultatDiv.innerHTML = `
                <div class="alert-box error">
                    <h4>⚠️ Eroare de Conexiune</h4>
                    <p>Nu am putut verifica statusul în acest moment. Te rugăm să încerci din nou sau să ne contactezi telefonic.</p>
                    <div class="result-actions">
                        <button onclick="verifica(${id_client})" class="btn btn-primary">Încearcă Din Nou</button>
                        <a href="/contact/" class="btn btn-secondary">Contactează-ne</a>
                    </div>
                </div>
            `;
    });
}

window.verifica = verifica;

function tryStatusFromUrl() {
    var cod = urlParam('cod');
    if (!cod || !document.getElementById('statusCheckForm')) return;
    if (typeof $ !== 'undefined' && $('#cod').length) {
        $('#cod').val(decodeURIComponent(String(cod).replace(/\+/g, ' ')));
    } else {
        var input = document.getElementById('cod');
        if (input) input.value = cod;
    }
    verifica(STATUS_API_ID_CLIENT);
}

// ===============================
// Repair form submit (EmailJS)
// ===============================
async function handleRepairFormSubmit(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('form-message');
    if (!submitButton || !messageDiv) return;
    const originalButtonText = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.innerHTML = '<span>Se trimite...</span>';
    messageDiv.innerHTML = '';

    const formData = new FormData(form);
    const data = {};
    formData.forEach(function (value, key) {
        if (key === 'photos') {
            if (!data.photos) data.photos = [];
            data.photos.push(value);
        } else {
            data[key] = value;
        }
    });

    try {
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS SDK nu este încărcat');
        }

        const photosInput = document.getElementById('photos');
        const photosCount = photosInput?.files?.length || 0;
        const photosInfo =
            photosCount > 0
                ? `${photosCount} ${
                      photosCount === 1 ? 'fotografie' : 'fotografii'
                  } încărcată${photosCount > 1 ? 'e' : ''}`
                : 'Nu au fost încărcate fotografii';

        const uniqueCode =
            'ZSM-2025-' +
            Math.random().toString(36).substr(2, 6).toUpperCase();

        const garantie = document.getElementById('garantie')?.checked
            ? 'Da'
            : 'Nu';
        const urgenta = document.getElementById('urgenta')?.checked
            ? 'Da'
            : 'Nu';
        const gdpr = document.getElementById('gdpr')?.checked ? 'Da' : 'Nu';

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
                minute: '2-digit',
            }),
        };

        await emailjs.send(
            'service_oc9vzjh',
            'template_1co0w1n',
            templateParams
        );

        messageDiv.innerHTML = `
                <div class="success-message">
                    <div class="success-icon">✅</div>
                    <h3>Cerere Trimisă cu Succes!</h3>
                    <p>Codul tău unic de urmărire este: <strong>${uniqueCode}</strong></p>
                    <p>Vei primi un email cu instrucțiuni detaliate și AWB pentru expediere în maximum 30 de minute.</p>
                    <p>Păstrează codul pentru a verifica statusul reparației!</p>
                    <a href="#status-form" class="btn btn-primary" onclick="var b=document.querySelector('.form-tab[data-tab=\\'status\\']');if(b)b.click();return false;">Verifică Status</a>
                </div>
            `;

        form.reset();

        const filePreview = document.getElementById('file-preview');
        if (filePreview) filePreview.innerHTML = '';

        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(function () {
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
                    <a href="/contact/" class="btn btn-secondary">Contactează-ne Direct</a>
                </div>
            `;

        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

// ===============================
// IMEI Check
// ===============================
async function handleImeiFormSubmit(form) {
    const imeiInput = document.getElementById('imei_check');
    const resultDiv = document.getElementById('imei-result');
    const submitButton = form.querySelector('button[type="submit"]');
    if (!imeiInput || !resultDiv || !submitButton) return;
    const imeiValue = imeiInput.value.trim().replace(/\s/g, '');

    if (!/^\d{15}$/.test(imeiValue)) {
        resultDiv.innerHTML = `
                <div class="alert-box error">
                    <h4>❌ IMEI Invalid</h4>
                    <p>IMEI-ul trebuie să conțină exact 15 cifre. Te rugăm să verifici și să încerci din nou.</p>
                </div>
            `;
        return;
    }

    submitButton.disabled = true;
    resultDiv.innerHTML = `
            <div class="loading-status">
                <div class="spinner"></div>
                <p>Se verifică IMEI-ul...</p>
            </div>
        `;

    try {
        await new Promise(function (resolve) {
            setTimeout(resolve, 2000);
        });

        const mockData = {
            success: true,
            imei: imeiValue,
            brand: 'Apple',
            model: 'iPhone 13 Pro',
            status: 'Clean',
            simlock: 'Unlocked',
            country: 'România',
            warranty: 'Expirat',
        };

        if (mockData.success) {
            const statusColor =
                mockData.status === 'Clean' ? 'success' : 'error';
            const simlockColor =
                mockData.simlock === 'Unlocked' ? 'success' : 'warning';

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
                            <a href="/formulare/" class="btn btn-primary">Trimite în Service</a>
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
                        <a href="/contact/" class="btn btn-primary">Contactează-ne</a>
                    </div>
                </div>
            `;
    } finally {
        submitButton.disabled = false;
    }
}

// ===============================
// Delegated events (single init)
// ===============================
(function initZengsmFormDelegations() {
    if (window.__zengsmFormsDelegations) return;
    window.__zengsmFormsDelegations = true;

    document.body.addEventListener('click', function (e) {
        var tab = e.target && e.target.closest && e.target.closest('.form-tab[data-tab]');
        if (!tab) return;
        e.preventDefault();
        var targetTab = tab.getAttribute('data-tab');
        if (!targetTab) return;

        var formTabs = document.querySelectorAll('.form-tab[data-tab]');
        var formContainers = document.querySelectorAll('.form-container');
        formTabs.forEach(function (t) {
            t.classList.remove('active');
        });
        formContainers.forEach(function (c) {
            c.classList.remove('active');
        });
        tab.classList.add('active');
        var targetForm = document.getElementById(targetTab + '-form');
        if (targetForm) targetForm.classList.add('active');
    });

    document.body.addEventListener('submit', function (e) {
        if (e.target && e.target.id === 'repairSubmissionForm') {
            e.preventDefault();
            handleRepairFormSubmit(e.target);
        }
    });

    document.body.addEventListener('submit', function (e) {
        if (e.target && e.target.id === 'statusCheckForm') {
            e.preventDefault();
            verifica(STATUS_API_ID_CLIENT);
        }
    });

    document.body.addEventListener('submit', function (e) {
        if (e.target && e.target.id === 'imeiCheckForm') {
            e.preventDefault();
            handleImeiFormSubmit(e.target);
        }
    });

    document.body.addEventListener('keydown', function (e) {
        if (e.target && e.target.id === 'cod' && e.key === 'Enter') {
            e.preventDefault();
            verifica(STATUS_API_ID_CLIENT);
        }
    });

    document.body.addEventListener('change', function (e) {
        if (!e.target || e.target.id !== 'photos') return;
        var filePreview = document.getElementById('file-preview');
        if (!filePreview) return;
        filePreview.innerHTML = '';
        var files = Array.from(e.target.files || []);
        if (files.length > 0) {
            files.forEach(function (file, index) {
                if (file.type.startsWith('image/')) {
                    var reader = new FileReader();
                    reader.onload = function (ev) {
                        var preview = document.createElement('div');
                        preview.className = 'file-preview-item';
                        preview.innerHTML =
                            '<img src="' +
                            ev.target.result +
                            '" alt="Preview">' +
                            '<button type="button" class="remove-file" data-index="' +
                            index +
                            '">×</button>' +
                            '<p>' +
                            file.name +
                            '</p>';
                        filePreview.appendChild(preview);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    });

    document.body.addEventListener('click', function (e) {
        var rm = e.target && e.target.closest && e.target.closest('.remove-file');
        if (!rm) return;
        e.preventDefault();
        var parent = rm.parentElement;
        if (parent) parent.remove();
    });

    document.body.addEventListener(
        'focusout',
        function (e) {
            if (e.target && e.target.id === 'telefon') {
                if (e.target.value && !validatePhoneNumber(e.target.value)) {
                    e.target.setCustomValidity(
                        'Număr de telefon invalid. Format acceptat: 07XXXXXXXX'
                    );
                } else {
                    e.target.setCustomValidity('');
                }
            }
            if (e.target && e.target.id === 'email') {
                if (e.target.value && !validateEmail(e.target.value)) {
                    e.target.setCustomValidity('Adresă de email invalidă');
                } else {
                    e.target.setCustomValidity('');
                }
            }
        },
        true
    );
})();

queueMicrotask(tryStatusFromUrl);

// ===============================
// Console Info
// ===============================
console.log(
    '%c📱 ZengSM Forms Module Loaded',
    'background: #6366f1; color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold;'
);
console.log('%c⚙️ API Configuration:', 'color: #6366f1; font-weight: bold;');
console.log('Status Check API: servicetelefoanemobile.ro');
console.log('IMEI Check API: [Configure with your API key]');
console.log(
    '%c⚠️ Remember to replace placeholder API endpoints with your actual backend URLs!',
    'color: #f59e0b; font-weight: bold;'
);
