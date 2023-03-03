const { Server } = require('socket.io')
const io = new Server(5174, {
  cors: { origin : 'http://localhost:5173' }
})

let rooms = createRoom(9, 2)
rooms[0].players = ['da', 'daw']


io.on('connection', socket => {

  socket.emit('updateRooms', rooms)

  socket.on('joinRoom', (data, cb) => {
    // if room is full
    if(rooms[data].players.length >= rooms[data].max){
      cb({ er: 'full' })
    }

    // if is in other room
    else if(socket.room) {
      cb({ er: 'in room ' + socket.room })
    }

    else{
      socket.room = data
      rooms[socket.room].players.push(socket.id)
      cb({ ok: 'room ' + socket.room })
    }

    io.emit('updateRooms', rooms)
  })

  socket.on('disconnect', () => {
    if(socket.room) {
      rooms[socket.room].players.splice(rooms[socket.room].players.indexOf(socket.id), 1)
    }

    io.emit('updateRooms', rooms)
  })

  socket.on('getRoom', cb => {
    cb(rooms[socket.room])
    rooms[socket.room].players.forEach(player => {
      io.to(player).emit('updateRoom', rooms[socket.room])
    })
  })

  socket.on('leaveRoom', () => {
    if(socket.room) {
      rooms[socket.room].players.splice(rooms[socket.room].players.indexOf(socket.id), 1)
    
      rooms[socket.room].players.forEach(player => {
        io.to(player).emit('updateRoom', rooms[socket.room])
      })
    }

    io.emit('updateRooms', rooms)
  })
  // let cardPool = createRandomPool()

  // let playerCards = sortCards(cardPool.slice(0, 4))
  // cardPool.splice(0, 4)
  // console.log(playerCards)

  // let opponentCards = cardPool.slice(0, 4)
  // cardPool.splice(0, 4)

  // socket.emit('init', {
  //   'playerCards': playerCards,
  //   'opponentCards': opponentCards.map(i => {
  //     return i.reveal ? i : {...i, 'value': '?', 'id': 0}
  //   })
  // })
})

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

function createRoom(amount, players) {
  return Array(amount).fill().map((i, idx) => ({
    'id': idx,
    'max': players,
    'players': []
  }))
}