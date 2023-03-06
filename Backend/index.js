const { Server } = require('socket.io')
const io = new Server(5174, {
  cors: { origin : 'http://localhost:5173' }
})

const maxPlayerCount = 2

let games = {}

io.on('connection', socket => {

  socket.on('joinRoom', ({ room, name }, cb) => {
    room = room.toUpperCase()

    if(room.length != 4) {
      cb({ er: 'invalid id' })
    }

    else if(name.length < 1) {
      cb({ er: 'no name' })
    }

    else if(io.sockets.adapter.rooms.get(room) && io.sockets.adapter.rooms.get(room).has(socket.id)) {
      cb({ er: 'already in room' })
    }

    else if(io.sockets.adapter.rooms.get(room) && io.sockets.adapter.rooms.get(room).size >= maxPlayerCount) {
      cb({ er: 'room full' })
    }

    else{
      socket.join(room)
      socket.name = name
      cb({ ok: 'joined #' + room })

      // game start
      if(io.sockets.adapter.rooms.get(room).size >= maxPlayerCount) {
        gameInit(room)
      }
    }
  })

  socket.on('disconnect', () => {

  })
})

io.sockets.adapter.on('join-room', (room, id) => {
  if(room != id) {
    io.to(room).emit('update', [...io.sockets.adapter.rooms.get(room)])
    console.log(`[${room}][+][${id}]`)
  }
})

io.sockets.adapter.on('leave-room', (room, id) => {
  if(room != id) {
    io.to(room).emit('update', [...io.sockets.adapter.rooms.get(room)])
    console.log(`[${room}][-][${id}]`)

    io.to(room).emit('leave-room')

    io.sockets.adapter.rooms.delete(room)
    delete games[room]
  }
})







function gameInit(room) {
  // create pool of cards
  games[room] = {
    'turn': 0,
    'pool': createRandomPool()
  }

  // assign cards to players
  for(const playerID of io.sockets.adapter.rooms.get(room)) {
    games[room][playerID] = {
      'name': io.sockets.sockets.get(playerID).name,
      'hand': sortCards(games[room].pool.splice(0, 4))
    }
  }

  // create player viewpoints
  for(const playerID of io.sockets.adapter.rooms.get(room)) {
    let playerView = {}

    for(const opponentID of io.sockets.adapter.rooms.get(room)) {
      let name = io.sockets.sockets.get(opponentID).name

      if(opponentID == playerID) {
        playerView[name] = games[room][playerID].hand
      }

      else {
        playerView[name] = games[room][opponentID].hand.map(card => {
          return card.reveal ? card : {...card, 'value': '?', 'id': 0}
        })
      }
    }

    io.to(playerID).emit('gameInit', { 'turn': games[room].turn, 'cards': playerView })
  }
}

function sortCards(cards) {
  return cards.sort((a, b) => (a.id > b.id ? 1 : -1))
}

function createRandomPool() {
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const colors = ['B', 'R']

  let newDeck = [], id = 0
  for(let i = 0; i < values.length; i++){
    for(let j = 0; j < colors.length; j++){
      newDeck.push({
        'id': ++id,
        'color': colors[j],
        'value': values[i],
        'reveal': false,
      })
    }
  }

  for(let i = newDeck.length - 1; i > 0; i--){
    let j = (Math.random() * (i + 1)) | 0
    let t = newDeck[i]
    newDeck[i] = newDeck[j]
    newDeck[j] = t
  }

  return newDeck
}