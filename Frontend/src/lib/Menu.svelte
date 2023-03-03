<script>
  export let socket, screen

  let rooms = []

  socket.on('updateRooms', data => {
    rooms = data
  })

  function joinRoom(room) {
    socket.emit('joinRoom', room, res => {
      if(res.er) {
        console.log(res)
      }

      if(res.ok) {
        console.log(res)
        screen = 'Game'
      }
    })
  }

</script>

<main class="h-screen flex flex-col justify-center items-center">
  {#each rooms as room}
  <div class="flex items-center w-60 text-xl py-1 border-b-1 border-black font-mono">
    <span class="mr-auto">Room {room.id}</span>
    <span class="mx-2"><sup>{room.players.length}</sup>&frasl<sub>{room.max}</sub></span>
    {#if room.players.length < room.max}
    <button class="w-7 text-center" on:click={() => {joinRoom(room.id)}}>&plus;</button>
    {:else}
    <span class="w-7 text-center"></span>
    {/if}
  </div>
  {/each}
</main>