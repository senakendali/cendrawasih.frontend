<template>
  <ClasificationForm :isEdit="true" :clasificationId="$route.params.id" />
</template>
  
  <script>
  import ClasificationForm from '@/components/match-clasification/ClasificationForm.vue';
  
  export default {
    name: "ClasificationEditPage",
    components: {
      ClasificationForm,
    },
  };
  </script>
  