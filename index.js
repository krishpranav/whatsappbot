const { create, Client } = require('@open-wa/wa-automate')
const welcome = require('./lib/welcome')
const msgHandler = require('./msgHndlr')
const options = require('./options')


const start = async(client = new Client()) => {
    console.log('[SERVER] Server Started!!!....')
    client.onStateChanged((state) => {
        console.log('[CLIENT STATE]', state)
        if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
    })
}