<template>
  <div class="dashboard-container">
    <div
      v-if="loading"
      class="progress-bar"
      :style="{ width: progress + '%' }"
    ></div>

    <div class="mb-2 page-title">
      <i class="bi bi-file-earmark-text"></i> Match List
    </div>

    <div class="mb-2 d-flex gap-2 justify-content-end align-items-center">
      <!-- Search Bar -->
      

     
      <router-link :to="'/admin/tanding/match/' + poolId" class="button button-primary">
        <i class="bi bi-diagram-3"></i> View Bracket
      </router-link>
    </div>

    <!-- Table to display navigation data -->
    <table class="table mt-4">
      <thead>
        <tr>
          <th rowspan="2">Round</th>
          <th colspan="2" class="text-center blue-side">Blue</th>
          <th colspan="2" class="text-center red-side">Red</th>
          <th></th>
        </tr>
        <tr>
          
          <th class="blue-side text-center">Contingent</th>
          <th class="blue-side text-center">Participant</th>
          <th class="red-side text-center">Contingent</th>
          <th class="red-side text-center">Participant</th>
          <th style="width: 200px;"></th>
        </tr>
      </thead>
      <tbody v-if="matchList.length > 0">
        <tr v-for="match in matchList" :key="match.match_id">
          <td>{{ match.round }}</td>
          <td class="blue">{{ match.participant_one_contingent ?? '-' }}</td>
          <td class="blue">{{ match.participant_one ?? '-' }}</td>
          <td class="red">{{ match.participant_two_contingent ?? '-' }}</td>
          <td class="red">{{ match.participant_two ?? '-' }}</td>
          <td>
          <button
            type="button"
            class="button button-primary"
            :disabled="loading"
            @click="createOpponent(match.match_id)"
          >
            <span><i class="bi bi-clipboard-check"></i> Create Opponent</span>
          </button>
        </td>


        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="5" class="text-center">No data found.</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <nav v-if="totalPages > 1">
      <ul class="pagination pagination-lg justify-content-end">
        <li class="page-item" :class="{ disabled: !prevPageUrl }">
          <button
            class="page-link"
            @click="changePage(currentPage - 1)"
            :disabled="!prevPageUrl"
          >
          <i class="bi bi-arrow-left-square"></i>
          </button>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="changePage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: !nextPageUrl }">
          <button
            class="page-link"
            @click="changePage(currentPage + 1)"
            :disabled="!nextPageUrl"
          >
          <i class="bi bi-arrow-right-square"></i>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from "axios";
import API from "@/config/api";
import { useToast } from "vue-toastification";
import { inject } from 'vue';

axios.defaults.baseURL = API.API_BASE_URL;

export default {
  name: "ContingentList",
  data() {
    return {
      poolId: null,
      deleteModal: null,
      matchList: [],
      loading: false,
      progress: 0,
    };
  },

  

  created() {
    this.poolId = this.$route.params.id;
    this.loadMatchList();
  },

  setup() {
    const toast = useToast();
    const permissions = inject('permissions', []); // Ensure permissions is always an array
    
    return { toast, permissions };
  },

  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        console.log("Route changed to:", newId);
        if (newId) {
          this.poolId = newId;
          this.generateBracket();
          
        }
      },
    }
  },
  
  methods: {
    async createOpponent(matchId) {
      this.loading = true;
      try {
        const response = await axios.post(`/matches/${matchId}/create-dummy`);
        this.toast.success('Peserta dummy berhasil dibuat!');
        console.log(response.data.message);
        await this.loadMatchList(); // refresh list
      } catch (error) {
        console.error('Gagal membuat dummy:', error);
        this.toast.error(
          error.response?.data?.message || 'Gagal membuat dummy peserta'
        );
      } finally {
        this.loading = false;
      }
    },
    async generateBracket() {
      this.loading = true;
      this.errorMessage = null;

      try {
        const response = await axios.get(`/pools/${this.poolId}/matches`);
        if (response.data.status === 'ongoing') {
          console.log("Bracket sudah ada, langsung fetch data.");
        } else {
          console.log("Membuat bracket baru...");
          await axios.get(`/pools/${this.poolId}/generate-bracket`);
        }
        await this.loadMatchList();
      } catch (error) {
        console.error("Error generating bracket:", error);
        this.errorMessage = "Gagal memuat bracket. Silakan coba lagi.";
      }
    },
    async loadMatchList() {
      this.loading = true;
      console.log(this.loading);
      try {
        this.loading = true;
        const response = await axios.get(`/pools/${this.poolId}/match-list`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Assumes token is in localStorage
          },
        });
        const {
          data,
        } = response.data;

        this.matchList = data; // Assign team members
        this.loading = false;
      } catch (error) {
        console.error("Error loading data:", error);
      }
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  background-color: #ffffff;
  margin-top: 80px;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.table th,
.table td {
  padding: 10px;
}

.navbar {
  background-color: #1E2A57 !important;
}

.navbar-toggler-icon {
  background-color: white;
}

.nav-link {
  color: white !important;
}

input::placeholder {
    color: #888;  /* Change text color */
    font-size: 15px;  /* Change font size */
    font-style: italic;  /* Change font style */
    opacity: 1;  /* Full opacity (default is 0.5) */
    font-family: 'Figtree', sans-serif;
}

.blue-side{
  background-color: #002FB9;
  color: #FFFFFF;
  text-transform: uppercase;
}

.blue{
  color:#002FB9;
}

.red{
  color: #F80000;
}

.red-side{
  background-color: #F80000;
  color: #FFFFFF;
  text-transform: uppercase;
}




.form-control {
  width: 250px;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 5px;
  background-color: #388E3C;
  animation: loader-animation 1.5s infinite;
}

/* Animasi garis loader */
@keyframes loader-animation {
  0% {
    width: 0;
    background-color: #388E3C; /* Warna awal */
  }
  50% {
    width: 50%;
    background-color: #388E3C; /* Warna saat animasi */
  }
  100% {
    width: 100%;
    background-color: #388E3C;
  }
}
</style>
