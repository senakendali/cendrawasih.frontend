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
        {{ isEdit ? "Edit Payment" : "Add Payment" }}
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="admin-form mt-4">
        <div class="row">
          <!-- Contingent Name -->
          <div class="col-lg-6">
            <div class="mb-3">
              <label for="tournament_id" class="form-label">Tournament</label>
              <select
                class="form-select"
                id="tournament_id"
                name="tournament_id"
                v-model="form.tournament_id"
                :class="{ 'is-invalid': errors.tournament_id }"
              >
                <option value="" disabled>Choose Tournament</option>
                <option v-for="tournament in tournaments" :key="tournament.id" :value="tournament.id">
                  {{ tournament.name }}
                </option>
              </select>
              <div class="invalid-feedback">{{ errors.tournament_id }}</div>
            </div>
            <div class="mb-3">
              <label for="bank_name" class="form-label">Bank Name</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.bank_name }"
                id="bank_name"
                name="bank_name"
                v-model="form.bank_name"
              />
              <div class="invalid-feedback">{{ errors.bank_name }}</div>
            </div>
            <div class="mb-3">
              <label for="account_number" class="form-label">Account Number</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.account_number }"
                id="account_number"
                name="account_number"
                v-model="form.account_number"
              />
              <div class="invalid-feedback">{{ errors.name }}</div>
            </div>
            <div class="mb-3">
              <label for="account_name" class="form-label">Account Name</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.account_name }"
                id="account_name"
                name="account_name"
                v-model="form.account_name"
              />
              <div class="invalid-feedback">{{ errors.account_name }}</div>
            </div>
            <div class="mb-3">
              <label for="notes" class="form-label">Notes</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.notes }"
                id="notes"
                name="notes"
                v-model="form.notes"
              />
              <div class="invalid-feedback">{{ errors.notes }}</div>
            </div>
          </div>

         
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <!-- Wrapper element with v-if -->
          <!-- Template Part: Handle Undefined Members Safely -->
          <tbody v-if="members?.length > 0">
            <tr v-for="(member, index) in members" :key="member.id">
              <td>{{ index + 1  }}</td>
              <td>{{ member.name }}</td>
              <td>{{ member.championship_category.name }}</td>
              <td class="action-column">
                
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="4" class="text-center">No members found.</td>
            </tr>
          </tbody>



        </table>
        

        <!-- Submit Button -->
        <div class="row">
          <div class="col-lg-12 text-center">
            <button type="submit" class="button button-primary" :disabled="loading">
              <i class="bi bi-floppy"></i>
              <span>{{ isEdit ? "Update Member" : "Add Member" }}</span>
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
  name: "MemberForm",
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
      paymentId: null,
      tournaments: [],
      members:[],
      form: {
        contingent_id: null,
        name: "",
        birth_place: "",
        birth_date: "",
        gender: "",
        body_weight: "",
        body_height: "",
        blood_type: "",
        nik: "",
        family_card_number: "",
        country_id: null,
        province_id: null,
        district_id: null,
        subdistrict_id: null,
        ward_id: null,
        address: "",
        category: "",
        documents: "",
      },
      errors: {},
      loading: false,
      progress: 0,
    };
  },

  created() {
    this.paymentId = this.$route.params.id;
    this.fetchActiveTournaments();
    this.loadTeamMembers();
    if (this.isEdit && this.paymentId) {
      //this.fetchMemberDetail(this.paymentId);
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
          this.fetchMemberDetail(newId); 
        }
      },
    }
  },

  methods: {
    async fetchActiveTournaments() {
      try {
        const response = await axios.get("/tournaments/active");
        this.tournaments = response.data;
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      }
    },
    async loadTeamMembers() {
      this.loading = true;
      try {
        const response = await axios.get("/team-members?fetch_all=true", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        this.members = response.data || []; // Ensure it assigns an array even if data is empty
      } catch (error) {
        console.error("Error loading members:", error);
        this.members = []; // Fallback to an empty array on error
      } finally {
        this.loading = false;
      }
    },
    async fetchAgeCategories() {
      try {
        const response = await axios.get("/age-categories");
        this.ageCategories = response.data;
      } catch (error) {
        console.error("Error fetching age-categories:", error);
      }
    },
    async fetchContingents() {
      try {
        // Fetch contingents
        const response = await axios.get(
          `/contingents/fetch-all`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
        this.contingents = response.data;
      } catch (error) {
        console.error("Error fetching contingents:", error);
      }
    },

    async fetchCountries() {
      try {
        const response = await axios.get("/countries");
        this.countries = response.data;
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    },
    async fetchProvinces() {
      try {
        const response = await axios.get("/provinces");
        this.provinces = response.data;
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    },
    async fetchDistricts() {
      if (!this.form.province_id) {
        this.districts = [];
        this.form.district_id = null;
        this.form.subdistrict_id = null;
        this.form.ward_id = null;
        this.sub_districts = [];
        this.wards = [];
        return;
      }
      try {
        const response = await axios.get(`/districts?province_id=${this.form.province_id}`);
        this.districts = response.data;
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    },
    async fetchSubDistricts() {
      if (!this.form.district_id) {
        this.sub_districts = [];
        this.form.subdistrict_id = null;
        this.form.ward_id = null;
        this.wards = [];
        return;
      }
      try {
        const response = await axios.get(`/subdistricts?district_id=${this.form.district_id}`);
        this.sub_districts = response.data;
      } catch (error) {
        console.error("Error fetching sub-districts:", error);
      }
    },
    async fetchWards() {
      if (!this.form.subdistrict_id) {
        this.wards = [];
        this.form.ward_id = null;
        return;
      }
      try {
        const response = await axios.get(`/wards?subdistrict_id=${this.form.subdistrict_id}`);
        this.wards = response.data;
      } catch (error) {
        console.error("Error fetching wards:", error);
      }
    },
    async fetchMemberDetail(id) {
      this.loading = true;
      try {
        const response = await axios.get(
          `/team-members/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
        if (response.data) {
          this.form = {
            name: response.data.name || "",
            contingent_id: response.data.contingent_id || null,
            birth_place: response.data.birth_place || "",
            birth_date: response.data.birth_date || "",
            gender: response.data.gender || "",
            body_weight: response.data.body_weight || "",
            body_height: response.data.body_height || "",
            blood_type: response.data.blood_type || "",
            nik: response.data.nik || "",
            family_card_number: response.data.family_card_number || "",
            country_id: response.data.country_id || null,
            province_id: response.data.province_id || null,
            district_id: response.data.district_id || null,
            subdistrict_id: response.data.subdistrict_id || null,
            ward_id: response.data.ward_id || null,
            address: response.data.address || "",
            category: response.data.category || "",
            age_category_id: response.data.age_category_id || null,
            documents: response.data.documents || "",
          };

          if (this.form.province_id) {
            await this.fetchDistricts();
          }
          if (this.form.district_id) {
            await this.fetchSubDistricts();
          }
          if (this.form.subdistrict_id) {
            await this.fetchWards();
          }
        }
      } catch (error) {
        this.toast.error("Error fetching member details.");
        console.error("Error fetching member details:", error);
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
        const endpoint = this.isEdit ? `/team-members/${this.memberId}` : "/team-members";
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

        this.toast.success(this.isEdit ? "Team member updated successfully!" : "Team member added successfully!");
        this.$router.push("/admin/team-members");
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
