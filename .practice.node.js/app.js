async function populateProducts() {
    const products = document.querySelector('#products');
    if (!products) return;
    products.innerHTML = '';
    const data = [
        { id: 'A1', name: 'Vaccum Cleaner', rrp: '99.99', info: 'the worst vaccum in the world.' },
        { id: 'A2', name: 'Leaf Blower', rrp: '303.33', info: 'This product will blow your socks off.' },
        { id: 'B1', name: 'Chocolate Bar', rrp: '22.40', info: 'Delicious overpriced chocolate.' }
    ];

    for (const product of data) {
        const item = document.createElement('product-item');
        for (const key of ['name', 'rrp', 'info']) {
            const span = document.createElement('span');
            span.slot = key;
            span.textContent = product[key];
            item.appendChild(span);
        }
        products.appendChild(item);
    }
}

const fetchBtn = document.querySelector('#fetch');
if (fetchBtn) {
    fetchBtn.addEventListener('click', async () => {
        await populateProducts();
    });
}

customElements.define('product-item', class Item extends HTMLElement {
    constructor() {
        super();
        const tmpl = document.querySelector('#item');
        if (!tmpl) return;
        const content = tmpl.content.cloneNode(true);
        this.attachShadow({ mode: 'open' }).appendChild(content);
    }
});