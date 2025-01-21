<template>
  <div>
    <!-- Loader -->
    <div v-if="isLoading" class="loading-bar"></div>

    <!-- Main Banner Section -->
    <div class="image-container w-100 h-100">
      <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
        <!-- Pagination -->
        <div class="carousel-indicators">
          <button
            v-for="(image, index) in images"
            :key="index"
            :data-bs-target="'#carouselExampleIndicators'"
            :data-bs-slide-to="index"
            :class="{ active: index === 0 }"
            aria-current="true"
            :aria-label="'Slide ' + (index + 1)"
          ></button>
        </div>

        <!-- Slides -->
        <div class="carousel-inner">
          <div
            class="carousel-item"
            v-for="(image, index) in images"
            :key="index"
            :class="{ active: index === 0 }"
          >
            <img :src="image" class="d-block w-100" alt="Event Image" />
          </div>
        </div>

        <!-- Navigation -->
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>

      <div v-if="!isLoading" :class="['caption-overlay', isScrolled ? 'scrolled' : '']">
        <div class="caption-content">
          <h1 class="caption-title">Cenderawasih Juara Manajemen</h1>
          <p class="caption-description">
            We are a premier sports event promoter dedicated to delivering exceptional experiences for fans and participants alike.
          </p>
          <div class="d-flex gap-2 justify-content-center">
            <button @click="scrollToEventSection" class="btn btn-primary">Join Our Current Events</button>
          </div>
        </div>
      </div>
    </div>
    
    <div id="event-image-section" class="event-image">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <img src="@/assets/images/main/banner/bogor-ps.png" alt="Logo" class="img-fluid w-100 h-100" />
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <div v-if="!isLoading" class="event-caption">
              <div class="caption-content">
                <h1 class="caption-title">{{ tournamentName }}</h1>
                <p class="caption-description">
                  {{ tournamentDescription }}
                </p>
                <div class="d-flex gap-2 justify-content-center">
                  <router-link
                    v-if="slug"
                    :to="{ name: 'registration', params: { slug: slug } }"
                    class="btn btn-primary"
                  >
                  Daftar
                </router-link>
                  <button @click="downloadDocument(document)" class="btn btn-primary">Download</button>
                </div>
              </div>
          </div>
          </div>
        </div>
      </div>
    </div>

    <TournamentInfo
      :tournament="{
        location: tournamentLocation,
        event_date: tournamentDate,
        matchCategories: matchCategories,
        ageCategories: ageCategories
      }"
    />

    <!-- Our Activity Section -->
    <OurActivity :activities="activities"/>
  </div>
</template>

<script>
import TournamentInfo from '@/components/main/TournamentInfo.vue';
import OurActivity from '@/components/main/OurActivity.vue';
import axios from 'axios';
import API from '@/config/api';


export default {
  name: 'HomePage',
  components: {
    TournamentInfo,
    OurActivity
  },
  data() {
    return {
      images: [
        require('@/assets/images/main/banner/1.png'),
        require('@/assets/images/main/banner/2.png'),
        require('@/assets/images/main/banner/3.png'),
        require('@/assets/images/main/banner/4.png'),
        require('@/assets/images/main/banner/5.png')
      ],
      isMobile: false,
      isScrolled: false,
      isLoading: false,
      tournamentId: null,
      tournamentName: '',
      slug: '',
      tournamentDescription: '',
      tournamentDate: '',
      tournamentLocation: '',
      dateStart: '',
      dateEnd: '',
      document: '',
      matchCategories: [],
      ageCategories: [],
      activities: [],
    };
  },
  created() {
    this.fetchTournamentDetail();
  },
  mounted() {
    this.checkIfMobile();
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    scrollToEventSection() {
      const section = document.getElementById('event-image-section');
      section.scrollIntoView({ behavior: 'smooth' });
    },
    checkIfMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 100;
    },
    async fetchTournamentDetail() {
      this.isLoading = true;
      try {
        const response = await axios.get(`${API.API_BASE_URL}/tournaments/highlight`);
        if (response.data) {
          this.tournamentId = response.data.id || '';
          this.tournamentName = response.data.name || '';
          this.slug = response.data.slug || '';
          this.tournamentDescription = response.data.description || '';
          this.tournamentDate = response.data.event_date || '';
          this.tournamentLocation = response.data.location || '';
          this.dateStart = response.data.start_date || '';
          this.dateEnd = response.data.end_date || '';
          this.matchCategories = response.data.categories || [];
          this.ageCategories = response.data.age_categories || [];
          this.document = response.data.document || '';
          this.activities = response.data.activities || [];
        }
      } catch (error) {
        this.toast.error("Error fetching tournament details.");
      } finally {
        this.isLoading = false;
      }
    },
    async downloadDocument(filename) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `${API.API_BASE_URL}/download-document/${filename}`,
          { responseType: 'blob' }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error('Error downloading the document:', error);
        alert('Failed to download the document. Please try again later.');
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>

.event-image{
  background-color: #000000;
  height: auto;
}

.event-image img{
  border-top: 5px solid #D32F2F;;
}

/* Loading Bar Style */
.loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #D32F2F; /* Red color for the loader */
  z-index: 9999; /* Ensure the loader stays on top */
  animation: loading 1s infinite linear; /* Animation for the loader */
}

