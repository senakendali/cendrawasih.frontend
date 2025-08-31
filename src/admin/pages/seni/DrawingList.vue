<template>
  <Teleport to="body">
  <!-- Modal Bracket -->
  <div
      class="modal fade"
      id="bracketModal"
      ref="bracketModal"
      tabindex="-1"
      aria-labelledby="bracketModalLabel"
      aria-hidden="true"
    >
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="bracketModalLabel">
            {{ modalBracketTitle }}
          </h5>

          <div class="d-flex align-items-center gap-2">
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
        </div>


        <div class="modal-body">
          <div class="d-flex justify-content-center">
            <button
              type="button"
              class="button button-primary"
              :disabled="!activePool || bracketLoading || bracketRegenerating"
              @click="regenerateBracket"
            >
              <span v-if="bracketRegenerating" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              <i v-if="!bracketRegenerating" class="bi bi-arrow-clockwise"></i> Regenerate
            </button>
          </div>

          <div v-if="bracketLoading" class="py-5 text-center">
            <div class="spinner-border" role="status"></div>
            <div class="mt-2">Loading bracket…</div>
          </div>

          <div v-else>
            <div v-if="bracketError" class="alert alert-danger mb-3">{{ bracketError }}</div>

            <div v-if="!rounds.length">
              <p class="text-center text-muted">Belum ada bracket untuk pool ini.</p>
            </div>

            <!-- ===== Bracket Render ===== -->
            <div v-else id="tournament-bracket" class="bracket-scroll">

              
              <!-- CASE: Custom bracket (manual render, type 2) -->
              
              <div v-if="bracketType === 2" class="match-bracket">
                <div
                  v-for="(game, index) in games"
                  :key="'manual-' + index"
                  class="match-container"
                >
                  <!-- Player 1 -->
                  <div class="player-1">
                    <div class="p-name">
                      {{ displayNameBracket(game?.player1, isFinalOnly ? { finalOnly: true } : {}) }}
                    </div>
                    <div class="p-contingent" v-if="displayContingentBracket(game?.player1)">
                      {{ displayContingentBracket(game?.player1) }}
                    </div>
                  </div>

                  <!-- Player 2 -->
                  <div class="player-2">
                    <div class="p-name">
                      {{ displayNameBracket(game?.player2, isFinalOnly ? { finalOnly: true } : {}) }}
                    </div>
                    <div class="p-contingent" v-if="displayContingentBracket(game?.player2)">
                      {{ displayContingentBracket(game?.player2) }}
                    </div>
                  </div>
                </div>
              </div>


              <!-- CASE: Langsung final (tepat 1 match) → pakai card manual -->
              <div v-else-if="isFinalOnly" class="final-only">
                <div class="match-container">
                  <!-- Player 1 -->
                  <div class="player-1">
                    <div class="p-name">
                      {{ displayNameBracket(finalOnlyGame?.player1 || null, { finalOnly: true }) }}
                    </div>
                    <div class="p-contingent" v-if="displayContingentBracket(finalOnlyGame?.player1 || null)">
                      {{ displayContingentBracket(finalOnlyGame?.player1 || null) }}
                    </div>
                  </div>

                  <!-- Player 2 -->
                  <div class="player-2">
                    <div class="p-name">
                      {{ displayNameBracket(finalOnlyGame?.player2 || null, { finalOnly: true }) }}
                    </div>
                    <div class="p-contingent" v-if="displayContingentBracket(finalOnlyGame?.player2 || null)">
                      {{ displayContingentBracket(finalOnlyGame?.player2 || null) }}
                    </div>
                  </div>
                </div>
              </div>


              <!-- CASE: Normal bracket (>= 2 match) -->
              <div v-else>
                <bracket :rounds="roundsWithRound">
                  <template #player="{ player }">
                    <div
                      class="vtb-player-custom"
                      :title="
                        displayNameBracket(player, {}) +
                        (displayContingentBracket(player) ? (' • ' + displayContingentBracket(player)) : '')
                      "
                    >
                      <div class="vtb-player-name">
                        {{ displayNameBracket(player, {}) }}
                      </div>
                      <div class="vtb-player-contingent"
                          v-if="displayContingentBracket(player)">
                        {{ displayContingentBracket(player) }}
                      </div>
                    </div>
                  </template>
                </bracket>
              </div>
            </div>

            <!-- ===== /Bracket Render ===== -->
          </div>
        </div>



      </div>
    </div>
  </div>
  </Teleport>

  <div>
    <!-- Bootstrap Modal -->
    <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Konfirmasi Hapus</h5>
            <i class="bi bi-x-square"></i>
          </div>
          <div class="modal-body">
            Apakah Anda yakin ingin menghapus kontingen ini?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
            <button type="button" class="btn btn-danger" @click="deleteContingent">Yes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="dashboard-container">
    <div
      v-if="loading"
      class="progress-bar"
      :style="{ width: progress + '%' }"
    ></div>

    <div class="mb-2 page-title">
      <i class="bi bi-file-earmark-text"></i> Seni
    </div>

    <div class="mb-2 d-flex justify-content-end align-items-center">
      <!-- Search Bar -->
     
      <!-- Create Menu Button -->
      <router-link to="/admin/seni/create" class="button button-primary">
        <i class="bi bi-plus-square"></i> Add New
      </router-link>
    </div>

    <!-- Filter Section -->
    <div class="admin-form d-flex flex-column gap-3 mb-4">
      <!-- Tournament Dropdown -->
        <div>
          <label class="form-label d-block mb-1"><strong>Turnamen</strong></label>
          <select class="form-select" v-model="selectedTournament" @change="onTournamentChange">
            <option value="" disabled selected>Pilih Turnamen</option>
            <option v-for="tournament in tournamentOptions" :key="tournament.id" :value="tournament.id">
              {{ tournament.name }}
            </option>
          </select>
        </div>

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
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="text-uppercase text-primary mb-0">
          {{ categoryGroup.category }} - {{ categoryGroup.gender === 'male' ? 'PUTRA' : 'PUTRI' }}
        </h4>
        <button
          class="btn btn-outline-success"
          @click="regenerateGroup(categoryGroup)"
        >
          <i class="bi bi-arrow-clockwise"></i> Regenerate
        </button>
      </div>


      <!-- Loop per Pool -->
      <div v-for="pool in categoryGroup.pools" :key="pool.id" class="mb-5">
        <table class="table mt-4">
          <thead>
            <!-- Header Pool -->
            <tr>
              <th :colspan="getTotalCols(pool)" class="table-header">
                <div class="d-flex justify-content-between align-items-center text-uppercase">
                  <span>{{ pool.name }}</span>
                  <button
                    v-if="pool.matches[0]?.mode === 'battle'"
                    type="button"
                    class="btn btn-outline-light btn-sm"
                    @click="openBracketModal(pool)"
                  >
                    <i class="bi bi-diagram-3"></i> View Bracket
                  </button>
                </div>
              </th>
            </tr>

            <tr>
              <th :colspan="getTotalCols(pool)" class="text-start text-uppercase">
                {{ pool.matches[0]?.pool?.age_category?.name.toUpperCase() }}
              </th>
            </tr>

            <!-- Header kolom -->
            <tr class="table-sub-header" v-if="pool.matches[0]?.mode === 'battle'">
              <th class="text-center">Babak</th>
              <th 
                class="text-center" 
                :colspan="getUnitCols(pool) * 2"
              >
                Peserta
              </th>
            </tr>


            <tr class="table-sub-header" v-else>
              <th :colspan="getUnitCols(pool)" class="text-center">Peserta</th>
            </tr>
          </thead>


          <tbody v-if="pool.matches?.length && pool.matches[0]?.mode === 'battle'">
            <template v-for="(pair, index) in getMatchPairs(pool.matches)" :key="index">
              <tr>
                <!-- Round -->
                <td class="round-label text-center align-middle fw-bold">
                  {{ (pair[0] && pair[0].round_label) || (pair[1] && pair[1].round_label) || '-' }}
                </td>

                <!-- 🔹 SUDUT BIRU -->
                <td
                  v-if="pair[0]?.match_type === 'seni_tunggal' || !pair[0]"
                  class="corner-blue"
                >
                  {{ displayNameTable(pair[0]?.team_member1, pair[0]?.round || pair[1]?.round, pool) }}<br>
                  <small
                    class="text-white vtb-player-contingent"
                    v-if="!_isEmptySlot(pair[0]?.team_member1)"
                  >
                    {{ displayContingent(pair[0], pair[0]?.round || pair[1]?.round) }}
                  </small>
                </td>

                <template v-else-if="pair[0]?.match_type === 'seni_ganda'">
                  <td class="corner-blue">
                    {{ displayNameTable(pair[0]?.team_member1, pair[0].round, pool) }}
                  </td>
                  <td class="corner-blue">
                    {{ displayNameTable(pair[0]?.team_member2, pair[0].round, pool) }}
                  </td>
                </template>

                <template v-else-if="pair[0]?.match_type === 'seni_regu'">
                  <td class="corner-blue">
                    {{ displayNameTable(pair[0]?.team_member1, pair[0].round, pool) }}
                  </td>
                  <td class="corner-blue">
                    {{ displayNameTable(pair[0]?.team_member2, pair[0].round, pool) }}
                  </td>
                  <td class="corner-blue">
                    {{ displayNameTable(pair[0]?.team_member3, pair[0].round, pool) }}
                  </td>
                </template>

                <!-- 🔸 SUDUT MERAH -->
                <td
                  v-if="pair[1]?.match_type === 'seni_tunggal' || !pair[1]"
                  class="corner-red"
                >
                  {{ displayNameTable(pair[1]?.team_member1, pair[1]?.round || pair[0]?.round, pool) }}<br>
                  <small
                    class="text-white vtb-player-contingent"
                    v-if="!_isEmptySlot(pair[1]?.team_member1)"
                  >
                    {{ displayContingent(pair[1], pair[1]?.round || pair[0]?.round) }}
                  </small>
                </td>

                <template v-else-if="pair[1]?.match_type === 'seni_ganda'">
                  <td class="corner-red">
                    {{ displayNameTable(pair[1]?.team_member1, pair[1].round, pool) }}
                  </td>
                  <td class="corner-red">
                    {{ displayNameTable(pair[1]?.team_member2, pair[1].round, pool) }}
                  </td>
                </template>

                <template v-else-if="pair[1]?.match_type === 'seni_regu'">
                  <td class="corner-red">
                    {{ displayNameTable(pair[1]?.team_member1, pair[1].round, pool) }}
                  </td>
                  <td class="corner-red">
                    {{ displayNameTable(pair[1]?.team_member2, pair[1].round, pool) }}
                  </td>
                  <td class="corner-red">
                    {{ displayNameTable(pair[1]?.team_member3, pair[1].round, pool) }}
                  </td>
                </template>
              </tr>
            </template>
          </tbody>


          <!-- NON-BATTLE -->
          <tbody v-else-if="pool.matches?.length && pool.matches[0]?.mode !== 'battle'">
            <tr v-for="m in pool.matches" :key="m.id">
              <!-- TUNGGAL -->
              <td v-if="m.match_type === 'seni_tunggal'">
                <div class="player-name">{{ m.team_member1?.name || '-' }}</div>
                <div class="player-contingent text-muted">
                  {{ m.contingent?.name || '-' }}
                </div>
              </td>

              <!-- GANDA -->
              <template v-else-if="m.match_type === 'seni_ganda'">
                <td>
                  <div class="player-name">{{ m.team_member1?.name || '-' }}</div>
                  <div class="player-contingent text-muted">
                    {{ m.contingent?.name || '-' }}
                  </div>
                </td>
                <td>
                  <div class="player-name">{{ m.team_member2?.name || '-' }}</div>
                </td>
              </template>

              <!-- REGU -->
              <template v-else-if="m.match_type === 'seni_regu'">
                <td>
                  <div class="player-name">{{ m.team_member1?.name || '-' }}</div>
                  <div class="player-contingent text-muted">
                    {{ m.contingent?.name || '-' }}
                  </div>
                </td>
                <td><div class="player-name">{{ m.team_member2?.name || '-' }}</div></td>
                <td><div class="player-name">{{ m.team_member3?.name || '-' }}</div></td>
              </template>

              <!-- FALLBACK (kalau tipe lain) -->
              <td v-else>
                <div class="player-name">{{ m.team_member1?.name || '-' }}</div>
                <div class="player-contingent text-muted">
                  {{ m.contingent?.name || '-' }}
                </div>
              </td>
            </tr>
          </tbody>

          <!-- EMPTY STATE -->
          <tbody v-else>
            <tr>
              <td :colspan="getUnitCols(pool) * (pool.matches?.[0]?.mode === 'battle' ? 2 : 1)"
                  class="text-center text-muted">
                Belum ada match.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import API from "@/config/api";
