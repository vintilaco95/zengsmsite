// Sell Phone Form Handler
// Handles phone selling form with step-by-step selection and price calculation

let phoneData = {};
let currentStep = 1;
let selectedData = {
    brand: null,
    model: null,
    condition: null,
    ecran: null,
    carcasa: null,
    baterie: null,
    ecran_inlocuit: null
};

// Load CSV data
async function loadPhoneData() {
    try {
        const response = await fetch('csv/preturi-telefoane.csv');
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

// Parse CSV to object (handles quoted values)
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return {};
    
    // Parse headers
    const headers = parseCSVLine(lines[0]);
    const data = {};
    
    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = parseCSVLine(lines[i]);
        const brand = values[0]?.trim();
        const model = values[1]?.trim();
        
        if (!brand || !model) continue;
        
        if (!data[brand]) {
            data[brand] = {};
        }
        
        const phoneObj = {};
        headers.forEach((header, index) => {
            const value = values[index]?.trim() || '';
            phoneObj[header] = value;
        });
        
        data[brand][model] = phoneObj;
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
        card.className = 'brand-select-card';
        card.dataset.brand = brand;
        card.innerHTML = `
            <span class="card-icon">📱</span>
            <h3>${brand}</h3>
        `;
        card.addEventListener('click', () => selectBrand(brand));
        brandsGrid.appendChild(card);
    });
}

// Select brand
function selectBrand(brand) {
    // Remove active from all brand cards
    document.querySelectorAll('.brand-select-card').forEach(card => {
        card.classList.remove('active');
    });
    // Add active to selected
    const selectedCard = document.querySelector(`.brand-select-card[data-brand="${brand}"]`);
    if (selectedCard) {
        selectedCard.classList.add('active');
    }
    
    selectedData.brand = brand;
    populateModels(brand);
    goToNextStep();
}

// Populate models
function populateModels(brand) {
    const modelsGrid = document.getElementById('models-grid');
    if (!modelsGrid) return;
    
    modelsGrid.innerHTML = '';
    
    const models = Object.keys(phoneData[brand] || {}).sort();
    
    models.forEach(model => {
        const card = document.createElement('div');
        card.className = 'model-select-card';
        card.dataset.model = model;
        card.innerHTML = `
            <span class="card-icon">📱</span>
            <h3>${model}</h3>
        `;
        card.addEventListener('click', () => selectModel(model));
        modelsGrid.appendChild(card);
    });
}

// Select model
function selectModel(model) {
    // Remove active from all model cards
    document.querySelectorAll('.model-select-card').forEach(card => {
        card.classList.remove('active');
    });
    // Add active to selected
    const selectedCard = document.querySelector(`.model-select-card[data-model="${model}"]`);
    if (selectedCard) {
        selectedCard.classList.add('active');
    }
    
    selectedData.model = model;
    goToNextStep();
}

// Select condition
function selectCondition(condition) {
    // Remove active from all condition cards
    document.querySelectorAll('#condition-grid .condition-card').forEach(card => {
        card.classList.remove('active');
    });
    // Add active to selected
    const selectedCard = document.querySelector(`#condition-grid .condition-card[data-value="${condition}"]`);
    if (selectedCard) {
        selectedCard.classList.add('active');
    }
    
    selectedData.condition = condition;
    goToNextStep();
}

// Select screen condition
function selectScreenCondition(value) {
    // Remove active from all screen cards
    document.querySelectorAll('#screen-condition-grid .condition-card').forEach(card => {
        card.classList.remove('active');
    });
    // Add active to selected
    const selectedCard = document.querySelector(`#screen-condition-grid .condition-card[data-value="${value}"]`);
    if (selectedCard) {
        selectedCard.classList.add('active');
    }
    
    selectedData.ecran = value;
    calculatePrice();
    goToNextStep();
}

// Select carcasa condition
function selectCarcasaCondition(value) {
    // Remove active from all carcasa cards
    document.querySelectorAll('#carcasa-condition-grid .condition-card').forEach(card => {
        card.classList.remove('active');
    });
    // Add active to selected
    const selectedCard = document.querySelector(`#carcasa-condition-grid .condition-card[data-value="${value}"]`);
    if (selectedCard) {
        selectedCard.classList.add('active');
    }
    
    selectedData.carcasa = value;
    calculatePrice();
    goToNextStep();
}

// Select battery condition
function selectBatteryCondition(value) {
    // Remove active from all battery cards
    document.querySelectorAll('#battery-condition-grid .condition-card').forEach(card => {
        card.classList.remove('active');
    });
    // Add active to selected
    const selectedCard = document.querySelector(`#battery-condition-grid .condition-card[data-value="${value}"]`);
    if (selectedCard) {
        selectedCard.classList.add('active');
    }
    
    selectedData.baterie = value;
    calculatePrice();
    goToNextStep();
}

// Select screen replacement
function selectScreenReplacement(value) {
    // Remove active from all replacement cards
    document.querySelectorAll('#screen-replacement-grid .condition-card').forEach(card => {
        card.classList.remove('active');
    });
    // Add active to selected
    const selectedCard = document.querySelector(`#screen-replacement-grid .condition-card[data-value="${value}"]`);
    if (selectedCard) {
        selectedCard.classList.add('active');
    }
    
    selectedData.ecran_inlocuit = value;
    calculatePrice();
    goToNextStep();
}

