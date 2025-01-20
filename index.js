const {Client, LocalAuth, NoAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth({
        dataPath: '.test'
    })
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    qrcode.generate(qr, {small: true});
});

client.on('ready', async () => {
    console.log('Client is ready!');

    const findMe = await findChat("+359 88 486 5090");

    await findMe.sendMessage('!ping');
});

client.on('message_create', async (msg) => {
    if (msg.body === '!ping') {
        await msg.reply('pong');
    }

    if (msg.body === 'кеш' || msg.body === 'Kеш' || msg.body === 'cash') {
        await msg.reply('IJP');
    }

    if (msg.body === 'cena?' || msg.body === 'cena' || msg.body === 'Cena' || msg.body === 'Cenorazpis molq' || msg.body === 'btc') {
        console.log('kk', msg)

        const btcPrice = await fetchCoinPrice('BTCUSDT');
        const ethPrice = await fetchCoinPrice('ETHUSDT');
        const trumpPrice = await fetchCoinPrice('TRUMPUSDT');


        await msg.reply(`
-----------------------------------
*BTC* (Binance)
- Time: *${getBulgarianTime(Date.now())}*
- Price: *${roundPrice(btcPrice['price'])}$*
-----------------------------------
*ETH* (Binance)
- Time: *${getBulgarianTime(Date.now())}*
- Price: *${roundPrice(ethPrice['price'])}$*
-----------------------------------
*ETH* (Binance)
- Time: *${getBulgarianTime(Date.now())}*
- Price: *${roundPrice(trumpPrice['price'])}$*
-----------------------------------
    `.trim())
    }
})
const getBulgarianTime = (date) => {
    return new Date(date).toLocaleString('en-GB', {timezone: 'Europe/Sofia'});
};

const roundPrice = (price) => {
    return Math.round(price * 100) / 100;
}

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.initialize();


const findChat = async (chatName) => {
    const allChats = await client.getChats();
    console.log('allChats', allChats);
    return allChats.find(chat => chat.name === chatName);
}

const fetchCoinPrice = async (coinCouple) => {
    const apiUrl = `https://data-api.binance.vision/api/v3/ticker/price?symbol=${coinCouple}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error.message);
    }
};
