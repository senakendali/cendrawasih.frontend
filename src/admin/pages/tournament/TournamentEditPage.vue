<template>
  <TournamentForm :isEdit="true" :contingentId="$route.params.id" />
</template>

<script>
import TournamentForm from "@/components/tournament/TournamentForm.vue";

export default {
  name: "TournamentEditPage",
  components: {
    TournamentForm,
  },
};
</script>
