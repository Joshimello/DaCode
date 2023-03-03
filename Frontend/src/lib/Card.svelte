<script>
  export let card
</script>

<div
  class="w-15 h-21 rounded-lg font-mono text-2xl border-3 flex justify-center items-center hover:border-5 transition-all duration-100 cursor-pointer"
  class:border-red-500={card.color == 'R'}
  class:border-dark-500={card.color == 'B'}
  class:text-red-500={card.color == 'R'}
  class:text-dark-500={card.color == 'B'}
>
  {card.value}
</div>