<template>
  <DrawingForm :isEdit="true" :drawingId="$route.params.id" />
</template>
  
  <script>
  import DrawingForm from '@/components/seni/DrawingForm.vue';
  
  export default {
    name: "DrawingEditPage",
    components: {
      DrawingForm,
    },
  };
  </script>
  