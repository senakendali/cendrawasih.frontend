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

    

   <div class="accordion" id="accordionMatchList">
      <div 
        v-for="(genders, ageCategory, index) in matchList"
        :key="ageCategory"
        class="accordion-item"
      >
        <h2 class="accordion-header" :id="'heading-' + index">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="'#collapse-' + index"
            aria-expanded="true"
            :aria-controls="'collapse-' + index"
          >
            {{ ageCategory }}
          </button>
        </h2>

        <div
          :id="'collapse-' + index"
          class="accordion-collapse collapse"
          :class="{ show: index === 0 }"
          :aria-labelledby="'heading-' + index"
          data-bs-parent="#accordionMatchList"
        >
          <div class="accordion-body">

            <!-- Tabs as Button Group -->
            <div class="d-flex justify-content-center mb-3">
              <div class="btn-group mb-3" role="group" :aria-label="'Gender Tabs ' + ageCategory">
                <button
                  v-for="(pools, gender) in genders"
                  :key="gender"
                  type="button"
                  class="btn"
                  :class="{
                    'btn-outline-primary': activeGender[ageCategory] !== gender,
                    'btn-primary': activeGender[ageCategory] === gender
                  }"
                  @click="activeGender[ageCategory] = gender"
                >
                  {{ gender === 'male' ? 'Putra' : gender === 'female' ? 'Putri' : gender }}
                </button>
              </div>
            </div>  

            <!-- Tab Content for selected gender -->
            <div v-if="activeGender[ageCategory]" class="tab-pane fade show active">
              <div
                v-for="(classes, poolName) in genders[activeGender[ageCategory]]"
                :key="poolName"
                class="mb-4"
              >
                <h5 class="fw-semibold text-primary text-uppercase mb-2">{{ poolName }}</h5>

                <div v-for="(matches, className) in classes" :key="className">
                

                  <table class="table table-bordered mt-2">
                    <thead>
                      <tr>
                        <th colspan="5" class="header fw-semibold text-uppercase">Kelas: {{ className }}</th>
                      </tr>
                      <tr>
                        <th rowspan="2" class="header text-center">Round</th>
                        <th colspan="2" class="text-center blue-side">Blue</th>
                        <th colspan="2" class="text-center red-side">Red</th>
                      </tr>
                      <tr>
                        <th class="blue-side text-center">Contingent</th>
                        <th class="blue-side text-center">Participant</th>
                        <th class="red-side text-center">Contingent</th>
                        <th class="red-side text-center">Participant</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="match in matches" :key="match.match_id">
                        <td>{{ match.round }}</td>
                        <td class="blue">{{ match.participant_one_contingent ?? '-' }}</td>
                        <td class="blue">{{ match.participant_one ?? '-' }}</td>
                        <td class="red">{{ match.participant_two_contingent ?? '-' }}</td>
                        <td class="red">{{ match.participant_two ?? '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>


          </div>
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
import { inject } from "vue";

axios.defaults.baseURL = API.API_BASE_URL;

export default {
  name: "ContingentList",

  data() {
    return {
      tournamentId: null,
      poolId: null,
      matchList: {},
      loading: false,
      progress: 0,
      activeGender: {}, 
    };
  },

  setup() {
    const toast = useToast();
    const permissions = inject("permissions", []);
    return { toast, permissions };
  },

  created() {
    this.tournamentId = this.$route.params.tournament_id;
    this.poolId = this.$route.params.id;

    if (this.tournamentId) {
      this.loadMatchList(this.tournamentId);
    }

    if (this.poolId) {
      this.generateBracket?.(); // hanya kalau function-nya ada
    }
  },

  watch: {
    '$route.params.tournament_id': {
      immediate: true,
      handler(newId) {
        if (newId && newId !== this.tournamentId) {
          this.tournamentId = newId;
          this.loadMatchList(newId);
        }
      },
    },
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        if (newId && newId !== this.poolId) {
          this.poolId = newId;
          this.generateBracket?.();
        }
      },
    },
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      const tournamentId = to.params.tournament_id;
      const poolId = to.params.id;

      if (tournamentId) {
        vm.tournamentId = tournamentId;
        vm.loadMatchList(tournamentId);
      }

      if (poolId) {
        vm.poolId = poolId;
        vm.generateBracket?.();
      }
    });
  },

  beforeRouteUpdate(to, from, next) {
    const newTournamentId = to.params.tournament_id;
    const newPoolId = to.params.id;

    if (newTournamentId && newTournamentId !== this.tournamentId) {
      this.tournamentId = newTournamentId;
      this.loadMatchList(newTournamentId);
    }

    if (newPoolId && newPoolId !== this.poolId) {
      this.poolId = newPoolId;
      this.generateBracket?.();
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

        // Set default tab (first gender) for each ageCategory
      for (const age in this.matchList) {
        const genders = this.matchList[age];
        this.activeGender[age] = Object.keys(genders)[0]; // first gender (e.g., male)
      }
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

.accordion-button::after {
  display: none !important;
}

.accordion-button::before {
  content: "\f4fe"; /* icon plus dari Bootstrap Icons */
  font-family: "bootstrap-icons";
  font-size: 1.2rem;
  margin-right: 10px;
  transition: transform 0.3s ease;
}

.accordion-button:not(.collapsed)::before {
  content: "\f2ea"; /* icon dash dari Bootstrap Icons */
}

.accordion-button:not(.collapsed) {
  background-color: #1E2A57; /* ganti dengan warna yang lu mau */
  color: #fff;               /* warna teks */
}

.accordion-button:not(.collapsed):hover {
  background-color: #1E2A57; /* warna hover-nya */
  color: #fff;
}


.table th,
.table td {
  padding: 10px;
}

.navbar {
  background-color: #1E2A57 !important;
}

.header{
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
