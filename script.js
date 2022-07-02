let cart = [];
let qnt = 1;
let modalKey = 0;

const el = (El) => document.querySelector(El);
const elAll = (El) => document.querySelectorAll(El);

pizzaJson.map((item, index) => {
    let pizzaItem = el('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        qnt = 1;
        modalKey = key;

        el('.pizzaBig img').src = pizzaJson[key].img;
        el('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        el('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        el('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        el('.pizzaInfo--size.selected').classList.remove('selected');
        elAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        el('.pizzaInfo--qt').innerHTML = qnt;

        el('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            el('.pizzaWindowArea').style.opacity = 1;
        }, 100);

    });

    el('.pizza-area').append(pizzaItem);
});

const closeModal = () => {
    el('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        el('.pizzaWindowArea').style.display = 'none';
    }, 200);
}

elAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

el('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (qnt > 1) {
        qnt--;
        el('.pizzaInfo--qt').innerHTML = qnt;
    }
});

el('.pizzaInfo--qtmais').addEventListener('click', () => {
    qnt++;
    el('.pizzaInfo--qt').innerHTML = qnt;
});

elAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        el('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

el('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(el('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id + '@' + size;
    let key = cart.findIndex((item) => item.identifier == identifier);

    if (key > -1) {
        cart[key].qnt += qnt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qnt
        });
    }

    closeModal();
    updateCart();
})

el('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        el('aside').style.left = 0;
    }
});

el('.menu-closer').addEventListener('click', () => {
    el('aside').style.left = '100vw';
});

const updateCart = () => {
    el('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        el('aside').classList.add('show');
        el('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for (const i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qnt;
            let cartItem = el('.models .cart--item').cloneNode(true);
            let pizzaSizeName;

            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P'
                    break;
                case 1:
                    pizzaSizeName = 'M'
                    break;
                case 2:
                    pizzaSizeName = 'G'
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qnt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qnt > 1) {
                    cart[i].qnt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qnt++;
                updateCart();
            });

            el('.cart').append(cartItem);
        }

        desconto = subtotal * 0; // desconto
        total = subtotal - desconto;

        el('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        el('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        el('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    }
    else {
        el('aside').classList.remove('show')
        el('aside').style.left = '100vw';
    }
}