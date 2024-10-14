const apiUrl = 'https://pumpbot-backend.vercel.app/'; // URL do seu back-end

const connectButton = document.getElementById('connect-button');
const walletInfo = document.getElementById('wallet-info');
const walletAddressElem = document.getElementById('wallet-address');
const creditBalance = document.getElementById('credit-balance');

let walletAddress = null;

function isPhantomInstalled() {
    return window.solana && window.solana.isPhantom;
}

async function connectWallet() {
    if (!isPhantomInstalled()) {
        alert('Phantom Wallet não encontrada! Instale a extensão.');
        return;
    }

    try {
        const response = await window.solana.connect();
        walletAddress = response.publicKey.toString();
        await registerOrRetrieveUser(walletAddress);
        updateUI();
    } catch (error) {
        console.error('Erro ao conectar à carteira:', error);
    }
}

async function registerOrRetrieveUser(address) {
    try {
        const response = await fetch(`${apiUrl}users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wallet_address: address }),
        });

        const data = await response.json();
        if (response.ok) {
            creditBalance.textContent = `${data.credits} créditos`;
            walletAddressElem.textContent = address;
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error('Erro ao comunicar com o servidor:', error);
    }
}

function updateUI() {
    if (walletAddress) {
        walletInfo.style.display = 'block';
    } else {
        walletInfo.style.display = 'none';
    }
}

connectButton.onclick = connectWallet;
