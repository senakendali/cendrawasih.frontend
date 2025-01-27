<template>
  <ClassForm :isEdit="true" :classId="$route.params.id" />
</template>
  
  <script>
  import ClassForm from '@/components/classes/ClassForm.vue';
  
  export default {
    name: "ClassEditPage",
    components: {
      ClassForm,
    },
  };
  </script>
  