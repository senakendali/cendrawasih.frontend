
<template>
  <div class="main-container">
    <div class="container" ref="printArea">
      <!-- Header Section -->
      <div class="row">
        <div class="col-lg-12 text-center my-4">
          <h1>Jadwal Pertandingan Kategori: Tanding </h1>
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

            <!-- Filter Round -->
            <div class="mb-4">
              <label class="fw-bold">Filter Round:</label>
              <div class="d-flex flex-wrap gap-3">
                <div>
                  <input
                    type="checkbox"
                    id="round-check-all"
                    :checked="selectedRoundFilters.length === allRoundLabels.length"
                    @change="toggleAllRound"
                  />
                  <label for="round-check-all">All Round</label>
                </div>

                <div v-for="round in allRoundLabels" :key="round">
                  <input
                    type="checkbox"
                    :id="'round-check-' + round"
                    :value="round"
                    v-model="selectedRoundFilters"
                  />
                  <label :for="'round-check-' + round">{{ round }}</label>
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
            <div v-if="filteredScheduleData.length === 0" class="text-center text-muted my-5">
              <h5>Belum ada jadwal pertandingan yang tersedia.</h5>
            </div>

            <!-- Arena Loop -->
            <div v-for="arena in filteredScheduleData" :key="arena.arena_name">
              <!-- ✅ Header Arena -->
              <div class="row align-items-center mb-4">
                <div class="col-3 text-start">
                  <img src="@/assets/images/ipsi.png" alt="Logo" style="width: 180px;" />
                </div>

                <div class="col-6 text-center">
                  <h4 class="text-dark mb-2 text-uppercase fw-bold">
                    JADWAL {{ arena.arena_name }}
                  </h4>
                  <h4 class="text-dark mb-2 text-uppercase fw-bold">{{ arena.tournament_name }}</h4>
                  <div class="text-dark text-uppercase fw-bold">
                    {{ formatLongDate(arena.scheduled_date) }}
                  </div>
                </div>
                <div class="col-3 text-end">
                  <button
                    class="btn btn-sm btn-outline-primary"
                    @click="downloadSchedule(arena)"
                  >
                    <i class="bi bi-download me-1"></i> Download Schedule
                  </button>
                </div>
              </div>

              <!-- ✅ Semua pertandingan langsung ditampilkan -->
              <div class="mb-4">
                <table class="table table-striped">
                  <thead>
                    <tr class="table-sub-header">
                      <th>Partai</th>
                      <th>Babak</th>
                      <th class="text-uppercase text-center">Kelas</th>
                      <th>Pool</th>
                      <th class="text-uppercase text-center blue">Sudut Biru</th>
                      <th class="text-uppercase text-center red">Sudut Merah</th>
                      <th colspan="2" class="text-center">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="(match, i) in arena.matches" 
                      :key="i"
                    >
                      <td>{{ match.match_number }}</td>
                      <td>{{ match.round_label }}</td>
                      <td class="text-center">{{ match.class_name || '-' }}</td>
                      <td>{{ match.pool_name || '-' }}</td>
                      <td class="text-center">
                        <div class="text-center font-blue">{{ match.participant_one }}</div>
                        <div class="text-center text-success">{{ match.contingent_one || '-'  }}</div>
                      </td>
                      <td class="text-center">
                        <div class="text-center font-red">{{ match.participant_two }}</div>
                        <div class="text-center text-success">{{ match.contingent_two || '-'  }}</div>
                      </td>
                      <td class="score-blue"> - </td>
                      <td class="score-red"> - </td>
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
</template>

<script>
import axios from "axios";
import API from "@/config/api";
import html2pdf from "html2pdf.js";

export default {
  name: "SchedulePage",
  data() {
    return {
      scheduleData: [],
      allArenaNames: [],
      selectedArenaFilters: [],

      allPoolNames: [],
      selectedPoolFilters: [],

      allRoundLabels: [],
      selectedRoundFilters: [],

      allDates: [],
      selectedDateFilters: [],
    };
  },

  computed: {
    filteredScheduleData() {
      return this.scheduleData
        .filter(arena =>
          this.selectedArenaFilters.includes(arena.arena_name) &&
          this.selectedDateFilters.includes(arena.scheduled_date)
        )
        .map(arena => {
          // 🔁 FLATTEN semua match ke satu array
          const allMatches = arena.age_category_rounds?.flatMap(category =>
            category.rounds?.flatMap(round =>
              round.matches?.map(match => ({
                ...match,
                round_label: round.round_label // inject round_label ke tiap match
              })).filter(match =>
                this.selectedPoolFilters.includes(match.pool_name) &&
                this.selectedRoundFilters.includes(match.round_label)
              ) || []
            ) || []
          ) || [];

          // 🔁 Optional: Sort berdasarkan match_order
          allMatches.sort((a, b) => a.match_order - b.match_order);

          return {
            ...arena,
            matches: allMatches
          };
        })
        .filter(arena => arena.matches.length > 0);
    },






  },

  mounted() {
    this.fetchSchedules();
  },

  methods: {
    groupByAgeCategory(matches) {
      const grouped = {};

      matches.forEach(match => {
        const key = match.age_category_id;
        if (!grouped[key]) {
          grouped[key] = {
            age_category_id: match.age_category_id,
            age_category_name: match.age_category_name,
            matches: []
          };
        }
        grouped[key].matches.push(match);
      });

      // Urutkan berdasarkan age_category_id
      return Object.values(grouped).sort((a, b) => a.age_category_id - b.age_category_id);
    },
    downloadSchedule(arena) {
      // Misalnya lu redirect ke API atau generate PDF
      const params = new URLSearchParams({
        arena_name: arena.arena_name,
        scheduled_date: arena.scheduled_date,
      });

      const url = `${API.API_BASE_URL}/tanding/export-schedule?${params.toString()}`;
      window.open(url, '_blank');
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
      try {
        const { slug } = this.$route.params;

        // Ambil jadwal tanding berdasarkan slug
        const response = await axios.get(`/tournaments/${slug}/match-schedules/tanding`);
        this.scheduleData = response.data.data;

        // Ambil semua arena unik
        this.allArenaNames = [...new Set(this.scheduleData.map(item => item.arena_name))];

        const allPools = new Set();
        const allRounds = new Set();

        this.scheduleData.forEach(item => {
          item.age_category_rounds?.forEach(category => {
            category.rounds?.forEach(round => {
              allRounds.add(round.round_label);
              round.matches?.forEach(match => {
                allPools.add(match.pool_name);
              });
            });
          });
        });

        this.allPoolNames = [...allPools];
        this.allRoundLabels = [...allRounds];
        this.allDates = [...new Set(this.scheduleData.map(item => item.scheduled_date))];

        // Default tampil semua
        this.selectedArenaFilters = [...this.allArenaNames];
        this.selectedPoolFilters = [...this.allPoolNames];
        this.selectedRoundFilters = [...this.allRoundLabels];
        this.selectedDateFilters = [...this.allDates];

      } catch (error) {
        console.error("Gagal ambil jadwal:", error);
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

.score-blue, .score-red {
    width: 60px;
    text-align: center;
  }

.font-blue{
  color: #002FB9;
}

.font-red{
  color: #F80000;
}

.blue{
  background-color: #002FB9 !important;
}

.red{
  background-color: #F80000 !important;
}

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
