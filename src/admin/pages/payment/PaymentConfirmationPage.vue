<template>
  <PaymentConfirmationForm :isConfirm="true" :paymentId="$route.params.id" />
</template>
  
  <script>
  import PaymentConfirmationForm from '@/components/payment/PaymentConfirmationForm.vue';
  
  export default {
    name: "PaymentConfirmationPage",
    components: {
      PaymentConfirmationForm,
    },
  };
  </script>
  