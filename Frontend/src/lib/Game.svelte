<script>
export let socket, screen

import Card from './Card.svelte'

const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

let playerCards = []
let opponentCards = []

let room
socket.emit('getRoom', res => {
  room = res
})

socket.on('joinRoom', data => {
  room = data
})

function leaveRoom() {
  socket.emit('leaveRoom')
}

// socket.on('init', data => {
//   playerCards = data.playerCards
//   opponentCards = data.opponentCards
// })



</script>

<main class="h-screen flex flex-col justify-center items-center">
  {#if room}
  <div class="flex flex-col w-60 text-xl font-mono py-1">
    <div class="border-b-1 border-black w-full flex justify-between">
      <button class="w-7 text-center" on:click={leaveRoom}>&#8629;</button>
      <span class="mr-auto">Room {room.id}</span>
      <span class="mx-2"><sup>{room.players.length}</sup>&frasl<sub>{room.max}</sub></span>
    </div>
    {#each room.players as player}
    <span>{player}</span>
    {/each}
    {#each Array(room.max - room.players.length) as empty}
    <span>...</span>
    {/each}
  </div>
  {/if}
</main>

<!-- 
<main class="h-screen flex justify-center items-center">
  <div class="flex flex-col font-mono tracking-widest items-center">
    <span class="py-1">OPPONENT CARDS</span>
    <div class="flex gap-2">
      {#each opponentCards as card}
      <Card {card} />
      {/each}    
    </div>

    <span class="py-1 mt-8"></span>
    <div class="flex">
      {#each values as value}
      <div class="m-1 w-8 h-8 bg-blue-100 rounded flex justify-center items-center hover:bg-blue-300 transition duration-200 cursor-pointer">
        {value}
      </div>
      {/each}
    </div>

    <span class="py-1 mt-8">YOUR CARDS</span>
    <div class="flex gap-2">
      {#each playerCards as card}
      <Card {card} />
      {/each}    
    </div>
  </div>
</main> -->