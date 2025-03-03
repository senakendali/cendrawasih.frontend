<template>
    <div class="masonry-gallery">
      <div class="masonry-item" v-for="(image, index) in images" :key="index">
        <img :src="image" alt="Gallery Image" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "TournamentList",
    props: {
      images: {
        type: Array,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .masonry-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    padding: 20px;
  }
  
  .masonry-item img {
    width: 100%;
    border-radius: 10px;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .masonry-item img:hover {
    transform: scale(1.05);
  }
  </style>
  