// Get condition label
function getConditionLabel(value) {
    const labels = {
        'nou': 'Nou',
        'desigilat': 'Desigilat',
        'uzat_foarte_bun': 'Foarte Bun',
        'uzat_bun': 'Bun',
        'uzat_mediu': 'Mediu'
    };
    return labels[value] || value;
}

// Calculate price
function calculatePrice() {
    if (!selectedData.brand || !selectedData.model || !selectedData.condition) {
        return 0;
    }
    
    const phone = phoneData[selectedData.brand]?.[selectedData.model];
    if (!phone) {
        console.error('Phone not found:', selectedData.brand, selectedData.model);
        return 0;
    }
    
    // Base price from condition
    let price = 0;
    const conditionKey = `stare_${selectedData.condition}`;
    const basePrice = phone[conditionKey];
    
    if (!basePrice || basePrice === '') {
        console.error('Base price not found for condition:', conditionKey);
        console.error('Available keys:', Object.keys(phone));
        return 0;
    }
    
    price = parseFloat(basePrice) || 0;
    console.log(`Base price for ${conditionKey}: ${price}`);
    
    // Apply deductions for screen
    if (selectedData.ecran) {
        const ecranKey = `ecran_${selectedData.ecran}`;
        const deduction = parseFloat(phone[ecranKey]) || 0;
        price += deduction; // deduction is already negative
        console.log(`Screen deduction (${ecranKey}): ${deduction}, New price: ${price}`);
    }
    
    // Apply deductions for carcasa
    if (selectedData.carcasa) {
        const carcasaKey = `carcasa_${selectedData.carcasa}`;
        const deduction = parseFloat(phone[carcasaKey]) || 0;
        price += deduction; // deduction is already negative
        console.log(`Carcasa deduction (${carcasaKey}): ${deduction}, New price: ${price}`);
    }
    
    // Apply deductions for battery
    if (selectedData.baterie) {
        const baterieKey = `baterie_${selectedData.baterie}`;
        const deduction = parseFloat(phone[baterieKey]) || 0;
        price += deduction; // deduction is already negative
        console.log(`Battery deduction (${baterieKey}): ${deduction}, New price: ${price}`);
    }
    
    // Apply deduction for screen replacement
    if (selectedData.ecran_inlocuit === 'da') {
        const deduction = parseFloat(phone['ecran_inlocuit']) || 0;
        price += deduction; // deduction is already negative
        console.log(`Screen replacement deduction: ${deduction}, New price: ${price}`);
    }
    
    // Ensure price is not negative
    price = Math.max(0, Math.round(price));
    
    console.log(`Final calculated price: ${price} RON`);
    
    // Update price display
    const priceElement = document.getElementById('final-price');
    if (priceElement) {
        priceElement.textContent = `${price} RON`;
    }
    
    return price;
}

// Navigation functions
function goToNextStep() {
    if (currentStep < 8) {
        // Validate current step
        if (currentStep === 1 && !selectedData.brand) {
            alert('Te rugăm să selectezi un brand!');
            return;
        }
        if (currentStep === 2 && !selectedData.model) {
            alert('Te rugăm să selectezi un model!');
            return;
        }
        if (currentStep === 3 && !selectedData.condition) {
            alert('Te rugăm să selectezi starea telefonului!');
            return;
        }
        if (currentStep === 4 && !selectedData.ecran) {
            alert('Te rugăm să selectezi condiția ecranului!');
            return;
        }
        if (currentStep === 5 && !selectedData.carcasa) {
            alert('Te rugăm să selectezi condiția carcasei!');
            return;
        }
        if (currentStep === 6 && !selectedData.baterie) {
            alert('Te rugăm să selectezi sănătatea bateriei!');
            return;
        }
        if (currentStep === 7 && !selectedData.ecran_inlocuit) {
            alert('Te rugăm să indici dacă ecranul a fost înlocuit!');
            return;
        }
        
        currentStep++;
        updateStepDisplay();
        
        // Calculate price when reaching final step
        if (currentStep === 8) {
            calculatePrice();
        }
    }
}

function goToPreviousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
        
        // Recalculate price if we go back from final step
        if (currentStep < 8) {
            calculatePrice();
        }
    }
}

