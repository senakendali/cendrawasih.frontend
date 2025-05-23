<template>
  <div id="gallery" class="gallery-container">
    <div class="masonry-grid" ref="grid">
      <!-- Sizer menentukan lebar kolom -->
      <div class="masonry-sizer"></div>

      <div
        v-for="tournament in tournaments"
        :key="tournament.id"
        class="masonry-item"
      >
        <router-link
          :to="{ name: 'GalleryDetail', params: { slug: tournament.slug } }"
        >
          <img
            :src="tournament.image"
            class="img-fluid"
            alt="Tournament Image"
          />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import axios from 'axios';
import API from '@/config/api';

export default {
  name: 'TournamentGallery',
  data() {
    return {
      tournaments: []
    };
  },
  mounted() {
    this.getTournaments();
  },
  methods: {
    async getTournaments() {
      try {
        const response = await axios.get(`${API.API_BASE_URL}/tournaments/gallery`);
        this.tournaments = response.data.data;

        this.$nextTick(() => {
          const grid = this.$refs.grid;

          imagesLoaded(grid, () => {
            new Masonry(grid, {
              itemSelector: '.masonry-item',
              columnWidth: 300,
              gutter: 16,
              fitWidth: true
            });
          });
        });
      } catch (error) {
        console.error('Failed to fetch tournaments:', error);
      }
    }
  }
};
</script>

<style scoped>
.masonry-grid {
  margin: 0 auto;
}

/* fixed 3-column layout when space is enough (≥ 900px) */
.masonry-sizer,
.masonry-item {
  width: 300px;
}

.masonry-item {
  margin-bottom: 16px;
  border-left: 5px solid #388E3C;
  transition: border-color 0.3s ease;
}

.masonry-item:hover {
  border-left-color: #D32F2F;
}

.masonry-item img {
  width: 100%;
  height: auto;
  display: block;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

/* Responsive override */
@media (max-width: 992px) {
  .masonry-sizer,
  .masonry-item {
    width: 48%;
  }
}

@media (max-width: 576px) {
  .masonry-sizer,
  .masonry-item {
    width: 100%;
  }
}
</style>