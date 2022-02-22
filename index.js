
const { builtinModules } = require('module')
const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againGameOptions} = require('./options')

const token = '5123507465:AAFMzcSGa3xI37RqN8EGvRkiVwubvXT_CFg'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю число от 0 до 9, а ты попробуешь ее угадать`)
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Попробуй угадать', gameOptions)
}

const start = () => {
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
        const name = msg.from.first_name
    
        bot.setMyCommands([
            {command: '/start', description: 'Начальное приветствие.'},
            {command: '/info', description: 'Информация о пользователе.'},
            {command: '/game', description: 'Сыграем в игру?'}
        ])
    
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ef5/8e1/ef58e15f-94a2-3d56-a365-ca06e1339d08/5.webp')
            return bot.sendMessage(chatId, `${name}, Добро пожаловать в телеграм бот Yuldash94`)
        } else if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name} `)
        } else if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId,`Я тебя не понимаю, но мы работаем над этим!`) 
    
    })

    bot.on('callback_query', msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again'){
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал число ${chats[chatId]}`, againGameOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал число ${chats[chatId]}`, againGameOptions)
        }
    })
}

start()