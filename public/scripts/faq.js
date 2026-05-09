// FAQ: nu depinde doar de DOMContentLoaded (script poate rula după eveniment sau la navigare tip SPA).

function initFaq() {
    const catBtns = document.querySelectorAll('.faq-cat-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    if (catBtns.length === 0 || faqItems.length === 0) return;

    catBtns.forEach((btn) => {
        btn.addEventListener('click', function () {
            const category = this.getAttribute('data-cat');

            catBtns.forEach((b) => b.classList.remove('active'));
            this.classList.add('active');

            faqItems.forEach((item) => {
                const itemCat = item.getAttribute('data-category');
                if (category === 'general' || itemCat === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach((question) => {
        question.addEventListener('click', function () {
            const item = this.parentElement;
            const isActive = item.classList.contains('active');

            faqItems.forEach((i) => i.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaq);
} else {
    queueMicrotask(initFaq);
}
