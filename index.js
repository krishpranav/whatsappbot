const { create, Client } = require('@open-wa/wa-automate')
const welcome = require('./lib/welcome')
const msgHandler = require('./msgHndlr')
const options = require('./options')


const start = async (client = new Client()) => {
    console.log('[SERVER] Server Started!')
    
    client.onStateChanged((state) => {
        console.log('[Client State]', state)
        if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
    })
    client.onMessage((async (message) => {
        client.getAmountOfLoadedMessages()
        .then((msg) => {
            if (msg >= 3000) {
                client.cutMsgCache()
            }
        })
        msgHandler(client, message)
    }))

    client.onGlobalParicipantsChanged((async (heuh) => {
        await welcome(client, heuh)
        //left(client, heuh)
        }))
    
    client.onAddedToGroup(((chat) => {
        let totalMem = chat.groupMetadata.participants.length
        if (totalMem < 30) { 
            client.sendText(chat.id, `Added to group ${totalMem}`).then(() => client.leaveGroup(chat.id)).then(() => client.deleteChat(chat.id))
        } else {
            client.sendText(chat.groupMetadata.id, `Hello Group *${chat.contact.name}* for more bot function type *!help*`)
        }
    }))


    client.onIncomingCall(( async (call) => {
        await client.sendText(call.peerJid, 'Some one is calling')
        .then(() => client.contactBlock(call.peerJid))
    }))
}
