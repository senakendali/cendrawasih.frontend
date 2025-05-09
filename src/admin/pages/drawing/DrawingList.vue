<template>
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
      <i class="bi bi-file-earmark-text"></i> Tanding
    </div>

    <div class="mb-2 d-flex justify-content-end align-items-center">
      <!-- Search Bar -->
     
      <!-- Create Menu Button -->
      <router-link to="/admin/tanding/create" class="button button-primary">
        <i class="bi bi-plus-square"></i> Add New
      </router-link>
    </div>

    <!-- Table to display navigation data -->
    <table class="table mt-4">
      <thead>
        <tr>
          <th>Tournament</th>
          <th>Pool</th>
          <th>Match Category</th>
          <th>Age Category</th>
          <th>Class Category</th>
          <th>Bracket Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody v-if="pools.length > 0">
        <tr v-for="pool in pools" :key="pool.pool_id">
          
       
          <td>{{ pool.tournament_name }}</td>
          <td>{{ pool.name }}</td>
          <td>{{ pool.match_category }}</td>
          <td>{{ pool.age_category }}</td>
          <td>{{ pool.category_class.gender }} - {{ pool.category_class.name }} ({{ pool.category_class.weight_min }} KG - {{ pool.category_class.weight_max }} KG)</td>
          <td class="text-center">{{ pool.match_chart }}</td>
          <td class="action-column">
            <div class="btn-group" role="group">
              <button type="button" class="button button-primary" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-card-checklist"></i> Action
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" @click="GenerateMatch(pool.pool_id)"><i class="bi bi-diagram-3"></i> View Bracket</a></li>
                <li><a class="dropdown-item" href="#" @click="ViewMatch(pool.pool_id)"><i class="bi bi-eye"></i> View Match</a></li>
                
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="7" class="text-center">No data found.</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <nav v-if="totalPages > 1">
      <ul class="pagination pagination-lg justify-content-end">
        <li class="page-item" :class="{ disabled: !prevPageUrl }">
          <button
            class="page-link"
            @click="changePage(currentPage - 1)"
            :disabled="!prevPageUrl"
          >
          <i class="bi bi-arrow-left-square"></i>
          </button>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="changePage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: !nextPageUrl }">
          <button
            class="page-link"
            @click="changePage(currentPage + 1)"
            :disabled="!nextPageUrl"
          >
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
import { Modal } from "bootstrap";
import { useToast } from "vue-toastification";
import { inject } from 'vue';

axios.defaults.baseURL = API.API_BASE_URL;

export default {
  name: "ContingentList",
  data() {
    return {
      poolId: null,
      deleteModal: null,
      pools: [],
      loading: false,
      progress: 0,
    };
  },

  setup() {
    const toast = useToast();
    const permissions = inject('permissions', []); // Ensure permissions is always an array
    
    return { toast, permissions };
  },
  mounted() {
    this.loadPools(); // Corrected the method name
    this.deleteModal = new Modal(document.getElementById("confirmDeleteModal"));
  },
  methods: {
    confirmDelete(id) {
      this.poolId = id;
      this.deleteModal.show();
    },
    
    async loadPools() {
      this.loading = true;
      console.log(this.loading);
      try {
        this.loading = true;

        const response = await axios.get("/pools", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Assumes token is in localStorage
          },
        });
        const {
          data,
        } = response.data;

        this.pools = data; // Assign team members
        this.loading = false;
      } catch (error) {
        console.error("Error loading data:", error);
      }
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