function updateStepDisplay() {
    // Hide all steps
    document.querySelectorAll('.sell-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    const currentStepElement = document.querySelector(`.sell-step[data-step="${currentStep}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
    
    // Update progress indicator
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
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
    
    // Show/hide back button
    const backButtons = document.querySelectorAll('.btn-back');
    backButtons.forEach(btn => {
        if (currentStep === 1) {
            btn.style.display = 'none';
        } else {
            btn.style.display = 'inline-flex';
        }
    });
}


// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add class to body and html for mobile styling
    if (window.innerWidth <= 640) {
        document.body.classList.add('sell-phone-page');
        document.documentElement.classList.add('sell-phone-page');
    }
    
    // Handle resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 640) {
            document.body.classList.add('sell-phone-page');
            document.documentElement.classList.add('sell-phone-page');
        } else {
            document.body.classList.remove('sell-phone-page');
            document.documentElement.classList.remove('sell-phone-page');
        }
    });
    
    // Load phone data
    loadPhoneData();
    
    // Condition cards (step 3)
    document.querySelectorAll('#condition-grid .condition-card').forEach(card => {
        card.addEventListener('click', function() {
            const value = this.dataset.value;
            selectCondition(value);
        });
    });
    
    // Screen condition cards (step 4)
    document.querySelectorAll('#screen-condition-grid .condition-card').forEach(card => {
        card.addEventListener('click', function() {
            const value = this.dataset.value;
            selectScreenCondition(value);
        });
    });
    
    // Carcasa condition cards (step 5)
    document.querySelectorAll('#carcasa-condition-grid .condition-card').forEach(card => {
        card.addEventListener('click', function() {
            const value = this.dataset.value;
            selectCarcasaCondition(value);
        });
    });
    
    // Battery condition cards (step 6)
    document.querySelectorAll('#battery-condition-grid .condition-card').forEach(card => {
        card.addEventListener('click', function() {
            const value = this.dataset.value;
            selectBatteryCondition(value);
        });
    });
    
    // Screen replacement cards (step 7)
    document.querySelectorAll('#screen-replacement-grid .condition-card').forEach(card => {
        card.addEventListener('click', function() {
            const value = this.dataset.value;
            selectScreenReplacement(value);
        });
    });
    
    // Form submission
    const sellForm = document.getElementById('sell-form');
    if (sellForm) {
        sellForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate all selections
            if (!selectedData.brand || !selectedData.model || !selectedData.condition ||
                !selectedData.ecran || !selectedData.carcasa || !selectedData.baterie || !selectedData.ecran_inlocuit) {
                alert('Te rugăm să completezi toate câmpurile!');
                return;
            }
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            // Show loading
            submitButton.disabled = true;
            submitButton.innerHTML = '<span>Se trimite...</span>';
            
            // Get form data
            const formData = new FormData(this);
            const finalPrice = calculatePrice();
            
            // Prepare email data
            const emailData = {
                tip_formular: 'Vanzare Telefon',
                brand: selectedData.brand,
                model: selectedData.model,
                stare: getConditionLabel(selectedData.condition),
                ecran: selectedData.ecran,
                carcasa: selectedData.carcasa,
                baterie: selectedData.baterie,
                ecran_inlocuit: selectedData.ecran_inlocuit === 'da' ? 'Da' : 'Nu',
                pret_estimativ: finalPrice,
                nume: formData.get('nume'),
                telefon: formData.get('telefon'),
                email: formData.get('email'),
                oras: formData.get('oras'),
                observatii: formData.get('observatii')
            };
            
            // Send email
            try {
                // Create email body
                const emailBody = `
Tip Formular: Vanzare Telefon
=============================

Detalii Telefon:
- Brand: ${selectedData.brand}
- Model: ${selectedData.model}
- Stare: ${getConditionLabel(selectedData.condition)}
- Condiție Ecran: ${selectedData.ecran}
- Condiție Carcasă: ${selectedData.carcasa}
- Sănătate Baterie: ${selectedData.baterie}%
- Ecran Înlocuit: ${selectedData.ecran_inlocuit === 'da' ? 'Da' : 'Nu'}

Preț Oferit: ${finalPrice} RON

Date Contact:
- Nume: ${formData.get('nume')}
- Telefon: ${formData.get('telefon')}
- Email: ${formData.get('email') || 'N/A'}
- Oraș: ${formData.get('oras') || 'N/A'}
- Observații: ${formData.get('observatii') || 'Niciuna'}
                `;
                
                // Using mailto as primary method
                // You can replace this with FormSpree, EmailJS, or backend endpoint
                const mailtoLink = `mailto:office@zengsm.ro?subject=Ofertă Vânzare Telefon - ${finalPrice} RON&body=${encodeURIComponent(emailBody)}`;
                
                // Open email client
                window.location.href = mailtoLink;
                
                // Show success message
                const messageDiv = document.createElement('div');
                messageDiv.className = 'form-message success-message';
                messageDiv.innerHTML = `
                    <div class="success-icon">✓</div>
                    <h3>Ofertă Trimisă cu Succes!</h3>
                    <p>Am deschis clientul tău de email. Dacă nu s-a deschis automat, te rugăm să trimiti manual la <strong>office@zengsm.ro</strong></p>
                    <p><strong>Oferta ta: ${finalPrice} RON</strong></p>
                    <p>Te vom contacta în cel mai scurt timp pentru a finaliza tranzacția.</p>
                `;
                sellForm.parentNode.insertBefore(messageDiv, sellForm);
                sellForm.reset();
                
            } catch (error) {
                console.error('Error:', error);
                alert('A apărut o eroare. Te rugăm să ne contactezi direct la office@zengsm.ro');
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }
    
    // Initialize first step
    updateStepDisplay();
});
