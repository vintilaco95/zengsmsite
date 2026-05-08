// Sell Phone Form Handler - NOUA VERSIUNE
// Structură: Brand → Model → Capacitate → Culoare → Stare → Baterie → Carcasă → Ecran → Contact Lichide → Date

let phoneData = {};
let currentStep = 1;
const totalSteps = 10;

let selectedData = {
    brand: null,
    model: null,
    capacitate: null,
    culoare: null,
    stare: null, // NOU_SIGILAT, NOU_DESIGILAT, FOLOSIT
    baterie: null, // 0-100
    carcasa: null, // Impecabila, Urme_Minore, Zgarituri
    ecran: null, // Impecabil, Urme_Fine, Zgarit
    contact_lichide: null // Da, Nu
};

// Load CSV data
async function loadPhoneData() {
    try {
        const response = await fetch('csv/preturi-telefoane-nou.csv');
        if (!response.ok) {
            throw new Error('Failed to load CSV');
        }
        const csvText = await response.text();
        phoneData = parseCSV(csvText);
        populateBrands();
    } catch (error) {
        console.error('Error loading phone data:', error);
        alert('Eroare la încărcarea datelor. Te rugăm să reîmprospătezi pagina.');
    }
}

// Parse CSV to structured object
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return {};
    
    const headers = parseCSVLine(lines[0]);
    const data = {};
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = parseCSVLine(lines[i]);
        const brand = values[0]?.trim();
        const model = values[1]?.trim();
        const capacitate = values[2]?.trim();
        const culoare = values[3]?.trim();
        
        if (!brand || !model || !capacitate || !culoare) continue;
        
        // Structure: data[brand][model][capacitate][culoare] = { all fields }
        if (!data[brand]) data[brand] = {};
        if (!data[brand][model]) data[brand][model] = {};
        if (!data[brand][model][capacitate]) data[brand][model][capacitate] = {};
        
        const phoneObj = {};
        headers.forEach((header, index) => {
            const value = values[index]?.trim() || '';
            phoneObj[header] = value;
        });
        
        data[brand][model][capacitate][culoare] = phoneObj;
    }
    
    return data;
}

// Parse CSV line handling quotes
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    
    return result;
}

// Populate brands
function populateBrands() {
    const brandsGrid = document.getElementById('brands-grid');
    if (!brandsGrid) return;
    
    brandsGrid.innerHTML = '';
    const brands = Object.keys(phoneData).sort();
    
    brands.forEach(brand => {
        const card = document.createElement('div');
        card.className = 'condition-card';
        card.dataset.brand = brand;
        card.onclick = () => selectBrand(brand);
        
        card.innerHTML = `
            <span class="card-icon">📱</span>
            <h3>${brand}</h3>
        `;
        
        brandsGrid.appendChild(card);
    });
}

function selectBrand(brand) {
    selectedData.brand = brand;
    selectedData.model = null;
    selectedData.capacitate = null;
    selectedData.culoare = null;
    
    populateModels();
    goToNextStep();
}

function populateModels() {
    const modelsGrid = document.getElementById('models-grid');
    if (!modelsGrid || !selectedData.brand) return;
    
    modelsGrid.innerHTML = '';
    const models = Object.keys(phoneData[selectedData.brand] || {}).sort();
    
    models.forEach(model => {
        const card = document.createElement('div');
        card.className = 'condition-card';
        card.dataset.model = model;
        card.onclick = () => selectModel(model);
        
        card.innerHTML = `
            <span class="card-icon">📱</span>
            <h3>${model}</h3>
        `;
        
        modelsGrid.appendChild(card);
    });
}

function selectModel(model) {
    selectedData.model = model;
    selectedData.capacitate = null;
    selectedData.culoare = null;
    
    populateCapacitati();
    goToNextStep();
}

function populateCapacitati() {
    const capacGrid = document.getElementById('capacitati-grid');
    if (!capacGrid || !selectedData.brand || !selectedData.model) return;
    
    capacGrid.innerHTML = '';
    const capacitati = Object.keys(phoneData[selectedData.brand][selectedData.model] || {});
    
    capacitati.forEach(capac => {
        const card = document.createElement('div');
        card.className = 'condition-card';
        card.dataset.capacitate = capac;
        card.onclick = () => selectCapacitate(capac);
        
        card.innerHTML = `
            <span class="card-icon">💾</span>
            <h3>${capac}</h3>
        `;
        
        capacGrid.appendChild(card);
    });
}

function selectCapacitate(capac) {
    selectedData.capacitate = capac;
    selectedData.culoare = null;
    
    populateCulori();
    goToNextStep();
}

