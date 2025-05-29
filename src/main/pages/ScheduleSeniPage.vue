<template>
  <div class="main-container">
    <div class="container" ref="printArea">
      <!-- Header Section -->
      <div class="row">
        <div class="col-lg-12 text-center my-4">
          <h1>Jadwal Pertandingan Kategori: Seni </h1>
          <!--p>
            Pendaftaran Kejuaraan Pencak Silat <strong>[Nama Kejuaraan]</strong> Telah Dibuka! 
            Jangan Lewatkan Kesempatan untuk Bertanding dengan Atlet-Atlet Berbakat Lainnya. 
            Dapatkan Hadiah Menarik dan Sertifikat Peserta!
          </p>
          <button class="btn btn-danger mt-3" @click="downloadPDF">
            <i class="bi bi-download"></i> Export PDF
          </button-->
        </div>
      </div>
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

      <!-- Schedule Table -->
      <div class="row bg-white">
        <div class="col-lg-12">
          <div class="table-responsive">

            <!-- ✅ Jika tidak ada data -->
            <div v-if="Object.keys(groupedByDate).length === 0" class="text-center text-muted my-5">
              <h5>Belum ada jadwal pertandingan seni yang tersedia.</h5>
            </div>

            <!-- ✅ Loop per TANGGAL -->
            <div v-for="(groupList, date) in groupedByDate" :key="date">
              <div v-if="groupList && groupList.length">

                <!-- ✅ Header Logo dan Info -->
                <div class="row align-items-center mb-4">
                  <div class="col-3 text-start">
                    <img src="@/assets/images/ipsi.png" alt="Logo" style="width: 180px;" />
                  </div>
                  <div class="col-6 text-center">
                    <h4 class="text-dark mb-2 text-uppercase fw-bold">
                      JADWAL {{ groupList[0]?.arena_name || '-' }}
                    </h4>
                    <h4 class="text-dark mb-2 text-uppercase fw-bold">
                      {{ groupList[0]?.tournament_name || '-' }}
                    </h4>
                    <div class="text-dark text-uppercase fw-bold">
                      {{ formatLongDate(date) }}
                    </div>
                  </div>
                  <div class="col-3"></div>
                </div>

                <!-- ✅ Loop per kategori -->
                <div v-for="categoryGroup in groupList" :key="categoryGroup.category + '-' + categoryGroup.gender">
                  
                  <!-- ✅ Loop per Pool -->
                  <div v-for="pool in categoryGroup.pools" :key="pool.name" class="mb-5">
                    <table class="table mt-4">
                      <thead>
                        <tr class="table-sub-header">
                          <th>PARTAI</th>
                          <th>Kontingen</th>
                          <th colspan="3">Nama Atlet</th>
                          <th>Waktu</th>
                          <th>Score</th>
                        </tr>
                        <tr>  
                          <th colspan="8" class="table-header text-start text-uppercase text-center">
                            {{ categoryGroup.category }} {{ categoryGroup.gender === 'male' ? 'PUTRA' : 'PUTRI' }} {{ pool.matches[0]?.pool?.age_category?.name.toUpperCase() }}  {{ pool.name }}
                          </th>
                        </tr>
                       
                      </thead>
                     <tbody>
  <tr v-for="entry in pool.matches" :key="entry.id">
    <td>{{ entry.match_order }}</td>
    <td>{{ entry.contingent?.name || '-' }}</td>

    <!-- ✅ Peserta sesuai tipe pertandingan -->
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

    <!-- ✅ Tambahan Kolom Waktu dan Score -->
    <td>{{ entry.match_time || '-' }}</td>
    <td>{{ entry.final_score || '-' }}</td>
  </tr>
</tbody>

                    </table>
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
import html2pdf from "html2pdf.js";

export default {
  name: "SchedulePage",
  data() {
    return {
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

      this.scheduleData.forEach(entry => {
        // ⛔ Skip kalau tidak lolos filter tanggal & arena
        if (
          !this.selectedDateFilters.includes(entry.scheduled_date) ||
          !this.selectedArenaFilters.includes(entry.arena_name)
        ) return;

        const date = entry.scheduled_date;
        if (!grouped[date]) grouped[date] = [];

        // ✅ Filter berdasarkan kategori, gender, pool
        const filteredGroups = entry.groups
          .filter(group =>
            this.selectedCategoryFilters.includes(group.category) &&
            this.selectedGenderFilters.includes(group.gender) &&
            group.pools.some(pool => this.selectedPoolFilters.includes(pool.name))
          )
          .map(group => ({
            ...group,
            pools: group.pools.filter(pool => this.selectedPoolFilters.includes(pool.name))
          }));

        // ✅ Hanya tambahkan jika ada data lolos filter
        if (filteredGroups.length > 0) {
          grouped[date].push(
            ...filteredGroups.map(g => ({
              ...g,
              arena_name: entry.arena_name,
              tournament_name: entry.tournament_name,
            }))
          );
        }
      });

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
  },

  methods: {
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
