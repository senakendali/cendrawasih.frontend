<template>
  <div class="dashboard-container">
    <div v-if="loading" class="progress-bar" :style="{ width: progress + '%' }"></div>
    <div class="container">
      <div class="mb-2 page-title">
        <i class="bi bi-file-earmark-text"></i>
        {{ isEdit ? "Edit Match" : "Generate Match" }}
      </div>

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
              <div class="match-container mt-4">
                <div v-for="(match, matchIndex) in round" :key="matchIndex" class="match" :style="{ marginTop: roundIndex > 0 ? getVerticalSpacing(roundIndex, matchIndex) + 'px' : '0px' }">
                  <div class="participant1">{{ match.team_member_1_name || "TBD" }}</div>
                  <div class="participant2">{{ match.team_member_2_name || "TBD" }}</div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
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
        this.toast.success("Bracket generated successfully!");
      } catch (error) {
        this.toast.error("Failed to generate bracket.");
      } finally {
        this.loading = false;
      }
    },

    processBracketData(bracketData) {
      return Object.values(bracketData);
    },

    getVerticalSpacing(roundIndex) {
      const spacings = [0, 100, 300, 700, 1400, 3100];
      return roundIndex > 0 ? spacings[roundIndex] || spacings[spacings.length - 1] : 0;
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

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 5px;
  background-color: #388E3C;
}

.bracket-container {
  overflow: auto;
  width: 100%;
}

.bracket {
  display: flex;
  gap: 40px;
}

.round {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.match {
  background-color: #ffffff;
  border-radius: 5px;
  text-align: center;
  height: 100px;
  width: 190px;
  margin-bottom: 100px;
}

.participant1, .participant2 {
  font-size: 12px;
  width: 100%;
  height: 50px;
  padding: 12px;
}
</style>
