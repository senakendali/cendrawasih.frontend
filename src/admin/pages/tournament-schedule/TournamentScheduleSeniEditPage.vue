<template>
  <TournamentScheduleSeniForm :isEdit="true" :classId="$route.params.id" />
</template>
  
<script>
  import TournamentScheduleSeniForm from '@/components/tournament-schedule/TournamentScheduleSeniForm.vue';
  
  export default {
    name: "TournamentScheduleSeniEditPage",
    components: {
      TournamentScheduleSeniForm,
    },
  };
</script>
  