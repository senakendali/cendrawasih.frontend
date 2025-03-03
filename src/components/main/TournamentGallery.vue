<template>
  <div id="gallery" class="main-container">
    <div class="container">
      <div class="row">
        <div v-for="tournament in tournaments" :key="tournament.id" class="col-md-4 mb-4">
          <div class="gallery-item">
            <div class="gallery-item-content">
              <router-link :to="{ name: 'GalleryDetail', params: { slug: tournament.slug } }">
                <img :src="tournament.image" class="img-fluid" alt="Tournament Image" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
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
        this.tournaments = response.data.data; // Sesuaikan dengan struktur respons API
      } catch (error) {
        console.error('Failed to fetch tournaments:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Gallery Styles */
.gallery-container {
  background-color: #000000; /* Light background for the gallery */
}

.gallery-item {
  position: relative;
  border-left: 5px solid #388E3C;
  height: auto;
}

.gallery-item:hover {
  position: relative;
  border-left: 5px solid #D32F2F;
  transition: all 0.3s ease;
  height: auto;
}

.gallery-item img {
  width: 100%;
 
}

.gallery-item-content {
  color: white;
}

.gallery-item-content h5 {
  font-family: Urbanist, sans-serif;
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.gallery-item-content p {
  font-family: Urbanist, sans-serif;
  font-size: 14px;
  margin-bottom: 20px;
}


@media (max-width: 768px) {
  .gallery-item img {
    height: 100%;
  }
}
</style>