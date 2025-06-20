<template>
  <!-- Modal Konfirmasi Delete -->
  <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true" ref="deleteModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteModalLabel">Konfirmasi Hapus Jadwal</h5>
         
        </div>
        <div class="modal-body">
          Apakah kamu yakin ingin menghapus jadwal ini?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
          <button type="button" class="btn btn-danger" @click="deleteSchedule">Hapus</button>
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
      <i class="bi bi-file-earmark-text"></i> Tournament Match Schedule List
    </div>

    <div class="mb-2 d-flex justify-content-end align-items-center">
      <!-- Search Bar -->
      <!--input 
        v-model="searchQuery" 
        type="text" 
        class="form-control w-auto" 
        placeholder="Search" 
        @input="searchMembers" 
      /-->

      <!-- Create Menu Button -->
       <div class="d-flex gap-2">
        <router-link to="/admin/tournament-schedule/tanding/create" class="button button-primary">
          <i class="bi bi-plus-square"></i> Add New Schedule (Tanding)
        </router-link>
        <router-link to="/admin/tournament-schedule/seni/create" class="button button-primary">
          <i class="bi bi-plus-square"></i> Add New Schedule (Seni)
        </router-link>
       </div>
     
    </div>

    <!-- Table to display navigation data -->
    <table class="table mt-4">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tournament</th>
          <th>Match Category</th>
          <th>Arena Name</th>
          <th>Match Date</th>
          <th>Age Category</th>
          <th>Round</th>
          <!--th>Start Time</th>
          <th>End Time</th-->
          <th>Actions</th>
        </tr>
      </thead>
      <!-- Wrapper element with v-if -->
      <tbody v-if="tournamentSchedules.length > 0">  
        <tr v-for="(tournamentSchedule, index) in tournamentSchedules" :key="tournamentSchedule.id">
          <td>{{ index + 1 + (currentPage - 1) * perPage }}</td>
          <td>{{ tournamentSchedule.tournament.name }}</td>
          <td>
            {{
              tournamentSchedule.details?.[0]?.tournament_match
                ? 'Tanding'
                : 'Seni'
            }}
          </td>



          
          <td>{{ tournamentSchedule.arena.name }}</td>
          <td>{{ tournamentSchedule.scheduled_date }}</td>
         <td>{{ tournamentSchedule.age_category?.name || '-' }}</td>

          <td>{{ tournamentSchedule.round_label }}</td>
          <!--td>{{ tournamentSchedule.start_time }}</td>
          <td>{{ tournamentSchedule.end_time }}</td-->
          <td class="action-column">
            <div class="btn-group" role="group">
              <button type="button" class="button button-primary" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-card-checklist"></i> Action
              </button>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#" @click="EditSchedule(tournamentSchedule.id)">
                    <i class="bi bi-pencil-square"></i> Edit
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click="confirmDelete(tournamentSchedule.id)">
                    <i class="bi bi-trash"></i> Delete
                  </a>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
      <!-- Fallback message when there is no data -->
      <tbody v-else>
        <tr>
          <td colspan="8" class="text-center">No schedule found.</td>
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
import * as bootstrap from 'bootstrap';



axios.defaults.baseURL = API.API_BASE_URL;

export default {
  name: "TournamentArenaList",
  data() {
    return {
      tournamentSchedules: [], // Array to hold paginated team members
      deleteModalInstance: null,
      selectedScheduleId: null,
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
  mounted() {
    const modalEl = this.$refs.deleteModal;
    this.deleteModalInstance = new bootstrap.Modal(modalEl);
    this.loadTournamentSchedules(); // Load menu data when the component is mounted
  },
  methods: {
    confirmDelete(id) {
      this.selectedScheduleId = id;
      this.deleteModalInstance.show();
    },

    async deleteSchedule() {
      if (!this.selectedScheduleId) return;

      try {
        await axios.delete(`/match-schedules/${this.selectedScheduleId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        this.toast?.success?.("Jadwal berhasil dihapus");
        this.deleteModalInstance.hide();
        this.loadTournamentSchedules(); // Refresh data
      } catch (error) {
        console.error("Gagal menghapus jadwal:", error);
        this.toast?.error?.("Gagal menghapus jadwal");
      }
    },
  
    async loadTournamentSchedules(page = 1) {
      this.loading = true;
      try {
        const response = await axios.get("/match-schedules", {
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

        this.tournamentSchedules = data; // Assign team members
        this.currentPage = current_page; // Current page
        this.totalPages = last_page; // Total pages
        this.nextPageUrl = next_page_url; // Next page URL
        this.prevPageUrl = prev_page_url; // Previous page URL
        this.loading = false;
      } catch (error) {
        console.error("Error loading data:", error);
      }
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.loadTournamentSchedules(page);
      }
    },


    searchClasses() {
      this.currentPage = 1; // Reset to page 1 for new search
      this.loadTournamentArenas();
    },

    /*async EditSchedule(id) {
      this.$router.push({ name: "EditSchedule", params: { id } });
    },*/

    EditSchedule(id) {
      const schedule = this.tournamentSchedules.find(item => item.id === id);

      if (!schedule) {
        this.toast.error("Schedule not found");
        return;
      }

      const isSeni = !!schedule.details?.[0]?.seni_match;

      const route = isSeni
        ? `/admin/tournament-schedule/seni/edit/${id}`
        : `/admin/tournament-schedule/tanding/edit/${id}`;

      this.$router.push(route);
    },


    deleteMenu(id) {
      console.log("Delete menu with ID:", id);
      // Implement logic to delete the menu (e.g., API call)
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
  background-color: #1E2A57 !important; /* Base color */
}

.navbar-toggler-icon {
  background-color: white; /* Ensure toggle icon is visible */
}

.nav-link {
  color: white !important; /* Navigation link color */
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
