<template>
  <div class="dashboard-container">
    <div v-if="loading" class="progress-bar" :style="{ width: progress + '%' }"></div>
    <div class="container">
      <!-- Form Title -->
      <div class="mb-2 page-title">
        <i class="bi bi-file-earmark-text"></i>
        {{ isEdit ? "Edit Match" : "Generate Match" }}
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="admin-form mt-4">
        <div class="row">
          <div class="col-lg-12">
            <div class="mb-3">
              <label for="tournament_id" class="form-label">Tournament</label>
              <select class="form-select" id="tournament_id" v-model="form.tournament_id">
                <option value="" disabled>Choose Tournament</option>
                <option v-for="tournament in activeTournaments" :key="tournament.id" :value="tournament.id">
                  {{ tournament.name }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="match_category_id" class="form-label">Match Category</label>
              <select class="form-select" id="match_category_id" v-model="form.match_category_id">
                <option value="" disabled>Choose Match Category</option>
                <option v-for="category in matchCategories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="age_category_id" class="form-label">Age Category</label>
              <select class="form-select" id="age_category_id" v-model="form.age_category_id">
                <option value="" disabled>Choose Age Category</option>
                <option v-for="ageCategory in ageCategories" :key="ageCategory.id" :value="ageCategory.id">
                  {{ ageCategory.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-12 text-center">
            <button type="submit" class="button button-primary" :disabled="loading">
              <i class="bi bi-floppy"></i>
              <span>{{ isEdit ? "Update Match Chart" : "Generate Match Chart" }}</span>
            </button>
          </div>
        </div>
      </form>

      <div class="row">
        <div class="bracket-container">
          <div class="bracket">
            <!-- Loop untuk setiap babak -->
            <div v-for="(round, roundIndex) in bracketMatches" :key="roundIndex" class="round">
              <h4>Round {{ roundIndex + 1 }}</h4>
              <div class="match-container">
                  <!-- Loop untuk setiap pertandingan dalam babak -->
                  <div
                    v-for="(match, matchIndex) in round"
                    :key="matchIndex"
                    class="match"
                    :style="{ marginTop: roundIndex > 0 ? getVerticalSpacing(roundIndex, matchIndex) + 'px' :  '0px' }"
                  >
                    <div class="participant1">{{ match.participant1.name || "TBD" }}</div>
                    <div class="participant2">{{ match.participant2.name || "TBD" }}</div>
                  </div>

              </div>
              
            </div>
          </div>
        </div>
      </div>
      <!-- Bracket Display Section -->
      
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  name: "MatchChartForm",
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      form: {
        tournament_id: "",
        match_category_id: "",
        age_category_id: "",
      },
      activeTournaments: [],
      matchCategories: [],
      ageCategories: [],
      errors: {},
      loading: false,
      bracketMatches: [],
      maxRowCount: 0,
    };
  },

  created() {
    this.fetchActiveTournaments();
    this.fetchMatchCategories();
    this.fetchAgeCategories();
  },

  methods: {
    async submitForm() {
      this.loading = true;

      try {
        const response = await axios.get(
          `/show-bracket/${this.form.tournament_id}/${this.form.match_category_id}/${this.form.age_category_id}`
        );

        // Proses data bracket
        this.bracketMatches = this.processBracketData(response.data.bracket);
        this.maxRowCount = this.bracketMatches[0].length;

        this.toast.success("Bracket generated successfully!");
      } catch (error) {
        this.toast.error("Failed to generate bracket.");
      } finally {
        this.loading = false;
      }
    },

    processBracketData(bracketData) {
      const rounds = Object.values(bracketData);
      const totalRounds = Math.ceil(Math.log2(rounds[0].length * 2)); // Hitung total babak

      // Tambahkan babak berikutnya dengan peserta TBD
      while (rounds.length < totalRounds) {
        const previousRound = rounds[rounds.length - 1] || [];
        const nextRound = new Array(Math.ceil(previousRound.length / 2)).fill({
          participant1: { name: "TBD" },
          participant2: { name: "TBD" },
        });
        rounds.push(nextRound);
      }

      return rounds;
    },

    getVerticalSpacing(roundIndex, matchIndex) {
      const multipliers_first = [0, 100, 300, 700, 1400, 3100]; // Atur kelipatan per ronde
      const multipliers_next = [0, 300, 700, 1500, 3200, 722]; // Atur kelipatan per ronde
     
      if (matchIndex > 0) {
        if(roundIndex == 0){
          return 220;
        }else{
          return (multipliers_next[roundIndex] || multipliers_next[multipliers_next.length - 1]);
        }
      } else {
        if(roundIndex > 0){
            return (multipliers_first[roundIndex] || multipliers_first[multipliers_first.length - 1]); // Jika ronde lebih dari array, pakai nilai terakhir
        }
      }
    },

    async fetchActiveTournaments() {
      await this.fetchData("/tournaments/active", "activeTournaments");
    },
    async fetchMatchCategories() {
      await this.fetchData("/match-categories", "matchCategories");
    },
    async fetchAgeCategories() {
      await this.fetchData("/age-categories", "ageCategories");
    },

    async fetchData(url, targetKey) {
      try {
        const response = await axios.get(url);
        this[targetKey] = response.data;
      } catch (error) {
        this.toast.error(`Failed to fetch ${targetKey}`);
      }
    },
  },

  setup() {
    const toast = useToast();
    return { toast };
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

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 5px;
  background-color: #388E3C;
  animation: loader-animation 1.5s infinite;
}

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

.bracket-container{
  position: relative;
  overflow: auto;
  width: 100%;
}

.bracket {
  display: flex;
  /*justify-content: center;*/
  gap: 40px;
}

.round {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.match {
  position: relative;
  background-color: #ffffff;
  border-radius: 5px;
  text-align: center;
 
  height: 100px;
  width: 190px;
  margin-bottom: 100px;
}

.participant1 {
  font-size: 12px;
  width:100%;
  height: 50px;
  padding:12px;
  border-left: 5px solid #388E3C;
  border-top:1px solid #388E3C;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom:1px solid #388E3C;
  border-right:1px solid #388E3C;
  background: #ffffff;
}

.participant2 {
  font-size: 12px;
  width:100%;
  height: 50px;
  padding:12px;
  border-left: 5px solid #858585;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-bottom:1px solid #858585;
  border-right:1px solid #858585;
  background: #ffffff;

}




</style>
