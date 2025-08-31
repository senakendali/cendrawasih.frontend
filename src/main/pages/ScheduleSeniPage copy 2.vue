<template>
  <div class="main-container">
    <div class="container" ref="printArea">
      <!-- Header -->
      <div class="row">
        <div class="col-lg-12 text-center my-4">
          <h1>Jadwal Pertandingan Kategori: Seni</h1>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="row filter mb-3">
        <div class="col-lg-12">
          <!-- Filter Tanggal -->
          <div class="mb-3">
            <label class="fw-bold">Filter Tanggal:</label>
            <div class="d-flex flex-wrap gap-3">
              <div>
                <input
                  type="checkbox"
                  id="date-check-all"
                  :checked="selectedDateFilters.length === allDates.length"
                  @change="toggleAllDates"
                />
                <label for="date-check-all">All Dates</label>
              </div>
              <div v-for="date in allDates" :key="date">
                <input
                  type="checkbox"
                  :id="'date-check-' + date"
                  :value="date"
                  v-model="selectedDateFilters"
                />
                <label :for="'date-check-' + date">{{ formatLongDate(date) }}</label>
              </div>
            </div>
          </div>

          <!-- Filter Kategori -->
          <div class="mb-3">
            <label class="fw-bold">Filter Kategori:</label>
            <div class="d-flex flex-wrap gap-3">
              <div>
                <input
                  type="checkbox"
                  id="category-check-all"
                  :checked="selectedCategoryFilters.length === allCategories.length"
                  @change="toggleAllCategories"
                />
                <label for="category-check-all">All Kategori</label>
              </div>
              <div v-for="category in allCategories" :key="category">
                <input
                  type="checkbox"
                  :id="'category-check-' + category"
                  :value="category"
                  v-model="selectedCategoryFilters"
                />
                <label :for="'category-check-' + category">{{ category }}</label>
              </div>
            </div>
          </div>

          <!-- Filter Gender -->
          <div class="mb-3">
            <label class="fw-bold">Filter Gender:</label>
            <div class="d-flex flex-wrap gap-3">
              <div>
                <input
                  type="checkbox"
                  id="gender-check-all"
                  :checked="selectedGenderFilters.length === allGenders.length"
                  @change="toggleAllGenders"
                />
                <label for="gender-check-all">All Gender</label>
              </div>
              <div v-for="gender in allGenders" :key="gender">
                <input
                  type="checkbox"
                  :id="'gender-check-' + gender"
                  :value="gender"
                  v-model="selectedGenderFilters"
                />
                <label :for="'gender-check-' + gender">{{ gender === 'male' ? 'Putra' : 'Putri' }}</label>
              </div>
            </div>
          </div>

          <!-- Filter Arena -->
          <div class="mb-3">
            <label class="fw-bold">Filter Arena:</label>
            <div class="d-flex flex-wrap gap-3">
              <div>
                <input
                  type="checkbox"
                  id="arena-check-all"
                  :checked="selectedArenaFilters.length === allArenaNames.length"
                  @change="toggleAllArena"
                />
                <label for="arena-check-all">All Arena</label>
              </div>
              <div v-for="arena in allArenaNames" :key="arena">
                <input
                  type="checkbox"
                  :id="'arena-check-' + arena"
                  :value="arena"
                  v-model="selectedArenaFilters"
                />
                <label :for="'arena-check-' + arena">{{ arena }}</label>
              </div>
            </div>
          </div>

          <!-- Filter Pool -->
          <div class="mb-3">
            <label class="fw-bold">Filter Pool:</label>
            <div class="d-flex flex-wrap gap-3">
              <div>
                <input
                  type="checkbox"
                  id="pool-check-all"
                  :checked="selectedPoolFilters.length === allPoolNames.length"
                  @change="toggleAllPool"
                />
                <label for="pool-check-all">All Pool</label>
              </div>
              <div v-for="pool in allPoolNames" :key="pool">
                <input
                  type="checkbox"
                  :id="'pool-check-' + pool"
                  :value="pool"
                  v-model="selectedPoolFilters"
                />
                <label :for="'pool-check-' + pool">{{ pool }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Schedule Table Section -->
      <div class="row bg-white">
        <div class="col-lg-12">
          <div class="table-responsive">

            <!-- Jika Tidak Ada Data -->
            <div v-if="Object.keys(groupedByDate).length === 0" class="text-center text-muted my-5">
              <h5>Belum ada jadwal pertandingan seni yang tersedia.</h5>
            </div>

            <!-- Loop per Tanggal -->
            <div v-for="(arenas, date) in groupedByDate" :key="date">
              <div v-for="(groupList, arenaName) in arenas" :key="arenaName">
                <div v-if="groupList && groupList.length">

                  <!-- Header Jadwal (per tanggal & arena) -->
                  <div class="row align-items-center mb-4">
                    <div class="col-3 d-flex align-items-center gap-3">
                      <img src="@/assets/images/ipsi.png" alt="Logo" style="width: 140px;" />
                    </div>
                    <div class="col-6 text-center">
                      <h4 class="text-dark mb-2 text-uppercase fw-bold">JADWAL {{ arenaName }}</h4>
                      <h4 class="text-dark mb-2 text-uppercase fw-bold">
                        {{ groupList[0]?.tournament_name || '-' }}
                      </h4>
                      <div class="text-dark text-uppercase fw-bold">
                        {{ formatLongDate(date) }}
                      </div>
                    </div>
                    <div class="col-3 text-end">
                      <button class="btn btn-outline-primary btn-sm" @click="downloadSchedule(groupList[0], date)">
                        <i class="bi bi-download me-1"></i> Download Schedule
                      </button>
                    </div>
                  </div>

                  <!-- ===================== BATTLE: SATU TABEL GABUNGAN ===================== -->
                  <!-- === BATTLE: satu tabel gabungan per arena === -->
                  <template v-if="getArenaBattleRows(groupList).length">
                    <table class="table table-striped mb-5">
                      <thead>
                        <tr class="table-sub-header">
                          <th>PARTAI</th>
                          <th>Babak</th>
                          <th>Kelas</th>
                          <th class="text-center" colspan="2">Peserta</th>
                          <th class="text-center" colspan="2">Waktu</th>
                          <th class="text-center" colspan="2">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in getArenaBattleRows(groupList)" :key="'b-'+row.order">
                          <td>{{ row.order }}</td>
                          <td class="text-uppercase">{{ row.round_label || '-' }}</td>
                          <td class="text-uppercase">{{ row.class_label || '-' }}</td>

                         <td class="corner-blue">
                            <template v-if="hasAny(row.blue)">
                              <div class="names" v-if="row.blue.names">{{ row.blue.names }}</div>
                              <div class="contingent" v-if="row.blue.contingent">{{ row.blue.contingent }}</div>
                              
                            </template>
                            <template v-else>-</template>
                          </td>

                          <td class="corner-red">
                            <template v-if="hasAny(row.red)">
                              <div class="names" v-if="row.red.names">{{ row.red.names }}</div>
                              <div class="contingent" v-if="row.red.contingent">{{ row.red.contingent }}</div>
                              
                            </template>
                            <template v-else>-</template>
                          </td>


                          <!-- duplikasi waktu/score biar simetris kiri/kanan -->
                          <td class="text-center">{{ row.time  || '-' }}</td>
                          <td class="text-center">{{ row.time  || '-' }}</td>
                          <td class="text-center">{{ row.score || '-' }}</td>
                          <td class="text-center">{{ row.score || '-' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </template>

                  <!-- ===================== NON-BATTLE: PER POOL (seperti biasa) ===================== -->
                  <template v-for="tb in getNonBattleTables(groupList)" :key="arenaName+'-'+tb.key">
                    <table class="table table-striped mb-5">
                      <thead>
                        <tr class="table-sub-header">
                          <th>PARTAI</th>
                          <th>Kontingen</th>
                          <th colspan="3">Nama Atlet</th>
                          <th class="text-center">Waktu</th>
                          <th class="text-center">Score</th>
                        </tr>
                        <tr>
                          <th :colspan="7" class="text-center fw-bold text-uppercase table-header">
                            {{ tb.title.category }}
                            {{ tb.title.gender === 'male' ? 'PUTRA' : 'PUTRI' }}
                            {{ tb.title.age?.toUpperCase() || '-' }} - {{ tb.title.pool }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="entry in tb.rows" :key="'nb-'+entry.id">
                          <td>{{ entry.match_order ?? entry.order ?? '-' }}</td>
                          <td>{{ entry.contingent?.name || '-' }}</td>

                          <template v-if="entry.match_type === 'seni_tunggal'">
                            <td colspan="3">{{ entry.team_member1?.name || '-' }}</td>
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
                          <template v-else>
                            <td colspan="3">{{ entry.team_member1?.name || '-' }}</td>
                          </template>

                          <td class="text-center">{{ entry.match_time || '-' }}</td>
                          <td class="text-center">{{ entry.final_score || '-' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </template>


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
import API from "@/config/api";
import html2pdf from "html2pdf.js";

export default {
  name: "SchedulePage",
  data() {
    return {
      allDates: [],
      allArenaNames: [],
      allPoolNames: [],
      allCategories: ['Tunggal', 'Ganda', 'Regu', 'Solo Kreatif'],
      selectedDateFilters: [],
      selectedArenaFilters: [],
      selectedPoolFilters: [],
      selectedCategoryFilters: ['Tunggal', 'Ganda', 'Regu', 'Solo Kreatif'],
      allGenders: ['male', 'female'],
      selectedGenderFilters: ['male', 'female'],

      scheduleData: [],

      

      tournamentName: '',
    };
  },

  computed: {
    filteredMatchList() {
      // Kalau lu pakai ini untuk ngecek "data kosong"
      return this.scheduleData.filter(entry =>
        this.selectedDateFilters.includes(entry.scheduled_date) &&
        this.selectedArenaFilters.includes(entry.arena_name)
      );
    },
  
    groupedByDate() {
      const grouped = {};

      console.log("📦 Jadwal Masuk:", this.scheduleData);
      console.log("📌 Filters Aktif:");
      console.log("🎯 Category:", this.selectedCategoryFilters);
      console.log("🎯 Gender:", this.selectedGenderFilters);
      console.log("🎯 Pool:", this.selectedPoolFilters);

      this.scheduleData.forEach(entry => {
        const date = entry.scheduled_date;
        const arena = entry.arena_name;

        // Skip jika filter tidak cocok
        if (
          !this.selectedDateFilters.includes(date) ||
          !this.selectedArenaFilters.includes(arena)
        ) {
          console.log("⛔ SKIPPED by filter", arena);
          return;
        }

        // Inisialisasi struktur
        if (!grouped[date]) grouped[date] = {};
        if (!grouped[date][arena]) grouped[date][arena] = [];

        const filteredGroups = (entry.groups || [])
          .filter(group =>
            (this.selectedCategoryFilters.length === 0 || this.selectedCategoryFilters.includes(group.category)) &&
            (this.selectedGenderFilters.length === 0 || this.selectedGenderFilters.includes(group.gender)) &&
            (
              this.selectedPoolFilters.length === 0 ||
              group.pools?.some(pool => this.selectedPoolFilters.includes(pool.name))
            )
          )
          .map(group => ({
            ...group,
            pools:
              this.selectedPoolFilters.length === 0
                ? group.pools
                : (group.pools || []).filter(pool =>
                    this.selectedPoolFilters.includes(pool.name)
                  ),
            arena_name: arena,
            tournament_name: entry.tournament_name
          }));

        if (filteredGroups.length > 0) {
          grouped[date][arena].push(...filteredGroups);
        } else {
          grouped[date][arena].push({
            arena_name: arena,
            tournament_name: entry.tournament_name,
            category: null,
            gender: null,
            pools: [],
          });
        }
      });

      console.log("🔥 groupedByDate Final:", grouped);
      return grouped;
    },





    filteredScheduleData() {
      return this.scheduleData
        .filter(arena =>
          this.selectedArenaFilters.includes(arena.arena_name) &&
          this.selectedDateFilters.includes(arena.scheduled_date) // ⬅️ Tambahan filter tanggal
        )
        .map(arena => {
          const filteredPools = arena.pools
            .filter(pool => this.selectedPoolFilters.includes(pool.pool_name))
            .map(pool => {
              const filteredRounds = pool.rounds
                .filter(round =>
                  this.selectedRoundFilters.includes(round.round_label) &&
                  round.matches.length > 0
                );
              return { ...pool, rounds: filteredRounds };
            })
            .filter(pool => pool.rounds.length > 0); // hanya pool dengan round yang valid

          return {
            ...arena,
            pools: filteredPools
          };
        })
        .filter(arena => arena.pools.length > 0); // hanya arena dengan pool valid
    }

  },

  mounted() {
    this.fetchSchedules();
    console.log("📦 Filters Aktif:");
    console.log("🎯 Category:", this.selectedCategoryFilters);
    console.log("🎯 Gender:", this.selectedGenderFilters);
    console.log("🎯 Pool:", this.selectedPoolFilters);

  },

  methods: {

    hasAny(side) {
      return !!(side && (side.contingent || side.names));
    },


     getNonBattlePools(categoryGroup) {
        const pools = (categoryGroup?.pools || []).map(p => {
          const matches = (p.matches || [])
            .filter(m => m?.mode !== 'battle')
            .sort((a, b) => (a.order ?? a.match_order ?? 0) - (b.order ?? b.match_order ?? 0));
          return { name: p.name, matches };
        });
        return pools.filter(p => p.matches.length > 0);
      },

    _matchTypeToCategory(mt) {
      switch (mt) {
        case 'seni_tunggal': return 'TUNGGAL';
        case 'seni_ganda':   return 'GANDA';
        case 'seni_regu':    return 'REGU';
        case 'solo_kreatif': return 'SOLO KREATIF';
        default:             return 'KATEGORI';
      }
    },

    /**
       * Gabung nama atlet utk tiap side:
       * - Tunggal: 1 nama
       * - Ganda/Regu: "nama1, nama2[, nama3]"
       * - Jika slot kosong (misal BYE), tampilkan 'BYE'
       */

    _joinMemberNames(entry) {
      if (!entry) return '';
      const names = [];
      if (entry.team_member1?.name) names.push(entry.team_member1.name);
      if (entry.team_member2?.name) names.push(entry.team_member2.name);
      if (entry.team_member3?.name) names.push(entry.team_member3.name);
      return names.join(', ');
    },

    // === ranking label babak (buat tau "sebelumnya" itu apa)
    _roundRank(label) {
      const L = String(label || '').toLowerCase();
      if (L.includes('final') && !L.includes('semi') && !L.includes('perempat') && !L.includes('delapan')) return 5; // Final
      if (L.includes('semifinal'))    return 4;
      if (L.includes('perempat'))     return 3;
      if (L.includes('perdelapan') || L.includes('16')) return 2;
      if (L.includes('penyisihan') || L.includes('babak')) return 1;
      return 1; // fallback
    },

    // === TABLE BATTLE ARENA-LEVEL: diratakan, urut match_order, isi winner untuk slot kosong
  getArenaBattleRows(groupList = []) {
  // util kecil
  const toStr = (v) => (v ?? '').toString().trim();
  const sanitize = (v) => {
    const s = toStr(v);
    if (!s) return '';
    const u = s.toUpperCase();
    return (u === '-' || u === '—' || u === 'N/A' || u === 'NULL' || u === 'UNDEFINED' || u === 'BYE' || u === 'TBD')
      ? ''
      : s;
  };
  const genderLabel = (g) => (g === 'male' ? 'PUTRA' : g === 'female' ? 'PUTRI' : toStr(g).toUpperCase());

  // key = order (global di arena), val = row gabungan (blue+red)
  const byOrder = new Map();

  for (const group of (groupList || [])) {
    const category = toStr(group?.category);         // ex. 'Tunggal'
    const gender   = genderLabel(group?.gender);     // 'PUTRA' / 'PUTRI'
    const pools    = group?.pools || [];

    for (const pool of pools) {
      const matches = pool?.matches || [];

      for (const m of matches) {
        if (m?.mode !== 'battle') continue;

        const order = (m.order ?? m.match_order);
        if (order == null) continue; // mesti ada nomor partai

        if (!byOrder.has(order)) {
          byOrder.set(order, {
            order,
            round_label: toStr(m.round_label),
            class_label: '',                 // diisi sekali per order
            blue: { contingent: '', names: '' },
            red:  { contingent: '', names: '' },
            time: m.match_time || '',
            score: m.final_score || '',
          });
        }

        const row = byOrder.get(order);

        // round label (ambil yang terisi)
        if (!row.round_label && m.round_label) {
          row.round_label = toStr(m.round_label);
        }

        // CLASS LABEL: "TUNGGAL REMAJA PUTRA" (uppercase)
        if (!row.class_label) {
          const age = toStr(m?.pool?.age_category?.name) || toStr(group?.age_category);
          const cls = [category, age, gender].filter(Boolean).join(' ');
          row.class_label = cls.toUpperCase();
        }

        // NAMA2 atlet (gabung), TANPA fallback '-'
        const namesJoined = [
          m?.team_member1?.name,
          m?.team_member2?.name,
          m?.team_member3?.name,
        ].filter(Boolean).join(', ');
        let names = sanitize(namesJoined);

        // Kalau kosong, coba pakai info "pemenang partai #<no>"
        const winnerOrder =
          m?.winner_of_order ??
          m?.winner_from_order ??
          m?.source_order ??
          m?.from_order ??
          m?.prev_order ??
          null;
        if (!names && winnerOrder) {
          names = `Pemenang partai #${winnerOrder}`;
        }

        // Kontingen TANPA fallback '-'
        const cont = sanitize(m?.contingent?.name ?? m?.contingent_name);

        const side = { contingent: cont, names };
        const corner = toStr(m?.corner).toLowerCase();

        if (corner === 'blue') {
          row.blue = side;
        } else if (corner === 'red') {
          row.red = side;
        } else {
          // fallback: paritas nomor partai (jarang kepakai)
          const isEven = ((order ?? 0) % 2) === 0;
          if (isEven) row.red = side; else row.blue = side;
        }

        // waktu/score pertama yang ada disimpan
        if (!row.time && m.match_time)   row.time  = m.match_time;
        if (!row.score && m.final_score) row.score = m.final_score;
      }
    }
  }

  // hasil akhir: array urut by order ASC
  return Array.from(byOrder.values()).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
},



    // === Untuk BATTLE: kembalikan array group per babak, setiap group punya rows terurut
    // dan kolom display_no (1..N) lokal per tabel babak tsb.
    buildBattleGroups(matches = []) {
      // Pair per battle_group
      const byGroup = new Map(); // battle_group -> row

      for (const m of (matches || [])) {
        const g = m.battle_group ?? m.match_order ?? m.id;
        if (!byGroup.has(g)) {
          byGroup.set(g, {
            key: `g-${g}`,
            // tetap simpan order global untuk sort (biar urut eksekusi asli)
            order: (m.order ?? m.match_order ?? Number.MAX_SAFE_INTEGER),
            round_label: m.round_label || '-',
            blue: { contingent: '-', names: '' },
            red:  { contingent: '-', names: '' },
            time: m.match_time ?? null,
            score: m.final_score ?? null,
          });
        }

        const row = byGroup.get(g);

        const names = [
          m.team_member1?.name,
          m.team_member2?.name,
          m.team_member3?.name,
        ].filter(Boolean).join(', ');

        const roundNum  = Number(m.round || 1);
        const namesStr  = names || (roundNum === 1 ? 'BYE' : 'TBD');
        const cont      = m.contingent?.name || '-';
        const corner    = (m.corner || '').toLowerCase();

        if (corner === 'blue') {
          row.blue = { contingent: cont, names: namesStr };
        } else if (corner === 'red') {
          row.red = { contingent: cont, names: namesStr };
        } else {
          // fallback (kalau corner belum ada): tebak parity
          const isEven = ((m.match_order ?? 0) % 2) === 0;
          if (isEven) row.red = { contingent: cont, names: namesStr };
          else        row.blue = { contingent: cont, names: namesStr };
        }

        // ambil order minimum dalam satu group
        const candOrder = (m.order ?? m.match_order ?? Number.MAX_SAFE_INTEGER);
        if (candOrder < row.order) row.order = candOrder;

        // rapihkan label
        if ((!row.round_label || row.round_label === '-') && m.round_label) {
          row.round_label = m.round_label;
        }

        if (!row.time && m.match_time)   row.time  = m.match_time;
        if (!row.score && m.final_score) row.score = m.final_score;
      }

      // rows (tiap pasangan) urutkan by order global
      const rows = Array.from(byGroup.values()).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      // group per round_label
      const bucket = new Map(); // label -> { label, rows: [], minOrder }
      for (const r of rows) {
        const label = r.round_label || '-';
        if (!bucket.has(label)) bucket.set(label, { label, rows: [], minOrder: Number.MAX_SAFE_INTEGER });
        bucket.get(label).rows.push(r);
        bucket.get(label).minOrder = Math.min(bucket.get(label).minOrder, (r.order ?? Number.MAX_SAFE_INTEGER));
      }

      // urutkan row di dalam babak & assign display_no lokal (1..N)
      const grouped = Array.from(bucket.values())
        .sort((a, b) => a.minOrder - b.minOrder) // Semifinal (min order kecil) muncul duluan ketimbang Final, dst
        .map(g => {
          g.rows.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          g.rows = g.rows.map((r, i) => ({ ...r, display_no: i + 1 })); // nomor lokal
          return g;
        });

      return grouped;
    },

    // === Untuk NON-BATTLE: kembalikan matches yang sudah disort + display_no lokal (1..N)
    getNonBattleTables(groupList = []) {
      const tables = [];

      (groupList || []).forEach(cg => {
        const gender = cg.gender; // 'male' / 'female'
        (cg.pools || []).forEach(pool => {
          const age = pool?.matches?.[0]?.pool?.age_category?.name || '-';

          // ambil hanya non-battle, sort by order/match_order, lalu nomor lokal 1..N
          const rows = (pool.matches || [])
            .filter(m => m?.mode !== 'battle')
            .sort((a, b) =>
              (a.match_order ?? a.order ?? 0) - (b.match_order ?? b.order ?? 0)
            )
            .map((m, i) => ({ ...m, display_no: i + 1 }));

          if (rows.length > 0) {
            tables.push({
              key: `${cg.category}|${gender}|${age}|${pool.name}`,
              title: {
                category: cg.category,
                gender,
                age,
                pool: pool.name,
              },
              rows,
            });
          }
        });
      });

      return tables;
    },

    // Tetap dipakai di non-battle kalau kamu butuh versi baris lokal
    getNonBattleRows(matches = []) {
      const sorted = [...matches].sort((a, b) => {
        const oa = a.match_order ?? a.order ?? 0;
        const ob = b.match_order ?? b.order ?? 0;
        if (oa !== ob) return oa - ob;
        return (a.id ?? 0) - (b.id ?? 0);
      });
      return sorted.map((m, i) => ({ ...m, display_no: i + 1 }));
    },




      
    

      /**
       * Build baris battle dari daftar match (blue+red dalam satu baris),
       * dikelompokkan berdasarkan (round, battle_group).
       */
      buildBattleRows(matches = []) {
        const groups = {};

        matches.forEach(m => {
          if (m?.mode !== 'battle') return;
          const gkey = `${m.round || 1}-${m.battle_group || m.match_order || 0}`;

          if (!groups[gkey]) {
            groups[gkey] = {
              order: m.match_order ?? null,
              round_label: m.round_label ?? null,
              blue: null,
              red: null,
              time: m.match_time ?? null,
              score: m.final_score ?? null,
            };
          }

          // Keep the earliest filled info (order/time/label)
          if (!groups[gkey].order && m.match_order) groups[gkey].order = m.match_order;
          if (!groups[gkey].round_label && m.round_label) groups[gkey].round_label = m.round_label;
          if (!groups[gkey].time && m.match_time) groups[gkey].time = m.match_time;
          if (!groups[gkey].score && m.final_score) groups[gkey].score = m.final_score;

          if (m.corner === 'blue') groups[gkey].blue = m;
          if (m.corner === 'red')  groups[gkey].red  = m;
        });

        // Convert ke array + sort by order lalu round
        return Object.entries(groups)
          .map(([key, g]) => ({
            key,
            order: g.order,
            round_label: g.round_label,
            time: g.time,
            score: g.score,
            blue: {
              contingent: g.blue?.contingent?.name || (g.blue?.contingent_name ?? null),
              names: this._joinMemberNames(g.blue),
            },
            red: {
              contingent: g.red?.contingent?.name || (g.red?.contingent_name ?? null),
              names: this._joinMemberNames(g.red),
            },
          }))
          .sort((a, b) => {
            // primary by order, secondary by round label (optional)
            const ao = a.order ?? 0, bo = b.order ?? 0;
            if (ao !== bo) return ao - bo;
            return String(a.round_label || '').localeCompare(String(b.round_label || ''));
          });
      },

    downloadSchedule(arena, date) {
      const params = new URLSearchParams({
        arena_name: arena.arena_name,
        scheduled_date: date,
      });

      const url = `${API.API_BASE_URL}/seni/export-schedule?${params.toString()}`;
      window.open(url, '_blank');
    },

    toggleAllGenders() {
      if (this.selectedGenderFilters.length === this.allGenders.length) {
        this.selectedGenderFilters = [];
      } else {
        this.selectedGenderFilters = [...this.allGenders];
      }
    },
    toggleAllCategories() {
      if (this.selectedCategoryFilters.length === this.allCategories.length) {
        this.selectedCategoryFilters = [];
      } else {
        this.selectedCategoryFilters = [...this.allCategories];
      }
    },
    toggleAllDates() {
      if (this.selectedDateFilters.length === this.allDates.length) {
        this.selectedDateFilters = [];
      } else {
        this.selectedDateFilters = [...this.allDates];
      }
    },
    toggleAllArena() {
      if (this.selectedArenaFilters.length === this.allArenaNames.length) {
        this.selectedArenaFilters = [];
      } else {
        this.selectedArenaFilters = [...this.allArenaNames];
      }
    },

    toggleAllPool() {
      if (this.selectedPoolFilters.length === this.allPoolNames.length) {
        this.selectedPoolFilters = [];
      } else {
        this.selectedPoolFilters = [...this.allPoolNames];
      }
    },

    toggleAllRound() {
      if (this.selectedRoundFilters.length === this.allRoundLabels.length) {
        this.selectedRoundFilters = [];
      } else {
        this.selectedRoundFilters = [...this.allRoundLabels];
      }
    },
    formatLongDate(dateStr) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('id-ID', options);
    },
    formatShortDate(dateStr) {
      const date = new Date(dateStr);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    },

   async fetchSchedules() {
      const { slug } = this.$route.params;

      try {
        const response = await axios.get(`/tournaments/${slug}/match-schedules/seni`);
        this.scheduleData = response.data.data || [];

        // 🔽 Ambil semua tanggal unik
        this.allDates = [...new Set(this.scheduleData.map(item => item.scheduled_date))];
        this.selectedDateFilters = [...this.allDates];

        // 🔽 Ambil semua arena unik
        this.allArenaNames = [...new Set(this.scheduleData.map(item => item.arena_name))];
        this.selectedArenaFilters = [...this.allArenaNames];

        // 🔽 Ambil semua pool unik dari dalam groups
        const pools = [];
        this.scheduleData.forEach(entry => {
          entry.groups.forEach(group => {
            group.pools.forEach(pool => {
              pools.push(pool.name);
            });
          });
        });
        this.allPoolNames = [...new Set(pools)];
        this.selectedPoolFilters = [...this.allPoolNames];

        console.log('📦 Jadwal Masuk:', response.data.data);

      } catch (error) {
        console.error('Gagal ambil data jadwal seni:', error);
        this.scheduleData = [];
      }
    },
    downloadPDF() {
      const element = this.$refs.printArea;
      const options = {
        filename: 'jadwal-pertandingan.pdf',
        margin: 0.3,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(options).from(element).save();
    }
  },
};
</script>

<style scoped>
.filter {
  background-color: #343a40;
  color: #ffffff;
  padding: 20px;
  border-radius: 8px;
}
.bg-white{
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 8px;
}
.table {
  background-color: #181818;
  color: #fff;
}
.table thead {
  background-color: #333;
}
.table tbody tr:hover {
  background-color: #444;
}

.table-sub-header th {
  background-color: #495057;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
}
.round-separator td {
  background-color: #6c757d;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
}
.table-header {
  background-color: #343a40;
  color: #ffffff;
}

/* Sudut */
.corner-blue {
  background: #002FB9 !important; /* bootstrap primary */
  color: #fff !important;
  width: 35%;
}
.corner-red {
  background: #F80000 !important; /* bootstrap danger */
  color: #fff !important;
  width: 35%;
}
.corner-blue .contingent,
.corner-red .contingent {
  font-style: italic;
  font-size: 0.85rem;
  opacity: 0.95;
  margin-bottom: 2px;
}
.corner-blue .names,
.corner-red .names {
  font-weight: 600;
  line-height: 1.15rem;
}




</style>
