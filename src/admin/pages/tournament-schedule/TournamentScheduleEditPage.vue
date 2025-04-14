<template>
  <TournamentScheduleForm :isEdit="true" :classId="$route.params.id" />
</template>
  
<script>
  import TournamentScheduleForm from '@/components/tournament-schedule/TournamentScheduleForm.vue';
  
  export default {
    name: "TournamentScheduleEditPage",
    components: {
      TournamentScheduleForm,
    },
  };
</script>
  