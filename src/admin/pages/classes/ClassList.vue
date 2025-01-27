<template>
  <div class="dashboard-container">
    <div
      v-if="loading"
      class="progress-bar"
      :style="{ width: progress + '%' }"
    ></div>
    <div class="mb-2 page-title">
      <i class="bi bi-file-earmark-text"></i> Class List
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
      <router-link to="/admin/classes/create" class="button button-primary">
        <i class="bi bi-plus-square"></i> Add New
      </router-link>
    </div>

    <!-- Table to display navigation data -->
    <table class="table mt-4">
      <thead>
        <tr>
          <th>ID</th>
          <th>Age Category</th>
          <th>Class Name</th>
          <th>Gender</th>
          <th>Weight Min</th>
          <th>Weight Max</th>
          <th>Actions</th>
        </tr>
      </thead>
      <!-- Wrapper element with v-if -->
      <tbody v-if="classes.length > 0">
        
        <tr v-for="(class_category, index) in classes" :key="class_category.id">
          <td>{{ index + 1 + (currentPage - 1) * perPage }}</td>
          <td>{{ class_category.age_category.name }}</td>
          <td>{{ class_category.name }}</td>
          <td>{{ class_category.gender === 'male' ? 'Laki-laki' : (class_category.gender === 'female' ? 'Perempuan' : 'N/A') }}</td>
          <td>{{ class_category.weight_min }}</td>
          <td>{{ class_category.weight_max }}</td>
          <td class="action-column">
            <div class="btn-group" role="group">
              <button type="button" class="button button-primary" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-card-checklist"></i> Action
              </button>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#" @click="EditClass(class_category.id)">
                    <i class="bi bi-pencil-square"></i> Edit
                  </a>
                </li>
                <!--li>
                  <a class="dropdown-item" href="#" @click="deleteMenu(member.id)">
                    <i class="bi bi-trash"></i> Delete
                  </a>
                </li-->
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
      <!-- Fallback message when there is no data -->
      <tbody v-else>
        <tr>
          <td colspan="7" class="text-center">No class found.</td>
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

axios.defaults.baseURL = API.API_BASE_URL;

export default {
  name: "MembersList",
  data() {
    return {
      classes: [], // Array to hold paginated team members
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
    this.loadClasses(); // Load menu data when the component is mounted
  },
  methods: {
    async loadClasses(page = 1) {
      this.loading = true;
      try {
        const response = await axios.get("/category-classes", {
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

        this.classes = data; // Assign team members
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
        this.loadClasses(page);
      }
    },


    searchClasses() {
      this.currentPage = 1; // Reset to page 1 for new search
      this.loadClasses();
    },

    async EditClass(id) {
      this.$router.push({ name: "EditClass", params: { id } });
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
