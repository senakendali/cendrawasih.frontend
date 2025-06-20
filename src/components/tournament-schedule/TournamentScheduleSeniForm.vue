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
        {{ isEdit ? "Edit Schedule (Seni)" : "Add Schedule (Seni)" }}
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
              <label for="age_category_id" class="form-label">Age Category</label>
              <select
                class="form-select"
                id="age_category_id"
                v-model="form.age_category_id"
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

            <div class="admin-form d-flex flex-column gap-3 mb-4">
              <!-- Match Category -->
              <div>
                <label class="form-label d-block mb-1"><strong>Match Category</strong></label>
                <div class="d-flex flex-wrap gap-3 align-items-center">
                  <div class="form-check" style="min-width: 100px;">
                    <input type="checkbox" class="form-check-input" id="match-all" :checked="isAllChecked('match_category')" @change="toggleAll('match_category', matchCategoryOptions)" />
                    <label class="form-check-label" for="match-all">All</label>
                  </div>
                  <div class="form-check" v-for="opt in matchCategoryOptions" :key="opt.value" style="min-width: 100px;">
                    <input type="checkbox" class="form-check-input" :id="'match-' + opt.value" :value="opt.value" v-model="filters.match_category" />
                    <label class="form-check-label" :for="'match-' + opt.value">{{ opt.label }}</label>
                  </div>
                </div>
              </div>

              <!-- Gender -->
              <div>
                <label class="form-label d-block mb-1"><strong>Gender</strong></label>
                <div class="d-flex flex-wrap gap-3 align-items-center">
                  <div class="form-check" style="min-width: 100px;">
                    <input type="checkbox" class="form-check-input" id="gender-all" :checked="isAllChecked('gender')" @change="toggleAll('gender', genderOptions)" />
                    <label class="form-check-label" for="gender-all">All</label>
                  </div>
                  <div class="form-check" v-for="opt in genderOptions" :key="opt.value" style="min-width: 100px;">
                    <input type="checkbox" class="form-check-input" :id="'gender-' + opt.value" :value="opt.value" v-model="filters.gender" />
                    <label class="form-check-label" :for="'gender-' + opt.value">{{ opt.label }}</label>
                  </div>
                </div>
              </div>

              <!-- Age Category -->
              <div>
                <label class="form-label d-block mb-1"><strong>Age Category</strong></label>
                <div class="d-flex flex-wrap gap-3 align-items-center">
                  <div class="form-check" style="min-width: 100px;">
                    <input type="checkbox" class="form-check-input" id="age-all" :checked="isAllChecked('age_category')" @change="toggleAll('age_category', ageCategoryOptions)" />
                    <label class="form-check-label" for="age-all">All</label>
                  </div>
                  <div class="form-check" v-for="age in ageCategoryOptions" :key="age.id" style="min-width: 100px;">
                    <input type="checkbox" class="form-check-input" :id="'age-' + age.id" :value="age.id" v-model="filters.age_category" />
                    <label class="form-check-label" :for="'age-' + age.id">{{ age.name }}</label>
                  </div>
                </div>
              </div>

              <!-- Pool -->
              <div>
                <label class="form-label d-block mb-1"><strong>Pool</strong></label>
                <div class="d-flex flex-wrap gap-3 align-items-center">
                  <div class="form-check" style="min-width: 100px;">
                    <input type="checkbox" class="form-check-input" id="pool-all" :checked="isAllChecked('pool')" @change="toggleAll('pool', poolOptions)" />
                    <label class="form-check-label" for="pool-all">All</label>
                  </div>
                  <div class="form-check" v-for="pool in poolOptions" :key="pool" style="min-width: 100px;">
                    <input type="checkbox" class="form-check-input" :id="'pool-' + pool" :value="pool" v-model="filters.pool" />
                    <label class="form-check-label" :for="'pool-' + pool">{{ pool }}</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Table to display navigation data -->
            <div v-for="categoryGroup in filteredMatchList" :key="categoryGroup.category + '-' + categoryGroup.gender">

              <!-- Judul Kategori dan Gender -->
              <h4 class="text-uppercase text-primary mb-3">
                {{ categoryGroup.category }} - {{ categoryGroup.gender === 'male' ? 'PUTRA' : 'PUTRI' }}
              </h4>

              <!-- Loop per Pool -->
              <div v-for="pool in categoryGroup.pools" :key="pool.name" class="mb-5">
                <!--div>
                  <button class="btn btn-sm btn-outline-primary me-2" type="button" @click="selectAllInPool(pool)">
                    Select All
                  </button>
                  <button class="btn btn-sm btn-outline-secondary" type="button" @click="unselectAllInPool(pool)">
                    Unselect All
                  </button>
                </div-->
                <table class="table mt-4">
                  <thead>
                    <!-- Header Informasi Pool -->
                    <tr>
                      <th colspan="6" class="table-header text-start text-uppercase">
                        {{ pool.name }}
                      </th>
                    </tr>
                    <tr>
                      <th colspan="6" class="table-header text-start text-uppercase">
                        {{ pool.matches[0]?.pool?.age_category?.name.toUpperCase() }}
                      </th>
                    </tr>
                    <tr class="table-sub-header">
                      <th>Match Number</th>
                      <th>Kontingen</th>
                      <th colspan="3">Peserta</th> <!-- Kolom dinamis, nanti isi di tbody -->
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="entry in pool.matches" :key="entry.id">
                      <td>
                        <input type="checkbox" v-model="entry.selected" />
                        {{ entry.match_order }}
                      </td>
                      <td>{{ entry.contingent?.name || '-' }}</td>

                      <!-- Dinamis: render kolom peserta tergantung match_type -->
                      <template v-if="entry.match_type === 'seni_tunggal'">
                        <td>{{ entry.team_member1?.name || '-' }}</td>
                        <td colspan="2">-</td>
                      </template>

                      <template v-else-if="entry.match_type === 'seni_ganda'">
                        <td>{{ entry.team_member1?.name || '-' }}</td>
                        <td>{{ entry.team_member2?.name || '-' }}</td>
                        <td>-</td>
                      </template>

                      <template v-else-if="entry.match_type === 'seni_regu'">
                        <td>{{ entry.team_member1?.name || '-' }}</td>
                        <td>{{ entry.team_member2?.name || '-' }}</td>
                        <td>{{ entry.team_member3?.name || '-' }}</td>
                      </template>
                    </tr>
                  </tbody>
                </table>

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
      matchList: {}, // <- ini
      filters: {
        match_category: ['seni_tunggal', 'seni_ganda', 'seni_regu'],
        gender: ['male', 'female'],
        age_category: [], // diisi setelah load
        pool: [] // diisi setelah load
      },
      matchCategoryOptions: [
        { label: 'Tunggal', value: 'seni_tunggal' },
        { label: 'Ganda', value: 'seni_ganda' },
        { label: 'Regu', value: 'seni_regu' },
      ],
      genderOptions: [
        { label: 'Putra', value: 'male' },
        { label: 'Putri', value: 'female' },
      ],
      ageCategoryOptions: [], // diisi saat loadPools
      poolOptions: [], // diisi saat loadPools
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
    filteredPools() {
      return this.allPools.filter(pool => this.shouldShowPool(pool));
    },
    filteredMatchList() {
      const data = Array.isArray(this.matchList)
        ? this.matchList
        : Object.values(this.matchList);

      return data
        .map(item => {
          const matchType = item.pools[0]?.matches[0]?.match_type;
          const gender = item.gender;

          const matchCategoryMatch =
            this.filters.match_category.length > 0 &&
            this.isMatchByFilter(matchType, this.filters.match_category);

          const genderMatch =
            this.filters.gender.length > 0 &&
            this.isMatchByFilter(gender, this.filters.gender);

          const ageCategoryMatch =
            this.filters.age_category.length > 0 &&
            item.pools.some(pool =>
              pool.matches[0]?.pool?.age_category &&
              this.isMatchByFilter(pool.matches[0].pool.age_category.id, this.filters.age_category)
            );

          const filteredPools = item.pools.filter(pool =>
            this.filters.pool.length > 0 &&
            this.isMatchByFilter(pool.name, this.filters.pool)
          );

          if (matchCategoryMatch && genderMatch && ageCategoryMatch && filteredPools.length > 0) {
            return {
              ...item,
              pools: filteredPools,
            };
          }

          return null;
        })
        .filter(Boolean);
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
    form: {
      handler(val) {
        if (val.age_category_id) {
          // Set filters.age_category jadi array berisi satu item (yang dipilih)
          this.filters.age_category = [val.age_category_id];
        }
      },
      deep: true
    },

    'form.match_category_id': 'updateMatchOrderDelayed',
    'form.age_category_id': 'updateMatchOrderDelayed',
    'form.category_class_id': 'updateMatchOrderDelayed',
    'selectedRound': 'updateMatchOrderDelayed',
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
          this.fetchMatchList();
          
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
    selectAllInPool(pool) {
      pool.matches.forEach(match => match.selected = true);
    },
    unselectAllInPool(pool) {
      pool.matches.forEach(match => match.selected = false);
    },
    getSelectedMatches() {
      return this.matchList.flatMap(group =>
        group.pools.flatMap(pool =>
          pool.matches.filter(entry => entry.selected)
        )
      );
    },
    isMatchByFilter(value, filterArray) {
      return filterArray.includes(value);
    },

    isMatchByFilterInsensitive(value, filterArray) {
      return filterArray
        .map(f => f?.toString().trim().toLowerCase())
        .includes(value?.toString().trim().toLowerCase());
    },

    isAllChecked(type) {
      if (type === 'match_category') {
        return this.filters.match_category.length === this.matchCategoryOptions.length;
      } else if (type === 'gender') {
        return this.filters.gender.length === this.genderOptions.length;
      } else if (type === 'age_category') {
        return this.filters.age_category.length === this.ageCategoryOptions.length;
      } else if (type === 'pool') {
        return this.filters.pool.length === this.poolOptions.length;
      }
      return false;
    },

    toggleAll(type) {
      if (type === 'match_category') {
        this.filters.match_category = this.isAllChecked(type)
          ? []
          : this.matchCategoryOptions.map(o => o.value);
      } else if (type === 'gender') {
        this.filters.gender = this.isAllChecked(type)
          ? []
          : this.genderOptions.map(o => o.value);
      } else if (type === 'age_category') {
        this.filters.age_category = this.isAllChecked(type)
          ? []
          : this.ageCategoryOptions.map(o => o.id); // ✅ pakai id, bukan value
      } else if (type === 'pool') {
        this.filters.pool = this.isAllChecked(type)
          ? []
          : this.poolOptions.slice(); // <- bikin salinan array pool (karena poolOptions isinya string)
      }
    },
    groupByClassAndPool() {
      const grouped = {};
      for (const pool of this.pools) {
        const className = `${pool.category_class.gender} - ${pool.category_class.name} (${pool.category_class.weight_min} - ${pool.category_class.weight_max} KG)`;
        if (!grouped[className]) grouped[className] = {};
        if (!grouped[className][pool.name]) grouped[className][pool.name] = [];
        grouped[className][pool.name].push(pool);
      }
      this.groupedPools = grouped;
    },




    shouldShowPool(poolName) {
      return this.matchList.some(group =>
        group.pools.some(pool => pool.name === poolName)
      );
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
      if (!this.form.age_category_id || !this.form.tournament_id) return;
      try {
        const response = await axios.get(`/fetch-available-class`, {
          params: {
            age_category_id: this.form.age_category_id,
            tournament_id: this.form.tournament_id,
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

  setAllMatchesSelected(value = true) {
    this.matchList.forEach(group => {
      group.pools.forEach(pool => {
        pool.matches.forEach(match => {
          match.selected = value;
        });
      });
    });
  },


  toggleSelectAll() {
    // just trigger updateMatchOrder via selectAll
    this.selectAll = !this.selectAll;
    this.onSelectAllChange({ target: { checked: this.selectAll } });
  },

  updateMatchOrder() {
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


  async fetchMatchList() {
    this.loading = true;
    try {
      const params = {
        tournament_id: this.form.tournament_id,
      };

      if (this.isEdit) {
        params.include_scheduled = true; // ✅ hanya kalau edit
      }

      const response = await axios.get("/seni/match-list", {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      this.matchList = response.data;

      // Pool list (unique)
      const poolNames = [...new Set(response.data.flatMap(g => g.pools.map(p => p.name)))];
      this.poolOptions = poolNames;

      if (this.filters.pool.length === 0) {
        this.filters.pool = poolNames;
      }

      // Age Category list
      const ageMap = new Map();
      response.data.flatMap(g => g.pools).forEach(pool => {
        const age = pool.matches[0]?.pool?.age_category;
        if (age && !ageMap.has(age.id)) {
          ageMap.set(age.id, age.name);
        }
      });
      this.ageCategoryOptions = Array.from(ageMap.entries()).map(([id, name]) => ({ id, name }));

      if (this.filters.age_category.length === 0) {
        this.filters.age_category = this.ageCategoryOptions.map(item => item.id);
      }
      this.setAllMatchesSelected(true);

    } catch (error) {
      console.error("Error loading seni match list:", error);
    } finally {
      this.loading = false;
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

        // Set ID supaya trigger watcher
        this.form.tournament_id = detail.tournament_id;

        // Tunggu match list dari tournament ini
        await this.fetchMatchList(detail.tournament_id);
        console.log("✅ Match list fetched", this.matchList);

        // Set nilai form lainnya
        this.form = {
          ...this.form,
          tournament_arena_id: detail.tournament_arena_id,
          scheduled_date: detail.scheduled_date || '',
          start_time: detail.start_time ? detail.start_time.substring(0, 5) : '',
          end_time: detail.end_time ? detail.end_time.substring(0, 5) : '',
          note: detail.note || ''
        };

        // Tandai match yang sudah dijadwalkan (khusus seni)
        this.scheduledMap = {};
        (detail.details || []).forEach(scheduled => {
          if (scheduled.seni_match_id) {
            this.scheduledMap[scheduled.seni_match_id] = true;
          }
        });

        // Checklist match yang dijadwalkan
        this.matchList.forEach(group => {
          group.pools.forEach(pool => {
            pool.matches.forEach(match => {
              match.selected = !!this.scheduledMap[match.id];
            });
          });
        });

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

      // Ambil match yang dipilih
      const selectedMatches = (this.filteredMatchList || []).flatMap(group =>
        group.pools.flatMap(pool =>
          pool.matches
            .filter(m => m.selected)
            .map(m => ({
              seni_match_id: m.id,
              order: m.order || null,
              start_time: m.start_time || null,
              note: m.note || `Seni Match in ${pool.name}`
            }))
        )
      );


      // Validasi minimal 1 match dipilih
      if (selectedMatches.length === 0) {
        this.toast.error("Please select at least one match");
        this.loading = false;
        this.progress = 100;
        return;
      }

     

      const payload = {
        tournament_id: this.form.tournament_id,
        tournament_arena_id: this.form.tournament_arena_id,
        age_category_id: this.form.age_category_id,
        scheduled_date: this.form.scheduled_date,
        start_time: this.form.start_time,
        end_time: this.form.end_time,
        note: this.form.note,
        matches: selectedMatches
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