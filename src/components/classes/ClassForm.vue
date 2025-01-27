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
        {{ isEdit ? "Edit Class" : "Add Class" }}
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="admin-form mt-4">
        <div class="row">
          <div class="col-lg-12">
            <div class="mb-3">
              <label for="name" class="form-label">Class Name</label>
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
        <div class="row">
          <!-- Contingent Name -->
          <div class="col-lg-6">
            <div class="mb-3">
              <label for="gender" class="form-label">Gender</label>
              <select
                class="form-select"
                :class="{ 'is-invalid': errors.type }"
                id="gender"
                v-model="form.gender"
              >
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
              <div class="invalid-feedback">{{ errors.gender }}</div>
            </div>
            <div class="mb-3">
              <label for="weight_min" class="form-label">Weight Minimum</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.weight_min }"
                id="weight_min"
                v-model="form.weight_min"
              />
              <div class="invalid-feedback">{{ errors.weight_min }}</div>
            </div>
          </div>

          <!-- Person Responsible -->
          <div class="col-lg-6">
            <div class="mb-3">
              <label for="age_category_id " class="form-label">Age Categories</label>
              <select
                class="form-select"
                id="age_category_id "
                name="age_category_id "
                v-model="form.age_category_id"
                :class="{ 'is-invalid': errors.age_category_id  }"
              >
                <option value="" disabled>Choose Age Category</option>
                <option v-for="ageCategory in ageCategories" :key="ageCategory.id" :value="ageCategory.id">
                 {{ ageCategory.name }}
                </option>
              </select>
              <div class="invalid-feedback">{{ errors.age_category_id  }}</div>
            </div>

            <div class="mb-3">
              <label for="weight_max" class="form-label">Weight Maximum</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.weight_max }"
                id="weight_max"
                v-model="form.weight_max"
              />
              <div class="invalid-feedback">{{ errors.weight_max }}</div>
            </div>
            
          </div>
        </div>

        <!-- Submit Button -->
        <div class="row">
          <div class="col-lg-12 text-center">
            <button type="submit" class="button button-primary" :disabled="loading">
              <i class="bi bi-floppy"></i>
              <span>{{ isEdit ? "Update Class" : "Add Class" }}</span>
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
  name: "ClassForm",
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
      classId: null,
      ageCategories: [],
      form: {
        name: "",
        gender: "",
        weight_min: "",
        weight_max: "",
        ageCategory: null,
      },
      errors: {},
      loading: false,
      progress: 0,
    };
  },

  created() {
    this.classId = this.$route.params.id;
    this.fetchAgeCategories();
    if (this.isEdit && this.classId) {
      this.fetchClassDetail(this.classId);
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
          this.fetchClassDetail(newId); 
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
    
    async fetchClassDetail(id) {
      this.loading = true;
      try {
        const response = await axios.get(
          `/category-classes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
        if (response.data) {
          const detail = response.data.data;
          this.form = {
            name: detail.name || "",
            age_category_id: detail.age_category_id || null,
            gender: detail.gender || "",
            weight_min: detail.weight_min || "",
            weight_max: detail.weight_max || "",
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
      

     

     

      // Log FormData for debugging
      /*for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }*/

      try {
        const endpoint = this.isEdit ? `/category-classes/${this.memberId}` : "/category-classes";
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

        this.toast.success(this.isEdit ? "Class updated successfully!" : "Class added successfully!");
        this.$router.push("/admin/classes");
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
