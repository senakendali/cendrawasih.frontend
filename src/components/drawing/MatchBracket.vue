<template>
    <div class="dashboard-container">
        <div v-if="loading" class="progress-bar" :style="{ width: progress + '%' }"></div>

        <div class="mb-2 page-title">
            <i class="bi bi-file-earmark-text"></i> Match Bracket
        </div>
        <div class="mb-2 d-flex justify-content-end align-items-center gap-2">
          <!-- Search Bar -->
        
          <!-- Create Menu Button -->
          
          <router-link :to="'/admin/tanding/match/list/' + poolId" class="button button-primary">
            <i class="bi bi-table"></i> View Match List
          </router-link>
          <button @click="exportBracketToPNG" class="button button-primary"><i class="bi bi-filetype-png"></i> Export as PNG</button>
          <button @click="exportBracketToPDF(bracketType)" class="button button-primary"><i class="bi bi-filetype-pdf"></i> Export as PDF</button>
          <button @click="regenerateBracket" class="button button-primary"><i class="bi bi-arrow-clockwise"></i> Regenerate</button>
          
        </div>
        <div id="tournament-bracket">
          <div v-if="bracketType === 2" class="match-bracket">
            <div v-for="(game, index) in games" :key="index" class="match-container">
              <div class="player-1">{{ game.player1.name }}</div>
              <div class="player-2">{{ game.player2.name }}</div>
            </div>
          </div>
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
    data() {
        return {
            poolId: null,
            loading: false,
            progress: 100,
            bracketType: '',
            rounds: [],
            games: [],
        };
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

  methods: {
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

          } catch (error) {
              console.error("Error fetching dummy bracket:", error);
          } finally {
              this.loading = false;
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
        await this.fetchRounds();
      } catch (error) {
        console.error("Error generating bracket:", error);
        this.errorMessage = "Gagal memuat bracket. Silakan coba lagi.";
      }
    },
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
    color: #1E2A57;
    width: 100%;
    height: 50px;
    padding: 12px;
    border-left: 5px solid #388E3C;
    border-top: 1px solid #388E3C;
    border-bottom: 1px solid #388E3C;

    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-right: 1px solid #388E3C;
    background: #ffffff;
  }

  

  .match-container .player-2 {
    font-size: 12px;
    color: #1E2A57;
    width: 100%;
    height: 50px;
    padding: 12px;
    border-left: 5px solid #858585;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-bottom: 1px solid #858585;
    border-right: 1px solid #858585;
    background: #ffffff;
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
  