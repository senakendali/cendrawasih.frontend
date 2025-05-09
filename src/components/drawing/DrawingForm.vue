<template>
  <div class="dashboard-container">
    <!-- Loader: Top Progress Bar -->
    <div v-if="loading" class="progress-bar" :style="{ width: progress + '%' }"></div>

    <div class="container">
      <!-- Form Title -->
      <div class="mb-2 page-title">
        <i class="bi bi-file-earmark-text"></i>
        {{ isEdit ? "Edit Match" : "Generate Match" }}
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
                @change="fetchCategoryClasses"
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
              <label for="match_category_id" class="form-label">Match Category</label>
              <select
                class="form-select"
                id="match_category_id"
                v-model="form.match_category_id"
                @change="fetchCategoryClasses"
                :class="{ 'is-invalid': errors.match_category_id }"
              >
                <option value="" disabled>Choose Match Category</option>
                <option 
                  v-for="category in matchCategories.filter(c => [1].includes(c.id))" 
                  :key="category.id" 
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
                
              </select>
              <div class="invalid-feedback">{{ errors.match_category_id }}</div>
            </div>

            <div class="mb-3">
              <label for="age_category_id" class="form-label">Age Category</label>
              <select
                class="form-select"
                id="age_category_id"
                v-model="form.age_category_id"
                @change="fetchCategoryClasses"
                :class="{ 'is-invalid': errors.age_category_id }"
              >
                <option value="" disabled>Choose Age Category</option>
                <option 
                  v-for="ageCategory in ageCategories" 
                  :key="ageCategory.id" 
                  :value="ageCategory.id"
                >
                  {{ ageCategory.name }}
                </option>
              </select>
              <div class="invalid-feedback">{{ errors.age_category_id }}</div>
            </div>

            <div class="mb-3">
              <label for="category_class_id" class="form-label">Class</label>
              <select
                class="form-select"
                id="category_class_id"
                v-model="form.category_class_id"
                :class="{ 'is-invalid': errors.category_class_id }"
              >
                <option value="" disabled>Choose Class</option>
                <option 
                  v-for="categoryClass in categoryClasses" 
                  :key="categoryClass.class_id" 
                  :value="categoryClass.class_id"
                >
                  {{ categoryClass.gender }} Class {{ categoryClass.class_name }},  ( {{  categoryClass.weight_min }} KG - {{  categoryClass.weight_max }} KG ). Total Participant: {{ categoryClass.team_member_count }}
                </option>
              </select>
              <div class="invalid-feedback">{{ errors.category_class_id }}</div>
            </div>

            <div class="mb-3">
              <label for="match_chart" class="form-label">Match Chart</label>

              <select
                class="form-select"
                id="match_chart"
                name="match_chart"
                v-model="form.match_chart"
                :class="{ 'is-invalid': errors.match_chart  }"
              > 
                <option value="" disabled>Choose Match Chart</option>
                <option value="2">Bagan 2</option>
                <option value="4">Bagan 4</option>
                <option value="6">Bagan 6</option>
                <option value="8">Bagan 8</option>
                <option value="16">Bagan 16</option>
                <option value="full_prestasi">Full Prestasi</option>
                
              </select>
              <div class="invalid-feedback">{{ errors.match_chart }}</div>
            </div>

           
          </div>
        </div>

        

        <div class="row">
          <div class="col-lg-12 text-center">
            <button type="submit" class="button button-primary" :disabled="loading">
              <i class="bi bi-floppy"></i>
              <span>{{ isEdit ? "Update Match" : "Generate Match" }}</span>
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
  name: "DrawingForm",
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
      clasificationId: null,
      form: {
        tournament_id: "",
        match_category_id: "",
        age_category_id: "",
        category_class_id: "",
        name: "",
        match_chart:"",
      },
      maleClasses: [], // Move the data here
      femaleClasses: [], // Move the data here
      activeTournaments: [],
      matchCategories: [],
      ageCategories: [],
      categoryClasses: [],
      errors: {},
      loading: false,
      progress: 0,
    };
  },
  
  created() {
    this.clasificationId = this.$route.params.id;
    this.fetchActiveTournaments();
    this.fetchMatchCategories();
    this.fetchAgeCategories();
    this.fetchCategoryClasses();
    if (this.isEdit && this.clasificationId) {
      this.fetchClasificationDetail(this.clasificationId);
    }
  },

  methods: {
    updateClassificationName() {
      const matchCategory = this.matchCategories.find(
        (category) => category.id === this.form.match_category_id
      );
      const ageCategory = this.ageCategories.find(
        (category) => category.id === this.form.age_category_id
      );

      const matchCategoryName = matchCategory ? matchCategory.name : '';
      const ageCategoryName = ageCategory ? ageCategory.name : '';

      this.form.name = [matchCategoryName, ageCategoryName]
        .filter((name) => name) // Remove empty values
        .join(' - '); // Join with a separator
    },

    async fetchActiveTournaments() {
      await this.fetchData("/tournaments/active", "activeTournaments");
    },
    async fetchMatchCategories() {
      await this.fetchData("/match-categories", "matchCategories");
    },
    async fetchAgeCategories() {
      await this.fetchData("/age-categories", "ageCategories");
    },

    async fetchCategoryClasses() {
      // Reset jika belum lengkap datanya
      if (!this.form.age_category_id || !this.form.tournament_id || !this.form.match_category_id) {
        this.categoryClasses = [];
        return;
      }

      try {
        const response = await axios.get(`/fetch-available-class`, {
          params: {
            age_category_id: this.form.age_category_id,
            tournament_id: this.form.tournament_id,
            match_category_id: this.form.match_category_id // ✅ ini yang sebelumnya belum dikirim
          }
        });

        this.categoryClasses = response.data;
      } catch (error) {
        console.error("Error fetching category classes:", error);
      }
    },
   

    async fetchData(url, targetKey) {
      try {
        const response = await axios.get(url);
        this[targetKey] = response.data;
      } catch (error) {
        this.toast.error(`Failed to fetch ${targetKey}`);
      }
    },

    async fetchClasificationDetail(id) {
      this.loading = true;
      try {
          const response = await axios.get(`/match-clasifications/${id}`, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('authToken')}`,
              },
          });

          if (response.data) {
              const data = response.data;

              // Populate form with fetched data
              this.form = {
                  tournament_id: data.tournament_id || null,
                  match_category_id: data.match_category_id || null,
                  age_category_id: data.age_category_id || null,
                  name: data.name || "",
              };

              // Ensure details have male and female categories, defaulting to empty arrays
              const maleDetails = data.details.male || [];
              const femaleDetails = data.details.female || [];

              // Loop through all male categories and update based on the 'isSelected' field
              this.maleClasses = maleDetails.map(item => ({
                  ...item,
                  selected: item.isSelected || false,  // Set checkbox as checked/unchecked based on 'isSelected'
              }));

              // Loop through all female categories and update based on the 'isSelected' field
              this.femaleClasses = femaleDetails.map(item => ({
                  ...item,
                  selected: item.isSelected || false,  // Set checkbox as checked/unchecked based on 'isSelected'
              }));

              console.log('Male Classes:', this.maleClasses);
              console.log('Female Classes:', this.femaleClasses);
          }
      } catch (error) {
          this.toast.error("Error fetching classification details.");
          console.error("Error:", error);
      } finally {
          this.loading = false;
      }
  },

    async submitForm() {
      this.loading = true;
      try {
       

        // Submit the form data
        const method = this.isEdit ? "put" : "post";
        const endpoint = this.isEdit ? `/drawings/${this.clasificationId}` : "/create-pools";

        await axios[method](
          endpoint,
          this.form,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add Authorization header
            },
          }
        );
        
        this.toast.success(`Match chart ${this.isEdit ? "updated" : "added"} successfully!`);
        this.$router.push("/admin/tanding");
      } catch (error) {
        this.errors = error.response?.data?.errors || {};
        this.toast.error("Failed to save Match chart.");
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
.invalid-feedback {
  color: #dc3545;
}
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
