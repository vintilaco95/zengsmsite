// Contact Form Handler cu EmailJS
// Gestionează trimiterea formularului de contact prin EmailJS

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.warn('Formularul de contact nu a fost găsit');
        return;
    }
    
    // Handler pentru submit
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obține valorile din formular
        const formData = {
            nume: document.getElementById('contact_name').value.trim(),
            telefon: document.getElementById('contact_phone').value.trim(),
            email: document.getElementById('contact_email').value.trim(),
            subiect: document.getElementById('contact_subject').value.trim(),
            mesaj: document.getElementById('contact_message').value.trim()
        };
        
        // Validare basic
        if (!formData.nume || !formData.telefon || !formData.email || !formData.mesaj) {
            alert('⚠️ Te rugăm să completezi toate câmpurile obligatorii!');
            return;
        }
        
        // Validare email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('⚠️ Te rugăm să introduci o adresă de email validă!');
            return;
        }
        
        // Validare telefon (minim 10 cifre)
        const phoneRegex = /^[0-9\s\+\-\(\)]{10,}$/;
        if (!phoneRegex.test(formData.telefon)) {
            alert('⚠️ Te rugăm să introduci un număr de telefon valid!');
            return;
        }
        
        // Disable butonul de submit pentru a preveni trimiteri multiple
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Se trimite...</span>';
        
        try {
            // Verifică dacă EmailJS este încărcat
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS SDK nu este încărcat');
            }
            
            // Pregătește parametrii pentru template EmailJS
            const templateParams = {
                nume: formData.nume,
                telefon: formData.telefon,
                email: formData.email,
                subiect: formData.subiect,
                mesaj: formData.mesaj,
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
            // Poți folosi același Service ID ca pentru formularul de vânzare,
            // dar trebuie să creezi un Template nou pentru contact
            await emailjs.send(
                'service_oc9vzjh',        // ← Service ID (același ca pentru vânzare)
                'template_n36su2b',  // ← Template ID NOU pentru contact (vezi mai jos)
                templateParams
            );
            
            // Succes!
            alert('✅ Mulțumim pentru mesajul tău! Te vom contacta în cel mai scurt timp posibil.');
            
            // Reset formular
            contactForm.reset();
            
        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert('⚠️ A apărut o eroare la trimiterea mesajului. Te rugăm să ne suni direct la 0758 060 072 sau să ne trimiți un email la office@zengsm.ro');
        } finally {
            // Re-enable butonul
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
});

