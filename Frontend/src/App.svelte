<script>
import Card from './lib/Card.svelte'

import { io } from 'socket.io-client'
const socket = io('http://localhost:5174')

let state = 'Menu', value = ''

socket.on('update', data => {
  console.log(data)
})

function joinRoom() {
  if(value.length != 4) return

  socket.emit('joinRoom', value, data => {
    console.log(data)

    if(data.ok) {

    }
  })
}

let cards = {}
let turn = 0

socket.on('gameInit', data => {
  state = 'Game'
  cards = data.cards
  turn = data.turn
})

socket.on('leave-room', () => {
  state = 'Menu'
  cards = {}
})

</script>

<main class="w-screen h-screen flex justify-center items-center">

  {#if state == 'Menu'}
  <form on:submit|preventDefault={joinRoom} class="flex flex-col items-center font-mono">
    <input class="bg-transparent border-b border-b-black outline-none text-4xl text-center uppercase" bind:value maxlength="4" />
    {#if value.length == 4}
    <button class="text-2xl">Enter &rsaquo;</button>
    {:else}
    <span class="text-2xl">Room ID</span>
    {/if}
  </form>

  {:else if state == 'Game'}
  <div class="flex flex-col font-mono tracking-widest items-center">

    <span class="py-2">
      TURN: {turn}, 
      {#if Object.keys(cards)[turn % Object.keys(cards).length] == socket.id}
      YOU
      {:else}
      {Object.keys(cards)[turn % Object.keys(cards).length]}
      {/if}
    </span>


    {#each Object.entries(cards) as [player, cards]}

    <span class="py-1">
      {#if player == socket.id}
      YOUR CARDS
      {:else}
      {player}'s CARDS
      {/if}
    </span>

    <div class="flex gap-2">
      {#each cards as card}
      <Card {card} />
      {/each}
    </div>

    {/each}
  </div>


  {/if}
    
</main>