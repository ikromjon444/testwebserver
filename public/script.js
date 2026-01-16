    function setToken(token) { localStorage.setItem('token', token); }
    function getToken() { return localStorage.getItem('token'); }
    function removeToken() { localStorage.removeItem('token'); }
    const coinSound = document.getElementById('coinSound');


    async function register() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const result = document.getElementById('result');

        // 1. Username va password bo'sh emasligini tekshirish
        if (!username || !password) {
            result.innerText = 'Username va password kerak';
            result.style.color = 'red';
            return;
        }

        // 2. Parol 8 ta belgidan kam bo‘lmasligini tekshirish
        if (password.length < 8) {
            result.innerText = 'Parol kamida 8 ta belgidan iborat bo‘lishi kerak';
            result.style.color = 'red';
            return;
        }

        // 3. Parollar mos kelishini tekshirish
        if (password !== confirmPassword) {
            result.innerText = 'Parollar mos emas!';
            result.style.color = 'red';
            return;
        }

        try {
            const res = await fetch('https://uzbsmpback.onrender.com/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();
            result.innerText = data.message;
            result.style.color = data.success ? 'lightgreen' : 'red';

            if (data.success) {
                window.location.href = 'index.html';
            }
        } catch (err) {
            console.error(err);
            result.innerText = 'Server bilan aloqa yo‘q';
            result.style.color = 'red';
        }
    }


    async function login() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const result = document.getElementById('result');

        if (!username || !password) {
            result.innerText = "Username va password kiriting!";
            result.style.color = 'red';
            return;
        }

        try {
            const res = await fetch('https://uzbsmpback.onrender.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!data.success) {
                result.innerText = data.message;
                result.style.color = 'red';
                return;
            }

            // Token saqlash
            setToken(data.token);

            // Foydalanuvchi ma'lumotini olish
            const userRes = await fetch('https://uzbsmpback.onrender.com/me', {
                headers: { 'Authorization': data.token }
            });
            const userData = await userRes.json();

            if (!userData.success) {
                result.innerText = "User ma'lumotini olishda xato!";
                result.style.color = 'red';
                return;
            }

            // Rankga qarab yo‘naltirish
            const rank = userData.user.rank;
            if (rank === 'ADMIN') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'home.html';
            }

        } catch (err) {
            console.error(err);
            result.innerText = "Server bilan bog‘lanishda xato!";
            result.style.color = 'red';
        }
    }

    function loadUser() {
        const token = getToken();
        if (!token) return window.location.href = 'index.html';

        fetch('https://mcback.onrender.com/me', {
            headers: { 'Authorization': token }
        })
            .then(res => res.json())
            .then(data => {
                if (!data.success) return logout();

                document.querySelectorAll('.username').forEach(el => {
                    el.innerText = data.user.username;
                });


                const coinsEl = document.getElementById('coins');
                if (coinsEl) {
                    coinsEl.innerText = formatCoins(data.user.coins);
                }
                const coinsEl2 = document.getElementById('coins2');
                if (coinsEl2) {
                    coinsEl2.innerText = formatCoins(data.user.coins);
                }
            });
    }




    const SHOP_ITEMS = [
        { id: 1, name: 'Totem', price: 1500, image: 'totem.webp' },
        { id: 2, name: 'Enchanted Golden Apple', price: 2500, image: 'egoldenapple.gif' },
        { id: 3, name: 'Mace', price: 20000, image: 'mace.png' },
        { id: 4, name: 'Elytra', price: 10000, image: 'elytra.webp' },
        { id: 5, name: 'Villager Spawn Egg', price: 10000, image: 'villageregg.png' },
        { id: 6, name: 'Wind Charge (64)', price: 1500, image: 'windcharge.webp' },
        { id: 7, name: 'End Crystal', price: 1500, image: 'endcrystal.webp' },
        { id: 8, name: 'Respawn Anchor', price: 1000, image: 'respawnanchor.png' },
        { id: 9, name: 'Trident', price: 5000, image: 'tridient.webp' },
        { id: 10, name: 'Nether Star', price: 3000, image: 'netherstar.gif' },
        { id: 11, name: 'bottle o\' enchanting (64)', price: 4000, image: 'ebottle.gif' },
        { id: 12, name: 'Smithing Template', price: 5000, image: 'smithing.webp' }
    ];

    function formatCoins(amount) {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1).replace(/\.0$/, '') + "M"; // million
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(1).replace(/\.0$/, '') + "k"; // ming
        } else {
            return amount; // 1000 dan kichik
        }
    }

    function renderShop(items = SHOP_ITEMS) {
        const container = document.getElementById('shop-items');
        const result = document.getElementById('result');

        container.innerHTML = '';

        if (items.length === 0) {
            result.innerText = 'Topilmadi';
            result.style.display = 'block';
            return;
        } else {
            result.style.display = 'none';
        }

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${formatCoins(item.price)} coins</p>
            `;
            card.onclick = () => buyItemCard(item.id);
            container.appendChild(card);
        });
    }


    function buyItemCard(itemId) {
        window.location.href = `item.html?id=${itemId}`;
    }

    function logout() { removeToken(); window.location.href = 'index.html'; }

    const page = window.location.pathname;

    if (page.endsWith('shop.html')) {
        loadUser();
        renderShop();
    }

    if (page.endsWith('games.html')) {
        loadUser();
        initGameButtons();
    }

    if (page.endsWith('coin_purchase.html')) {
        loadUser();
        renderShop();
    }
    if (page.endsWith('rank.html')) {
        loadUser();
        renderShop();
    }
    if (page.endsWith('home.html')) {
        loadUser();
        renderShop();
    }
    if (page.endsWith('item.html')) {
        loadUser();
    }



    function initGameButtons() {
        const playBtn = document.getElementById('play-game-btn');
        const pauseBtn = document.getElementById('pause-game-btn');

        playBtn.onclick = () => {
            playBtn.disabled = true;
            pauseBtn.disabled = false;
            startGame();
        };

        pauseBtn.onclick = () => {
            isPaused = !isPaused;
            pauseBtn.innerText = isPaused ? 'Resume' : 'Pause';
        };
    }


    let gameInterval = null;
    let gameTimeout = null;
    let coinsCaught = 0;
    let isPaused = false;

    // Coin turlari
    // Coin turlari va tushish ehtimollari
    const coinTypes = [
        { class: 'gold', value: 4, chance: 0.05 },   // 5%
        { class: 'silver', value: 2, chance: 0.30 }, // 40%
        { class: 'bronze', value: 1, chance: 0.70 }  // 75%
    ];

    // Tasodifiy coin turini ehtimolga asoslangan tanlash
    function getRandomCoinType() {
        const rand = Math.random(); // 0 dan 1 gacha
        let sum = 0;
        for (let coin of coinTypes) {
            sum += coin.chance;
            if (rand <= sum) return coin;
        }
        return coinTypes[coinTypes.length - 1]; // xavfsizlik uchun
    }

    // createCoin funksiyasida coinType ni shunday olamiz:
    const coinType = getRandomCoinType();

    // Tugmalar
    const playBtn = document.getElementById('play-game-btn');
    const pauseBtn = document.getElementById('pause-game-btn');

    // O'yin boshlash
    playBtn.onclick = function () {
        playBtn.disabled = true;
        pauseBtn.disabled = false;
        startGame();
    };

    // Pauza/Resume
    pauseBtn.onclick = function () {
        isPaused = !isPaused;
        pauseBtn.innerText = isPaused ? 'Resume' : 'Pause';
    };

    // O'yin funksiyasi
function startGame() {
    const gameArea = document.getElementById('game-area');
    const basket = document.getElementById('basket');
    const result = document.getElementById('game-result');
    const coinDisplay = document.getElementById('game-coins');

    // Avvalgi interval va timeoutlarni tozalash
    if (gameInterval) clearInterval(gameInterval);
    if (gameTimeout) clearTimeout(gameTimeout);

    coinsCaught = 0;
    isPaused = false;
    coinDisplay.innerText = `Yig‘ilgan coin: ${coinsCaught}`;
    result.innerText = '';
    gameArea.innerHTML = '';
    gameArea.appendChild(basket);

    const token = getToken();
    if (!token) return window.location.href = 'index.html';

    // Basketni harakatlantirish funksiyasi
    const moveBasket = (x) => {
        const rect = gameArea.getBoundingClientRect();
        const basketWidth = basket.offsetWidth;
        x = x - basketWidth / 2;

        if (x < 0) x = 0;
        if (x > rect.width - basketWidth) x = rect.width - basketWidth;

        basket.style.left = x + 'px';
    };

    // Desktop uchun mousemove
    gameArea.onmousemove = (e) => {
        if (isPaused) return;
        const rect = gameArea.getBoundingClientRect();
        moveBasket(e.clientX - rect.left);
    };

    // Mobil uchun touchmove
    gameArea.addEventListener('touchmove', (e) => {
        if (isPaused) return;
        const rect = gameArea.getBoundingClientRect();
        const touch = e.touches[0];
        moveBasket(touch.clientX - rect.left);
        e.preventDefault(); // scrollni oldini oladi
    }, { passive: false });

    // Coin tushish intervali
    gameInterval = setInterval(() => {
        if (isPaused) return;
        createCoin(gameArea, basket, coinDisplay);
    }, 600);

    // O'yin 20 soniya
    gameTimeout = setTimeout(async () => {
        endGame(gameArea, result, token, coinDisplay);
    }, 20000);
}

    // Coin yaratish va collision
    function createCoin(gameArea, basket, coinDisplay) {
        // Coin turlari va ularning rasm manzillari
        const coinImages = {
            gold: 'netherite.png',
            silver: 'diamond.png',
            bronze: 'iron.png'
        };

        // Tasodifiy coin turini tanlash
        const coinType = coinTypes[Math.floor(Math.random() * coinTypes.length)];

        // Coin elementi yaratish
        const coin = document.createElement('div');
        coin.className = `coin ${coinType.class}`;
        coin.dataset.value = coinType.value;
        coin.style.left = Math.random() * (gameArea.offsetWidth - 35) + 'px';
        coin.style.width = '35px';
        coin.style.height = '35px';
        coin.style.position = 'absolute';

        // Rasmni qo'shish
        coin.style.backgroundImage = `url("${coinImages[coinType.class]}")`;
        coin.style.backgroundSize = 'cover';
        coin.style.backgroundRepeat = 'no-repeat';
        coin.style.backgroundPosition = 'center';

        gameArea.appendChild(coin);

        // Coin tushish va collision
        let top = 0;
        const fallInterval = setInterval(() => {
            if (isPaused) return;
            top += 3;
            coin.style.top = top + 'px';

            const coinRect = coin.getBoundingClientRect();
            const basketRect = basket.getBoundingClientRect();

    if (!(coinRect.right < basketRect.left || coinRect.left > basketRect.right || coinRect.bottom < basketRect.top || coinRect.top > basketRect.bottom)) {
        coinsCaught += parseInt(coin.dataset.value);

        // Coin qiymatini ko‘rsatish
        const coinVal = document.createElement('div');
        coinVal.className = 'coin-value';
        coinVal.innerText = `+${coin.dataset.value}`;
        coinVal.style.left = coin.offsetLeft + 'px';
        coinVal.style.top = coin.offsetTop + 'px';
        gameArea.appendChild(coinVal);

        setTimeout(() => coinVal.remove(), 1000);
        coin.remove();
        clearInterval(fallInterval);
        coinDisplay.innerText = `Yig‘ilgan coin: ${coinsCaught}`;

        // Bu yerga qo‘shamiz:
        if (coinSound) {
            coinSound.currentTime = 0; // agar audio oldin o‘ynayotgan bo‘lsa, qayta boshlash
            coinSound.play();
        }
    }

            if (top > gameArea.offsetHeight) {
                coin.remove();
                clearInterval(fallInterval);
            }
        }, 20);
    }


    // O'yin tugatish
    async function endGame(gameArea, result, token, coinDisplay) {
        clearInterval(gameInterval);
        clearTimeout(gameTimeout);
        gameInterval = null;
        gameTimeout = null;

        // Serverga yuborish
        await fetch('https://uzbsmpback.onrender.com/play-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': token },
            body: JSON.stringify({ coinsEarned: coinsCaught })
        });

        result.innerText = `O‘yin tugadi! Siz ${coinsCaught} coin yutdingiz!`;
        coinsCaught = 0;
        coinDisplay.innerText = `Yig‘ilgan coin: ${coinsCaught}`;

        // Basketni saqlab, gameArea ni tozalash
        const basket = document.getElementById('basket');
        gameArea.innerHTML = '';
        gameArea.appendChild(basket);

        // Basketning onmousemove eventini qayta o‘rnatish
        gameArea.onmousemove = (e) => {
            if (isPaused) return;
            const rect = gameArea.getBoundingClientRect();
            let x = e.clientX - rect.left - basket.offsetWidth / 2;

            // Chegaralarni aniqlash
            if (x < 0) x = 0;
            if (x > gameArea.clientWidth - basket.offsetWidth) x = gameArea.clientWidth - basket.offsetWidth;

            basket.style.left = x + 'px';
        };


        playBtn.disabled = false;
        pauseBtn.disabled = true;
        pauseBtn.innerText = 'Pause';
        isPaused = false;
    }
    async function buyVipRank() {
        const token = getToken();
        if (!token) {
            showToast('Avval login qiling', 'error');
            return;
        }

        try {
            const res = await fetch('https://uzbsmpback.onrender.com/vip', {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                showToast(data.message || 'Xatolik yuz berdi', 'error');
                return;
            }

            showToast(data.message, 'success');
            loadUser(); // coin va rank yangilanadi

        } catch (err) {
            console.error(err);
            showToast('Server bilan aloqa yo‘q', 'error');
        }
    }
    function loadBanner() {
    fetch('/uploads/banner.png', { method: 'HEAD' })
        .then(res => {
        if (res.ok) document.querySelector('.banner-img').src = '/uploads/banner.png';
        })
        .catch(err => console.error('Banner topilmadi', err));
    }

    loadBanner();

    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3500);
    }
