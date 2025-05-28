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
            <div 
              v-for="arena in filteredScheduleData"
              :key="arena.arena_name"
            >


              <!-- Logo + Header -->
              <div class="row align-items-center mb-4">
                <div class="col-3 text-start">
                  <img src="@/assets/images/ipsi.png" alt="Logo" style="width: 180px;" />
                </div>
                <div class="col-6 text-center">
                  <h4 class="text-dark mb-2 text-uppercase fw-bold">JADWAL {{ arena.arena_name }}</h4>
                  <h4 class="text-dark mb-2 text-uppercase fw-bold">{{ arena.tournament_name }}</h4>
                  <div class="text-dark text-uppercase fw-bold">
                    {{ formatLongDate(arena.scheduled_date) }}
                  </div>
                </div>
                <div class="col-3"></div>
              </div>

              <!-- Pool Loop -->
              <div class="mb-4">
                <div 
                  v-for="pool in arena.pools"
                  :key="pool.pool_name"
                  class="mb-3"
                >



                  <table class="table table-striped">
                    <thead>
                      <!--tr>
                        <th colspan="4" class="table-header text-uppercase">
                          {{ pool.pool_name }}
                        </th>
                      </tr-->
                      <tr class="table-sub-header">
                        <th>Partai</th> 
                        <th>Babak</th>
                        <th class="text-uppercase text-center">Kelas</th>
                        <th>Pool</th>
                        
                        <th class="text-uppercase blue">Sudut Biru</th>
                        
                        <th class="text-uppercase red">Sudut Merah</th>
                        <th colspan="2" class="text-center">Score</th>
                        
                       
                      </tr>
                      <tr class="round-separator d-none">
                        <td colspan="6"></td>
                        <td class="text-uppercase text-white"></td>
                        <td class="text-uppercase text-white"></td>
                      </tr>

                    </thead>
                    <tbody>
                      <template 
                        v-for="round in pool.rounds.filter(r => selectedRoundFilters.includes(r.round_label))"
                        :key="round.round_label"
                      >
                        <!--tr class="round-separator">
                          <td colspan="4" class="fw-bold">{{ round.round_label }}</td>
                        </tr-->
                        <tr v-for="(match, i) in round.matches" :key="i">
                          <td>{{ match.match_order }}</td> 
                          <td>{{ round.round_label }}</td>
                           <td>{{ match.class_name || '-' }}</td>
                          <td>{{ pool.pool_name }}</td>
                         
                          <td>{{ match.participant_one }} ({{ match.contingent_one || '-' }})</td>
                          
                          <td>{{ match.participant_two }} ({{ match.contingent_two || '-' }})</td>
                          <td class="score-blue"> - </td>
                          <td class="score-red"> - </td>
                          <!--td>{{ match.match_time }}</td-->
                        </tr>
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
  </div>
</template>

<script>
import axios from "axios";
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

        const allPools = [];
        const allRounds = [];

        this.scheduleData.forEach(item => {
          item.pools.forEach(pool => {
            allPools.push(pool.pool_name);
            pool.rounds.forEach(round => {
              allRounds.push(round.round_label);
            });
          });
        });

        this.allPoolNames = [...new Set(allPools)];
        this.allRoundLabels = [...new Set(allRounds)];
        this.allDates = [
          ...new Set(this.scheduleData.map(item => item.scheduled_date)),
        ];

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
