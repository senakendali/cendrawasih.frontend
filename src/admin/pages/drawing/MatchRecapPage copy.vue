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

   <div
      v-for="(pools, ageCategory) in matchList"
      :key="ageCategory"
      class="mb-4"
    >
      <h4 class="fw-bold text-success">{{ ageCategory }}</h4>

      <div
        v-for="(classes, poolName) in pools"
        :key="poolName"
        class="mb-3 ps-3"
      >
        <h5 class="fw-semibold text-primary">Pool: {{ poolName }}</h5>

        <div
          v-for="(matches, className) in classes"
          :key="className"
          class="ps-4"
        >
          <h6 class="fw-semibold">Kelas: {{ className }}</h6>

          <table class="table mt-2">
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="match in matches" :key="match.match_id">
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
                    <i class="bi bi-clipboard-check"></i> Create Opponent
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>




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
      tournamentId: null,
      poolId: null,
      deleteModal: null,
      matchList: {}, 
      loading: false,
      progress: 0,
    };
  },

  setup() {
    const toast = useToast();
    const permissions = inject('permissions', []);
    return { toast, permissions };
  },

  created() {
    this.poolId = this.$route.params.id;
    this.tournamentId = this.$route.query.tournament_id;
    if (this.tournamentId) {
      this.loadMatchList(this.tournamentId);
    }
  },

  watch: {
    '$route.query.tournament_id': {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal !== this.tournamentId) {
          this.tournamentId = newVal;
          this.loadMatchList(newVal);
        }
      },
    },
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.poolId = newId;
          this.generateBracket();
        }
      },
    }
  },

  beforeRouteUpdate(to, from, next) {
    if (to.query.tournament_id !== from.query.tournament_id) {
      this.tournamentId = to.query.tournament_id;
      this.loadMatchList(to.query.tournament_id);
    }
    next();
  },

  methods: {
   
    

    async loadMatchList(tournamentId) {
      this.loading = true;
      try {
        const response = await axios.get(`/matches-recap?tournament_id=${tournamentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        this.matchList = response.data.data;
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        this.loading = false;
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
