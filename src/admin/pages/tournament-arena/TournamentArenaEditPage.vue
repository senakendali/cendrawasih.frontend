<template>
  <ArenaForm :isEdit="true" :classId="$route.params.id" />
</template>
  
  <script>
  import ArenaForm from '@/components/tournament-arena/ArenaForm.vue';
  
  export default {
    name: "TournamentArenaEditPage",
    components: {
      ArenaForm,
    },
  };
  </script>
  