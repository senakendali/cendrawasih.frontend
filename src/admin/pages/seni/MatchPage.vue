<template>
  <MatchBracket :isGenerate="true"  :poolId="$route.params.id" />
  
  
</template>

<script>
  import MatchBracket from '@/components/seni/MatchBracket.vue';
  
  export default {
    name: "MatchPage",
    components: {
      MatchBracket,
    },
  };
  </script>