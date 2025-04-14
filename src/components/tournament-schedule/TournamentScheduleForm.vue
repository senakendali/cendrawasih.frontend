<template>
  <div class="dashboard-container">
    <!-- Loader: Top Progress Bar -->
    <div
      v-if="loading"
      class="progress-bar"
      :style="{ width: progress + '%' }"
    ></div>

    <div class="container">
      <!-- Form Title -->
      <div class="mb-2 page-title">
        <i class="bi bi-file-earmark-text"></i>
        {{ isEdit ? "Edit Schedule" : "Add Schedule" }}
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="admin-form mt-4">
        <div class="row">
          <div class="col-lg-12">
            <div class="mb-3">
              <label for="tournament_id" class="form-label">Tournament</label>
              <select
                class="form-select"
                id="tournament_id"
                v-model="form.tournament_id"
                :class="{ 'is-invalid': errors.tournament_id }"
              >
                <option value="" disabled>Choose Tournament</option>
                <option 
                  v-for="tournament in allTournaments" 
                  :key="tournament.id" 
                  :value="tournament.id"
                >
                  {{ tournament.name }}
                </option>
              </select>
              <div class="invalid-feedback">{{ errors.tournament_id }}</div>
            </div>
            
            <div class="mb-3">
              <label for="tournament_arena_id" class="form-label">Arena</label>
              <select
                class="form-select"
                id="tournament_arena_id"
                v-model="form.tournament_arena_id"
                :class="{ 'is-invalid': errors.tournament_arena_id }"
              >
                <option value="" disabled>Choose Arena</option>
                <option 
                  v-for="arena in allArenas" 
                  :key="arena.id" 
                  :value="arena.id"
                >
                  {{ arena.name }}
                </option>
              </select>
              <div class="invalid-feedback">{{ errors.tournament_arena_id }}</div>
            </div>

            <div class="mb-3">
              <label for="scheduled_date" class="form-label">Match Date</label>
              <input
                type="date"
                class="form-control"
                :class="{ 'is-invalid': errors.scheduled_date }"
                id="scheduled_date"
                v-model="form.scheduled_date"
              />
              <div class="invalid-feedback">{{ errors.scheduled_date }}</div>
            </div>

            <div class="row mb-3">
              <div class="col-md-6">
                <label for="start_time" class="form-label">Start Time</label>
                <input
                  type="time"
                  class="form-control"
                  id="start_time"
                  v-model="form.start_time"
                  :class="{ 'is-invalid': errors.start_time }"
                />
                <div class="invalid-feedback">{{ errors.start_time }}</div>
              </div>
              <div class="col-md-6">
                <label for="end_time" class="form-label">End Time (Optional)</label>
                <input
                  type="time"
                  class="form-control"
                  id="end_time"
                  v-model="form.end_time"
                  :class="{ 'is-invalid': errors.end_time }"
                />
                <div class="invalid-feedback">{{ errors.end_time }}</div>
              </div>
            </div>

            <div class="mb-3">
              <label for="note" class="form-label">Notes (Optional)</label>
              <textarea
                class="form-control"
                id="note"
                v-model="form.note"
                rows="2"
              ></textarea>
            </div>

            <div class="row mb-3">
              <div class="col-lg-12">
                <div class="table-responsive">
                  <div class="mb-3">
                    <label>
                      <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /> Select All
                    </label>
                  </div>

                  <table class="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Participant One</th>
                        <th>Participant Two</th>
                        <th>Match Order</th>
                        <th>Match Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(match) in allMatches" :key="match.id">
                        <td>
                          <input type="checkbox" v-model="match.selected" @change="updateMatchOrder" />
                        </td>
                        <td>{{ match.participant_one.name }} ({{ match.participant_one.contingent?.name || 'No contingent' }})</td>
                        <td>{{ match.participant_two.name }} ({{ match.participant_two.contingent?.name || 'No contingent' }})</td>
                        <td><input type="text" class="form-control" v-model="match.match_order" readonly /></td>
                        <td><input type="time" class="form-control" v-model="match.match_time" /></td>
                      </tr>
                      <tr v-if="allMatches.length === 0">
                        <td colspan="7" class="text-center">No matches found.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Submit Button -->
        <div class="row">
          <div class="col-lg-12 text-center">
            <button type="submit" class="button button-primary" :disabled="loading">
              <i class="bi bi-floppy"></i>
              <span>{{ isEdit ? "Update Schedule" : "Add Schedule" }}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  name: "TournamentScheduleForm",
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      scheduleId: null,
      allTournaments: [],
      allArenas: [],
      allMatches: [],
      selectAll: false,
      form: {
        tournament_id: "",
        tournament_arena_id: "",
        scheduled_date: "",
        start_time: "08:00",
        end_time: "17:00",
        note: ""
      },
      errors: {},
      loading: false,
      progress: 0,
    };
  },

  created() {
    this.scheduleId = this.$route.params.id;
    this.fetchActiveTournaments();
    if (this.isEdit && this.scheduleId) {
      this.fetchScheduleDetail(this.scheduleId);
    }
  },

  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        if (this.isEdit && newId) {
          this.scheduleId = newId;
          this.fetchScheduleDetail(newId); 
        }
      },
    },
    'form.tournament_id': {
      handler(newId, oldId) {
        // Skip if in edit mode or if the value didn't actually change
        if (this.isEdit || newId === oldId){
          this.fetchArenasByTournament(newId);
          return;
        }
        
        if (newId) {
          this.fetchArenasByTournament(newId);
          this.fetchMatchList(newId);
          this.form.tournament_arena_id = "";
        } else {
          this.allArenas = [];
          this.allMatches = [];
        }
      },
      immediate: true
    }
  },

  methods: {
    toggleSelectAll() {
      this.allMatches.forEach((match, index) => {
        match.selected = this.selectAll;
        if (this.selectAll) {
          match.match_order = index + 1;
        } else {
          match.match_order = '';
        }
      });
    },

    updateMatchOrder() {
      const selectedMatches = this.allMatches.filter(match => match.selected);
      
      if (selectedMatches.length === 0) {
        this.allMatches.forEach(match => {
          match.match_order = '';
        });
      } else {
        selectedMatches.forEach((match, index) => {
          match.match_order = index + 1;
        });
        
        this.allMatches.forEach(match => {
          if (!match.selected) {
            match.match_order = '';
          }
        });
      }
      
      this.selectAll = selectedMatches.length === this.allMatches.length;
    },

    async fetchArenasByTournament(tournamentId) {
      try {
        const response = await axios.get(`/tournaments/${tournamentId}/arenas`);
        this.allArenas = response.data.data;
      } catch (error) {
       // this.toast.error("Failed to fetch arenas.");
        console.error("Error fetching arenas:", error);
      }
    },

    async fetchMatchList(tournamentId) {
      try {
        const response = await axios.get(`/tournaments/${tournamentId}/matches`);
        this.allMatches = response.data.data.map(match => ({
          ...match,
          selected: false,
          match_order: '',
          match_time: '08:00'
        }));
      } catch (error) {
        console.error('Failed to fetch matches:', error);
        this.toast.error("Failed to fetch matches");
      }
    },
    
    async fetchActiveTournaments() {
      try {
        const response = await axios.get("/tournaments/all");
        this.allTournaments = response.data;
      } catch (error) {
        this.toast.error("Failed to fetch tournaments");
        console.error("Error fetching tournaments:", error);
      }
    },

    async fetchScheduleDetail(id) {
      this.loading = true;
      this.progress = 30;

      try {
        // Step 1: Get schedule details
        const response = await axios.get(`/match-schedules/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        this.progress = 50;

        if (!response.data?.data) {
          throw new Error('Invalid schedule data structure');
        }

        const detail = response.data.data;

        // Safely handle time fields with null checks
        this.form = {
          tournament_id: detail.tournament_id,
          tournament_arena_id: detail.tournament_arena_id,
          scheduled_date: detail.scheduled_date || '',
          start_time: detail.start_time ? detail.start_time.substring(0, 5) : '',
          end_time: detail.end_time ? detail.end_time.substring(0, 5) : '',
          note: detail.note || ''
        };

        const scheduledMatchIds = [];
        const scheduledMatches = [];

        // Step 2: Process scheduled matches
        if (detail.details?.length) {
          detail.details.forEach(scheduledMatch => {
            // Skip if tournament_match is null
            if (!scheduledMatch.tournament_match) {
              console.warn('Missing tournament_match for scheduled match:', scheduledMatch.id);
              return;
            }

            const tournamentMatch = scheduledMatch.tournament_match;
            scheduledMatchIds.push(scheduledMatch.tournament_match_id);

            // Safely handle participant data
            const participantOne = tournamentMatch.participant_one || {};
            const participantTwo = tournamentMatch.participant_two || {};

            scheduledMatches.push({
              id: scheduledMatch.tournament_match_id,
              selected: true,
              match_order: scheduledMatch.order || null,
              match_time: scheduledMatch.start_time 
                ? scheduledMatch.start_time.substring(0, 5) 
                : '',
              schedule_detail_id: scheduledMatch.id,
              participant_one: {
                id: participantOne.id,
                name: participantOne.name || 'Unknown',
                contingent: {
                  id: participantOne.contingent?.id,
                  name: participantOne.contingent?.name || 'No contingent'
                }
              },
              participant_two: {
                id: participantTwo.id,
                name: participantTwo.name || 'Unknown',
                contingent: {
                  id: participantTwo.contingent?.id,
                  name: participantTwo.contingent?.name || 'No contingent'
                }
              }
            });
          });
        }

        // Step 3: Get all matches (scheduled + unscheduled)
        const matchResponse = await axios.get(`/match-schedules/${id}/matches`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        const allFromAPI = matchResponse.data.data || [];

        // Step 4: Combine and mark scheduled matches
        const unscheduledMatches = allFromAPI
          .filter(match => !scheduledMatchIds.includes(match.id))
          .map(match => ({
            id: match.id,
            selected: false,
            match_order: null,
            match_time: '',
            schedule_detail_id: null,
            participant_one: {
              id: match.participant_one?.id,
              name: match.participant_one?.name || 'Unknown',
              contingent: {
                id: match.participant_one?.contingent?.id,
                name: match.participant_one?.contingent?.name || 'No contingent'
              }
            },
            participant_two: {
              id: match.participant_two?.id,
              name: match.participant_two?.name || 'Unknown',
              contingent: {
                id: match.participant_two?.contingent?.id,
                name: match.participant_two?.contingent?.name || 'No contingent'
              }
            }
          }));

        this.allMatches = [...scheduledMatches, ...unscheduledMatches];
        this.updateMatchOrder();
        this.selectAll = this.allMatches.every(m => m.selected);

        this.progress = 100;
        //this.toast.success("Schedule loaded successfully");
      } catch (error) {
        this.progress = 100;
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            "Failed to load schedule details";
        
        this.toast.error(errorMessage);
        console.error("Fetch error:", {
          error: error.response?.data || error,
          request: error.config
        });
        
        if (error.response?.status === 404) {
          setTimeout(() => {
            this.$router.push("/admin/match-schedules");
          }, 2000);
        }
      } finally {
        this.loading = false;
      }
    },

    
    async submitForm() {
      this.loading = true;
      this.progress = 30;

      // Prepare payload
      const payload = {
        tournament_id: this.form.tournament_id,
        tournament_arena_id: this.form.tournament_arena_id,
        scheduled_date: this.form.scheduled_date,
        start_time: this.form.start_time,
        end_time: this.form.end_time,
        note: this.form.note,
        matches: this.allMatches
          .filter(match => match.selected)
          .map(match => ({
            tournament_match_id: match.id,
            order: match.match_order,
            start_time: match.match_time,
            note: `Match between ${match.participant_one?.name} vs ${match.participant_two?.name}`
          }))
      };

      // Validate at least one match is selected
      if (payload.matches.length === 0) {
        this.toast.error("Please select at least one match");
        this.loading = false;
        this.progress = 100;
        return;
      }

      try {
        this.progress = 60;
        const endpoint = this.isEdit 
          ? `/match-schedules/${this.scheduleId}` 
          : "/match-schedules";
        const method = this.isEdit ? "put" : "post";

        await axios[method](endpoint, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
          }
        });

        this.progress = 100;
        this.toast.success(
          this.isEdit 
            ? "Schedule updated successfully!" 
            : "Schedule created successfully!"
        );
        this.$router.push("/admin/tournament-schedule");
      } catch (error) {
        this.progress = 100;
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors;
          this.toast.error("Validation error occurred");
        } else {
          this.toast.error(
            error.response?.data?.message || 
            "An error occurred while submitting the form."
          );
          console.error("API Error:", error);
        }
      } finally {
        this.loading = false;
      }
    }
  }
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

.page-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
}

@keyframes loader-animation {
  0% {
    width: 0;
    background-color: #388E3C;
  }
  50% {
    width: 50%;
    background-color: #388E3C;
  }
  100% {
    width: 100%;
    background-color: #388E3C;
  }
}

.button-primary {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button-primary:hover {
  background-color: #45a049;
}

.button-primary:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.table {
  margin-top: 20px;
}

.table th {
  background-color: #f2f2f2;
}

.table-responsive {
  overflow-x: auto;
}
</style>