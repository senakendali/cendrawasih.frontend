<template>
  <DrawingForm :isEdit="true" :drawingId="$route.params.id" />
</template>
  
  <script>
  import DrawingForm from '@/components/drawing/DrawingForm.vue';
  
  export default {
    name: "DrawingEditPage",
    components: {
      DrawingForm,
    },
  };
  </script>
  