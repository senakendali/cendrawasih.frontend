<template>
  <div class="dashboard-container">
    <div
      v-if="loading"
      class="progress-bar"
      :style="{ width: progress + '%' }"
    ></div>
    <div class="mb-2 page-title">
      <i class="bi bi-clipboard-data"></i> Tournament Insight ({{ tournamentName }})
    </div>
    
    <div class="d-flex w-100 gap-3">
      <div class="summary-data flex-grow-1">
        <div class="title">
          Jumlah Pengguna
        </div>
        <div class="value">
          {{ totalAccount }}
        </div>
      </div>
      <div class="summary-data flex-grow-1">
        <div class="title">
          Jumlah Kotingen
        </div>
        <div class="value">
          {{  totalContingent }}
        </div>
      </div>
      <div class="summary-data flex-grow-1">
        <div class="title">
          Jumlah Peserta Tanding
        </div>
        <div class="value">
          {{  totalTanding }}
        </div>
      </div>
      <div class="summary-data flex-grow-1">
        <div class="title">
          Jumlah Peserta Seni
        </div>
        <div class="value">
          {{  totalSeni }}
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="tabs mt-4 d-flex gap-2">
      <button @click="activeTab = 'summary'" :class="{ active: activeTab === 'summary' }" class="button button-primary"><i class="bi bi-table"></i> View as Table</button>
      <button @click="activeTab = 'statistic'" :class="{ active: activeTab === 'statistic' }" class="button button-primary"><i class="bi bi-pie-chart-fill"></i> View as Chart</button>
    </div>
    
    <div v-if="activeTab === 'summary'">
      <div class="row mt-4">
        <div class="col-lg-12">
          <table class="table">
            <thead>
              <tr>
                <th colspan="5" class="header">
                  <i class="bi bi-clipboard-data"></i> Jumlah Kontingen Mendaftar per hari
                </th>
              </tr>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody v-if="totalRegistrance.length > 0">
              <tr v-for="(item, index) in totalRegistrance" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.join_date }}</td>
                <td>{{ item.total_contingents }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5" class="text-center">No data found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-lg-6">
          <table class="table">
            <thead>
              <tr>
                <th colspan="3" class="header">
                  <i class="bi bi-clipboard-data"></i> Proyeksi Uang Diterima
                </th>
              </tr>
              <tr>
                <th>No</th>
                <th>Deskripsi</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody v-if="RevenueProjection.length > 0">
              <tr v-for="(item, index) in RevenueProjection" :key="index">
                <td>{{ item.id }}</td>
                <td>{{ item.description }}</td>
                <td>{{ formatCurrency(item.total_amount) }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="3" class="text-center">No data found.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-lg-6">
          <table class="table">
            <thead>
              <tr>
                <th colspan="3" class="header">
                  <i class="bi bi-clipboard-data"></i> Laporan Pembayaran
                </th>
              </tr>
              <tr>
                <th>No</th>
                <th>Deskripsi</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody v-if="tournamentIncomes.length > 0">
              <tr v-for="(item, index) in tournamentIncomes" :key="index">
                <td>{{ item.id }}</td>
                <td>{{ item.description }}</td>
                <td>{{ formatCurrency(item.amount) }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="3" class="text-center">No data found.</td>
              </tr>
            </tbody>
          </table>
        </div>
        
      </div>
      <div class="row mt-4">
        <div class="col-lg-12">
          <table class="table">
            <thead>
              <tr>
                <th colspan="5" class="header">
                  <i class="bi bi-clipboard-data"></i> Detail Peserta Kotingen Berdasarkan Kategori
                </th>
              </tr>
              <tr>
                <th>No</th>
                <th>Contingent Name</th>
                <th>Tanding</th>
                <th>Seni</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody v-if="contingents.length > 0">
              <tr v-for="(contingent, index) in contingents" :key="contingent.id">
                <td>{{ index + 1 }}</td>
                <td>{{ contingent.contingent_name }}</td>
                <td>{{ contingent.total_tanding }}</td>
                <td>{{ contingent.total_seni }}</td>
                <td>{{ contingent.total_members }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5" class="text-center">No data found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="row mt-4">
        <div class="col-lg-4">
          <table class="table">
            <thead>
              <tr>
                <th colspan="3" class="header">
                  <i class="bi bi-clipboard-data"></i> Kontingen Berdasarkan Provinsi
                </th>
              </tr>
              <tr>
                <th>No</th>
                <th>Province</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody v-if="contingentsByProvince.length > 0">
              <tr v-for="(item, index) in contingentsByProvince" :key="index">
                <td>{{ item.id }}</td>
                <td>{{ item.province }}</td>
                <td>{{ item.total }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="3" class="text-center">No data found.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-lg-4">
          <table class="table">
            <thead>
              <tr>
                <th colspan="3" class="header">
                  <i class="bi bi-clipboard-data"></i> Peserta Berdasarkan Provinsi
                </th>
              </tr>
              <tr>
                <th>No</th>
                <th>Province</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody v-if="participantsByProvince.length > 0">
              <tr v-for="(item, index) in participantsByProvince" :key="index">
                <td>{{ item.id }}</td>
                <td>{{ item.province }}</td>
                <td>{{ item.total }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="3" class="text-center">No data found.</td>
              </tr>
            </tbody>  
          </table>
        </div>
        <div class="col-lg-4">
          <table class="table">
            <thead>
              <tr>
                <th colspan="3" class="header">
                  <i class="bi bi-clipboard-data"></i> Peserta Berdasarkan Kabupaten/Kota
                </th>
              </tr>
              <tr>
                <th>No</th>
                <th>Province</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody v-if="participantsByDistrict.length > 0">
              <tr v-for="(item, index) in participantsByDistrict" :key="index">
                <td>{{ item.id }}</td>
                <td>{{ item.district_name }}</td>
                <td>{{ item.total }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="3" class="text-center">No data found.</td>
              </tr>
            </tbody>  
          </table>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-lg-4">
          <table class="table">
            <thead>
              <tr>
                <th colspan="3" class="header">
                  <i class="bi bi-clipboard-data"></i> Peserta Berdasarkan Gender
                </th>
              </tr>
              <tr>
                <th>Gender</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody v-if="participantsByGender.length > 0">
              <tr v-for="(item, index) in participantsByGender" :key="index">
                <td>{{ item.gender }}</td>
                <td>{{ item.total }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="2" class="text-center">No data found.</td>
              </tr>
            </tbody> 
          </table>
        </div>
        <div class="col-lg-4">
          <table class="table">
            <thead>
              <tr>
                <th colspan="3" class="header">
                  <i class="bi bi-clipboard-data"></i> Peserta Berdasarkan Kategori Usia
                </th>
              </tr>
              <tr>
                <th>No</th>
                <th>Kelompok Usia</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody v-if="participantsByAge.length > 0">
              <tr v-for="(item, index) in participantsByAge" :key="index">
                <td>{{ item.id }}</td>
                <td>{{ item.age_category }}</td>
                <td>{{ item.total }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="3" class="text-center">No data found.</td>
              </tr>
            </tbody> 
          </table>
        </div>
        <div class="col-lg-4">
          <table class="table">
            <thead>
              <tr>
                <th colspan="3" class="header">
                  <i class="bi bi-clipboard-data"></i> Peserta Berdasarkan Kelas
                </th>
              </tr>
              <tr>
                <th>No</th>
                <th>Kelas</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody v-if="participantsByClass.length > 0">
              <tr v-for="(item, index) in participantsByClass" :key="index">
                <td>{{ item.id }}</td>
                <td>{{ item.age_category_name }} - {{ item.class_name }}</td>
                <td>{{ item.total }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="3" class="text-center">No data found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'statistic'">
      <div class="row mt-4">
        <div class="col-lg-12">
          <div class="chart-container">
            <div class="title"><i class="bi bi-bar-chart-line"></i> Peserta Berdasarkan Kelas</div>
            <v-chart :option="ContingentRegistraionByDateChartData" style="width: 100%; height: 500px;"></v-chart>
          </div>
        </div>
      </div>
      
      <div class="row mt-4">
        <div class="col-lg-6">
          <div class="chart-container">
            <div class="title"><i class="bi bi-pie-chart"></i> Laporan Pembayaran</div>
            <v-chart :option="paymentReportChartData" style="width: 100%; height: 400px;"></v-chart>
          </div> 
        </div>
        <div class="col-lg-6">
          <div class="chart-container">
            <div class="title"><i class="bi bi-pie-chart"></i> Kontingen berdasarkan Provinsi</div>
            <v-chart :option="contingentsByProvinceChartData" style="width: 100%; height: 400px;"></v-chart>
          </div> 
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-lg-6">
          <div class="chart-container">
            <div class="title"><i class="bi bi-pie-chart"></i> Peserta berdasarkan Provinsi</div>
            <v-chart :option="participantsByProvinceChartData" style="width: 100%; height: 400px;"></v-chart>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="chart-container">
            <div class="title"><i class="bi bi-pie-chart"></i> Peserta Berdasarkan Kota</div>
            <v-chart :option="participantsByDistrictChartData" style="width: 100%; height: 400px;"></v-chart>
          </div>
        </div>
       
      </div>
      <div class="row mt-4">
        <div class="col-lg-6">
          <div class="chart-container">
            <div class="title"><i class="bi bi-pie-chart"></i> Peserta Berdasarkan Gender</div>
            <v-chart :option="participantsByGenderChartData" style="width: 100%; height: 400px;"></v-chart>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="chart-container">
            <div class="title"><i class="bi bi-pie-chart"></i> Peserta Berdasarkan Kategori Usia</div>
            <v-chart :option="ageChartData" style="width: 100%; height: 400px;"></v-chart>
          </div>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-lg-12">
          <div class="chart-container">
            <div class="title"><i class="bi bi-bar-chart-fill"></i> Peserta Berdasarkan Kelas</div>
            <v-chart :option="participantByClassChartData" style="width: 100%; height: 500px;"></v-chart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import axios from 'axios';
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, PieChart, LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
import VChart from "vue-echarts";

use([CanvasRenderer, BarChart, PieChart, LineChart, GridComponent, TooltipComponent, LegendComponent]);


export default defineComponent({
  name: 'TournamentInsightPage',
  components: { VChart },
  data() {
    return {
      activeTab: 'summary', // Default tab
      tournamentName: '',
      totalAccount:'',
      totalContingent:'',
      totalTanding:'',
      totalSeni:'',
      tournamentImage:'',
      tournamentDescription: '',
      tournamentDate: '',
      tournamentLocation: '',
      dateStart: '',
      dateEnd: '',
      document: '',
      matchCategories: [],
      ageCategories: [],
      activities: [],
      contingents: [],
      contingentsByProvince :[],
      participantsByProvince :[],
      participantsByAge :[],
      participantsByClass :[],
      participantsByDistrict :[],
      participantsByGender :[],
      tournamentIncomes: [],
      RevenueProjection: [],
      totalRegistrance: [],
      ageChartData: {
        tooltip: { trigger: "item" },
        legend: { top: "bottom" },
        series: [
          {
            name: "Participants by Age",
            type: "pie",
            radius: "50%",
            data: [],
          },
        ],
      },
      paymentReportChartData: {
        tooltip: { trigger: "item" },
        legend: { top: "bottom" },
        series: [
          {
            name: "Laporan Pembayaran",
            type: "pie",
            radius: "50%",
            data: [],
          },
        ],
      },
      participantsByGenderChartData: {
        tooltip: { trigger: "item" },
        legend: { top: "bottom" },
        series: [
          {
            name: "Participants by Gender",
            type: "pie",
            radius: "50%",
            data: [],
          },
        ],
      },
      contingentsByProvinceChartData: {
        tooltip: { trigger: "item" },
        legend: { top: "bottom" },
        series: [
          {
            name: "Kontingen Berdasarkan Provinsi",
            type: "pie",
            radius: "50%",
            data: [],
          },
        ],
      },
      participantsByProvinceChartData: {
        tooltip: { trigger: "item" },
        legend: { top: "bottom" },
        series: [
          {
            name: "Peserta Berdasarkan Provinsi",
            type: "pie",
            radius: "50%",
            data: [],
          },
        ],
      },
      participantsByDistrictChartData: {
        tooltip: { trigger: "item" },
        legend: { top: "bottom" },
        series: [
          {
            name: "Peserta Berdasarkan Kabupaten/Kota",
            type: "pie",
            radius: "50%",
            data: [],
          },
        ],
      },
      participantByClassChartData: {
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: [] },
        yAxis: { type: "value" },
        series: [{ type: "bar", data: [] }],
      },
      ContingentRegistraionByDateChartData: {
        tooltip: { trigger: "axis" },
        legend: { data: ["Registrations"] },
        xAxis: { type: "category", data: [] },
        yAxis: { type: "value" },
        series: [{ type: "line", data: [] }],
      },
      formData: {
        person_responsible: '',
        email: '',
        password: '',
        password_confirmation: '',
      },
      errors: {},
      loading: false,
      progress: 0,
    };
  },
  

  created() {
    this.loading = true; 
    this.fetchTotalRegistrance(this.$route.params.id);
    this.fetchTournamentDetail(this.$route.params.id);
    this.fetchAcount();
    this.fetchTournamentInsight(this.$route.params.id);
    this.loadContingent(this.$route.params.id);
    this.fetchContingentsByProvince(this.$route.params.id); 
    this.fetchParticipantsByProvince(this.$route.params.id);
    this.fetchParticipantsByAge(this.$route.params.id);
    this.fetchParticipantsByClass(this.$route.params.id);
    this.fetchParticipantsByDistrict(this.$route.params.id);
    this.fetchParticipantsByGender(this.$route.params.id); 
    this.fetchTournamentIncomes(this.$route.params.id);
    this.fetchRevenueProjection(this.$route.params.id);
  },
  //
  methods: {
    formatCurrency(value) {
      if (!value) return "Rp 0";
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(value);
    },
    
    
    async fetchTournamentDetail(id) {
     
      try {
        const response = await axios.get(`/tournaments/${id}`);
        if (response.data) {
          this.tournamentName = response.data.name;
          this.tournamentImage = response.data.image;
          this.tournamentDescription = response.data.description;
          this.tournamentDate = response.data.event_date;
          this.tournamentLocation = response.data.location;
          this.dateStart = response.data.start_date;
          this.dateEnd = response.data.end_date;
          this.matchCategories = response.data.categories;
          this.ageCategories = response.data.age_categories;
          this.document = response.data.document;
          this.activities = response.data.activities;
         
        }
      } catch (error) {
        this.toast.error("Error fetching contingent details.");
      } finally {
        this.loading = false;
      }
    },

    async fetchAcount() {
      this.loading = true; // Show loader
      try {
        const response = await axios.get(`/users/count`);
        if (response.data) {
          this.totalAccount = response.data.total_users; // Use the correct key
        }
      } catch (error) {
        this.toast.error("Error fetching user count.");
      } finally {
        this.loading = false;
      }
    },


    async fetchTournamentInsight(id) {
      this.loading = true; // Show loader
      try {
        const response = await axios.get(`/tournaments/${id}/stats`);
        if (response.data) {
          this.totalContingent = response.data.total_contingents;
          this.totalTanding = response.data.tanding;
          this.totalSeni = response.data.seni;  
        }
      } catch (error) {
        this.toast.error("Error fetching contingent details.");
      } finally {
        this.loading = false;
      }
    },

    async loadContingent(selectedTournamentId) {
      if (!selectedTournamentId) {
        this.toast.error("Invalid tournament ID.");
        return;
      }

      this.loading = true; // Show loader
      try {
        const response = await axios.get(`/tournaments/${selectedTournamentId}/contingents`);
        
        if (response.status === 200 && Array.isArray(response.data)) {
          this.contingents = response.data; // Assign array
        } else {
          this.toast.error("Unexpected response format.");
          this.contingents = []; // Ensure it's an array to prevent errors
        }
      } catch (error) {
        this.toast.error("Error fetching contingent details.");
        console.error("API Error:", error);
        this.contingents = []; // Prevent undefined issues
      } finally {
        this.loading = false;
      }
    },

    async fetchContingentsByProvince(tournamentId) {
      this.loading = true;
      try {
        const response = await axios.get(`/tournaments/${tournamentId}/contingents/summary-by-province`);
        if (response.status === 200) {
          this.contingentsByProvince = Object.entries(response.data).map(([province, data], index) => ({
            id: index + 1,
            province: province,
            total: data.total_contingents
          }));

          //contingentsByProvinceChartData
          this.contingentsByProvinceChartData = {
            tooltip: { trigger: "item" },
            legend: { top: "bottom" },
            series: [
              {
                name: "Kontingen Berdasarkan Provinsi",
                type: "pie",
                radius: "50%",
                data: this.contingentsByProvince.map(item => ({
                  name: item.province,
                  value: item.total
                }))
              }
            ]
          };
        }
      } catch (error) {
        console.error("Error fetching contingents by province:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchParticipantsByProvince(tournamentId) {
      this.loading = true;
      try {
        const response = await axios.get(`/tournaments/${tournamentId}/participants-by-province`);
        if (response.status === 200) {
          this.participantsByProvince = response.data.map((item, index) => ({
            id: index + 1,
            province: item.province,
            total: item.total_participants
          }));

          //participantsByProvinceChartData
          this.participantsByProvinceChartData = {
            tooltip: { trigger: "item" },
            legend: { top: "bottom" },
            series: [
              {
                name: "Kontingen Berdasarkan Provinsi",
                type: "pie",
                radius: "50%",
                data: this.participantsByProvince.map(item => ({
                  name: item.province,
                  value: item.total
                }))
              }
            ]
          };
        }
      } catch (error) {
        console.error("Error fetching participants by province:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchParticipantsByAge(tournamentId) {
      this.loading = true;
      try {
        const response = await axios.get(`/tournaments/${tournamentId}/participants-by-age-category`);
        if (response.status === 200) {
          this.participantsByAge = response.data.map((item, index) => ({
            id: index + 1,
            age_category: item.age_category,
            total: item.total_participants
          }));

          // Update chart data
          this.ageChartData = {
            tooltip: { trigger: "item" },
            legend: { top: "bottom" },
            series: [
              {
                name: "Participants by Age",
                type: "pie",
                radius: "50%",
                data: this.participantsByAge.map(item => ({
                  name: item.age_category,
                  value: item.total
                }))
              }
            ]
          };
        }
      } catch (error) {
        console.error("Error fetching participants by age:", error);
      } finally {
        this.loading = false;
      }
    },


    async fetchParticipantsByClass(tournamentId) {
      this.loading = true;
      try {
        const response = await axios.get(`/tournaments/${tournamentId}/participants-by-category-class`);
        if (response.status === 200) {
          this.participantsByClass = response.data.map((item, index) => ({
            id: index + 1,
            class: item.age_category_name+" - "+item.class_name,
            age_category_name: item.age_category_name,
            class_name: item.class_name,
            total: item.total_participants
          }));

         

          //participantByClassChartData
          this.participantByClassChartData = {
            tooltip: { trigger: "axis" },
            xAxis: {
              type: "category",
              data: this.participantsByClass.map(item => item.class),
              axisLabel: { rotate: 45 } // Rotate labels if they are long
            },
            yAxis: {
              type: "value",
              name: "Total Participants"
            },
            series: [
              {
                name: "Participants",
                type: "bar",
                data: this.participantsByClass.map(item => item.total),
                itemStyle: {
                  color: "#91CC75" // Customize bar color
                }
              }
            ]
          };
        
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },

    //participantsByDistrict
    async fetchParticipantsByDistrict(tournamentId) {
      this.loading = true;
      try {
        const response = await axios.get(`/tournaments/${tournamentId}/participants-by-district`);
        if (response.status === 200) {
          this.participantsByDistrict = response.data.map((item, index) => ({
            id: index + 1,
            district_name: item.district_name,
            total: item.total_participants
          }));

          //participantsByDistrictChartData
          this.participantsByDistrictChartData = {
            tooltip: { trigger: "item" },
            legend: { top: "bottom" },
            series: [
              {
                name: "Participants by Age",
                type: "pie",
                radius: "50%",
                data: this.participantsByDistrict.map(item => ({
                  name: item.district_name,
                  value: item.total
                }))
              }
            ]
          };
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },

    //participantsByGender
    async fetchParticipantsByGender(tournamentId) {
      this.loading = true;
      try {
        const response = await axios.get(`/tournaments/${tournamentId}/participants-by-gender`);
        if (response.status === 200) {
          this.participantsByGender = response.data.map((item) => ({
            gender: item.gender,
            total: item.total_participants
          }));

          //participantsByGenderChartData
          this.participantsByGenderChartData = {
            tooltip: { trigger: "item" },
            legend: { top: "bottom" },
            series: [
              {
                name: "Peserta Berdasarkan Gender",
                type: "pie",
                radius: "50%",
                data: this.participantsByGender.map(item => ({
                  name: item.gender,
                  value: item.total
                }))
              }
            ]
          };
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },

    //fetchTournamentIncomes
    async fetchTournamentIncomes(tournamentId) {
      this.loading = true;
      try {
        const response = await axios.get(`/tournaments/${tournamentId}/get-tournament-income`);
        if (response.status === 200) {
          this.tournamentIncomes = response.data.map((item, index) => ({
            id: index + 1,
            description: item.description,
            amount: item.amount
          }));

          //participantsByGenderChartData
          this.paymentReportChartData = {
            tooltip: { trigger: "item" },
            legend: { top: "bottom" },
            series: [
              {
                name: "Laporan Pembayaran",
                type: "pie",
                radius: "50%",
                data: this.tournamentIncomes.map(item => ({
                  name: item.description,
                  value: item.amount
                }))
              }
            ]
          };
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },

    
    async fetchRevenueProjection(tournamentId) {
      this.loading = true;
      try {
        const response = await axios.get(`/tournaments/${tournamentId}/get-total-income`);
        if (response.status === 200) {
          this.RevenueProjection = response.data.map((item, index) => ({
            id: index + 1,
            description: item.description,
            total_amount: item.total_amount
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchTotalRegistrance(tournamentId) {
      this.loading = true;
      try {
        const response = await axios.get(`/tournaments/${tournamentId}/contingents-join-by-date`);
        if (response.status === 200) {
          this.totalRegistrance = response.data.map((item, index) => ({
            id: index + 1,
            join_date: item.join_date,
            total_contingents: item.total_contingents
          }));

          this.ContingentRegistraionByDateChartData = {
            tooltip: { trigger: "axis" },
            xAxis: {
              type: "category",
              data: this.totalRegistrance.map(item => item.join_date),
              axisLabel: { rotate: 45 } // Rotate labels if they are long
            },
            yAxis: {
              type: "value",
              name: "Total Contingents"
            },
            series: [
              {
                name: "Contingents",
                type: "line",
                data: this.totalRegistrance.map(item => item.total_contingents),
                itemStyle: {
                  color: "#91CC75" // Customize bar color
                }
              }
            ]
          };
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },

    

        
  },
});
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

.dashboard-container p{
  font-family: Figtree, sans-serif;
  font-size: 16px;
  font-weight: 500;
}

.dashboard-container .summary-data{
  height: 100px;
  border: 1px solid #388E3C;
  border-top: 5px solid #388E3C;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 24px;
}

.dashboard-container .chart-container{
  border: 1px solid #1E2A57;
  background-color: #E2F1FD;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  padding-bottom: 20px;
  

}

.dashboard-container .chart-container .title{
  background-color: #1E2A57;
  height: 65px;
  line-height: 65px;
  padding-left: 10px;
  color: #FFFFFF;
  font-family: Figtree, sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
}

.dashboard-container .summary-data .title{
  font-family: Figtree, sans-serif;
  font-size: 16px;
  font-weight: 500;
  text-transform: uppercase;
}

.dashboard-container .summary-data .value{
  font-family: Figtree, sans-serif;
  font-size: 14px;
  font-weight: 500;
}

.dashboard-container .form-control{
  font-family: Figtree, sans-serif;
  font-size: 16px;
  font-weight: 500;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 5px;
  background-color: #388E3C;
  animation: loader-animation 1.5s infinite;
}

.tournament-name{
  font-family: Urbanist, sans-serif;
  font-size: 2rem;
  color: #1E2A57;
  font-weight: 700;
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

.list-unstyled {
  margin-bottom: 15px;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  padding: 8px 20px;
  border-radius: 5px;
  font-size: 14px;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