import { Modal } from "bootstrap";
import { useToast } from "vue-toastification";
import { inject } from 'vue';
import Bracket from "vue-tournament-bracket";



axios.defaults.baseURL = API.API_BASE_URL;

export default {
  name: "ContingentList",
  components: {
    Bracket, // daftar biar bisa dipakai di template
  },
  data() {
    return {
      activePool: null,
      bracketLoading: false,
      bracketError: null,
      bracketType: 0,
      rounds: [],   // ✅ default array, bukan undefined
      games: [],    // ✅ default array
      selectedTournament: '',
      tournamentOptions: [], // dropdown turnamen
      poolId: null,
      deleteModal: null,
      pools: [],
      matchList: {}, // <- ini
      loading: false,
      progress: 0,
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
      matchCategoryMap: {
        seni_tunggal: 2,
        seni_ganda: 3,
        seni_regu: 4,
        solo_kreatif: 5
      },

      ageCategoryOptions: [], // diisi saat loadPools
      poolOptions: [], // diisi saat loadPools
      bracketRegenerating: false,

    };
  },

  computed: {

      modalBracketTitle() {
        const name = this.activePool?.name || '';
        const mt   = this._matchTypeLabel(this.activePool?.match_type);
        const age  = this.activePool?.age_name || '';
        const g    = this._genderLabel(this.activePool?.gender);

        return [name, mt, g, age].filter(Boolean).join(' ');
      },
      
      finalGame() {
        const rr = Array.isArray(this.roundsWithRound) ? this.roundsWithRound : [];
        if (rr.length !== 1) return null;
        const g = rr[0]?.games;
        if (!Array.isArray(g) || g.length !== 1) return null;
        return g[0]; // { player1, player2 }
      },
      finalRound() {
        const rr = Array.isArray(this.roundsWithRound) ? this.roundsWithRound : [];
        if (!rr.length) return 1;
        return Number(rr[0]?.round ?? 1);
      },

      isFinalOnly() {
        if (this.bracketType === 2) return false; // manual mode biarkan apa adanya
        const rs = Array.isArray(this.roundsWithRound) ? this.roundsWithRound : [];
        if (!rs.length) return false;
        let total = 0;
        for (const r of rs) total += Array.isArray(r?.games) ? r.games.length : 0;
        return total === 1; // tepat satu match → langsung final
      },

      finalOnlyGame() {
        if (!this.isFinalOnly) return null;
        return this.roundsWithRound?.[0]?.games?.[0] || null;
      },

      roundsForBracket() {
        // untuk kasus normal (>=2 match) tetap pakai struktur yang sudah jalan
        return this.roundsWithRound;
      },


      // Pastikan tiap player & game punya 'round' supaya helper BYE/TBD konsisten
       roundsWithRound() {
        const list = Array.isArray(this.rounds) ? this.rounds : [];
        return list.map((r, idx) => {
          if (r && typeof r === 'object' && Array.isArray(r.games)) {
            const roundNum = Number(r.round ?? (idx + 1));
            const games = r.games.map(g => ({
              round: Number(g?.round ?? roundNum),
              player1: g?.player1 ? { ...g.player1, round: Number(g.player1.round ?? roundNum) } : null,
              player2: g?.player2 ? { ...g.player2, round: Number(g.player2.round ?? roundNum) } : null,
            }));
            return { round: roundNum, games };
          }
          if (Array.isArray(r)) {
            const roundNum = idx + 1;
            const games = r.map(p => ({
              round: roundNum,
              player1: p?.player1 ? { ...p.player1, round: Number(p.player1.round ?? roundNum) } : null,
              player2: p?.player2 ? { ...p.player2, round: Number(p.player2.round ?? roundNum) } : null,
            }));
            return { round: roundNum, games };
          }
          return { round: idx + 1, games: [] };
        });
      },


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
  },


  setup() {
    const toast = useToast();
    const permissions = inject('permissions', []); // Ensure permissions is always an array
    
    return { toast, permissions };
  },
  mounted() {
    this.fetchTournaments();
    //this.loadPools(); // Corrected the method name
    this.deleteModal = new Modal(document.getElementById("confirmDeleteModal"));
  },
  methods: {

    _matchTypeLabel(t) {
      switch (t) {
        case 'seni_tunggal': return 'Tunggal';
        case 'seni_ganda':   return 'Ganda';
        case 'seni_regu':    return 'Regu';
        case 'solo_kreatif': return 'Solo Kreatif';
        default:
          return (t || '').toString().replace(/_/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
      }
    },
    _genderLabel(g) {
      if (!g) return '';
      const s = g.toString().toLowerCase();
      if (s === 'male'   || s === 'putra' ) return 'Putra';
      if (s === 'female' || s === 'putri' ) return 'Putri';
      return ''; // kalau nggak jelas, kosongkan aja
    },

    isFinalOnlyPool(pool) {
      const pairs = this.getMatchPairs(pool?.matches || []);
      return pairs.length === 1;
    },

    // Versi khusus untuk table: kalau final-only & slot kosong → '-'
    displayNameTable(player, round, pool) {
      if (this.isFinalOnlyPool(pool) && this._isEmptySlot(player)) {
        return '-';
      }
      return this.displayName(player, round);
    },

    
    
    displayNameBracket(player, opts = {}) {
      // finalOnly bisa boolean true atau object { finalOnly: true }
      const finalOnly =
        opts === true || (typeof opts === 'object' && !!opts.finalOnly);

      const norm = (v) => (v ?? '').toString().trim();
      const isWinnerPlaceholder = (s) => /^pemenang\s*partai\s*#/i.test(norm(s));
      const isPlaceholderString = (s) => {
        const t = norm(s).toUpperCase();
        return (
          !t ||
          t === '-' ||
          t === '—' ||
          t === 'BYE' ||
          t === 'TBD' ||
          t === 'N/A' ||
          t === 'NULL' ||
          t === 'UNDEFINED' ||
          isWinnerPlaceholder(t)
        );
      };

      // null/undefined
      if (player == null) return finalOnly ? '-' : 'TBD';

      // string
      if (typeof player === 'string') {
        return isPlaceholderString(player) ? (finalOnly ? '-' : 'TBD') : norm(player);
      }

      // object → cek anggota tim
      const rawNames = [
        player?.team_member1?.name,
        player?.team_member2?.name,
        player?.team_member3?.name,
      ];
      const names = rawNames
        .map(norm)
        .filter((nm) => !isPlaceholderString(nm));

      if (names.length) return names.join(', ');

      // cek field name sederhana
      const nm = norm(player?.name);
      if (nm && !isPlaceholderString(nm)) return nm;

      // fallback placeholder
      return finalOnly ? '-' : 'TBD';
    },




    displayContingentBracket(player) {
      if (!player) return null;

      // Jangan tampilkan kontingen untuk placeholder
      const disp = this.displayNameBracket(player);
      if (disp === 'TBD' || disp === '-') return null;

      // Prioritas: field contingent
      if (player?.contingent) {
        if (typeof player.contingent === 'string') {
          const s = player.contingent.trim();
          if (s) return s;
        } else if (typeof player.contingent === 'object') {
          const s = (player.contingent.name || player.contingent.short_name || '').toString().trim();
          if (s) return s;
        }
      }

      // Fallback: pakai extractor yang sudah ada
      const alt = this._extractContingent(player);
      return alt || null;
    },



    async loadBracket(poolId) {
      this.bracketLoading = true;
      this.bracketError = null;
      try {
        const res = await axios.get(`/seni/pools/${poolId}/bracket`, { params: { _t: Date.now() } });
        const raw = res?.data ?? {};

        let type   = Number(raw.match_chart ?? raw.type ?? 1);
        let rounds = Array.isArray(raw.rounds) ? raw.rounds : null;

        // 🔧 jika rounds bentuk lama (array-of-pairs), ubah ke { round, games }
        if (Array.isArray(rounds) && rounds.length && !rounds[0]?.games) {
          rounds = rounds.map((pairs, idx) => ({
            round: idx + 1,
            games: (pairs || []).map(p => ({
              round: idx + 1,
              player1: p?.player1 || null,
              player2: p?.player2 || null,
            })),
          }));
        }

        // fallback dari flat matches → normalisasi
        const payload = raw?.data ?? raw;
        if ((!rounds || !rounds.length) && Array.isArray(payload.matches)) {
          const norm = this._normalizeMatchesToRounds(payload.matches, payload.type ?? type);
          type   = norm.type ?? type;
          rounds = norm.rounds ?? [];
        }

        this.bracketType = type;
        this.rounds      = rounds || [];
        this.games       = this.rounds?.[0]?.games ?? [];
        this.finalGame   = raw.final ?? null; // boleh diabaikan karena computed finalGame sudah robust
        this.finalRound  = raw.final_round ?? (this.rounds?.length || 1);
      } catch (e) {
        this.bracketError = e?.response?.data?.message || e.message;
      } finally {
        this.bracketLoading = false;
      }
    },

    // === Normalisasi dari bentuk {matches:[...]} → {rounds:[ [ {player1,player2} ] ]} ===
  _normalizeMatchesToRounds(matches = [], fallbackType = 1) {
    // round -> Map(battle_group -> pair)
    const roundMap = new Map();

    for (const m of matches) {
      const rnum = Number(m.round) || 1;
      if (!roundMap.has(rnum)) roundMap.set(rnum, new Map());

      const gkey = m.battle_group ?? m.order ?? m.match_order ?? m.id;
      const mapForRound = roundMap.get(rnum);

      if (!mapForRound.has(gkey)) {
        mapForRound.set(gkey, { blue: null, red: null, order: (m.order ?? m.match_order ?? 0) });
      }
      const pair = mapForRound.get(gkey);

      // jaga urutan stabil
      const ord = (m.order ?? m.match_order ?? 0);
      if (ord && (!pair.order || ord < pair.order)) pair.order = ord;

      // player object sederhana utk bracket
      const toPlayer = (mm) => ({
        round: rnum,
        // biarkan nama kosong bila belum diketahui → nanti tampil 'TBD'
        // tetapi taruh struktur jika sudah ada
        name: [
          mm?.team_member1?.name,
          mm?.team_member2?.name,
          mm?.team_member3?.name,
        ].filter(Boolean).join(', '),
        contingent: mm?.contingent?.name || null,
        // simpan juga field original biar slot #player tetap aman
        team_member1: mm?.team_member1 || null,
        team_member2: mm?.team_member2 || null,
        team_member3: mm?.team_member3 || null,
        contingent_obj: mm?.contingent || null,
      });

      if ((m.corner || '').toLowerCase() === 'blue') pair.blue = toPlayer(m);
      else pair.red = toPlayer(m);
    }

    // Build rounds: array of { round, games: [{player1,player2}] }
    const roundNums = Array.from(roundMap.keys()).sort((a,b)=>a-b);
    const rounds = roundNums.map(rnum => {
      const pairs = Array.from(roundMap.get(rnum).values())
        .sort((a,b)=>(a.order ?? 0) - (b.order ?? 0));
      const games = pairs.map(p => ({
        round: rnum,
        player1: p.blue || null,
        player2: p.red  || null,
      }));
      return { round: rnum, games };
    });

    return { type: fallbackType, rounds };
  },

    // dipakai table battle supaya tidak render "-" + "Pemenang partai..."
    hasAny(side) {
      if (!side || typeof side !== 'object') return false;
      const hasName = !!(side.team_member1?.name || side.team_member2?.name || side.team_member3?.name);
      const hasCont = !!(side.contingent?.name);
      return hasName || hasCont;
    },

    async regenerateBracket() {
      if (!this.activePool?.id) return;

      // pakai judul lengkap; fallback ke nama pool aja kalau belum kebentuk
      const poolTitle =
        this.modalBracketTitle ||
        [ this.activePool?.name,
          this._matchTypeLabel(this.activePool?.match_type),
          this._genderLabel(this.activePool?.gender),
          this.activePool?.age_name,
        ].filter(Boolean).join(' ');

      const ok = window.confirm(
        `Regenerate bracket untuk ${poolTitle}?\n` +
        `Apabila sudah membuat jadwal untuk match ini maka jadwal harus dibuat ulang.`
      );
      if (!ok) return;

      try {
        this.bracketRegenerating = true;

        await axios.post(`/seni/matches/${this.activePool.id}/regenerate-pool`);
        await this.refetchBracketForActivePool();
        await this.loadPools();

        this.toast.success('Bracket berhasil di-regenerate');

      } catch (err) {
        console.error('Regenerate bracket gagal:', err);
        alert(err?.response?.data?.message || 'Gagal regenerate bracket');
      } finally {
        this.bracketRegenerating = false;
      }
    },

      // === Re-fetch bracket (silakan sesuaikan dengan cara kamu load bracket sekarang) ===
      // === Re-fetch bracket utk pool aktif ===
    async refetchBracketForActivePool() {
      if (!this.activePool?.id) return;
      await this.loadBracket(this.activePool.id);
    },

  /**
   * Terima payload berbagai bentuk & kembalikan shape seragam utk UI.
   * Prioritas:
   *  - Jika sudah ada rounds (array-of-arrays), pakai langsung.
   *  - Jika hanya ada matches (flat), build rounds dari matches (battle_group).
   */
  _normalizeBracketPayload(payload = {}) {
    // Jika backend sudah kasih rounds siap pakai
    if (Array.isArray(payload.rounds) && payload.rounds.length) {
      // Pastikan setiap player punya properti round (biar slot <player> aman)
      const rounds = payload.rounds.map((pairs, idx) =>
        (pairs || []).map(p => ({
          player1: { ...(p.player1 || {}), round: p.player1?.round ?? (idx + 1) },
          player2: { ...(p.player2 || {}), round: p.player2?.round ?? (idx + 1) },
        }))
      );

      return {
        type: payload.type ?? 1,
        games: payload.games ?? [],
        rounds,
        final: payload.final ?? null,
        final_round: payload.final_round ?? rounds.length,
      };
    }

    // Jika backend balikin flat matches → build sendiri
    if (Array.isArray(payload.matches) && payload.matches.length) {
      const rounds = this._buildRoundsFromMatches(payload.matches);

      // Final-only detection
      let finalGame = null;
      if (rounds.length === 1 && rounds[0].length === 1) {
        const only = rounds[0][0];
        finalGame = {
          player1: only.player1,
          player2: only.player2,
        };
      }

      return {
        type: payload.type ?? 1,
        games: payload.games ?? [],
        rounds,
        final: finalGame,
        final_round: rounds.length || 1,
      };
    }

    // Fallback kosong
    return { type: 1, games: [], rounds: [], final: null, final_round: 1 };
  },

  /**
   * Build struktur rounds (array-of-arrays) dari flat matches battle.
   * - Gabung blue+red per battle_group
   * - Kelompokkan per round (angka), urutkan by order/match_order
   * - Isi nama “Pemenang partai #X” dari winner_of_order jika slot kosong
   */
  // REPLACE
  _buildRoundsFromMatches(matches = []) {
    const data = matches.filter(m => (m.mode || '').toLowerCase() === 'battle');

    // group: `${round}::${battle_group}`
    const pairMap = new Map();
    for (const m of data) {
      const round = Number(m.round ?? 1);
      const g     = m.battle_group ?? m.match_order ?? m.id;
      const key   = `${round}::${g}`;

      if (!pairMap.has(key)) {
        pairMap.set(key, {
          round,
          order: m.order ?? m.match_order ?? Number.MAX_SAFE_INTEGER,
          round_label: m.round_label || '',
          blue: null,
          red:  null,
        });
      }

      const slot = pairMap.get(key);
      const ord  = m.order ?? m.match_order ?? Number.MAX_SAFE_INTEGER;
      if (ord < slot.order) slot.order = ord;
      if (!slot.round_label && m.round_label) slot.round_label = m.round_label;

      const toPlayer = (mm) => ({
        round,
        name: [
          mm?.team_member1?.name,
          mm?.team_member2?.name,
          mm?.team_member3?.name,
        ].filter(Boolean).join(', '),
        contingent: mm?.contingent?.name || null,

        // simpan juga bentuk asal bila slot #player butuh
        team_member1: mm?.team_member1 || null,
        team_member2: mm?.team_member2 || null,
        team_member3: mm?.team_member3 || null,
        contingent_obj: mm?.contingent || null,
      });

      const corner = (m.corner || '').toLowerCase();
      if (corner === 'blue') slot.blue = toPlayer(m);
      if (corner === 'red')  slot.red  = toPlayer(m);
    }

    // -> array, sort by round/order, lalu kelompokkan per round jadi { round, games }
    const pairs = Array.from(pairMap.values())
      .sort((a,b) => (a.round - b.round) || (a.order - b.order));

    const byRound = new Map();
    for (const p of pairs) {
      if (!byRound.has(p.round)) byRound.set(p.round, []);
      byRound.get(p.round).push(p);
    }

    const rounds = Array.from(byRound.entries())
      .sort((a,b)=>a[0]-b[0])
      .map(([roundNumber, arr]) => {
        arr.sort((a,b)=>a.order - b.order);
        const games = arr.map(p => ({
          round: roundNumber,
          player1: p.blue || null,
          player2: p.red  || null,
        }));
        return { round: roundNumber, games };
      });

    return rounds;
  },


    // ===== Utils kecil =====
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

  // Ambil nama dari berbagai bentuk
  _extractName(player) {
    if (!player) return '';
    if (typeof player === 'string') {
      const s = this._s(player);
      return (this._isBye(s) || this._isPlaceholder(s) || /^pemenang\s*partai\s*#/i.test(s)) ? '' : s;
    }
    const cand = [
      player.name,
      player.full_name,
      player.display_name,
      player.player_name,
      player?.team_member?.name,
    ];
    for (const v of cand) {
      const s = this._s(v);
      if (s && !this._isBye(s) && !this._isPlaceholder(s) && !/^pemenang\s*partai\s*#/i.test(s)) {
        return s;
      }
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

  // Slot kosong? (null/undefined/'BYE'/'-' dll, atau object tanpa nama)
  _isEmptySlot(player) {
    if (!player) return true;
    if (typeof player === 'string') {
      const s = this._s(player);
      return !s || this._isBye(s) || this._isPlaceholder(s);
    }
    // object tanpa nama valid dianggap kosong
    return this._extractName(player) === '';
  },

  // ====== Dipakai di template ======
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



    // jumlah peserta per tim berdasarkan match_type
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

    // Round 1: BYE; Round >1: TBD; kalau slot 2/3 dari tim kosong → “-”
    renderMemberOrByeTbd(m, n) {
      // ambil member n
      const tm = n === 1 ? m?.team_member1 : n === 2 ? m?.team_member2 : m?.team_member3;
      const name = tm?.name;

      // cek semua anggota kosong?
      const emptyAll = !m?.team_member1?.name && !m?.team_member2?.name && !m?.team_member3?.name;

      if (emptyAll) {
        if (n !== 1) return '-'; // slot 2/3 supaya tetap rapi
        const roundNum = Number(m?.round ?? m?.round_priority ?? 0);
        const isFirst = roundNum ? roundNum === 1
          : /round\s*1|babak\s*1|prelim|penyisihan|kualifikasi/i.test((m?.round_label || ''));
        return isFirst ? 'BYE' : 'TBD';
      }

      return name || '-';
    },

    // Non-battle: render nama atau “-” sesuai slot
    renderMemberOrDash(m, n) {
      const tm = n === 1 ? m?.team_member1 : n === 2 ? m?.team_member2 : m?.team_member3;
      return tm?.name || '-';
    },

    isFirstRound(m) {
      const r = Number(m?.round ?? m?.round_priority ?? 0);
      if (r) return r === 1;
      const label = (m?.round_label || '').toLowerCase();
      return /round\s*1|babak\s*1|prelim|penyisihan|kualifikasi/.test(label);
    },

    hasAnyMember(m) {
      return Boolean(
        m?.team_member1?.name || m?.team_member1?.id ||
        m?.team_member2?.name || m?.team_member2?.id ||
        m?.team_member3?.name || m?.team_member3?.id
      );
    },

    formatPlayers(m) {
      if (!m || !this.hasAnyMember(m)) {
        return this.isFirstRound(m) ? 'BYE' : 'TBD';
      }

      const type = m.match_type || 'seni_tunggal';
      const n1 = m.team_member1?.name;
      const n2 = m.team_member2?.name;
      const n3 = m.team_member3?.name;

      if (type === 'seni_tunggal') {
        return n1 || '-';
      }
      if (type === 'seni_ganda') {
        return [n1, n2].filter(Boolean).join(' / ') || '-';
      }
      if (type === 'seni_regu') {
        return [n1, n2, n3].filter(Boolean).join(' / ') || '-';
      }
      // default
      return n1 || '-';
    },

   
    getModalInstance() {
      const el = this.$refs.bracketModal
      if (!el) return null
      // pastikan instance konsisten
      let instance = Modal.getInstance(el)
      if (!instance) {
        instance = new Modal(el, {
          backdrop: true,  // 👈 pastikan opsi ada, biar gak undefined
          keyboard: true,
          focus: true,
        })
      }
      return instance
    },

    showModal() {
      const modal = this.getModalInstance()
      if (modal) modal.show()
    },

    hideModal() {
      const modal = this.getModalInstance()
      if (modal) modal.hide()
    },

  

    async openBracketModal(pool) {
      // ambil match pertama sebagai sumber meta (type/age/gender)
      const m0   = pool?.matches?.[0] || {};
      const age  = m0?.pool?.age_category?.name || '';
      const gRaw =
        m0?.gender ||
        m0?.pool?.gender ||
        pool?.gender ||
        pool?.category_class?.gender || '';

      this.activePool = {
        id: pool.id,
        name: pool.name,
        match_type: m0?.match_type || '',
        age_name: age,
        gender: gRaw
      };

      await this.loadBracket(pool.id);
      await this.$nextTick();
      this.showModal();
    },


      // 🔧 Adapter kalau responsnya model "rounds/games"
      toMatchesFromRounds(rounds = []) {
        const out = []
        rounds.forEach((round, rIdx) => {
          const roundLabel = `Round ${rIdx + 1}`
          ;(round.games || []).forEach((g, gIdx) => {
            // player1 = blue, player2 = red (konvensi)
            out.push({
              id: `r${rIdx + 1}g${gIdx + 1}b`,
              round_label: roundLabel,
              round_priority: rIdx + 1,
              order: gIdx + 1,
              corner: 'blue',
              match_type: 'seni_tunggal', // kalau perlu, lu bisa inject dari backend
              contingent: { name: g.player1?.contingent || '-' },
              team_member1: { name: g.player1?.name || '-' },
            })
            out.push({
              id: `r${rIdx + 1}g${gIdx + 1}r`,
              round_label: roundLabel,
              round_priority: rIdx + 1,
              order: gIdx + 1,
              corner: 'red',
              match_type: 'seni_tunggal',
              contingent: { name: g.player2?.contingent || '-' },
              team_member1: { name: g.player2?.name || '-' },
            })
          })
        })
        return this.normalizeMatchesForBracketView(out)
      },

      // ⛏️ Tetap pakai normalizer lama lu kalau BracketView butuh shape tertentu
      normalizeMatchesForBracketView(list) {
        return list.map(m => ({
          id: m.id,
          pool_id: m.pool_id,
          round_label: m.round_label,
          round_priority: m.round_priority,
          order: m.order,
          corner: m.corner, // 'blue' | 'red'
          match_type: m.match_type || 'seni_tunggal',
          contingent: m.contingent || null,
          team_member1: m.team_member1 || null,
          team_member2: m.team_member2 || null,
          team_member3: m.team_member3 || null,
        }))
      },
    
      
    makeStub(side, proto = {}) {
      return {
        id: `stub-${side}-${Math.random().toString(36).slice(2)}`,
        corner: side, // 'blue' | 'red'
        round_label: proto.round_label || '',
        match_type: proto.match_type || 'seni_tunggal',
        contingent: null,
        team_member1: null,
        team_member2: null,
        team_member3: null,
      };
    },
    getMatchPairs(matches = []) {
      if (!Array.isArray(matches)) return [];

      // helper inline (bukan method baru): tebak round awal/lanjut dari label
      const resolveRound = (m) => {
        const n = Number(m && (m.round ?? m.round_priority));
        if (n && !Number.isNaN(n)) return n;
        const s = ((m && m.round_label) || '').toString().toLowerCase();
        // label babak awal → 1, selain itu → 2 (final/semifinal/1/4 final dll dianggap lanjut)
        if (/round\s*1|babak\s*1|penyisihan|kualifikasi|prelim/.test(s)) return 1;
        return 2;
      };

      // Group by (round, battle_group)
      const buckets = new Map();
      for (const m of matches) {
        if (!m) continue;
        const round = resolveRound(m);
        const bg    = m.battle_group ?? m.match_order ?? 0;
        const key   = `${round}#${bg}`;

        if (!buckets.has(key)) {
          buckets.set(key, {
            round,
            round_label: m.round_label || `Round ${round}`,
            match_type: m.match_type || 'seni_tunggal',
            blue: null,
            red:  null,
          });
        }
        const b = buckets.get(key);
        if (m.match_type) b.match_type = m.match_type;

        // suntik round ke match & semua team_member
        const mm = { ...m, round };
        ['team_member1','team_member2','team_member3'].forEach(k => {
          if (mm[k]) mm[k] = { ...mm[k], round };
        });

        if (mm.corner === 'blue') b.blue = mm;
        else if (mm.corner === 'red') b.red = mm;
        else {
          if (!b.blue) b.blue = mm; else if (!b.red) b.red = mm;
        }
      }

      // placeholder aman
      const makePlaceholder = (mt, rl, corner, round) => ({
        match_type: mt || 'seni_tunggal',
        round_label: rl || `Round ${round ?? 1}`,
        corner,
        round: Number(round || 1),
        team_member1: null,
        team_member2: null,
        team_member3: null,
        contingent: null,
      });

      // sortir, lalu jadi pasangan [blue, red]
      const out = [...buckets.entries()]
        .sort((a, b) => {
          const [ra, bga] = a[0].split('#').map(n => parseInt(n, 10) || 0);
          const [rb, bgb] = b[0].split('#').map(n => parseInt(n, 10) || 0);
          if (ra !== rb) return ra - rb;
          return bga - bgb;
        })
        .map(([, b]) => {
          const blue = b.blue ?? makePlaceholder(b.match_type, b.round_label, 'blue', b.round);
          const red  = b.red  ?? makePlaceholder(b.match_type, b.round_label, 'red',  b.round);

          // safety: pastikan setiap member punya round juga
          [blue, red].forEach(side => {
            const r = Number(side.round || b.round || 1);
            side.round = r;
            ['team_member1','team_member2','team_member3'].forEach(k => {
              if (side[k]) side[k] = { ...side[k], round: r };
            });
          });

          return [blue, red];
        });

      return out;
    },

    groupMatches(matches = []) {
      const sorted = [...matches].sort((a, b) => {
        const ra = a.round ?? 0, rb = b.round ?? 0;
        if (ra !== rb) return ra - rb;

        const ga = a.battle_group ?? 0, gb = b.battle_group ?? 0;
        if (ga !== gb) return ga - gb;

        // blue dulu, baru red
        const ac = a.corner === 'blue' ? 0 : 1;
        const bc = b.corner === 'blue' ? 0 : 1;
        return ac - bc;
      });

      // group by round+battle_group
      const buckets = new Map();
      for (const m of sorted) {
        const key = `${m.round || 1}-${m.battle_group || 0}`;
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key).push(m);
      }

      // jadikan pasangan [blue, red]
      const pairs = [];
      for (const [, arr] of buckets) {
        let blue = arr.find(x => x.corner === 'blue');
        let red  = arr.find(x => x.corner === 'red');
        // fallback kalau data corner belum lengkap
        if (!blue && arr[0]) blue = arr[0];
        if (!red  && arr[1]) red  = arr[1];
        pairs.push([blue, red]);
      }
      return pairs;
    },
    async regenerateGroup(categoryGroup) {
      if (!this.selectedTournament) {
        this.toast.error("Pilih turnamen terlebih dahulu.");
        return;
      }

      // Ambil contoh pool yang punya data match
      const samplePool =
        categoryGroup.pools.find(p => Array.isArray(p.matches) && p.matches.length) ||
        categoryGroup.pools[0];

      const firstMatch = samplePool?.matches?.[0];
      const ageCategoryId = firstMatch?.pool?.age_category?.id;
      const matchType = firstMatch?.match_type;
      const matchCategoryId = this.matchCategoryMap[matchType];

      if (!ageCategoryId || !matchCategoryId) {
        this.toast.error("Data tidak lengkap (match type / age category tidak ditemukan).");
        return;
      }

      // Tentukan mode dari data existing
      const mode = firstMatch?.mode === 'battle' ? 'battle' : 'default';

      if (!confirm(
        `Regenerate semua match ${categoryGroup.category} - ` +
        `${categoryGroup.gender === 'male' ? 'PUTRA' : 'PUTRI'} ` +
        `(mode: ${mode}) ?`
      )) {
        return;
      }

      try {
        this.loading = true;

        // Payload dasar
        const payload = {
          tournament_id: this.selectedTournament,
          match_category_id: matchCategoryId,
          age_category_id: ageCategoryId,
          gender: categoryGroup.gender,
          mode, // ⬅️ penting: kirim mode yang diinginkan
        };

        // Jika battle, pakai bracket_type adaptif
        if (mode === 'battle') {
          // Biar fleksibel terhadap jumlah tim, pakai full_prestasi
          payload.bracket_type = 'full_prestasi';
        }

        await axios.post(`/seni/matches/regenerate`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });

        this.toast.success(`Berhasil regenerate peserta (mode: ${mode}).`);
        await this.loadPools();
      } catch (err) {
        console.error("Gagal regenerate:", err);
        const msg = err?.response?.data?.message || "Gagal regenerate.";
        this.toast.error(msg);
      } finally {
        this.loading = false;
      }
    },

    async fetchTournaments() {
      try {
        const res = await axios.get("/tournaments/active", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        this.tournamentOptions = res.data;
      } catch (err) {
        console.error('Gagal ambil turnamen:', err);
      }
    },
    onTournamentChange() {
      if (!this.selectedTournament) {
        this.matchList = {};
        return;
      }

      this.loadPools(); // panggil ulang data
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

    confirmDelete(id) {
      this.poolId = id;
      this.deleteModal.show();
    },
    
    async loadPools() {
      this.loading = true;
      try {
        
        const response = await axios.get(`/seni/matches?tournament_id=${this.selectedTournament}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });


        this.matchList = response.data;

        // Pool list (unique)
        const poolNames = [...new Set(response.data.flatMap(g => g.pools.map(p => p.name)))];
        this.poolOptions = poolNames;

        // ❌ Jangan langsung set filter.pool kalau user sudah pernah ubah
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

        // ❌ Sama, jangan override jika user sudah ubah
        if (this.filters.age_category.length === 0) {
          this.filters.age_category = this.ageCategoryOptions.map(item => item.id);
        }

      } catch (error) {
        console.error("Error loading seni match list:", error);
      } finally {
        this.loading = false;
      }
    },


    shouldShowPool(poolName) {
      return this.matchList.some(group =>
        group.pools.some(pool => pool.name === poolName)
      );
    },



    GenerateMatch(id) {
      this.$router.push({ name: "GenerateMatch", params: { id } });
    },
    ViewMatch(id) {
      this.$router.push({ name: "ViewMatch", params: { id } });
    },
  },
};
</script>

<style scoped>
:global(.modal-backdrop.show) { z-index: 2050 !important; }
:global(.modal.show)          { z-index: 2060 !important; }

.players-line {
  white-space: nowrap;      /* biar ga patah jadi banyak baris */
  overflow: hidden;
  text-overflow: ellipsis;  /* kalau kepanjangan, jadi ... */
}

.player-name {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
}
.player-contingent {
  font-size: 11px;
  font-style: italic;
  opacity: 0.85;
  margin-top: 2px;
}
.corner-blue .player-name, .corner-blue .player-contingent {
  color: #fff;
}
.corner-red .player-name, .corner-red .player-contingent {
  color: #fff;
}




.bracket-dialog {
  max-width: min(98vw, 1600px); /* modal lebih lebar */
}

.bracket-scroll {
  overflow-x: auto;
  overflow-y: visible;
  padding-bottom: 8px; /* ruang buat scrollbar */
}


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

.round-label {
  background-color: #f5f5f5; /* abu-abu terang */

}

.corner-blue {
  background-color: #002FB9 !important; /* biru */
  color: white !important;
  width: 40%;
}

.corner-red {
  background-color: #F80000 !important; /* merah */
  color: white !important;
  width: 40%;
}

  ::v-deep(.final-only .vtb-item-parent:after),
  ::v-deep(.final-only .vtb-item-child:before),
  ::v-deep(.final-only .vtb-item-child:after),
  ::v-deep(.final-only .vtb-connector),
  ::v-deep(.final-only .vtb-line),
  ::v-deep(.final-only path),
  ::v-deep(.final-only svg) {
    display: none !important;
    opacity: 0 !important;
    pointer-events: none !important;
    height: 0 !important;
    max-height: 0 !important;
  }

 .bracket-container {
    overflow: auto;
    width: 100%;
  }

  .match-bracket{
    display: flex;
    flex-wrap: wrap; /* Wrap items to the next row */
    gap: 20px; /* Space between items */
    justify-content: space-between;
  }

  .match-container{
    flex: 1 1 calc(20% - 20px); /* 20% width per item minus gap */
    max-width: calc(20% - 20px);
    background-color: #f0f0f0;
  }

  .match-container .player-1 {
    font-size: 12px;
    color: #FFFFFF;
    width: 100%;
    height:70px;
    padding: 12px;
    border-left: 5px solid #002FB9;
    border-top: 1px solid #002FB9;
    border-bottom: 1px solid #002FB9;

    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-right: 1px solid #002FB9;
    background: #002FB9;
  }

  

  .match-container .player-2 {
    font-size: 12px;
    color: #FFFFFF;
    width: 100%;
    height: 70px;
    padding: 12px;
    border-left: 5px solid #F80000;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-bottom: 1px solid #F80000;
    border-right: 1px solid #F80000;
    background: #F80000;
  }

  ::v-deep(.vtb-item-players .vtb-player.vtb-player1.defeated) {
    width: 200px;
    background-color: #002FB9;
    color: #FFFFFF;
  }

  ::v-deep(.vtb-item-players .vtb-player.vtb-player2.defeated) {
    width: 200px;
    background-color: #F80000;
    color: #FFFFFF;
  }


  ::v-deep(.vtb-item-players .defeated.highlight) {
    width: 200px;
    background-color: #f0f0f0;
    color: #1E2A57 ;
  }

  
  
  ::v-deep(.vtb-item-players) {
    width: 200px;
    background-color: #f0f0f0;
  }
  
  ::v-deep(.vtb-player1) {
    font-size: 12px;
    color: #FFFFFF;
    width: 100%;
    height: 50px;
    padding: 12px;
    border-left: 5px solid #002FB9;
    border-top: 1px solid #002FB9;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-right: 1px solid #002FB9;
    background: #002FB9;
  }
  
  ::v-deep(.vtb-player1)::after {
    width: 100%;
    height: 0.5px;
    background-color: #002FB9;
    display: block;
    content: "";
    position: absolute;
    top: 50%;
    left: 0px;
  }
  
  ::v-deep(.vtb-player2) {
    font-size: 12px;
    color: #FFFFFF;
    width: 100%;
    height: 50px;
    padding: 12px;
    border-left: 5px solid #F80000;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-bottom: 1px solid #F80000;
    border-right: 1px solid #F80000;
    background: #F80000;
  }
  
  ::v-deep(.vtb-item-child:after, .vtb-item-child:before) {
    content: "";
    position: absolute;
    background-color: gray;
    top: 50%;
  }
  
  ::v-deep(.vtb-item-child:before) {
    right: 0;
    transform: translateX(100%);
    width: 25px;
    height: 0.5px;
  }
  
  ::v-deep(.vtb-item-parent:after) {
    position: absolute;
    content: "";
    width: 25px;
    height: 0.5px;
    left: 0;
    top: 50%;
    background-color: #388E3C;
    transform: translateX(-100%);
  }
  
  ::v-deep(.vtb-item-child:after) {
    right: -25px;
    height: calc(50% + 22px);
    width: 1px;
  }

  /* untuk manual/final-only card */
  .p-name { font-weight: 500; line-height: 1.1; }
  .p-contingent { font-size: 11px; opacity: .9; margin-top: 2px; font-style: italic;}

  /* untuk komponen vue-tournament-bracket via slot */
  ::v-deep(.vtb-player-custom){
    display:flex; flex-direction:column; line-height:1.1;
  }
  ::v-deep(.vtb-player-name){ font-weight:500; font-size:12px; }
  ::v-deep(.vtb-player-contingent){ font-size:11px; opacity:.9; margin-top:2px; font-style: italic;}

  /* optional: potong teks kalau kepanjangan */
  .p-name, .p-contingent,
  ::v-deep(.vtb-player-name), ::v-deep(.vtb-player-contingent){
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
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

.table-header{
  background-color: #1E2A57 !important;
  color: #ffffff;
}

.table-sub-header th{
  background-color: #f2f2f2 !important;
  
}
</style>
