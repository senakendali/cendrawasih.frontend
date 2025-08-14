<template>
  <div class="dashboard-container">
    <!-- Loader: Top Progress Bar -->
    <div v-if="loading" class="progress-bar" :style="{ width: progress + '%' }"></div>

    <div class="container">
      <!-- Form Title -->
      <div class="mb-2 page-title">
        <i class="bi bi-file-earmark-text"></i>
        {{ isEdit ? "Edit Match (Seni)" : "Generate Match (Seni)" }}
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
                @change="handleFilterChange"
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
                @change="handleFilterChange"
                :class="{ 'is-invalid': errors.match_category_id }"
              >
                <option value="" disabled>Choose Match Category</option>
                <option 
                  v-for="category in matchCategories.filter(c => [2, 3, 4, 5].includes(c.id))" 
                  :key="category.id" 
                  :value="category.id"
                >
                  {{ category.name }}
                </option>

              </select>
              <div class="invalid-feedback">{{ errors.match_category_id }}</div>
            </div>

            <div class="mb-3">
              <label for="mode" class="form-label">Mode Pertandingan</label>
              <select
                class="form-select"
                id="mode"
                v-model="form.mode"
                :class="{ 'is-invalid': errors.mode }"
              >
                <option value="" disabled>Pilih Mode</option>
                <option value="default">Pool</option>
                <option value="battle">Battle</option>
              </select>
              <div class="invalid-feedback">{{ errors.mode }}</div>
            </div>

            <div v-if="form.mode === 'battle'" class="mb-3">
              <label for="bracket_type" class="form-label">Tipe Bagan</label>
              <select
                class="form-select"
                id="bracket_type"
                v-model="form.bracket_type"
                :class="{ 'is-invalid': errors.bracket_type }"
              >
                <option value="" disabled>Choose Match Chart</option>
                <option value="2">Bagan 2</option>
                <option value="4">Bagan 4</option>
                <option value="6">Bagan 6</option>
                <option value="8">Bagan 8</option>
                <option value="16">Bagan 16</option>
                <option value="full_prestasi">Full Prestasi</option>
              </select>
              <div class="invalid-feedback">{{ errors.bracket_type }}</div>
            </div>



            <div class="mb-3">
              <label for="age_category_id" class="form-label">Age Category</label>
              <select
                class="form-select"
                id="age_category_id"
                v-model="form.age_category_id"
                @change="handleFilterChange"
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
              <label for="gender" class="form-label">Gender</label>
              <select
                class="form-select"
                id="gender"
                v-model="form.gender"
                :class="{ 'is-invalid': errors.gender }"
              >
                <option v-if="genderLoading" disabled>Loading gender data...</option>
                <option value="" disabled>Choose Gender</option>
                <option 
                  v-for="g in genderOptions" 
                  :key="g.value" 
                  :value="g.value"
                >
                  {{ g.label }} (Total Peserta: {{ g.count }})
                </option>
              </select>
              <div class="invalid-feedback">{{ errors.gender }}</div>
            </div>

            <div v-if="form.mode !== 'battle'" class="mb-3">
              <label for="pool_size" class="form-label">
                Number of Performances per Pool
              </label>
              

              <select
                class="form-select"
                id="pool_size"
                v-model="form.pool_size"
                :disabled="!form.gender || poolSizeOptions.length === 0"
                :class="{ 'is-invalid': errors.pool_size }"
              >
                <option value="" disabled>Choose pool size</option>
                <option 
                  v-for="size in poolSizeOptions" 
                  :key="size" 
                  :value="size"
                >
                  {{ size }} penampilan per pool
                </option>
              </select>
              <small class="form-text text-muted">
                One performance equals one participant (solo, pair, or team). Not the number of people.
              </small>
              <div class="invalid-feedback">{{ errors.pool_size }}</div>
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
        gender: "",
        name: "",
        match_chart:"",
        mode: "",          // <--- baru
        bracket_type: "",  // <--- baru
      },
      maleClasses: [], // Move the data here
      femaleClasses: [], // Move the data here
      activeTournaments: [],
      matchCategories: [],
      ageCategories: [],
      categoryClasses: [],
      poolSizeOptions: [],
      genderOptions: [
        { value: 'male', label: 'Putra', count: 0 },
        { value: 'female', label: 'Putri', count: 0 }
      ],

      errors: {},
      loading: false,
      genderLoading: false,
      progress: 0,
    };
  },

  watch: {
    'form.match_category_id'(newVal, oldVal) {
      if (oldVal && newVal !== oldVal) {
        this.toast.info("Please re-select age category and gender after changing match category.");
        this.handleFilterChange(); // tetap jalanin reset
      }
    },
    'form.gender'(val) {
      const selectedGender = this.genderOptions.find(g => g.value === val);
      const total = selectedGender?.count || 0;

      this.poolSizeOptions = this.getPoolSizeOptions(total);
      // Reset selected pool size kalau sebelumnya udah keisi
      this.form.pool_size = '';
    },
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
    async handleFilterChange() {
      // Reset field-field dependent
      this.form.gender = '';
      this.form.pool_size = '';
      this.poolSizeOptions = [];


      // Reset gender count dulu
      await this.fetchGenderParticipants();

      // Kalau user udah pilih gender, langsung hitung ulang pool size
      if (this.form.gender) {
        const selected = this.genderOptions.find(g => g.value === this.form.gender);
        const genderTotal = selected?.count || 0;
        this.poolSizeOptions = this.getPoolSizeOptions(genderTotal);
      }

      this.updateClassificationName();
    },
    getPoolSizeOptions(totalContingents) {
      const options = [];

      if (totalContingents < 1) return [];

      // ✅ Tambahkan pool size 1 jika hanya 1 peserta
      if (totalContingents === 1) {
        return [1];
      }

      for (let size = 2; size <= totalContingents; size++) {
        const remainder = totalContingents % size;
        const minRemainder = Math.floor(size / 2);

        if (remainder === 0 || remainder >= minRemainder) {
          options.push(size);
        }
      }

      return options;
    },

    async fetchGenderParticipants() {
      if (!this.form.tournament_id || !this.form.age_category_id || !this.form.match_category_id) {
        this.genderOptions = this.genderOptions.map(g => ({ ...g, count: 0 }));
        return 0;
      }

      try {
        const response = await axios.get('/seni/participant-counts', {
          params: {
            tournament_id: this.form.tournament_id,
            age_category_id: this.form.age_category_id,
            match_category_id: this.form.match_category_id,
          }
        });

        this.genderOptions = this.genderOptions.map(g => ({
          ...g,
          count: response.data[g.value] || 0
        }));

        const selected = this.genderOptions.find(g => g.value === this.form.category_class_id);
        return selected?.count || 0;
      } catch (error) {
        console.error('Failed to fetch gender participant counts:', error);
        return 0;
      }
    },
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
        const endpoint = this.isEdit ? `/seni/edit-match/${this.clasificationId}` : "/seni/generate-match";

        await axios[method](
          endpoint,
          this.form,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add Authorization header
            },
          }
        );
        
        this.toast.success(`Match ${this.isEdit ? "updated" : "added"} successfully!`);
        this.$router.push("/admin/seni");
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
