// FAQ Accordion and Filtering
document.addEventListener('DOMContentLoaded', function() {
    // Category filtering
    const catBtns = document.querySelectorAll('.faq-cat-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    
    catBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-cat');
            
            catBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            faqItems.forEach(item => {
                const itemCat = item.getAttribute('data-category');
                if (category === 'general' || itemCat === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const item = this.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});

