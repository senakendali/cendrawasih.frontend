<template>
    <div class="main-container">
      <div class="container">
        <h1>{{ tournamentName }}</h1>
        
        <div class="row">
          <div class="col-lg-12">
              <p>{{ tournamentDescription }}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <div v-if="!isLoading" class="event-caption">
              
              <div class="d-flex gap-2 justify-content-center">
                <router-link
                  v-if="slug && tournamentStatus === 'active'"
                  :to="{ name: 'registration', params: { slug: slug } }"
                  class="btn btn-primary"
                >
                Daftar
                </router-link>
                <button @click="downloadDocument" class="btn btn-primary">Download</button>
              </div>
             
          </div>
          </div>
        </div>

        <TournamentInfo
          :tournament="{
            location: tournamentLocation,
            event_date: tournamentDate,
            matchCategories: matchCategories,
            ageCategories: ageCategories,
            contactPersons: contactPersons
          }"
        />

        <!-- Our Activity Section -->
        <OurActivity :activities="activities"/>

        
      </div>
      <div v-if="isLoading" class="loading-bar"></div>
    </div>
</template>
  
  <script>
  import TournamentInfo from '@/components/main/TournamentInfo.vue';
  import OurActivity from '@/components/main/OurActivity.vue';
  import axios from 'axios';
  //import API from '@/config/api';

  export default {
    name: 'GalleryDetail',
    components: {
      TournamentInfo,
      OurActivity
    },
    data() {
      return {
        tournamentId: null,
        tournamentName: '',
        slug: '',
        tournamentDescription: '',
        tournamentDate: '',
        tournamentLocation: '',
        tournamentStatus: '',
        dateStart: '',
        dateEnd: '',
        document: '',
        matchCategories: [],
        ageCategories: [],
        activities: [],
        contactPersons: [],
        errors: {},
        isLoading: false,
      };
    },

  
    created() {
      this.fetchTournamentDetail(this.$route.params.slug);
    },
    methods: {
      async fetchTournamentDetail(slug) {
        this.isLoading = true; // Show loader
        try {
          const response = await axios.get(`/tournaments/detail/${slug}`);
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
            this.contactPersons = response.data.contact_persons || [];
            this.document = response.data.document || '';
            this.activities = response.data.activities || [];
            this.tournamentStatus = response.data.status || '';
            console.log(this.contactPersons);
          }
        } catch (error) {
          this.toast.error("Error fetching contingent details.");
        } finally {
          this.isLoading = false;
        }
      },

      async downloadDocument() {
        this.isLoading = true;
        try {
          const response = await axios.get('/download-document', {
            params: {
              filename: this.document, // Kirim full path: uploads/tournament_documents/xxx.pdf
            },
            responseType: 'blob',
          });

          const blob = new Blob([response.data]);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          const fileName = this.document?.split('/').pop() || 'document.pdf'; // fallback jika tidak ada nama

          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
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
  /* Add styles for the gallery detail page */
  .gallery-detail-container {
    color: white;
    background-color: black;
    min-height: 100vh;
    padding: 2rem 0;
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

  /* Loader Styles */
.loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #D32F2F;
  z-index: 9999;
  animation: loading 1s infinite linear;
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

small {
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .myForm .row{
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}
</style>
  