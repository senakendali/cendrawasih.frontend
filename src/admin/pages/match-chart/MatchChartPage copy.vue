<template>
  <div class="dashboard-container">
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
            <div v-for="(round, roundIndex) in bracketMatches" :key="roundIndex" class="round">
              <div
                v-for="(match, matchIndex) in round"
                :key="matchIndex"
                class="match"
                :style="{ marginTop: getVerticalSpacing(roundIndex, matchIndex) + 'px' }"
              >
                <div class="participant">{{ match.participant1.name || "TBD" }}</div>
                <div class="vs">VS</div>
                <div class="participant">{{ match.participant2.name || "TBD" }}</div>
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
      const totalRounds = Math.ceil(Math.log2(rounds[0].length * 2));

      while (rounds.length < totalRounds) {
        const previousRound = rounds[rounds.length - 1] || [];
        const nextRound = new Array(Math.ceil(previousRound.length / 2)).fill({
          participant1: "TBD",
          participant2: "TBD",
        });

        rounds.push(nextRound);
      }

      return rounds;
    },

    getVerticalSpacing(roundIndex, matchIndex) {
      return matchIndex % 2 === 1 ? 50 : 0;
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
}

/* Bracket */
.bracket {
  display: flex;
  justify-content: center;
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
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 5px;
  text-align: center;
  border: 2px solid #333;
  height: 150px;
  width: 190px;
  margin-bottom: 30px;
}

/* Peserta */
.participant {
  padding: 5px;
  background: #ddd;
}

/* VS */
.vs {
  font-weight: bold;
  margin: 5px 0;
}

/* Garis ke pertandingan berikutnya */
.match::after {
  content: "";
  position: absolute;
  right: -15px;
  top: 50%;
  width: 20px;
  height: 2px;
  background: #333;
}
</style>
