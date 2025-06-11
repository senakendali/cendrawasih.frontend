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

      <!-- Header Jadwal -->
      <div class="row align-items-center mb-4">
        <div class="col-3 d-flex align-items-center gap-3">
          <img src="@/assets/images/ipsi.png" alt="Logo" style="width: 140px;" />
        </div>
        <div class="col-6 text-center">
          <h4 class="text-dark mb-2 text-uppercase fw-bold">
            JADWAL {{ arenaName }}
          </h4>
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

      <!-- Loop per Kategori -->
      <div v-for="(categoryGroup, index) in groupList" :key="index">
          <!-- Loop per Pool -->
          <div v-for="pool in categoryGroup.pools" :key="pool.name" class="mb-5">
            <div v-if="pool.matches.length > 0">
              <table class="table table-striped">
                <thead>
                  <tr class="table-sub-header">
                    <th>PARTAI</th>
                    <th>Kontingen</th>
                    <th colspan="3">Nama Atlet</th>
                    <th>Waktu</th>
                    <th>Score</th>
                  </tr>
                  <tr>
                    <th colspan="7" class="text-center fw-bold text-uppercase table-header">
                      {{ categoryGroup.category }}
                      {{ categoryGroup.gender === 'male' ? 'PUTRA' : 'PUTRI' }}
                      {{ pool.matches[0]?.pool?.age_category?.name?.toUpperCase() || '-' }}
                      - {{ pool.name }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="entry in pool.matches" :key="entry.id">
                    <td>{{ entry.match_order }}</td>
                    <td>{{ entry.contingent?.name || '-' }}</td>

                    <!-- Tunggal -->
                    <template v-if="entry.match_type === 'seni_tunggal'">
                      <td>{{ entry.team_member1?.name || '-' }}</td>
                      <td colspan="2">-</td>
                    </template>

                    <!-- Ganda -->
                    <template v-else-if="entry.match_type === 'seni_ganda'">
                      <td>{{ entry.team_member1?.name || '-' }}</td>
                      <td>{{ entry.team_member2?.name || '-' }}</td>
                      <td>-</td>
                    </template>

                    <!-- Regu -->
                    <template v-else-if="entry.match_type === 'seni_regu'">
                      <td>{{ entry.team_member1?.name || '-' }}</td>
                      <td>{{ entry.team_member2?.name || '-' }}</td>
                      <td>{{ entry.team_member3?.name || '-' }}</td>
                    </template>

                    <td>{{ entry.match_time || '-' }}</td>
                    <td>{{ entry.final_score || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center text-muted my-3">
              Tidak ada pertandingan pada pool ini.
            </div>
          </div>
        </div>

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
      intervalId: null,
      allDates: [],
      allArenaNames: [],
      allPoolNames: [],
      allCategories: ['Tunggal', 'Ganda', 'Regu'],
      selectedDateFilters: [],
      selectedArenaFilters: [],
      selectedPoolFilters: [],
      selectedCategoryFilters: ['Tunggal', 'Ganda', 'Regu'],
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

    this.intervalId = setInterval(() => {
      this.fetchSchedules();
    }, 3000); // refresh setiap 3 detik
    

  },

  unmounted() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },

  methods: {
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



</style>
