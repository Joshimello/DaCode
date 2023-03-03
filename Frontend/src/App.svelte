<script>
import { io } from 'socket.io-client'
const socket = io('http://localhost:5174')

import Menu from './lib/Menu.svelte'
import Game from './lib/Game.svelte'

let screens = {
  'Menu': Menu,
  'Game': Game
}

let screen = 'Menu'
$: screen, console.log('screen: ' + screen)

</script>

<main>
  <svelte:component this={screens[screen]} {socket} bind:screen />  
</main>