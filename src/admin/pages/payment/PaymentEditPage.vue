<template>
    <PaymentForm :isEdit="true" :paymentId="$route.params.id" />
  </template>
  
  <script>
  import PaymentForm from '@/components/payment/PaymentForm.vue';
  
  export default {
    name: "PaymentEditPage",
    components: {
      PaymentForm,
    },
  };
  </script>
  