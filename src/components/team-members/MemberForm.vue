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
        {{ isEdit ? "Edit Member" : "Add Member" }}
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="admin-form mt-4">
        <div class="row">
          <!-- Contingent Name -->
          <div class="col-lg-6">
            <div class="mb-3">
              <label for="contingent_id" class="form-label">Kontingen</label>
              <select
                class="form-select"
                id="contingent_id"
                name="contingent_id"
                v-model="form.contingent_id"
                :class="{ 'is-invalid': errors.contingent_id }"
              >
                <option value="" disabled>Pilih Kontingen</option>
                <option v-for="contingent in contingents" :key="contingent.id" :value="contingent.id">
                  {{ contingent.name }}
                </option>
              </select>
              <div class="invalid-feedback">{{ errors.contingent_id }}</div>
            </div>
            <div class="mb-3">
              <label for="name" class="form-label">Nama</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
                id="name"
                name="name"
                v-model="form.name"
              />
              <div class="invalid-feedback">{{ errors.name }}</div>
            </div>

            <div class="mb-3">
              <label for="birth_place" class="form-label">Birth Place</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.birth_place }"
                id="birth_place"
                v-model="form.birth_place"
              />
              <div class="invalid-feedback">{{ errors.birth_place }}</div>
            </div>

            <div class="mb-3">
              <label for="birth_date" class="form-label">Birth Date</label>
              <input
                type="date"
                class="form-control"
                :class="{ 'is-invalid': errors.birth_date }"
                id="birth_date"
                v-model="form.birth_date"
              />
              <div class="invalid-feedback">{{ errors.birth_date }}</div>
            </div>

            <div class="mb-3">
              <label for="gender" class="form-label">Gender</label>
              <select
                class="form-select"
                :class="{ 'is-invalid': errors.type }"
                id="gender"
                v-model="form.gender"
              >
                <option value="M">Laki-laki</option>
                <option value="F">Perempuan</option>
              </select>
              <div class="invalid-feedback">{{ errors.gender }}</div>
            </div>
            <div class="mb-3">
              <label for="body_weight" class="form-label">Body Weight</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.body_weight }"
                id="body_weight"
                v-model="form.body_weight"
              />
              <div class="invalid-feedback">{{ errors.body_weight }}</div>
            </div>
            <div class="mb-3">
              <label for="body_height" class="form-label">Body Height</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.body_height }"
                id="body_height"
                v-model="form.body_height"
              />
              <div class="invalid-feedback">{{ errors.body_height }}</div>
            </div>
            <div class="mb-3">
              <label for="nik" class="form-label">ID Card Number (Nomor KTP)</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.nik }"
                id="nik"
                v-model="form.nik"
              />
              <div class="invalid-feedback">{{ errors.nik }}</div>
            </div>
            <div class="mb-3">
              <label for="family_card_number" class="form-label">Family Card Number (Nomor KK)</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.family_card_number }"
                id="family_card_number"
                v-model="form.family_card_number"
              />
              <div class="invalid-feedback">{{ errors.family_card_number }}</div>
            </div>
            

           
          </div>

          <!-- Person Responsible -->
          <div class="col-lg-6">
            <div class="mb-3">
              <label for="country_id" class="form-label">Country</label>
              <select
                class="form-select"
                id="country_id"
                name="country_id"
                v-model="form.country_id"
                @change="fetchDistricts"
                :class="{ 'is-invalid': errors.country_id }"
              >
                <option value="" disabled>Choose Country</option>
                <option v-for="country in countries" :key="country.id" :value="country.id">
                  <img src="{{ country.flag }}" alt="">{{ country.country_name }}
                </option>
              </select>
              <div class="invalid-feedback">{{ errors.country_id }}</div>
            </div>
            <div class="mb-3">
              <label for="province_id" class="form-label">Provinsi</label>
              <select
                class="form-select"
                id="province_id"
                name="province_id"
                v-model="form.province_id"
                @change="fetchDistricts"
                :class="{ 'is-invalid': errors.province_id }"
              >
                <option value="" disabled>Pilih Provinsi</option>
                <option v-for="province in provinces" :key="province.id" :value="province.id">
                  {{ province.name }}
                </option>
              </select>
              <div class="invalid-feedback">{{ errors.province_id }}</div>
            </div>

            <div class="mb-3">
              <label for="district_id" class="form-label">Kabupaten/Kota</label>
              <select
                class="form-select"
                id="district_id"
                name="district_id"
                v-model="form.district_id"
                @change="fetchSubDistricts"
                :class="{ 'is-invalid': errors.district_id }"
              >
                <option value="" disabled>Pilih Kabupaten/Kota</option>
                <option v-for="district in districts" :key="district.id" :value="district.id">
                  {{ district.name }}
                </option>
              </select>
              <div class="invalid-feedback">{{ errors.district_id }}</div>
            </div>

            <div class="mb-3">
              <label for="subdistrict_id" class="form-label">Kecamatan</label>
              <select
                class="form-select"
                id="subdistrict_id"
                name="subdistrict_id"
                v-model="form.subdistrict_id"
                @change="fetchWards"
                :class="{ 'is-invalid': errors.subdistrict_id }"
              >
                <option value="" disabled>Pilih Kecamatan</option>
                <option v-for="sub_district in sub_districts" :key="sub_district.id" :value="sub_district.id">
                  {{ sub_district.name }}
                </option>
              </select>
              <div class="invalid-feedback">{{ errors.subdistrict_id }}</div>
            </div>

            <div class="mb-3">
              <label for="ward_id" class="form-label">Kelurahan</label>
              <select
                class="form-select"
                id="ward_id"
                name="ward_id"
                v-model="form.ward_id"
                :class="{ 'is-invalid': errors.ward_id }"
              >
                <option value="" disabled>Pilih Kelurahan</option>
                <option v-for="ward in wards" :key="ward.id" :value="ward.id">
                  {{ ward.name }}
                </option>
              </select>
              <div class="invalid-feedback">{{ errors.ward_id }}</div>
            </div>

            <div class="mb-3">
              <label for="address" class="form-label">Alamat</label>
              <textarea
                class="form-control"
                :class="{ 'is-invalid': errors.address }"
                id="address"
                v-model="form.address"
              ></textarea>
              <div class="invalid-feedback">{{ errors.address }}</div>
            </div>

            <div class="mb-3">
              <label for="category" class="form-label">Kategori</label>
              <select
                class="form-select"
                :class="{ 'is-invalid': errors.type }"
                id="category"
                v-model="form.category"
              >
                <option value="Tanding">Tanding</option>
                <option value="Seni">Seni</option>
              </select>
              <div class="invalid-feedback">{{ errors.category }}</div>
            </div>

            <div class="mb-3">
              <label for="documents" class="form-label">Document Link (Google Drive)</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.documents }"
                id="documents"
                v-model="form.documents"
              />
              <div class="invalid-feedback">{{ errors.documents }}</div>
            </div>
            
          </div>
        </div>

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
      memberId: null,
      contingents: [],
      countries: [],
      provinces: [],
      districts: [],
      sub_districts: [],
      wards: [],
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
    this.memberId = this.$route.params.id;
    this.fetchCountries();
    this.fetchProvinces();
    this.fetchContingents();
    if (this.isEdit && this.memberId) {
      this.fetchMemberDetail(this.memberId);
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
