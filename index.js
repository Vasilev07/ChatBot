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

    if (msg.body === 'cena?' || msg.body === 'cena' || msg.body === 'Cena' || msg.body === 'btc') {
        console.log('kk', msg)

        const btcData = await fetchBTCForMarkets('btc');

        const binanceBTCData = btcData.find((data) => {
            return data.name === 'Binance'
        });

        const ethData = await fetchETHForMarkets('eth');

        const binanceETHData = ethData.find((data) => {
            return data.name === 'Binance'
        });

        console.log('DATA', binanceBTCData)

        await msg.reply(`
            -----------------------------------
            base: [${binanceBTCData['base']}]
            source: [${binanceBTCData['name']}]
            time: [${getBulgarianTime(binanceBTCData['time'])}]
            price: ${binanceBTCData['price_usd']}$
            -----------------------------------
            base: [${binanceETHData['base']}]
            source: [${binanceETHData['name']}]
            time: [${getBulgarianTime(binanceETHData['time'])}]
            price: ${binanceETHData['price_usd']}$
            -----------------------------------
    `)
    }
})
const getBulgarianTime = (time) => {
    new Date(time * 1000).toLocaleString('en-GB', { timezone: 'Europe/Sofia' });
};

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

const fetchBTCForMarkets = async (coin) => {
    const schema = {
        btc: {
            id: "90"
        },
        eth: {
            id: "80"
        }
    }

    if (!schema[coin].id) {
        throw new Error('Invalid coin');
    }

    const apiUrlBTC = `https://api.coinlore.net/api/coin/markets/?id=${schema[coin].id}`;

    try {
        const response = await fetch(apiUrlBTC);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error.message);
    }
};
