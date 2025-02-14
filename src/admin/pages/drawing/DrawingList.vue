<template>
  <div class="dashboard-container">
    <div
      v-if="loading"
      class="progress-bar"
      :style="{ width: progress + '%' }"
    ></div>
    <div class="mb-2 page-title">
      <i class="bi bi-file-earmark-text"></i> Match List
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
      <router-link to="/admin/drawing/create" class="button button-primary">
        <i class="bi bi-plus-square"></i> Add New
      </router-link>
    </div>

    <!-- Table to display navigation data -->
    <table class="table mt-4">
      <thead>
        <tr>
          <th>Match</th>
          <th>Round</th>
          <th>Contingent 1</th>
          <th>Participant 1</th>
          <th>Contingent 2</th>
          <th>Participant 2</th>
          <th>Winner</th>
        </tr>
      </thead>
      <!-- Wrapper element with v-if -->
      <tbody v-if="matches.length > 0">
        <tr v-for="match in matches" :key="match.match_id">
          <td>{{ match.match_id }}</td>
          <td>{{ match.round }}</td>
          <td>{{ match.team_member_1_contingent ?? 'TBD' }}</td>
          <td>{{ match.team_member_1_name ?? 'TBD' }}</td>
          <td>{{ match.team_member_2_contingent ?? 'TBD' }}</td>
          <td>{{ match.team_member_2_name ?? 'TBD' }}</td>
          <td>{{ match.winner ?? 'TBD' }}</td>
        </tr>
      </tbody>

      <!-- Fallback message when there is no data -->
      <tbody v-else>
        <tr>
          <td colspan="7" class="text-center">No match found.</td>
        </tr>
      </tbody>


    </table>

    



  </div>
</template>

<script>
import axios from "axios";
import API from "@/config/api";

axios.defaults.baseURL = API.API_BASE_URL;

export default {
  name: "DrawingList",
  data() {
    return {
      matches: [], // Array to hold paginated team members
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
    this.loadMatches(); // Load menu data when the component is mounted
  },
  methods: {
    async loadMatches() {
      this.loading = true;
      try {
        const response = await axios.get("/drawings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Assumes token is in localStorage
          },
          params: {
            search: this.searchQuery.trim(),
          },
        });
        const {
          data,
        } = response.data;

        this.matches = data; // Assign team membersL
        this.loading = false;
      } catch (error) {
        console.error("Error loading members:", error);
      }
    },

   


    searchDrawing() {
      this.currentPage = 1; // Reset to page 1 for new search
      this.loadMatches();
    },

    async EditDrawing(id) {
      this.$router.push({ name: "EditDrawing", params: { id } });
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
