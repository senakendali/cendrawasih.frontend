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
        {{ isEdit ? "Edit Schedule (Tanding)" : "Add Schedule (Tanding)" }}
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
                <label for="match_category_id" class="form-label">Match Category</label>
              <select
                class="form-select"
                id="match_category_id"
                v-model="form.match_category_id"
                :class="{ 'is-invalid': errors.match_category_id }"
              >
                <option value="" disabled>Choose Match Category</option>
                <option 
                  v-for="category in matchCategories" 
                  :key="category.id" 
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
              <div class="invalid-feedback">{{ errors.match_category_id }}</div>
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

            

            <div class="row mb-3">
              <div class="col-md-4">
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
              <div class="col-md-4">
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
              <div class="col-md-4">
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

            <div class="mb-5">
              <label for="note" class="form-label">Notes (Optional)</label>
              <textarea
                class="form-control"
                id="note"
                v-model="form.note"
                rows="2"
              ></textarea>
            </div>

            <div class="filter">
              <div class="alert alert-info mb-3">
                Filter data pertandingan.
              </div>
              

              <div class="mb-3">
                <label for="age_category_id" class="form-label">Age Category</label>
                <select
                  class="form-select"
                  id="age_category_id"
                  v-model="form.age_category_id"
                  @change="fetchCategoryClasses"
                  :class="{ 'is-invalid': errors.age_category_id }"
                >
                  <option value="" disabled>Choose Age Category</option>
                  <option 
                    v-for="ageCategory in ageCategories" 
                    :key="ageCategory.id" 
                    :value="ageCategory.id"
                  >
                    {{ ageCategory.name }}
                  </option>
                </select>
                <div class="invalid-feedback">{{ errors.age_category_id }}</div>
              </div>

              <div class="mb-3">
                <label for="category_class_id" class="form-label">Class</label>
                <select
                  class="form-select"
                  id="category_class_id"
                  v-model="form.category_class_id"
                  :class="{ 'is-invalid': errors.category_class_id }"
                >
                  <option value="" disabled>Choose Class</option>
                  <option 
                    v-for="categoryClass in categoryClasses" 
                    :key="categoryClass.class_id" 
                    :value="categoryClass.class_id"
                  >
                    {{ categoryClass.gender }} Class {{ categoryClass.class_name }},  ( {{  categoryClass.weight_min }} KG - {{  categoryClass.weight_max }} KG ). Total Participant: {{ categoryClass.team_member_count }}
                  </option>
                </select>
                <div class="invalid-feedback">{{ errors.category_class_id }}</div>
              </div>

              <div class="mb-3">
                <label for="round" class="form-label">Babak</label>
                <select
                  class="form-select"
                  id="round"
                  v-model="selectedRound"
                >
                  <option value="">Semua Babak</option>
                  <option 
                    v-for="round in roundOptions" 
                    :key="round.value" 
                    :value="round.value"
                  >
                    {{ round.label }}
                  </option>
                </select>
              </div>

            </div>

            <div class="row mb-3">
              <div class="col-lg-12">
                <div class="table-responsive">
                  <div class="mb-3">
                    <label>
                      <label>
                        <input type="checkbox" :checked="selectAll" @change="onSelectAllChange($event)" />
                        {{ selectAll ? 'Unselect All' : 'Select All' }}
                      </label>
                    </label>
                  </div>


                  <div v-for="(pools, key) in groupedPoolsByClass" :key="key">
                    <!-- Header per kelas -->
                    <h5 class="text-uppercase font-weight-bold mb-3">
                      {{ key.split('|')[0] }} {{ key.split('|')[1] }} - KELAS {{ key.split('|')[2] }}
                    </h5>

                    <!-- Tampilkan semua pool di bawah kelas ini -->
                    <div v-for="pool in pools" :key="pool.pool_id" class="mb-5">
                      <table class="table">
                        <thead>
                          <tr>
                            <th colspan="5" class="table-header text-uppercase">
                              {{ pool.pool_name }}
                            </th>
                          </tr>
                          <tr>
                            <th>#</th>
                            <th>Participant One</th>
                            <th>Participant Two</th>
                            <th>Match Order</th>
                            <th>Match Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          <template v-for="round in pool.rounds" :key="round.round">
                            <template v-if="round.matches.length > 0">
                              <tr class="round-separator">
                                <td colspan="5">{{ round.round_label }}</td>
                              </tr>
                              <tr v-for="match in round.matches" :key="match.id">
                                <td>
                                  <input
                                    type="checkbox"
                                    :checked="match.selected"
                                    @change="(e) => {
                                      match.selected = e.target.checked;
                                      onMatchCheckChanged();
                                    }"
                                  />
                                </td>
                                <td>{{ match.participant_one?.name || 'No Name' }} ({{ match.participant_one?.contingent?.name || 'No contingent' }})</td>
                                <td>{{ match.participant_two?.name || 'No Name' }} ({{ match.participant_two?.contingent?.name || 'No contingent' }})</td>
                                <td><input type="text" class="form-control" v-model="match.match_order" readonly /></td>
                                <td><input type="time" class="form-control" v-model="match.match_time" /></td>
                              </tr>
                            </template>
                          </template>
                        </tbody>
                      </table>
                    </div>
                  </div>




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
      matchCategories: [],
      ageCategories: [],
      categoryClasses: [],
      roundOptions: [], // untuk dropdown babak
      selectedRound: '', // yang dipilih user
      allMatchesByPool : [],
      selectAll: false,
      scheduledMap: {},
      form: {
        tournament_id: "",
        match_category_id: "",
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
    this.fetchMatchCategories();
    this.fetchAgeCategories();
    this.fetchCategoryClasses();
    if (this.isEdit && this.scheduleId) {
      this.fetchScheduleDetail(this.scheduleId);
    }
  },

  computed: {
    groupedPoolsByClass() {
      const group = {};
      this.visiblePools.forEach(pool => {
        const key = `${pool.age_category_name}|${pool.gender}|${pool.class_name}`;
        if (!group[key]) group[key] = [];
        group[key].push(pool);
      });
      return group;
    },
    visiblePools() {
      return this.filteredMatchesByPool.filter(pool =>
        pool.rounds.some(round => round.matches.length > 0)
      );
    },
    filteredMatchesByPool() {
      return this.allMatchesByPool.map(pool => {
        return {
          ...pool,
          rounds: pool.rounds
            .sort((a, b) => a.round - b.round) // ✅ Urutkan round number
            .map(round => {
              // Tetap simpan label meskipun match kosong
              const filteredMatches = round.matches.filter(match => {
                const matchCategoryMatch = !this.form.match_category_id || match.pool?.match_category_id == this.form.match_category_id;
                const ageCategoryMatch = !this.form.age_category_id || match.age_category_id == this.form.age_category_id;
                const classMatch = !this.form.category_class_id || match.category_class_id == this.form.category_class_id;
                const roundMatch = !this.selectedRound || round.round == this.selectedRound;
                return matchCategoryMatch && ageCategoryMatch && classMatch && roundMatch;
              });

              return {
                round: round.round,
                round_label: round.round_label || `Babak ${round.round}`,
                matches: filteredMatches
              };
            })
            .filter(round => round.matches.length > 0 || !this.selectedRound || round.round == this.selectedRound) // ✅ Tampilkan babak walau match kosong jika tidak difilter
        };
      });
    }

  },

  watch: {
    'form.match_category_id': 'onFilterAndOrderChanged',
    'form.age_category_id': 'onFilterAndOrderChanged',
    'form.category_class_id': 'onFilterAndOrderChanged',
    'selectedRound': 'onFilterAndOrderChanged',
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
      handler: async function (newId, oldId) {
        if (!newId) return; 
        // Skip if in edit mode or if the value didn't actually change
        if (this.isEdit || newId === oldId){
          this.fetchArenasByTournament(newId);
          this.fetchRounds(newId); // ✅ tambahin di sini juga buat edit mode
          return;
        }
        
        if (newId) {
          this.fetchArenasByTournament(newId);
          await this.fetchRounds(newId); // ⬅️ tunggu roundOptions siap
          this.fetchMatchList(newId);    // ⬅️ baru fetch match pakai round label yang bener
          this.form.tournament_arena_id = "";
          
        } else {
          this.allArenas = [];
          this.allMatches = [];
          this.roundOptions = [];
        }
      },
      immediate: true
    }
  },

  methods: {
    onFilterAndOrderChanged() {
      this.onFilterChanged();         // 🔄 Reset match_order & match_time
      this.updateMatchOrderDelayed(); // ⏳ Reorder berdasarkan filter baru
    },
    onFilterChanged() {
      // Reset match_order dan match_time dulu
      this.allMatchesByPool.forEach(pool => {
        pool.rounds.forEach(round => {
          round.matches.forEach(match => {
            match.match_order = '';
            match.match_time = '';
          });
        });
      });

      // Setelah reset, update berdasarkan filter baru
      this.$nextTick(() => {
        this.updateMatchOrder();
      });
    },

    

    async fetchMatchCategories() {
      await this.fetchData("/match-categories", "matchCategories");
    },
    async fetchAgeCategories() {
      await this.fetchData("/age-categories", "ageCategories");
    },

    async fetchRounds(tournamentId) {
      if (!tournamentId) return;
      try {
        const res = await axios.get(`/tournaments/${tournamentId}/available-rounds`);
        this.roundOptions = Object.entries(res.data.rounds).map(([key, label]) => ({
          value: key,
          label: label
        }));
      } catch (err) {
        console.error('Gagal ambil list babak:', err);
        this.roundOptions = [];
      }
    },

    getRoundLabels(totalRounds) {
        const labels = {};

        for (let i = 1; i <= totalRounds; i++) {
          if (totalRounds === 1) {
            labels[i] = "Final";
          } else if (totalRounds === 2) {
            labels[i] = i === 1 ? "Semifinal" : "Final";
          } else if (totalRounds === 3) {
            labels[i] = i === 1 ? "Perempat Final" : (i === 2 ? "Semifinal" : "Final");
          } else {
            if (i === 1) {
              labels[i] = "Penyisihan";
            } else if (i === totalRounds - 2) {
              labels[i] = "Perempat Final";
            } else if (i === totalRounds - 1) {
              labels[i] = "Semifinal";
            } else if (i === totalRounds) {
              labels[i] = "Final";
            } else {
              labels[i] = `Babak ${i}`;
        }
      }
    }

    return labels;
  },





    async fetchData(url, targetKey) {
      try {
        const response = await axios.get(url);
        this[targetKey] = response.data;
      } catch (error) {
        this.toast.error(`Failed to fetch ${targetKey}`);
      }
    },

    async fetchCategoryClasses() {
      if (!this.form.age_category_id || !this.form.tournament_id || !this.form.match_category_id) return;
      try {
        const response = await axios.get(`/fetch-available-class`, {
          params: {
            age_category_id: this.form.age_category_id,
            tournament_id: this.form.tournament_id,
            match_category_id: this.form.match_category_id
          }
        });
        this.categoryClasses = response.data;
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    },

  handleIndividualCheck(match, event) {
    match.selected = event.target.checked;
    this.$nextTick(() => {
      this.updateMatchOrder();
    });
  },

  updateMatchOrderDelayed() {
    setTimeout(() => {
      this.updateMatchOrder();
    }, 0);
  },

  onMatchToggle(match, checked) {
    match.selected = checked;
    this.$nextTick(() => {
      this.updateMatchOrder();
    });
  },

  onSelectAllChange(event) {
    const checked = event.target.checked;
    this.selectAll = checked;

    
    
    

    // Tandai match yang terpilih
    this.allMatchesByPool.forEach(pool => {
      pool.rounds.forEach(round => {
        round.matches.forEach(match => {
          if (this.scheduledMap[match.id]) {
            match.selected = true;
            match.match_order = this.scheduledMap[match.id].match_order;
            match.match_time = this.scheduledMap[match.id].match_time;
          } else {
            match.selected = false; // ✅ PATCH INI BRO!
            match.match_order = '';
            match.match_time = '';
          }
        });
      });
    });

  },

  toggleSelectAll() {
    // just trigger updateMatchOrder via selectAll
    this.selectAll = !this.selectAll;
    this.onSelectAllChange({ target: { checked: this.selectAll } });
  },

  updateMatchOrder__PATCH() {
  let order = 1;

  // Start dari waktu yang ditentukan
  let currentTime = new Date(`1970-01-01T${this.form.start_time || "08:00"}:00`);

  this.allMatchesByPool.forEach(pool => {
    pool.rounds.forEach(round => {
      // Skip jika round bukan yang dipilih
      if (this.selectedRound && round.round != this.selectedRound) return;

      round.matches.forEach(match => {
        if (match.selected) {
          match.match_order = order++;
          match.match_time = currentTime.toTimeString().substring(0, 5);
          currentTime.setMinutes(currentTime.getMinutes() + 5);
        }
        // ⚠️ Jangan kosongkan match yang tidak dipilih saat edit!
      });
    });
  });

  // Update state checkbox selectAll
  this.selectAll = this.allMatchesByPool.every(pool =>
    pool.rounds.every(round =>
      (!this.selectedRound || round.round == this.selectedRound) &&
      round.matches.every(match => match && match.selected)
    )
  );

  console.log('✅ Updated Match Order after filtering');
},

updateMatchOrder() {
  let order = 1;
  let currentTime = new Date(`1970-01-01T${this.form.start_time || "08:00"}:00`);

  this.filteredMatchesByPool.forEach(pool => {
    pool.rounds.forEach(round => {
      // Skip round jika tidak sesuai filter (udah dicek sebelumnya sih)
      if (this.selectedRound && round.round != this.selectedRound) return;

      round.matches.forEach(match => {
        if (match.selected) {
          match.match_order = order++;
          match.match_time = currentTime.toTimeString().substring(0, 5);
          currentTime.setMinutes(currentTime.getMinutes() + 5);
        } else {
          match.match_order = '';
          match.match_time = '';
        }
      });
    });
  });

  // Optional: update selectAll state
  this.selectAll = this.filteredMatchesByPool.every(pool =>
    pool.rounds.every(round =>
      (!this.selectedRound || round.round == this.selectedRound) &&
      round.matches.every(match => match.selected)
    )
  );

  console.log("✅ match_order & match_time updated based on filter");
},


  onMatchCheckChanged() {
    this.allMatchesByPool.forEach(pool => {
      pool.rounds.forEach(round => {
        round.matches.forEach(match => {
          if (!match.selected) {
            match.match_order = '';
            match.match_time = '';
          }
        });
      });
    });

    this.$nextTick(() => {
      this.updateMatchOrder();
    });
  },

  async fetchArenasByTournament(tournamentId) {
    if (!tournamentId) return;
    try {
      const response = await axios.get(`/tournaments/${tournamentId}/arenas`);
      this.allArenas = response.data.data;
    } catch (error) {
      console.error("Error fetching arenas:", error);
    }
  },


  async fetchMatchList(tournamentId) {
    try {
      const params = {};
      if (this.isEdit) {
        params.include_scheduled = true;
      }

      const response = await axios.get(`/tournaments/${tournamentId}/matches`, { params });
      const pools = response.data.data;

      if (Array.isArray(pools)) {
        // ⬇️ Ambil round label dari roundOptions
        const roundLabelMap = {};
        this.roundOptions.forEach(opt => {
          roundLabelMap[parseInt(opt.value)] = opt.label;
        });

        this.allMatchesByPool = pools.map(pool => ({
          pool_id: pool.pool_id,
          pool_name: pool.pool_name,
          class_name: pool.class_name,
          age_category_name: pool.age_category_name,
          gender: pool.gender === 'male' ? 'PUTRA' : 'PUTRI',
          rounds: pool.rounds.map(round => ({
            round: round.round,
            round_label: roundLabelMap[round.round] || `Babak ${round.round}`, // ✅ Gunakan label dari roundOptions
            matches: round.matches.map(match => ({
              ...match,
              match_category_id: match.pool?.category_class?.match_category_id || null,
              age_category_id: match.pool?.category_class?.age_category_id || null,
              category_class_id: match.pool?.category_class?.id || null,
              selected: this.isEdit ? false : true,
              match_order: '',
              match_time: '08:00',
              pool: match.pool || {},
              participant_one: match.participant_one || { name: 'No Name', contingent: { name: 'No contingent' } },
              participant_two: match.participant_two || { name: 'No Name', contingent: { name: 'No contingent' } }
            }))
          }))
        }));

        this.$nextTick(() => {
          this.updateMatchOrder();
        });

      } else {
        console.error("Expected array from API, got:", pools);
        this.toast.error("Invalid match data format.");
      }
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
        // Ambil data schedule
        const response = await axios.get(`/match-schedules/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        this.progress = 50;
        const detail = response.data?.data;
        if (!detail) throw new Error('Invalid schedule data structure');

        // Set ID dulu supaya watcher jalan dengan benar
        this.form.tournament_id = detail.tournament_id;

        // Tunggu match list diambil berdasarkan tournament ID
        await this.fetchMatchList(detail.tournament_id);
        console.log("✅ Match list fetched", this.allMatchesByPool);

        // Set nilai form lainnya
        this.form = {
          ...this.form,
          tournament_arena_id: detail.tournament_arena_id,
          scheduled_date: detail.scheduled_date || '',
          start_time: detail.start_time ? detail.start_time.substring(0, 5) : '',
          end_time: detail.end_time ? detail.end_time.substring(0, 5) : '',
          note: detail.note || ''
        };

        // Tandai match yang sudah dijadwalkan
        this.scheduledMap = {};

        (detail.details || []).forEach(scheduled => {
          if (!scheduled.tournament_match) return;

         
        this.scheduledMap[scheduled.tournament_match_id] = {
            match_order: scheduled.order || '',
            match_time: scheduled.start_time ? scheduled.start_time.substring(0, 5) : ''
          };
        });

        // Tandai match yang terpilih
        this.allMatchesByPool.forEach(pool => {
          pool.rounds.forEach(round => {
            round.matches.forEach(match => {
              if (this.scheduledMap[match.id]) {
                match.selected = true;
                match.match_order = this.scheduledMap[match.id].match_order;
                match.match_time = this.scheduledMap[match.id].match_time;
              }
            });
          });
        });

        this.selectAll = this.allMatchesByPool.every(pool =>
          pool.rounds.every(round =>
            round.matches
              .filter(match => this.scheduledMap[match.id]) // hanya match yang dijadwalkan
              .every(match => match.selected)
          )
        );


        this.updateMatchOrder();
        this.progress = 100;

      } catch (error) {
        this.progress = 100;
        const errorMessage = error.response?.data?.message ||
          error.message || "Failed to load schedule details";

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

      const selectedMatches = this.allMatchesByPool.flatMap(pool =>
        pool.rounds
          .filter(round => !this.selectedRound || round.round == this.selectedRound)
          .flatMap(round =>
            round.matches
              .filter(match => match.selected)
              .map(match => {
                const base = {
                  order: match.match_order,
                  start_time: match.match_time,
                  note: `Match between ${match.participant_one?.name || 'Unknown'} vs ${match.participant_two?.name || 'Unknown'}`
                };

                // 🧠 Deteksi apakah ini pertandingan seni atau tanding
                if (match.seni_match_id) {
                  return { ...base, seni_match_id: match.seni_match_id };
                } else {
                  return { ...base, tournament_match_id: match.id };
                }
              })
          )
      );

      if (selectedMatches.length === 0) {
        this.toast.error("Please select at least one match");
        this.loading = false;
        this.progress = 100;
        return;
      }

      const invalidMatch = selectedMatches.find(m => !m.order || !m.start_time);
      if (invalidMatch) {
        this.toast.error("Match order and time must be filled in all selected matches.");
        this.loading = false;
        this.progress = 100;
        return;
      }

      const isTanding = selectedMatches.some(m => m.tournament_match_id);

      const payload = {
        tournament_id: this.form.tournament_id,
        tournament_arena_id: this.form.tournament_arena_id,
        scheduled_date: this.form.scheduled_date,
        start_time: this.form.start_time,
        end_time: this.form.end_time,
        note: this.form.note,
        matches: selectedMatches,
        ...(isTanding && { match_category_id: this.form.match_category_id }) // kirim hanya untuk tanding
      };

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

.table .round-separator td {
  background-color: #F2F2F2;
  text-transform: uppercase;
}

.table-header{
  background-color: #1E2A57 !important;
  color: #ffffff;
}

.table-sub-header{
  background-color: #E2F1FD !important;
  border-bottom:1px solid #9ab3d1 !important;
}

.table-responsive {
  overflow-x: auto;
}
</style>