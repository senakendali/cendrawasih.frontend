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

            <!-- Mode: Default / Battle -->
            <div class="mb-3">
              <label class="form-label"><strong>Mode</strong></label>
              <select class="form-select" v-model="form.mode">
                <option value="default">Default</option>
                <option value="battle">Battle</option>
              </select>
            </div>

            <!-- Babak (muncul hanya saat Battle) -->
            <div class="mb-3" v-if="form.mode === 'battle'">
              <label class="form-label"><strong>Babak</strong></label>
              <select class="form-select" v-model="selectedBattleRound">
                <option value="">Semua Babak</option>
                <option v-for="opt in battleRoundOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
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
                        {{ pool.matches[0]?.pool?.age_category?.name?.toUpperCase() }}
                      </th>
                    </tr>

                    <!-- Header kolom: beda untuk battle vs non-battle -->
                    <tr
                      class="table-sub-header"
                      v-if="pool.matches?.length && pool.matches[0]?.mode === 'battle'"
                    >
                      <th style="width:110px; display: none;">Match Number</th>
                      <th style="width:140px;">Babak</th>
                      
                      <th>Kontingen</th>
                      <th colspan="3">Peserta</th>
                    </tr>

                    <tr
                      class="table-sub-header"
                      v-else
                    >
                      <th style="width:110px;">Match Number</th>
                      <th>Kontingen</th>
                      <th colspan="3">Peserta</th>
                    </tr>
                  </thead>

                  <!-- BODY: BATTLE -->
                  <tbody v-if="pool.matches?.length && pool.matches[0]?.mode === 'battle'">
                    <tr
                      v-for="entry in pool.matches"
                      :key="entry.id"
                      :class="rowClass(entry)"
                    >
                      <!-- Match Number + checkbox -->
                      <td style="width:110px; display: none;">
                        <input type="checkbox" v-model="entry.selected" />
                        {{ entry.match_order }}
                      </td>

                      <!-- Babak -->
                      <td>{{ entry.round_label || '-' }}</td>

                     

                      <!-- Kontingen (pakai helper agar BYE/TBD kebaca) -->
                      <td>
                        {{ displayContingent(entry, entry.round) }}
                      </td>

                      <!-- Peserta dinamis + BYE/TBD aware (pakai displayName) -->
                      <template v-if="entry.match_type === 'seni_tunggal'">
                        <td>{{ displayName(entry.team_member1, entry.round) }}</td>
                        <td colspan="2">-</td>
                      </template>

                      <template v-else-if="entry.match_type === 'seni_ganda'">
                        <td>{{ displayName(entry.team_member1, entry.round) }}</td>
                        <td>{{ displayName(entry.team_member2, entry.round) }}</td>
                        <td>-</td>
                      </template>

                      <template v-else-if="entry.match_type === 'seni_regu'">
                        <td>{{ displayName(entry.team_member1, entry.round) }}</td>
                        <td>{{ displayName(entry.team_member2, entry.round) }}</td>
                        <td>{{ displayName(entry.team_member3, entry.round) }}</td>
                      </template>
                    </tr>
                  </tbody>

                  <!-- BODY: NON-BATTLE (unchanged) -->
                  <tbody v-else>
                    <tr v-for="entry in pool.matches" :key="entry.id">
                      <td>
                        <input type="checkbox" v-model="entry.selected" />
                        {{ entry.match_order }}
                      </td>
                      <td>{{ entry.contingent?.name || '-' }}</td>

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
        match_category: ['seni_tunggal', 'seni_ganda', 'seni_regu', 'solo_kreatif'],
        gender: ['male', 'female'],
        age_category: [], // diisi setelah load
        pool: [] // diisi setelah load
      },
      matchCategoryOptions: [
        { label: 'Tunggal', value: 'seni_tunggal' },
        { label: 'Ganda', value: 'seni_ganda' },
        { label: 'Regu', value: 'seni_regu' },
        { label: 'Solo Kreatif', value: 'solo_kreatif' },
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
        note: "",
        mode: "default",         
      },
      battleRoundOptions: [],
      selectedBattleRound: "", 
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
      const raw = Array.isArray(this.matchList)
        ? this.matchList
        : Object.values(this.matchList || {});

      return raw
        .map(item => {
          const pools = (item.pools || [])
            .map(pool => {
              // 1) filter dulu berdasar MODE + (jika battle) ROUND LABEL
              let matches = (pool.matches || []).filter(m => {
                const isBattle = m?.mode === 'battle';
                if (this.form.mode === 'battle') {
                  if (!isBattle) return false;
                  if (this.selectedBattleRound) {
                    return String(m.round_label || '') === String(this.selectedBattleRound);
                  }
                  return true;
                } else {
                  return !isBattle; // default mode: non-battle saja
                }
              });

              if (!matches.length) return null;

              // 2) apply filter UI lain (kategori, gender, age, pool)
              const matchType = matches[0]?.match_type || null;
              const passCategory =
                this.filters.match_category.length === 0 ||
                this.filters.match_category.includes(matchType);

              const passGender =
                this.filters.gender.length === 0 ||
                this.filters.gender.includes(item.gender);

              const ageId = matches[0]?.pool?.age_category?.id;
              const passAge =
                this.filters.age_category.length === 0 ||
                (ageId && this.filters.age_category.includes(ageId));

              const passPool =
                this.filters.pool.length === 0 ||
                this.filters.pool.includes(pool.name);

              return (passCategory && passGender && passAge && passPool)
                ? { ...pool, matches }
                : null;
            })
            .filter(Boolean);

          return pools.length ? { ...item, pools } : null;
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
      immediate: true,
      handler: async function (newId) {
        if (!newId) return;

        await this.fetchArenasByTournament(newId);

        // siapkan pilihan babak kalau mode battle
        if (this.form.mode === 'battle') {
          await this.fetchBattleRounds(newId);
        } else {
          this.battleRoundOptions = [];
          this.selectedBattleRound = "";
        }

        // ambil match list (BE boleh abaikan param; kita tetap filter di client)
        await this.fetchMatchList();
      }
    },

    'form.mode': {
      immediate: false,
      handler: async function (mode) {
        if (!this.form.tournament_id) return;

        if (mode === 'battle') {
          await this.fetchBattleRounds(this.form.tournament_id);
        } else {
          this.battleRoundOptions = [];
          this.selectedBattleRound = "";
        }
        // tidak wajib refetch server; tapi kalau BE support filter server-side, boleh:
        await this.fetchMatchList();
      }
    },

    // kalau ganti babak: cukup recompute (computed akan jalan).
    // kalau BE support param round_label, boleh panggil fetchMatchList lagi.
    selectedBattleRound() {
      // client-side only: biarkan computed yang menyaring
      // kalau mau minta BE, uncomment:
      // this.fetchMatchList();
    },
  },

  methods: {
    async fetchBattleRounds(tournamentId) {
      this.battleRoundOptions = [];
      this.selectedBattleRound = "";
      if (!tournamentId) return;

      try {
        // (opsional) kalau BE support: kembalikan { rounds: { "Final":"Final", ... } }
        const res = await axios.get(`/seni/tournament/${tournamentId}/available-rounds`, {
          params: { mode: 'battle' }
        });
        const rounds = res.data?.rounds || {};
        const opts = Object.entries(rounds).map(([value, label]) => ({
          value, label: label || value
        }));
        if (opts.length) {
          this.battleRoundOptions = opts;
          return;
        }
      } catch (_) {
        // ignore -> fallback
      }

      // Fallback: scan dari matchList yang ada
      const set = new Set();
      (Array.isArray(this.matchList) ? this.matchList : []).forEach(group => {
        (group.pools || []).forEach(pool => {
          (pool.matches || [])
            .filter(m => m.mode === 'battle' && m.round_label)
            .forEach(m => set.add(m.round_label));
        });
      });
      this.battleRoundOptions = Array.from(set).map(v => ({ value: v, label: v }));
    },
    rowClass(entry) {
      if (!entry) return '';
      if (entry.mode === 'battle') {
        if (entry.corner === 'blue') return 'battle-row battle-blue';
        if (entry.corner === 'red')  return 'battle-row battle-red';
      }
      return '';
    },
    getUnitCols(pool) {
      switch (pool.matches[0]?.match_type) {
        case 'seni_tunggal': return 1
        case 'seni_ganda': return 2
        case 'seni_regu': return 3
        default: return 1
      }
    },

    // total kolom table per pool (untuk colspan header)
    getTotalCols(pool) {
      if (pool?.matches?.[0]?.mode === 'battle') {
        return 1 /* Round */ + (this.getUnitCols(pool) * 2); // Biru + Merah
      }
      return this.getUnitCols(pool); // non-battle: hanya kolom peserta
    },


    _isEmptySlot(player) {
      if (!player) return true;
      if (typeof player === 'string') {
        const s = this._s(player);
        return !s || this._isBye(s) || this._isPlaceholder(s);
      }
      // object tanpa nama valid dianggap kosong
      return this._extractName(player) === '';
    },
    displayName(player, round) {
      const r = Number(round) || 1;
      if (this._isEmptySlot(player)) return r === 1 ? 'BYE' : 'TBD';
      return this._extractName(player) || (r === 1 ? 'BYE' : 'TBD');
    },

    displayContingent(entity, round) {
      const r = Number(round) || 1;

      // Deteksi: entity adalah "side/match" (pair[0]/pair[1]) atau "player"
      const isSide =
        entity && typeof entity === 'object' &&
        ('corner' in entity || 'match_type' in entity || 'team_member1' in entity || 'round_label' in entity);

      if (isSide) {
        const side = entity;
        const tm = side.team_member1; // battle tunggal: kontingen diambil dari side, fallback ke player
        // Slot kosong → BYE/TBD
        if (!tm || this._isEmptySlot(tm)) return r === 1 ? 'BYE' : 'TBD';

        // 1) Coba ambil dari level side (pair[x].contingent)
        let cg = '';
        const c = side.contingent;
        if (c) {
          if (typeof c === 'object') {
            const objCand = [c.name, c.short_name, c.fullname, c.display_name];
            for (const v of objCand) {
              const s = this._s(v);
              if (s && !this._isPlaceholder(s)) { cg = s; break; }
            }
          } else if (typeof c === 'string') {
            const s = this._s(c);
            if (s && !this._isPlaceholder(s)) cg = s;
          }
        }
        // 2) Fallback dari player (kalau side kosong)
        if (!cg) cg = this._extractContingent(tm);

        return cg || '-';
      }

      // ==== entity dianggap "player" ====
      if (this._isEmptySlot(entity)) return r === 1 ? 'BYE' : 'TBD';
      const cg = this._extractContingent(entity);
      return cg || '-';
    },

    _extractName(player) {
    if (!player) return '';
    if (typeof player === 'string') {
      const s = this._s(player);
      return (this._isBye(s) || this._isPlaceholder(s)) ? '' : s;
    }
    // object
    const cand = [
      player.name,
      player.full_name,
      player.display_name,
      player.player_name,
      player?.team_member?.name,
    ];
    for (const v of cand) {
      const s = this._s(v);
      if (s && !this._isBye(s) && !this._isPlaceholder(s)) return s;
    }
    return '';
  },

  // Ambil kontingen dari berbagai bentuk (object/string/alias/nested)
  _extractContingent(player) {
    if (!player) return '';
    // kalau string -> tidak ada info kontingen
    if (typeof player === 'string') return '';

    const c = player.contingent;
    // contingent sebagai object
    if (c && typeof c === 'object') {
      const objCand = [c.name, c.short_name, c.fullname, c.display_name];
      for (const v of objCand) {
        const s = this._s(v);
        if (s && !this._isPlaceholder(s)) return s;
      }
    }
    // contingent sebagai string / alias lain
    const flatCand = [
      player.contingent,            // string
      player.contingent_name,
      player.team_name,
      player?.team?.name,
      player?.team_member?.contingent_name,
      player?.team_member?.contingent?.name,
      player?.member?.contingent_name,
      player?.member?.contingent?.name,
      player?.club?.name,
      player?.club_name,
    ];
    for (const v of flatCand) {
      const s = this._s(v);
      if (s && !this._isPlaceholder(s)) return s;
    }
    return '';
  },

  _s(v) {
    return (v === 0 || typeof v === 'number' || typeof v === 'string')
      ? String(v).trim()
      : '';
  },
  _isBye(v) {
    const s = this._s(v).toUpperCase();
    return s === 'BYE';
  },
  _isPlaceholder(v) {
    // treat '-' / '—' / 'N/A' / 'NULL' / 'UNDEFINED' as kosong
    const s = this._s(v).toUpperCase();
    return s === '-' || s === '—' || s === 'N/A' || s === 'NULL' || s === 'UNDEFINED';
  },
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
        mode: this.form.mode || undefined,
        round_label: this.form.mode === 'battle' && this.selectedBattleRound
          ? this.selectedBattleRound
          : undefined,
      };
      if (this.isEdit) params.include_scheduled = true;

      const response = await axios.get("/seni/match-list", {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });

      this.matchList = response.data || [];

      // poolOptions
      const poolNames = [...new Set(
        (this.matchList || []).flatMap(g => (g.pools || []).map(p => p.name))
      )];
      this.poolOptions = poolNames;
      if (this.filters.pool.length === 0) this.filters.pool = poolNames;

      // ageCategoryOptions
      const ageMap = new Map();
      (this.matchList || []).flatMap(g => g.pools || []).forEach(pool => {
        const age = pool.matches?.[0]?.pool?.age_category;
        if (age && !ageMap.has(age.id)) ageMap.set(age.id, age.name);
      });
      this.ageCategoryOptions = Array.from(ageMap, ([id, name]) => ({ id, name }));
      if (this.filters.age_category.length === 0) {
        this.filters.age_category = this.ageCategoryOptions.map(a => a.id);
      }

      this.setAllMatchesSelected(true);
    } catch (error) {
      console.error("Error loading seni match list:", error);
      this.matchList = [];
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
              // pakai properti yang lu set di updateMatchOrder()
              order: m.match_order || null,
            start_time: m.match_time || null,
              // kirim info babak biar tersimpan
              round: (typeof m.round === 'number') ? m.round : null,
              round_label: m.mode === 'battle' ? (m.round_label || '') : undefined,
              note: m.note || `Seni Match in ${pool.name}`,
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
        mode: this.form.mode,
        matches: selectedMatches
      };

      try {
        this.progress = 60;
        const endpoint = this.isEdit
          ? `/match-schedules/${this.scheduleId}`
          : "/match-schedules";
        const method = this.isEdit ? "put" : "post";

        console.log('PAYLOAD =>', JSON.parse(JSON.stringify(payload)));


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

/* ==== Highlight baris battle: biru / merah ==== */
.battle-row td {
  transition: background-color .15s ease-in-out, border-left-color .15s ease-in-out;
}
.battle-blue td {
  background-color: #002FB9;           /* biru muda */
  color: #FFFFFF;
}
.battle-red td {
  background-color: #F80000;           /* merah muda */
  color: #FFFFFF;
  
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