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
      <i class="bi bi-file-earmark-text"></i> Contingent List
    </div>

    <div class="mb-2 d-flex justify-content-between align-items-center">
      <!-- Search Bar -->
      <input 
        v-model="searchQuery" 
        type="text" 
        class="form-control w-auto" 
        placeholder="Search" 
        @input="searchContingent" 
      >
      <div class="tool-bar d-flex gap-2">
        <button class="button button-primary" @click="exportToExcel">
          <i class="bi bi-file-earmark-spreadsheet"></i> Export to Excel
        </button>
        <!-- Create Menu Button -->
        <router-link to="/admin/contingent/create" class="button button-primary">
          <i class="bi bi-plus-square"></i> Add New
        </router-link>
      </div>
    </div>

    


    <!-- Table to display navigation data -->
    <table class="table mt-4">
      <thead>
        <tr class="table-header">
          <th colspan="8" class="header">
            <select v-model="selectedTournament" @change="loadContingent" class="form-select w-auto">
              <option value="">All Tournaments</option>
              <option v-for="t in tournaments" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>
          </th>
        </tr>
        <tr>
          <th>ID</th>
          <th>Tournament Name</th>
          <th>Contingent Name</th>
          <th>PIC Name</th>
          <th>PIC Phone</th>
          <th>PIC Email</th>
          <th>Total Team Members</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody v-if="contingents.length > 0">
        <tr v-for="(contingent, index) in contingents" :key="contingent.id">
        <td>{{ index + 1 + (currentPage - 1) * perPage }}</td>
          <td>{{ contingent.tournament_name }}</td>
          <td>{{ contingent.name }}</td>
          <td>{{ contingent.pic_name }}</td>
          <td>{{ contingent.pic_phone }}</td>
          <td>{{ contingent.pic_email }}</td>
          <td>{{ contingent.team_members_count }}</td>
          <td class="action-column">
            <div class="btn-group" role="group">
              <button type="button" class="button button-primary" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-card-checklist"></i> Action
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" @click="EditContingent(contingent.id)"><i class="bi bi-pencil-square"></i> Edit</a></li>
                <li v-if="permissions && permissions.includes('delete contingent')">
                  <a class="dropdown-item" href="#" @click="confirmDelete(contingent.id)">
                    <i class="bi bi-trash"></i> Delete
                  </a>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="8" class="text-center">No data found.</td>
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
      contingentId: null,
      selectedTournament: '', // Untuk filter
      deleteModal: null,
      contingents: [],
      searchQuery: "", // User's search input
      currentPage: 1, // Current page of results
      perPage: 10, // Results per page
      totalPages: 0, // Total number of pages
      prevPageUrl: null, // URL of the previous page
      nextPageUrl: null, // URL of the next page
      loading: false,
      progress: 0,
    };
  },

  setup() {
    const toast = useToast();
    const permissions = inject('permissions', []); // Ensure permissions is always an array
    
    return { toast, permissions };
  },
  async mounted() {
    
    await this.loadTournaments();       // Pastikan daftar turnamen udah ready
    this.loadContingent(); // Corrected the method name
    this.deleteModal = new Modal(document.getElementById("confirmDeleteModal"));
  },
  methods: {
    async loadTournaments() {
      try {
        const res = await axios.get("/tournaments/active", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        this.tournaments = res.data;
      } catch (err) {
        console.error("Gagal load tournament:", err);
      }
    },

    confirmDelete(id) {
      this.contingentId = id;
      this.deleteModal.show();
    },

    async exportToExcel() {
      try {
        this.loading = true;

        const response = await axios.get("/contingents/export", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          params: {
            search: this.searchQuery.trim(),
            tournament_id: this.selectedTournament,
          },
          responseType: "blob",
        });

        let filename = "download.xlsx";
        const disposition = response.headers["content-disposition"];
        if (disposition && disposition.includes("filename=")) {
          const match = disposition.match(/filename="?([^"]+)"?/);
          if (match && match[1]) {
            filename = match[1];
          }
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();

        this.loading = false;
      } catch (error) {
        console.error("Gagal mengekspor:", error);
        this.toast.error("Gagal mengekspor data!");
        this.loading = false;
      }
    },
    
    async loadContingent(page = 1) {
      this.loading = true;
      console.log(this.loading);
      try {
        this.loading = true;

        const response = await axios.get("/contingents", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Assumes token is in localStorage
          },
          params: {
            page,
            perPage: this.perPage,
            search: this.searchQuery.trim(),
            tournament_id: this.selectedTournament || undefined, // 🆕 dikirim kalau ada
          },
        });
        const {
          current_page,
          last_page,
          data,
          next_page_url,
          prev_page_url,
        } = response.data;

        this.contingents = data; // Assign team members
        this.currentPage = current_page; // Current page
        this.totalPages = last_page; // Total pages
        this.nextPageUrl = next_page_url; // Next page URL
        this.prevPageUrl = prev_page_url; // Previous page URL
        this.loading = false;
      } catch (error) {
        console.error("Error loading members:", error);
      }
    },

    

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.loadContingent(page);
      }
    },


    searchContingent() {
      this.currentPage = 1; // Reset to page 1 for new search
      this.loadContingent();
    },

    EditContingent(id) {
      this.$router.push({ name: "EditContingent", params: { id } });
    },

    async deleteContingent() {
      try {

        await axios.delete(`/contingents/${this.contingentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Assumes token is in localStorage
          }
        });
        this.$emit("contingentDeleted", this.contingentId); // Emit event jika perlu
        this.loadContingent();
        this.toast.success("Contingent deleted successfully!");
        this.deleteModal.hide(); // Tutup modal setelah sukses
      } catch (error) {
        this.deleteModal.hide(); // Tutup modal setelah sukses
        this.toast.error("Gagal menghapus:", error);
        console.error("Gagal menghapus:", error);
      }
    },
  },
  computed: {
    prevPageExists() {
      return this.currentPage > 1;
    },
    nextPageExists() {
      return this.currentPage < this.totalPages;
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
