<template>
  <CategoryForm :isEdit="true" :classId="$route.params.id" />
</template>
  
  <script>
  import CategoryForm from '@/components/tournament-category/CategoryForm.vue';
  
  export default {
    name: "CategoryEditPage",
    components: {
      CategoryForm,
    },
  };
  </script>
  