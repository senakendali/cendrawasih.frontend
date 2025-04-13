<template>
  <ActivityForm :isEdit="true" :classId="$route.params.id" />
</template>
  
  <script>
  import ActivityForm from '@/components/tournament-activity/ActivityForm.vue';
  
  export default {
    name: "ActivityEditPage",
    components: {
      ActivityForm,
    },
  };
  </script>
  