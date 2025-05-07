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

      <!-- Tournament Bracket -->
      <div class="row">
        <div class="bracket-container">
          <Bracket v-if="bracketMatches.length > 0" :flat-tree="bracketMatches">
            <template v-slot:player="{ player }">
              {{ player.name }}
            </template>
          </Bracket>
          <p v-else>Belum ada bracket yang tersedia.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";
import Bracket from "vue-tournament-bracket"; // Importing the bracket library

export default {
  name: "MatchChartForm",
  components: {
    Bracket
  },
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
      bracketMatches: [], // Store the bracket data
    };
  },

  created() {
    this.fetchActiveTournaments();
    this.fetchMatchCategories();
    this.fetchAgeCategories();
  },

  methods: {
    formatBracket(bracketData) {
      let matchMap = {}; // Simpan referensi pertandingan berdasarkan ID

      // Simpan pertandingan ke dalam matchMap
      bracketData.forEach((roundData) => {
        roundData.matches.forEach((match) => {
          matchMap[match.id] = match;
        });
      });

      console.log("✅ matchMap:", matchMap);

      // Format bracket dengan `next` yang benar
      return bracketData.flatMap((roundData, roundIndex) => 
        roundData.matches.map((match) => {
          let nextMatch = matchMap[match.next] || null;

          console.log(
            `Match ID: ${match.id} (Round: ${roundIndex + 1}) → Next: ${match.next}`
          );

          return {
            id: match.id,
            next: nextMatch ? nextMatch.id : null,
            player1: {
              id: `m${match.id}p1`,
              name: match.player1?.name || "TBD",
              winner: match.winner_id ? match.winner_id === match.player1?.id : null,
            },
            player2: {
              id: `m${match.id}p2`,
              name: match.player2?.name || "TBD",
              winner: match.winner_id ? match.winner_id === match.player2?.id : null,
            },
          };
        })
      );
    },

    async submitForm() {
      this.loading = true;
      try {
        const response = await axios.get(
          `/show-bracket/${this.form.tournament_id}/${this.form.match_category_id}/${this.form.age_category_id}`
        );

        console.log("API Response:", response.data);

        if (response.data && Array.isArray(response.data.bracket)) {
          this.bracketMatches = this.formatBracket(response.data.bracket);
        } else {
          console.error("Invalid bracket format:", response.data);
          this.bracketMatches = [];
        }
      } catch (error) {
        console.error("Error fetching bracket:", error);
        this.bracketMatches = [];
      } finally {
        this.loading = false;
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

::v-deep(.vtb-item-players) {
  width:200px;
  background-color: #f0f0f0;
}

::v-deep(.vtb-player1) {
  font-size: 12px;
  color:#1E2A57;
  width:100%;
  height: 50px;
  padding:12px;
  border-left: 5px solid #388E3C;
  border-top:1px solid #388E3C;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  
  border-right:1px solid #388E3C;
  background: #ffffff;
}

::v-deep(.vtb-player1)::after {
  width: 100%;
  height: 1px;
  background-color: #388E3C;
  display: block;
  content: "";
  position: absolute;
  top: 50%;
  left: 0px;
}

::v-deep(.vtb-player2) {
  font-size: 12px;
  color:#1E2A57;
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

::v-deep(.vtb-item-child:after, .vtb-item-child:before) {
    content: "";
    position: absolute;
    background-color: #388E3C;
    top: 50%;
}

::v-deep(.vtb-item-child:before) {
    right: 0;
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
    width: 25px;
    height: 1px;
}

::v-deep(.vtb-item-parent:after) {
    position: absolute;
    content: "";
    width: 25px;
    height: 1px;
    left: 0;
    top: 50%;
    background-color: #388E3C;
    transform: translateX(-100%);
}

::v-deep(.vtb-item-child:after){
    right: -25px;
    height: calc(50% + 22px);
    width: 1px;
}
</style>
