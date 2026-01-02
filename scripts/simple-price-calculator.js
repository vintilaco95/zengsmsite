// Simple Price Calculator - CSV-based approach

// Global price data loaded from CSV
let PRICE_DATA = [];

// Load prices from CSV file
async function loadPricesFromCSV() {
  try {
    const response = await fetch('csv/prices.csv');
    const csvText = await response.text();
    const lines = csvText.split('\n').filter(line => line.trim());
    
    // Skip header row
    const dataLines = lines.slice(1);
    
    PRICE_DATA = dataLines.map(line => {
      const [brand, model, repairType, partsCost, labourCost] = line.split(',');
      return {
        brand: brand.trim(),
        model: model.trim(),
        repairType: repairType.trim(),
        partsCost: parseInt(partsCost.trim()) || 0,
        labourCost: parseInt(labourCost.trim()) || 0
      };
    });
    
    console.log('✅ Prices loaded from CSV:', PRICE_DATA.length, 'entries');
  } catch (error) {
    console.error('❌ Error loading prices from CSV:', error);
    // Fallback to empty array
    PRICE_DATA = [];
  }
}

function normalizeBrand(value) {
  return String(value || '').toLowerCase();
}

function getModelsForBrand(brandKey) {
  const brandData = PRICE_DATA.filter(item => 
    normalizeBrand(item.brand) === brandKey
  );
  
  // Get unique models for this brand
  const models = [...new Set(brandData.map(item => item.model))];
  return models.sort();
}

function getRepairsFor(brandKey, model) {
  const repairs = PRICE_DATA.filter(item => 
    normalizeBrand(item.brand) === brandKey && 
    item.model === model
  );
  
  // Get unique repair types for this model
  const repairTypes = [...new Set(repairs.map(item => item.repairType))];
  return repairTypes.sort();
}

function calculatePrice(brandKey, model, repairType) {
  const item = PRICE_DATA.find(entry => 
    normalizeBrand(entry.brand) === brandKey && 
    entry.model === model && 
    entry.repairType === repairType
  );
  
  if (!item) return null;
  
  const parts = Number(item.partsCost) || 0;
  const labour = Number(item.labourCost) || 0;
  
  return {
    parts,
    labour,
    total: parts + labour
  };
}

// Funcție pentru generare mesaj WhatsApp
function generateWhatsAppMessage(brandLabel, model, repairLabel, parts, labour, total) {
  const message = `Bună ziua! 

Am folosit calculatorul de prețuri de pe site-ul zengsm.ro și aș dori să discut despre următoarea reparație:

📱 *Detalii reparație:*
• Marca: ${brandLabel}
• Model: ${model}
• Tip reparație: ${repairLabel}

💰 *Estimare preț:*
• Cost componentă originală: ${parts} RON
• Manoperă: ${labour} RON
• *Total estimat: ${total} RON*

Aș dori să programez o consultație sau să obțin mai multe informații.

Mulțumesc!`;

  return message;
}

function renderResult(container, payload) {
  if (!payload) {
    container.innerHTML = `
      <div class="result-placeholder">
        <div class="placeholder-icon">ℹ️</div>
        <h3>Nu avem încă preț pentru această combinație</h3>
        <p>Contactează-ne pentru o ofertă exactă sau alege altă opțiune.</p>
      </div>
    `;
    return;
  }

  const { brandLabel, model, repairLabel, parts, labour, total } = payload;
  
  // Generare mesaj WhatsApp
  const whatsappMessage = generateWhatsAppMessage(brandLabel, model, repairLabel, parts, labour, total);
  const whatsappUrl = `https://wa.me/40758060072?text=${encodeURIComponent(whatsappMessage)}`;
  
  container.innerHTML = `
    <div class="result-card">
      <h3 style="color: white; font-weight: 800 ;">Estimare Preț</h3>
      <ul class="result-list">
        <li><strong>Marcă:</strong> ${brandLabel}</li>
        <li><strong>Model:</strong> ${model}</li>
        <li><strong>Reparație:</strong> ${repairLabel}</li>
        <li><strong>Cost componenta Originala:</strong> ${parts} RON</li>
        <li><strong>Manoperă:</strong> ${labour} RON</li>
      </ul>
      <div class="result-total">Total: <strong>${total} RON</strong></div>
      <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-large calculator-whatsapp-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.98 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .96 4.495.96 10.025c0 1.79.464 3.47 1.28 4.935L.06 24l9.26-2.46a9.94 9.94 0 002.73.379c5.554 0 10.089-4.495 10.089-10.026 0-2.736-1.093-5.322-3.074-7.24"/>
        </svg>
        <span>Trimite pe WhatsApp</span>
      </a>
      <p class="result-note" style="color: white; font-weight: 800 ;">Prețul este orientativ și poate varia în funcție de disponibilitatea in stoc si de dificultatea suplimentara a reparatiei ce poate surveni din defectiuni constatate de tehnician.</p>
    </div>
  `;
}

