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
            Apakah Anda yakin ingin menghapus turnamen ini?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
            <button type="button" class="btn btn-danger" @click="deleteTournament">Yes</button>
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
      <i class="bi bi-file-earmark-text"></i> Tournament List
    </div>

    <div class="mb-2 d-flex justify-content-between align-items-center">
      <!-- Search Bar -->
      <input 
        v-model="searchQuery" 
        type="text" 
        class="form-control w-auto" 
        placeholder="Search" 
        @input="searchTournament" 
      >

      <!-- Create Menu Button -->
      <router-link to="/admin/tournament/create" class="button button-primary">
        <i class="bi bi-plus-square"></i> Add New
      </router-link>
    </div>

    <!-- Table to display navigation data -->
    <table class="table mt-4">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tournament Name</th>
          <th>Technical Meeting Date</th>
          <th>Date Start</th>
          <th>Date End</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody v-if="tournaments.length > 0">
        <tr v-for="(tournament, index) in tournaments" :key="tournament.id">
        <td>{{ index + 1 + (currentPage - 1) * perPage }}</td>
       
          <td>{{ tournament.name }}</td>
          <td>{{ tournament.technical_meeting_date }}</td>
          <td>{{ tournament.start_date }}</td>
          <td>{{ tournament.end_date }}</td>
          <td>{{ tournament.status }}</td>
          <td class="action-column">
            <div class="btn-group" role="group">
              <button type="button" class="button button-primary" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-card-checklist"></i> Action
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" @click="EditTournament(tournament.id)"><i class="bi bi-pencil-square"></i> Edit</a></li>
                <li>
                  <a class="dropdown-item" href="#" @click="confirmDelete(tournament.id)">
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
          <td colspan="6" class="text-center">No data found.</td>
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
  name: "TournamentList",
  data() {
    return {
      tournamentId: null,
      deleteModal: null,
      tournaments: [],
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
  mounted() {
    this.loadTournament(); // Corrected the method name
    this.deleteModal = new Modal(document.getElementById("confirmDeleteModal"));
  },
  methods: {
    confirmDelete(id) {
      this.tournamentId = id;
      this.deleteModal.show();
    },
    
    async loadTournament(page = 1) {
      this.loading = true;
      console.log(this.loading);
      try {
        this.loading = true;

        const response = await axios.get("/tournament-settings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Assumes token is in localStorage
          },
          params: {
            page,
            perPage: this.perPage,
            search: this.searchQuery.trim(),
          },
        });
        const {
          current_page,
          last_page,
          data,
          next_page_url,
          prev_page_url,
        } = response.data;

        this.tournaments = data; // Assign team members
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
        this.loadTournament(page);
      }
    },


    searchTournament() {
      this.currentPage = 1; // Reset to page 1 for new search
      this.loadTournament();
    },

    EditTournament(id) {
      this.$router.push({ name: "EditTournament", params: { id } });
    },

    async deleteTournament() {
      try {

        await axios.delete(`/tournament-settings/${this.tournamentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Assumes token is in localStorage
          }
        });
        this.$emit("tournamentDeleted", this.tournamentId); // Emit event jika perlu
        this.loadTournament();
        this.toast.success("Tournament deleted successfully!");
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
