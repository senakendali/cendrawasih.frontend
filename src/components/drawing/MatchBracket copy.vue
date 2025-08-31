<template>
    <div class="dashboard-container">
        <div v-if="loading" class="progress-bar" :style="{ width: progress + '%' }"></div>

        <div class="mb-2 page-title">
            <i class="bi bi-file-earmark-text"></i> Match Bracket
        </div>
        <div class="mb-2 d-flex justify-content-end align-items-center gap-2">
          <!-- Search Bar -->
        
          <!-- Create Menu Button -->
          
          <router-link v-if="!autoGenerating"  :to="'/admin/tanding/match/list/' + poolId" class="button button-primary">
            <i class="bi bi-table"></i> View Match List
          </router-link>
          <button v-if="!autoGenerating"  @click="exportBracketToPNG" class="button button-primary"><i class="bi bi-filetype-png"></i> Export as PNG</button>
          <button v-if="!autoGenerating"  @click="exportBracketToPDF(bracketType)" class="button button-primary"><i class="bi bi-filetype-pdf"></i> Export as PDF</button>
          <button v-if="!autoGenerating"  @click="regenerateBracket" class="button button-primary"><i class="bi bi-arrow-clockwise"></i> Regenerate</button>
          <button v-if="!autoGenerating"  @click="goToNextPool" class="button button-primary">
            <i class="bi bi-plus-circle"></i> Generate Another Match
          </button>
          
          <button
            @click="autoGenerate"
            class="button button-primary"
            :disabled="autoGenerating"
          >
            <i class="bi bi-lightning-charge"></i>
            {{ autoGenerateCaption }}
          </button>

          <button
            v-if="showStopButton"
            @click="stopAutoGenerate"
            class="button button-primary"
          >
            <i class="bi bi-x-circle"></i> Stop Auto Generate
          </button>





          
        </div>
        <!-- Informasi Kategori -->
        <div v-if="poolData" class="mb-3">
          <div class="info-box">
            <strong>Age Category:</strong> {{ poolData.age_category_name }} <br>
            <strong>Gender:</strong> {{ poolData.gender === 'male' ? 'Putra' : 'Putri' }} <br>
            <strong>Class:</strong> {{ poolData.class_name }} ({{ poolData.weight_min }} - {{ poolData.weight_max }} kg)
          </div>
        </div>

       <div id="tournament-bracket">
        <!-- CASE: Custom bracket (manual render, type 2) -->
        <div v-if="bracketType === 2" class="match-bracket">
          <div
            v-for="(game, index) in games"
            :key="'manual-' + index"
            class="match-container"
          >
            <div class="player-1">
              <div class="p-name">
                  {{ game.player1.name }}
              </div>
              <div class="p-contingent">
                {{ game.player1.contingent }}
              </div>
            </div>
            <div class="player-2">
              {{ game.player2.name === 'BYE'
                ? 'TBD'
                : game.player2.name + ' / ' + game.player2.contingent }}
            </div>
          </div>
        </div>

        <!-- CASE: Only one match in bracket (Final Only) -->
        <div
          v-else-if="rounds.length === 1 && rounds[0]?.games?.length === 1"
          class="final-only"
        >
          <div
            class="match-container"
            v-if="rounds && rounds[0] && rounds[0].games && rounds[0].games[0]"
          >
            <!-- Player 1 -->
            <div class="player-1">
              <div class="p-name">
                {{ (rounds[0].games[0].player1 && rounds[0].games[0].player1.name) || '-' }}
              </div>
              <div
                class="p-contingent"
                v-if="rounds[0].games[0].player1 && rounds[0].games[0].player1.contingent"
              >
                {{ rounds[0].games[0].player1.contingent }}
              </div>
            </div>

            <!-- Player 2 -->
            <div class="player-2">
              <!-- BYE -> tampilkan 'TBD' -->
              <template v-if="!rounds[0].games[0].player2 || rounds[0].games[0].player2.name === 'BYE'">
                TBD
              </template>

              <!-- Bukan BYE -->
              <template v-else>
                <div class="p-name">
                  {{ rounds[0].games[0].player2.name }}
                </div>
                <div
                  class="p-contingent"
                  v-if="rounds[0].games[0].player2.contingent"
                >
                  {{ rounds[0].games[0].player2.contingent }}
                </div>
              </template>
            </div>
          </div>

        </div>

        <!-- CASE: Normal bracket -->
        <div v-else>
          <bracket :rounds="rounds">
            <template v-slot:player="{ player }">
              {{ player.name }}
            </template>
          </bracket>
        </div>
      </div>

        
        
    </div>