function initSimpleCalculator() {
  const brandSelect = document.getElementById('phone-brand');
  const modelSelect = document.getElementById('phone-model');
  const repairSelect = document.getElementById('repair-type');
  const calcBtn = document.getElementById('calculate-price');
  const resultEl = document.getElementById('calculator-result');

  if (!brandSelect || !modelSelect || !repairSelect || !calcBtn || !resultEl) return;

  // Populate model select based on brand
  function populateModels() {
    const brandKey = normalizeBrand(brandSelect.value);
    const models = getModelsForBrand(brandKey);

    modelSelect.innerHTML = '';
    if (!brandKey || models.length === 0) {
      modelSelect.disabled = true;
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'Selectează mai întâi marca';
      modelSelect.appendChild(opt);
      return;
    }

    modelSelect.disabled = false;
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Selectează modelul';
    modelSelect.appendChild(placeholder);

    models.forEach(model => {
      const opt = document.createElement('option');
      opt.value = model;
      opt.textContent = model;
      modelSelect.appendChild(opt);
    });
  }

  // Populate repair types based on model
  function populateRepairs() {
    const brandKey = normalizeBrand(brandSelect.value);
    const model = modelSelect.value;
    const repairs = getRepairsFor(brandKey, model);

    repairSelect.innerHTML = '';
    if (!model || repairs.length === 0) {
      repairSelect.disabled = true;
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'Selectează mai întâi modelul';
      repairSelect.appendChild(opt);
      return;
    }

    repairSelect.disabled = false;
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Selectează tipul reparației';
    repairSelect.appendChild(placeholder);

    repairs.forEach(repair => {
      const opt = document.createElement('option');
      opt.value = repair;
      opt.textContent = repair;
      repairSelect.appendChild(opt);
    });
  }

  brandSelect.addEventListener('change', () => {
    populateModels();
    repairSelect.innerHTML = '<option value="">Selectează mai întâi modelul</option>';
    repairSelect.disabled = true;
    resultEl.innerHTML = `
      <div class="result-placeholder">
        <div class="placeholder-icon">💰</div>
        <h3>Prețul va apărea aici</h3>
        <p>Completează formularul de mai sus pentru a obține o estimare</p>
      </div>
    `;
  });

  modelSelect.addEventListener('change', () => {
    populateRepairs();
    resultEl.innerHTML = `
      <div class="result-placeholder">
        <div class="placeholder-icon">💰</div>
        <h3>Prețul va apărea aici</h3>
        <p>Completează formularul de mai sus pentru a obține o estimare</p>
      </div>
    `;
  });

  calcBtn.addEventListener('click', () => {
    const brandKey = normalizeBrand(brandSelect.value);
    const brandLabel = brandSelect.options[brandSelect.selectedIndex]?.text || '';
    const model = modelSelect.value;
    const repairKey = repairSelect.value;
    const repairLabel = repairSelect.options[repairSelect.selectedIndex]?.text || '';

    if (!brandKey || !model || !repairKey) {
      renderResult(resultEl, null);
      return;
    }

    const breakdown = calculatePrice(brandKey, model, repairKey);
    if (!breakdown) {
      renderResult(resultEl, null);
      return;
    }

    renderResult(resultEl, {
      brandLabel,
      model,
      repairLabel,
      parts: breakdown.parts,
      labour: breakdown.labour,
      total: breakdown.total
    });
  });

  // Initial state
  populateModels();
}

// Initialize calculator after loading CSV data
async function init() {
  await loadPricesFromCSV();
  initSimpleCalculator();
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}