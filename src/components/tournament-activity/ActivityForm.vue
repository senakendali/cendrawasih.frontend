<template>
  <div class="dashboard-container">
    <!-- Loader: Top Progress Bar -->
    <div
      v-if="loading"
      class="progress-bar"
      :style="{ width: progress + '%' }"
    ></div>

    <div class="container">
      <!-- Form Title -->
      <div class="mb-2 page-title">
        <i class="bi bi-file-earmark-text"></i>
        {{ isEdit ? "Edit Activity" : "Add Activity" }}
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="admin-form mt-4">
        <div class="row">
          <div class="col-lg-12">
            <div class="mb-3">
              <label for="tournament_id" class="form-label">Tournament</label>
              <select
                class="form-select"
                id="tournament_id"
                v-model="form.tournament_id"
                :class="{ 'is-invalid': errors.tournament_id }"
              >
                <option value="" disabled>Choose Tournament</option>
                <option 
                  v-for="tournament in activeTournaments" 
                  :key="tournament.id" 
                  :value="tournament.id"
                >
                  {{ tournament.name }}
                </option>
              </select>
              <div class="invalid-feedback">{{ errors.tournament_id }}</div>
            </div>
            <div class="mb-3">
              <label for="name" class="form-label">Activity Name</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
                id="name"
                v-model="form.name"
              />
              <div class="invalid-feedback">{{ errors.name }}</div>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <textarea
            class="form-control"
            :class="{ 'is-invalid': errors.address }"
            id="description"
            v-model="form.description"
          ></textarea>
          <div class="invalid-feedback">{{ errors.description }}</div>
        </div>
        <div class="mb-3">
              <label for="start_date" class="form-label">Date Start</label>
              <input
                type="date"
                class="form-control"
                :class="{ 'is-invalid': errors.start_date }"
                id="start_date"
                v-model="form.start_date"
              />
              <div class="invalid-feedback">{{ errors.start_date }}</div>
            </div>

            <div class="mb-3">
              <label for="end_date" class="form-label">Date End</label>
              <input
                type="date"
                class="form-control"
                :class="{ 'is-invalid': errors.end_date }"
                id="end_date"
                v-model="form.end_date"
              />
              <div class="invalid-feedback">{{ errors.end_date }}</div>
            </div>

        <!-- Submit Button -->
        <div class="row">
          <div class="col-lg-12 text-center">
            <button type="submit" class="button button-primary" :disabled="loading">
              <i class="bi bi-floppy"></i>
              <span>{{ isEdit ? "Update Activity" : "Add Activity" }}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  name: "ActivityForm",
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      activityId: null,
      ageCategories: [],
      activeTournaments: [],
      form: {
        tournament_id: "",
        name: "",
        description: "",
        start_date: "",
        end_date: "",
      },
      errors: {},
      loading: false,
      progress: 0,
    };
  },

  created() {
    this.classId = this.$route.params.id;
    this.fetchActiveTournaments();
    if (this.isEdit && this.classId) {
      this.fetchActivityDetail(this.classId);
    }
  },

  beforeRouteUpdate(to, from, next) {
    if (this.isEdit && to.params.id !== this.memberId) {
      this.memberId = to.params.id;
      this.fetchMemberDetail(this.memberId);
    }
    next();
  },

  watch: {
    // Watch for changes to the memberId from the route params
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        // Fetch contingent data when route param changes
        if (this.isEdit && newId) {
          this.memberId = newId;
          this.fetchActivityDetail(newId); 
        }
      },
    }
  },

  methods: {
    async fetchAgeCategories() {
      try {
        const response = await axios.get("/age-categories");
        this.ageCategories = response.data;
      } catch (error) {
        console.error("Error fetching age-categories:", error);
      }
    },
    

    async fetchActiveTournaments() {
      await this.fetchData("/tournaments/active", "activeTournaments");
    },

    async fetchData(url, targetKey) {
      try {
        const response = await axios.get(url);
        this[targetKey] = response.data;
      } catch (error) {
        this.toast.error(`Failed to fetch ${targetKey}`);
      }
    },
    async fetchActivityDetail(id) {
      this.loading = true;
      try {
        const response = await axios.get(
          `/tournament-activities/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
        if (response.data) {
          const detail = response.data.data;
          this.form = {
            tournament_id : detail.tournament_id || "",
            name: detail.name || null,
            description: detail.description || "",
            start_date: detail.start_date || "",
            end_date: detail.end_date || "",
          };

          
        }
      } catch (error) {
        this.toast.error("Error fetching class details.");
        console.error("Error fetching class details:", error);
      } finally {
        this.loading = false;
      }
    },

    
    async submitForm() {
      this.loading = true;

      try {
        const endpoint = this.isEdit ? `/tournament-activities/${this.memberId}` : "/tournament-activities";
        const method = this.isEdit ? "put" : "post";

        await axios[method](
          endpoint,
          this.form,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add Authorization header
            },
          }
        );

        this.toast.success(this.isEdit ? "Activity updated successfully!" : "Activity added successfully!");
        this.$router.push("/admin/tournament-activity");
      } catch (error) {
        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors;
          this.toast.error("An error occurred while submitting the form.");
        } else {
          this.toast.error("An error occurred while submitting the form.");
        }
      } finally {
        this.loading = false;
      }
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
  position: relative; /* For positioning progress bar */
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 5px;
  background-color: #388E3C;
  animation: loader-animation 1.5s infinite;
}

.page-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
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
