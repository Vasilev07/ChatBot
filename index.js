const {Client, LocalAuth, NoAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
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


    // await cryptoJit.sendMessage('Hello CryptoJit!');
    // const cryptoJitChatId = cryptoJit.id;
    //
    // console.log("cryptoJit", cryptoJit);
    // console.log("cryptoJitChatId", cryptoJitChatId)
});

client.on('message_create', async (msg) => {
    if (msg.body === '!ping') {
        await msg.reply('pong');
    }

    if (msg.body === 'кеш' || msg.body === 'Kеш' || msg.body === 'cash') {
        await msg.reply('Ivailo Jit Petrov');
    }

    if (msg.body === 'cena?' || msg.body === 'cena' || msg.body === 'Cena' || msg.body === 'btc') {
        console.log('kk', msg)

        const data = await fetchData();

        console.log('DATA', data)

        await msg.reply(`
            BTC PRICE: ${data[0]['price_usd']} $,
            percent_change_24h: ${data[0]['percent_change_24h']} %,
            percent_change_1h: ${data[0]['percent_change_1h']} %,
    `)
    }
});


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

const fetchData = async () => {
    const apiUrlBTC = "https://api.coinlore.net/api/ticker/?id=90";

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