function populateCulori() {
    const culoriGrid = document.getElementById('culori-grid');
    if (!culoriGrid || !selectedData.brand || !selectedData.model || !selectedData.capacitate) return;
    
    culoriGrid.innerHTML = '';
    const culori = Object.keys(phoneData[selectedData.brand][selectedData.model][selectedData.capacitate] || {});
    
    culori.forEach(culoare => {
        const card = document.createElement('div');
        card.className = 'condition-card';
        card.dataset.culoare = culoare;
        card.onclick = () => selectCuloare(culoare);
        
        card.innerHTML = `
            <span class="card-icon">🎨</span>
            <h3>${culoare}</h3>
        `;
        
        culoriGrid.appendChild(card);
    });
}

function selectCuloare(culoare) {
    selectedData.culoare = culoare;
    goToNextStep();
}

// Get base price based on selected options
function getBasePrice() {
    if (!selectedData.brand || !selectedData.model || !selectedData.capacitate || !selectedData.culoare || !selectedData.stare) {
        return 0;
    }
    
    const phoneInfo = phoneData[selectedData.brand][selectedData.model][selectedData.capacitate][selectedData.culoare];
    if (!phoneInfo) return 0;
    
    const stareKey = selectedData.stare.toUpperCase();
    const price = parseFloat(phoneInfo[stareKey]) || 0;
    
    return price;
}

// Get reduction percentage for an option
function getReduction(optionType, optionValue) {
    if (!selectedData.brand || !selectedData.model || !selectedData.capacitate || !selectedData.culoare) {
        return 0;
    }
    
    const phoneInfo = phoneData[selectedData.brand][selectedData.model][selectedData.capacitate][selectedData.culoare];
    if (!phoneInfo) return 0;
    
    const key = `${optionType}_${optionValue}`;
    const reduction = parseFloat(phoneInfo[key]) || 0;
    
    return reduction;
}

// Calculate final price
function calculateFinalPrice() {
    let basePrice = getBasePrice();
    if (basePrice === 0) return 0;
    
    // Pentru telefoane noi (NOU_SIGILAT, NOU_DESIGILAT), nu aplicăm reduceri
    // Prețul este fix la prețul de bază
    if (selectedData.stare === 'NOU_SIGILAT' || selectedData.stare === 'NOU_DESIGILAT') {
        return basePrice;
    }
    
    // Pentru telefoane folosite (FOLOSIT), aplicăm reducerile
    // Baterie reduction (based on percentage intervals)
    let baterieReduction = 0;
    if (selectedData.baterie !== null) {
        const batteryValue = parseInt(selectedData.baterie);
        if (batteryValue >= 90) {
            baterieReduction = getReduction('Baterie', '100_90');
        } else if (batteryValue >= 70) {
            baterieReduction = getReduction('Baterie', '80_70');
        } else if (batteryValue >= 50) {
            baterieReduction = getReduction('Baterie', '60_50');
        } else {
            baterieReduction = getReduction('Baterie', 'sub50');
        }
    }
    
    // Apply reductions (percentage of base price)
    const carcasaReduction = getReduction('Carcasa', selectedData.carcasa) || 0;
    const ecranReduction = getReduction('Ecran', selectedData.ecran) || 0;
    const contactReduction = selectedData.contact_lichide === 'Da' ? getReduction('Contact_Lichide', 'Da') : 0;
    
    // Calculate total reduction percentage
    const totalReduction = (baterieReduction + carcasaReduction + ecranReduction + contactReduction) / 100;
    
    // Final price = basePrice * (1 - totalReduction)
    const finalPrice = basePrice * (1 - totalReduction);
    
    return Math.round(finalPrice);
}

// Step navigation
function goToNextStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        updateStepDisplay();
        updateProgressBar();
        updatePriceDisplay();
    }
}

function goToPreviousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
        updateProgressBar();
    }
}

