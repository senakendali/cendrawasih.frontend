<template>
  <div class="dashboard-container">
    <!-- Loader: Top Progress Bar -->
    <div v-if="loading" class="progress-bar" :style="{ width: progress + '%' }"></div>

    <div class="container">
      <!-- Form Title -->
      <div class="mb-2 page-title">
        <i class="bi bi-file-earmark-text"></i>
        {{ isEdit ? "Edit Classification" : "Add Classification" }}
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
              <label for="match_category_id" class="form-label">Match Category</label>
              <select
                class="form-select"
                id="match_category_id"
                v-model="form.match_category_id"
                :class="{ 'is-invalid': errors.match_category_id }"
              >
                <option value="" disabled>Choose Match Category</option>
                <option 
                  v-for="category in matchCategories" 
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
              <label for="name" class="form-label">Classification Name</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="form.name"
                :class="{ 'is-invalid': errors.name }"
              />
              <div class="invalid-feedback">{{ errors.name }}</div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-12">
            <table class="table mt-2">
              <thead>
                <tr>
                  <th colspan="3" class="custom-border">Male</th>
                  
                </tr>
                <tr>
                  <th class="custom-border text-center">Class Name</th>
                  <th class="custom-border text-center">Weight Min</th>
                  <th class="custom-border text-center">Weight Max</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="maleClasses.length > 0">
                  <tr
                    v-for="maleClass in maleClasses"
                    :key="maleClass.id"
                  >
                    <td class="custom-border px-4 py-2">
                      <div class="form-check">

                        <input 
                            class="form-check-input"
                            type="checkbox" 
                            :id="'male-' + maleClass.id" 
                            v-model="maleClass.selected"
                            :value="maleClass.id"
                        />
                        <label class="form-check-label" :for="'male-' + maleClass.id">{{ maleClass.name }}</label>
                      </div>
                    </td>
                    <td class="custom-border px-4 py-2">{{ maleClass.weight_min }}</td>
                    <td class="custom-border px-4 py-2">{{ maleClass.weight_max }}</td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td colspan="3" class="text-center">No class found.</td>
                  </tr>
                </template>
              </tbody>
            </table>

            <table class="table mt-2">
              <thead>
                <tr>
                  <th colspan="3" class="custom-border">Female</th>
                </tr>
                <tr>
                  <th class="custom-border text-center">Class Name</th>
                  <th class="custom-border text-center">Weight Min</th>
                  <th class="custom-border text-center">Weight Max</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="femaleClasses.length > 0">
                  <tr
                    v-for="femaleClass in femaleClasses"
                    :key="femaleClass.id"
                  >
                    <td class="custom-border px-4 py-2">
                        <div class="form-check">
                          <input 
                                class="form-check-input"
                                type="checkbox" 
                                :id="'male-' + femaleClass.id" 
                                v-model="femaleClass.selected"
                                :value="femaleClass.id"
                            />
                            <label class="form-check-label" :for="'female-' + femaleClass.id"> {{ femaleClass.name }}</label>
                        </div>
                      </td>
                    <td class="custom-border px-4 py-2">{{ femaleClass.weight_min }}</td>
                    <td class="custom-border px-4 py-2">{{ femaleClass.weight_max }}</td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td colspan="3" class="text-center">No class found.</td>
                  </tr>
                </template>
              </tbody>
            </table>

          </div>
        </div>

        <div class="row">
          <div class="col-lg-12 text-center">
            <button type="submit" class="button button-primary" :disabled="loading">
              <i class="bi bi-floppy"></i>
              <span>{{ isEdit ? "Update Classification" : "Add Classification" }}</span>
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
  name: "ClassificationForm",
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    /*'form.match_category_id': 'updateClassificationName',
    'form.age_category_id': 'updateClassificationName',*/
  },

  computed: {
    maleClassesData() {
      return this.categoryClasses.filter((item) => item.gender === "male");
    },
    femaleClassesData() {
      return this.categoryClasses.filter((item) => item.gender === "female");
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
        name: "",
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
      if (!this.form.age_category_id) return;

      try {
        const { data } = await axios.get(
          `/category-classes/fetch-by-age-category/${this.form.age_category_id}`
        );

        // If there's no 'selected' in the response, add it here (set default to true)
        this.categoryClasses = data;
        
        // Initialize 'selected' property for maleClasses and femaleClasses
        this.maleClasses = data.male.map(item => ({
          ...item,
          selected: true // Set the default selection to true or false as per your logic
        }));
        
        this.femaleClasses = data.female.map(item => ({
          ...item,
          selected: true // Set the default selection to true or false as per your logic
        }));
      } catch (error) {
        this.toast.error("Failed to fetch category classes.");
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
        // Combine selected male and female classes into a single array and structure the data as expected by the API
        const selectedClasses = [
          ...this.maleClasses.filter(item => item.selected).map(item => ({ category_class_id: item.id })),
          ...this.femaleClasses.filter(item => item.selected).map(item => ({ category_class_id: item.id }))
        ];

        // Prepare the form data with the details array
        const formData = {
          ...this.form,
          details: selectedClasses,
        };

        // Submit the form data
        const method = this.isEdit ? "put" : "post";
        const endpoint = this.isEdit ? `/match-clasifications/${this.clasificationId}` : "/match-clasifications";

        await axios[method](endpoint, formData);
        
        this.toast.success(`Classification ${this.isEdit ? "updated" : "added"} successfully!`);
        this.$router.push("/admin/match-clasification");
      } catch (error) {
        this.errors = error.response?.data?.errors || {};
        this.toast.error("Failed to save classification.");
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
