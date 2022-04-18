const TelegramApi = require('node-telegram-bot-api')

const {gameOptions, againOptions} = require('./options')

const token = "5382017738:AAGJnf_HmNmuM8S0sJfzJ_iqBQdNpHebu7s";

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее отгадать.`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}


const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ef5/8e1/ef58e15f-94a2-3d56-a365-ca06e1339d08/2.webp')
            return bot.sendMessage(chatId, `Welcome to my bot!!!`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Your name is: ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId)
        }
        
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `🎉🎉🎉 Congrats you found a number ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `😔😔😔 Unfortunately you missed, bot guessed ${chats[chatId]}`, againOptions)
        }
    })




}

start()