</template>

<script>
import axios from "axios";
import Bracket from "vue-tournament-bracket";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "vue-toastification";

export default {
    name: "MatchBracket",
    props: {
      isGenerate: {
        type: Boolean,
        default: true,
      },
    },
    components: {
        Bracket,
    },
    setup() {
      const toast = useToast();
      return { toast };
    },
    data() {
        return {
            poolId: null,
            nextPoolId: null,
            tournamentId: null,
            poolData: null,
            loading: false,
            progress: 100,
            bracketType: '',
            rounds: [],
            games: [],
            autoGenerating: false,
            autoGenerateCaption: "Auto Generate",
            showStopButton: false,
        };
    },
    computed: {
      isFinalOnly() {
        return this.rounds.length === 1;
      }
    },  

    created() {
        this.poolId = this.$route.params.id;
        console.log("Created - Tournament ID:", this.poolId);
        this.fetchRounds();
    },

    

    beforeRouteUpdate(to, from, next) {
      if (this.isGenerate && to.params.id !== this.poolId) {
        this.poolId = to.params.id;
        this.fetchRounds();
      }
      next();
    },
    
    watch: {
      '$route.params.id': {
        immediate: true,
        handler(newId) {
          console.log("Route changed to:", newId);
          if (newId) {
            this.poolId = newId;
            this.generateBracket();
            
          }
        },
      }
    },
  
  async mounted() {
    await this.fetchPoolData(); // harus isi poolData
  },

  methods: {
    stopAutoGenerate() {
      this.autoGenerating = false;
      this.autoGenerateCaption = "Auto Generate";
      this.showStopButton = false;
    },
    async fetchPoolData() {
      const res = await axios.get(`/pools/${this.poolId}`);
      this.poolData = res.data;
    },

    exportBracketToPNG() {
        this.loading = true;
        const bracketElement = document.getElementById("tournament-bracket");
        if (!bracketElement) {
          console.error("Bracket element not found!");
          return;
        }

        // Buat elemen wrapper dengan padding
        const wrapper = document.createElement("div");
        wrapper.style.padding = "20px";
        wrapper.style.backgroundColor = "#fff"; // Opsional, jika ingin latar belakang putih
        wrapper.appendChild(bracketElement.cloneNode(true));

        document.body.appendChild(wrapper); // Tambahkan ke body sementara

        setTimeout(() => {
          html2canvas(wrapper, { scale: 2 }).then((canvas) => {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "tournament_bracket.png";
            link.click();
            
            document.body.removeChild(wrapper); // Hapus wrapper setelah screenshot
          });
          this.loading = false;
        }, 2000)
        
      },

      async exportBracketToPDF(bracketType) {
        
        this.loading = true;
        const bracketElement = document.getElementById("tournament-bracket");
        if (!bracketElement) {
            console.error("Bracket element not found!");
            this.loading = false;
            return;
        }

        try {
            // Render elemen ke canvas
            const canvas = await html2canvas(bracketElement, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");

            // Atur orientasi berdasarkan nilai bracketType
            const isPortrait = bracketType == 0; // Kondisi untuk menentukan orientasi portrait
            const pageWidth = isPortrait ? 210 : 280; // Lebar halaman (portrait = 210, landscape = 280)
            const pageHeight = (canvas.height * pageWidth) / canvas.width + 20; // Tinggi halaman
            const padding = 10; // Padding dalam mm
            const contentWidth = pageWidth - 2 * padding; // Lebar konten dengan padding
            const contentHeight = (canvas.height * contentWidth) / canvas.width; // Tinggi proporsional konten

            // Buat PDF dengan orientasi dinamis
            const pdf = new jsPDF(isPortrait ? "portrait" : "landscape", "mm", [pageWidth, pageHeight]);

            // Tambahkan gambar ke PDF dengan padding
            pdf.addImage(imgData, "PNG", padding, padding, contentWidth, contentHeight);

            // Simpan PDF
            pdf.save("tournament_bracket.pdf");

            this.loading = false;
        } catch (error) {
            console.error("Error generating PDF:", error);
            this.loading = false;
        }
      },
    
    async fetchRounds() {
          this.loading = true;
          
          try {
              const response = await axios.get(`/pools/${this.poolId}/matches`);
              this.rounds = response.data.rounds;
             
              this.bracketType = response.data.match_chart;
              this.games = response.data.rounds[0].games;
              this.tournamentId = response.data.tournament_id; 

              await this.$nextTick();

              // Tambahkan delay kecil agar SVG benar-benar ter-render
              if (
                this.rounds.length === 1 &&
                this.rounds[0]?.matches?.length === 1
              ) {
                setTimeout(() => {
                  const selectors = [
                    '#tournament-bracket svg',
                    '#tournament-bracket path',
                    '#tournament-bracket .connector',
                    '#tournament-bracket .line',
                    '#tournament-bracket .lines',
                    '#tournament-bracket .vtb-item-child:after',
                    '#tournament-bracket .vtb-item-child:before',
                    '#tournament-bracket .vtb-item-parent:after'
                  ];
                  const elements = document.querySelectorAll(selectors.join(', '));
                  elements.forEach(el => {
                    el.style.display = 'none';
                    el.style.opacity = '0';
                    el.style.height = '0';
                    el.style.maxHeight = '0';
                    el.style.pointerEvents = 'none';
                  });
                }, 200); // delay 200ms
              }


              

          } catch (error) {
              console.error("Error fetching dummy bracket:", error);
          } finally {
              this.loading = false;
          }
    },

    async autoGenerate() {
      this.autoGenerating = true;
      this.showStopButton = true;
      this.autoGenerateCaption = "Generating...";

      while (this.autoGenerating) {
        try {
          await this.goToNextPool();
           //await this.fetchPoolData(); // harus isi poolData
        } catch (error) {
          this.autoGenerating = false;
          this.autoGenerateCaption = "Auto Generate";
          this.showStopButton = false;
          this.$toast.success("Semua match berhasil digenerate!");
          break;
        }
      }
    },
  async goToNextPool() {
    try {
      const response = await axios.post("/pools/next", {
        current_pool_id: this.poolId,
      });

      const nextPool = response.data;
      this.poolId = nextPool.id;
      this.$router.push(`/admin/tanding/match/${nextPool.id}`);
      await this.fetchPoolData();
      await this.fetchRounds();
      await this.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.error("Gagal generate pool berikutnya:", error);

      
       this.toast.success(`Semua match berhasil digenerate!`);

       setTimeout(() => {
         this.$router.push(`/admin/tanding`);
       }, 3000);
       
    }
  },

    async generateBracket() {
      this.loading = true;
      this.errorMessage = null;

      try {
        const response = await axios.get(`/pools/${this.poolId}/matches`);
        if (response.data.status === 'ongoing') {
          console.log("Bracket sudah ada, langsung fetch data.");
        } else {
          console.log("Membuat bracket baru...");
          await axios.get(`/pools/${this.poolId}/generate-bracket`);
        }
        await this.fetchRounds();
      } catch (error) {
        console.error("Error generating bracket:", error);
        this.errorMessage = "Gagal memuat bracket. Silakan coba lagi.";
      }
    },

    async regenerateBracket(){
      this.loading = true;
      this.errorMessage = null;

      try {
        await axios.get(`/pools/${this.poolId}/regenerate-bracket`);

        //TAMBAHAN
        try {
          const response = await axios.get(`/pools/${this.poolId}/matches`);
         if (response.data.status === 'ongoing') {
            console.log("Bracket sudah ada, langsung fetch data.");
          } else {
            console.log("Membuat bracket baru...");
            await axios.get(`/pools/${this.poolId}/generate-bracket`);
          }
          await this.fetchRounds();
        } catch (error) {
          console.error("Error generating bracket:", error);
          this.errorMessage = "Gagal memuat bracket. Silakan coba lagi.";
        }

        //await this.fetchRounds();
      } catch (error) {
        console.error("Error generating bracket:", error);
        this.errorMessage = "Gagal memuat bracket. Silakan coba lagi.";
      }
    },
  }
};
</script>


<style>
body .final-only svg,
body .final-only path,
body .final-only .vtb-connector,
body .final-only .vtb-line,
body .final-only .vtb-item-parent:after,
body .final-only .vtb-item-child:before,
body .final-only .vtb-item-child:after {
  display: none !important;
  opacity: 0 !important;
  pointer-events: none !important;
  height: 0 !important;
  max-height: 0 !important;
}
</style>

<style scoped>
  .dashboard-container {
    background-color: #ffffff;
    margin-top: 80px;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
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

  .info-box {
    background-color: #f8f9fa;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    margin-bottom: 1rem;
    font-size: 15px;
    font-family: Figtree, sans-serif;
  }

  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 5px;
    background-color: #388E3C;
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

  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 5px;
    background-color: #388E3C;
    animation: loader-animation 1.5s infinite;
  }

  .p-name { font-weight: 500; line-height: 1.1; }
  .p-contingent { font-size: 11px; opacity: .9; margin-top: 2px; font-style: italic;}

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
  </style>
  