function updateStepDisplay() {
    document.querySelectorAll('.sell-step').forEach(step => {
        step.classList.remove('active');
    });
    
    const currentStepEl = document.querySelector(`.sell-step[data-step="${currentStep}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
}

function updateProgressBar() {
    document.querySelectorAll('.progress-step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        if (stepNum < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNum === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

function updatePriceDisplay() {
    const finalPriceEl = document.getElementById('final-price');
    if (finalPriceEl && currentStep >= 9) {
        const price = calculateFinalPrice();
        finalPriceEl.textContent = `${price.toLocaleString('ro-RO')} RON`;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadPhoneData();
    
    // Stare selection
    document.querySelectorAll('[data-stare]').forEach(card => {
        card.onclick = () => {
            document.querySelectorAll('[data-stare]').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedData.stare = card.dataset.stare;
            
            // Dacă telefonul este NOU_SIGILAT sau NOU_DESIGILAT, sărim direct la ultimul pas
            // și setăm valorile default pentru că nu poate fi uzat
            if (selectedData.stare === 'NOU_SIGILAT' || selectedData.stare === 'NOU_DESIGILAT') {
                // Setăm valorile implicite pentru telefoane noi
                selectedData.baterie = 100; // Baterie nouă
                selectedData.carcasa = 'Impecabila'; // Carcasă impecabilă
                selectedData.ecran = 'Impecabil'; // Ecran impecabil
                selectedData.contact_lichide = 'Nu'; // Nu a intrat în contact cu lichide
                
                // Sărim direct la step 10 (Date + Preț final)
                currentStep = 10;
                updateStepDisplay();
                updateProgressBar();
                updatePriceDisplay();
            } else {
                // Dacă este FOLOSIT, continuăm normal prin toți pașii
                goToNextStep();
            }
        };
    });
    
    // Baterie slider
    const baterieSlider = document.getElementById('baterie-slider');
    const baterieValue = document.getElementById('baterie-value');
    if (baterieSlider && baterieValue) {
        baterieSlider.oninput = (e) => {
            selectedData.baterie = e.target.value;
            baterieValue.textContent = `${e.target.value}%`;
            updatePriceDisplay();
        };
    }
    
    // Carcasă selection
    document.querySelectorAll('[data-carcasa]').forEach(card => {
        card.onclick = () => {
            document.querySelectorAll('[data-carcasa]').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedData.carcasa = card.dataset.carcasa;
            goToNextStep();
        };
    });
    
    // Ecran selection
    document.querySelectorAll('[data-ecran]').forEach(card => {
        card.onclick = () => {
            document.querySelectorAll('[data-ecran]').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedData.ecran = card.dataset.ecran;
            goToNextStep();
        };
    });
    
    // Contact lichide selection
    document.querySelectorAll('[data-contact-lichide]').forEach(card => {
        card.onclick = () => {
            document.querySelectorAll('[data-contact-lichide]').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedData.contact_lichide = card.dataset.contactLichide;
            goToNextStep();
        };
    });
    
    // Form submission
    const sellForm = document.getElementById('sell-form');
    if (sellForm) {
        sellForm.onsubmit = async (e) => {
            e.preventDefault();
            
            const finalPrice = calculateFinalPrice();
            const formData = {
                brand: selectedData.brand,
                model: selectedData.model,
                capacitate: selectedData.capacitate,
                culoare: selectedData.culoare,
                stare: selectedData.stare,
                baterie: selectedData.baterie,
                carcasa: selectedData.carcasa,
                ecran: selectedData.ecran,
                contact_lichide: selectedData.contact_lichide,
                pret_final: finalPrice,
                nume: document.getElementById('nume').value,
                telefon: document.getElementById('telefon').value,
                email: document.getElementById('email').value,
                oras: document.getElementById('oras').value,
                observatii: document.getElementById('observatii').value
            };
            
            // Submit via EmailJS
            // IMPORTANT: Actualizează ID-urile de mai jos cu cele din EmailJS Dashboard:
            // - YOUR_PUBLIC_KEY (în vanzare-telefon.html)
            // - YOUR_SERVICE_ID (în acest fișier)
            // - YOUR_TEMPLATE_ID (în acest fișier)
            try {
                // Verifică dacă EmailJS este încărcat
                if (typeof emailjs === 'undefined') {
                    console.error('EmailJS SDK nu este încărcat');
                    alert('Eroare de configurare. Te rugăm să contactezi administratorul.');
                    return;
                }
                
                // Pregătește parametrii pentru template EmailJS
                // Variabilele trebuie să corespundă cu cele din template-ul tău EmailJS
                const templateParams = {
                    brand: formData.brand,
                    model: formData.model,
                    capacitate: formData.capacitate,
                    culoare: formData.culoare,
                    stare: formData.stare,
                    baterie: formData.baterie,
                    carcasa: formData.carcasa,
                    ecran: formData.ecran,
                    contact_lichide: formData.contact_lichide,
                    pret_final: formData.pret_final,
                    nume: formData.nume,
                    telefon: formData.telefon,
                    email: formData.email || 'N/A',
                    oras: formData.oras || 'N/A',
                    observatii: formData.observatii || 'N/A'
                };
                
                // Trimite email via EmailJS
                // IMPORTANT: Înlocuiește YOUR_SERVICE_ID și YOUR_TEMPLATE_ID cu ID-urile tale reale!
                await emailjs.send(
                    'service_oc9vzjh',    // ← Înlocuiește cu Service ID-ul tău (ex: service_abc123)
                    'template_ai71rnf',   // ← Înlocuiește cu Template ID-ul tău (ex: template_xyz789)
                    templateParams
                );
                
                // Succes!
                alert('✅ Mulțumim! Oferta ta a fost trimisă. Te vom contacta în cel mai scurt timp!');
                sellForm.reset();
                
                // Reset form
                currentStep = 1;
                selectedData = {
                    brand: null, model: null, capacitate: null, culoare: null,
                    stare: null, baterie: null, carcasa: null, ecran: null, contact_lichide: null
                };
                updateStepDisplay();
                updateProgressBar();
                populateBrands();
                
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('⚠️ A apărut o eroare la trimiterea ofertei. Te rugăm să ne suni direct la 0758 060 072 sau să ne trimiți un email la office@zengsm.ro');
            }
        };
    }
});