/* Define animation for the loading bar */
@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Container to hold the image and caption */
.image-container {
  background-color: #000000;
  position: relative;
  width: 100%;
  height: 100vh; /* Make the container take full viewport height */
}

.carousel-inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensure the image covers the full container */
}

.event-caption{
  
  background-color: #000000; 
  padding: 20px 30px;
  width: 100%; /* Full width */
  box-sizing: border-box; /* To include padding in the width */
}

.caption-overlay {
  position: fixed; /* Start with the caption fixed */
  bottom: 0; /* Fix the caption to the bottom of the container */
  left: 50%; /* Center the caption horizontally */
  transform: translateX(-50%); /* Adjust horizontal position */
  background-color: rgba(0, 0, 0, 0.8); /* Semi-transparent black background */
  padding: 20px 30px;
  width: 100%; /* Full width */
  box-sizing: border-box; /* To include padding in the width */
  transition: all 0.3s ease; /* Smooth transition */
}

.caption-overlay.scrolled {
    position: static;
    bottom: 0;
    transform: none;
    background: #000;
}

.caption-content {
  text-align: center;
}

.caption-title {
  font-family: "Urbanist", sans-serif;
  color: white;
  font-size: 2.5rem; /* Adjust font size */
  margin-bottom: 10px;
}

.caption-description {
  color: white;
  font-size: 1.2rem; /* Adjust font size */
  margin-bottom: 20px;
  font-family: "Urbanist", sans-serif;
}

.btn-primary {
  font-size: 1rem;
  padding: 10px 20px;
  border: none;
  background-color: #D32F2F; /* Red background for the button */
  color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #FF5722; /* Darker red on hover */
}

/* For mobile devices */
@media only screen and (max-width: 600px) {
  .image-container{
    margin-top: 60px;
  }
  .caption-overlay {
    position:static;
    background-color: #000000; /* Semi-transparent black background */
    padding: 20px 30px;
    width: 100%; /* Full width */
    box-sizing: border-box; /* To include padding in the width */
    transform: none;
  }

  .caption-overlay.scrolled {
    position: static; /* Change to absolute when scrolled */
   
  }

  .caption-content {
    text-align: center;
  }

  .caption-title {
    font-family: "Urbanist", sans-serif;
    color: white;
    font-size: 2.5rem; /* Adjust font size */
    margin-bottom: 10px;
  }

  .caption-description {
    color: white;
    font-size: 1.2rem; /* Adjust font size */
    margin-bottom: 20px;
    font-family: "Urbanist", sans-serif;
  }

  .caption-overlay .btn-primary {
    font-size: 1rem;
    padding: 10px 20px;
    border: none;
    background-color: #D32F2F; /* Red background for the button */
    color: white;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  .caption-overlay .btn-primary:hover {
    background-color: #FF5722; /* Darker red on hover */
  }
}

/* For tablets */
@media only screen and (max-width: 768px) {
  .image-container{
    margin-top: 60px;
  }

  .caption-overlay {
    position:static;
    background-color: #000000; /* Semi-transparent black background */
    padding: 20px 30px;
    width: 100%; /* Full width */
    box-sizing: border-box; /* To include padding in the width */
    transform: none;
  }

  .caption-overlay.scrolled {
    position: static; /* Change to absolute when scrolled */
   
  }

  .caption-content {
    text-align: center;
  }

  .caption-title {
    font-family: "Urbanist", sans-serif;
    color: white;
    font-size: 2.5rem; /* Adjust font size */
    margin-bottom: 10px;
  }

  .caption-description {
    color: white;
    font-size: 1.2rem; /* Adjust font size */
    margin-bottom: 20px;
    font-family: "Urbanist", sans-serif;
  }

  .caption-overlay .btn-primary {
    font-size: 1rem;
    padding: 10px 20px;
    border: none;
    background-color: #D32F2F; /* Red background for the button */
    color: white;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  .caption-overlay .btn-primary:hover {
    background-color: #FF5722; /* Darker red on hover */
  }
}
</style>
