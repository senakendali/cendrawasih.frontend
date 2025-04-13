<template>
  <ContactPersonForm :isEdit="true" :classId="$route.params.id" />
</template>
  
  <script>
  import ContactPersonForm from '@/components/tournament-contact-person/ContactPersonForm.vue';
  export default {
    name: "ContactPersonEditPage",
    components: {
      ContactPersonForm,
    },
  };
  </script>
  