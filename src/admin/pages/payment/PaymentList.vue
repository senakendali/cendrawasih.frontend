<template>
  <div class="dashboard-container">
    <div v-if="loading" class="progress-bar" :style="{ width: progress + '%' }"></div>

    <div class="mb-2 page-title">
      <i class="bi bi-file-earmark-text"></i> Payment
    </div>

    <div class="mb-2 d-flex justify-content-end align-items-center">
      <!-- Create Menu Button -->
      <router-link v-if="permissions && permissions.includes('create payment')" to="/admin/payment/create" class="button button-primary">
        <i class="bi bi-plus-square"></i> Add New
      </router-link>
    </div>

    <!-- Table -->
    <table class="table mt-4">
      <thead>
        <tr class="table-header">
          <th colspan="7" class="header">
            <div class="d-flex gap-2 w-100">
              <select class="form-select w-auto" v-model="selectedTournamentId" @change="loadBillings(1)">
                <option value="">All Tournaments</option>
                <option
                  v-for="tournament in allTournaments"
                  :key="tournament.id"
                  :value="tournament.id"
                >
                  {{ tournament.name }}
                </option>
              </select>
              <select class="form-select w-auto" v-model="selectedStatus" @change="loadBillings(1)">
                <option value="">All Payment Status</option>
                <option value="waiting for payment">Waiting for Payment</option>
                <option value="waiting for confirmation">Waiting for Confirmation</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
          </th>
        </tr>
        <tr>
          <th>ID</th>
          <th>Tournament</th> 
          <th>Invoice Number</th>
          <th>Bank</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody v-if="billings.length > 0">
        <tr v-for="(billing, index) in billings" :key="billing.id">
          <td>{{ index + 1 + (currentPage - 1) * perPage }}</td>
          <td>{{ billing.tournament?.name || '-' }}</td>

          <td>{{ billing.invoice_number }}</td>
          <td>{{ billing.bank_name }}</td>
          <td>{{ formatNumber(billing.amount) }}</td>
          <td>
            <div :class="['payment-status', { 'paid': billing.status === 'paid' }]">
              {{ billing.status }}
            </div>
          </td>
          
          <td class="action-column">
            <div v-if="billing.status != 'paid'" class="btn-group" role="group">
              <button type="button" class="button button-primary" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-card-checklist"></i> Action
              </button>
              <ul class="dropdown-menu">
                <li v-if="permissions && permissions.includes('edit payment')">
                  <a class="dropdown-item" href="#" @click="EditPayment(billing.id)">
                    <i class="bi bi-pencil-square"></i> Edit
                  </a>
                </li>
                <li v-if="permissions && permissions.includes('upload payment struk')">
                  <a class="dropdown-item" href="#" @click="ConfirmPayment(billing.id)">
                    <i class="bi bi-credit-card-2-back"></i> Upload Payment Struk
                  </a>
                </li>
                <li v-if="permissions && permissions.includes('confirm payment')">
                  <a class="dropdown-item" href="#" @click="ConfirmPayment(billing.id)">
                    <i class="bi bi-credit-card-2-back"></i> Confirm Payment
                  </a>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="6" class="text-center">No data found.</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <nav v-if="totalPages > 1">
      <ul class="pagination pagination-lg justify-content-end">
        <li class="page-item" :class="{ disabled: !prevPageUrl }">
          <button class="page-link" @click="changePage(currentPage - 1)" :disabled="!prevPageUrl">
            <i class="bi bi-arrow-left-square"></i>
          </button>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
          <button class="page-link" @click="changePage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: !nextPageUrl }">
          <button class="page-link" @click="changePage(currentPage + 1)" :disabled="!nextPageUrl">
            <i class="bi bi-arrow-right-square"></i>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from "axios";
import API from "@/config/api";
import { inject } from 'vue';

axios.defaults.baseURL = API.API_BASE_URL;

export default {
  name: "PaymentList",
  data() {
    return {
      billings: [],
      allTournaments: [],
      searchQuery: "",
      currentPage: 1,
      perPage: 10,
      totalPages: 0,
      prevPageUrl: null,
      nextPageUrl: null,
      loading: false,
      progress: 0,
      selectedStatus: "", 
      selectedTournamentId: "", 
    };
  },

  setup() {
    const permissions = inject('permissions', []);  // Ensure permissions is always an array
    return { permissions };
  },

  mounted() {
    this.fetchAllTournaments();
    this.loadBillings();
  },

  methods: {
    async loadBillings(page = 1) {
      this.loading = true;
      try {
        const response = await axios.get("/billings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          params: {
            page,
            perPage: this.perPage,
            search: this.searchQuery.trim(),
            status: this.selectedStatus,
            tournament_id: this.selectedTournamentId, 
          },
        });

        const { current_page, last_page, data, next_page_url, prev_page_url } = response.data;
        this.billings = data;
        this.currentPage = current_page;
        this.totalPages = last_page;
        this.nextPageUrl = next_page_url;
        this.prevPageUrl = prev_page_url;
      } catch (error) {
        console.error("Error loading billings:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchAllTournaments() {
      try {
        const response = await axios.get("/tournaments/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        this.allTournaments = response.data;
      } catch (error) {
        console.error("Failed to fetch tournaments:", error);
      }
    },


    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.loadBillings(page);
      }
    },

    formatNumber(value) {
      if (value == null) return "-";
      return new Intl.NumberFormat("id-ID", { 
        style: "currency", 
        currency: "IDR", 
        minimumFractionDigits: 2 
      }).format(value);
    },

    EditPayment(id) {
      this.$router.push({ name: "EditPayment", params: { id } });
    },

    ConfirmPayment(id) {
      this.$router.push({ name: "ConfirmPayment", params: { id } });
    },
  },
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

.table th,
.table td {
  padding: 10px;
}

.payment-status{
  background-color: #CCC;
  border:1px solid #CCC;
  padding: 8px;
  border-radius: 5px;
  text-align: center;
  min-width: 150px;
  width: fit-content;
  color: #404040;
}

.payment-status.paid{
  background-color: #388E3C;
  border-color: #388E3C;
  color: #fff;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 5px;
  background-color: #388E3C;
  animation: loader-animation 1.5s infinite;
}

@keyframes loader-animation {
  0% { width: 0; background-color: #388E3C; }
  50% { width: 50%; background-color: #388E3C; }
  100% { width: 100%; background-color: #388E3C; }
}
</style>
