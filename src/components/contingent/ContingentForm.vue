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
        {{ isEdit ? "Edit Contingent" : "Add Contingent" }}
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="admin-form mt-4">
        <div class="row mb-4">
          <div class="col-md-6">
            <div v-if="!isEdit" class="mb-3">
              <label for="tournament_id" class="form-label">Pilih Tournament</label>
              <select
                class="form-select"
                id="tournament_id"
                v-model="form.tournament_id"
                :class="{ 'is-invalid': errors.tournament_id }"
              >
                <option value="" disabled>Pilih Tournament</option>
                <option
                  v-for="tournament in allTournaments"
                  :key="tournament.id"
                  :value="tournament.id"
                >
                  {{ tournament.name }}
                </option>
              </select>
              <div class="invalid-feedback">{{ errors.tournament_id }}</div>
              <div class="form-text">
                Pilih Tournament yang akan diikuti. Anda bisa mengikuti lebih dari satu turnamen di kemudian hari melalui halaman dashboard.
              </div>
            </div>
            <div v-else class="mb-3">
              <label class="form-label">Tournament yang Diikuti</label>
              <div
                v-for="tournament in allTournaments"
                :key="tournament.id"
                class="form-check"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="'tournament-' + tournament.id"
                  :value="tournament.id"
                  v-model="form.tournament_ids"
                />
                <label class="form-check-label" :for="'tournament-' + tournament.id">
                  {{ tournament.name }}
                </label>
              </div>
              <div class="form-text">
                Jika terjadi kesalahan pemilihan tournament, Anda bisa uncheck di sini dan pilih turnamen lain.
              </div>
            </div>


          </div>
        </div>
        <div class="row">
          
          <!-- Contingent Name -->
          <div class="col-lg-6">
            <div class="mb-3">
              <label for="name" class="form-label">Nama Kontingen</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
                id="name"
                v-model="form.name"
              />
              <div class="invalid-feedback">{{ errors.name }}</div>
            </div>

            <div class="mb-3">
              <label for="pic_name" class="form-label">Nama Penanggung Jawab</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.pic_name }"
                id="pic_name"
                v-model="form.pic_name"
              />
              <div class="invalid-feedback">{{ errors.pic_name }}</div>
            </div>

            <div class="mb-3">
              <label for="pic_phone" class="form-label">Nomor Telpon Penanggung Jawab</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.pic_phone }"
                id="pic_phone"
                v-model="form.pic_phone"
              />
              <div class="invalid-feedback">{{ errors.pic_phone }}</div>
            </div>

            <div class="mb-3">
              <label for="pic_email" class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors.pic_email }"
                id="pic_email"
                v-model="form.pic_email"
              />
              <div class="invalid-feedback">{{ errors.pic_email }}</div>
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
          </div>
        </div>

        <!-- Submit Button -->
        <div class="row">
          <div class="col-lg-12 text-center">
            <button type="submit" class="button button-primary" :disabled="loading">
              <i class="bi bi-floppy"></i>
              <span>{{ isEdit ? "Update Contingent" : "Add Contingent" }}</span>
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
  name: "ContingentForm",
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
      contingentId: null,
      allTournaments: [],
      tournament_ids: [], // <- array untuk multi select
      countries: [],
      provinces: [],
      districts: [],
      sub_districts: [],
      wards: [],
      form: {
        tournament_id: '',       // untuk create
        tournament_ids: [],      // untuk edit
        name: "",
        pic_email: "",
        pic_name: "",
        pic_phone: "",
        country_id: null,
        province_id: null,
        district_id: null,
        subdistrict_id: null,
        ward_id: null,
        address: null,
      },
      errors: {},
      loading: false,
      progress: 0,
    };
  },

  created() {
    this.contingentId = this.$route.params.id;
    this.fetchActiveTournaments();
    this.fetchCountries();
    this.fetchProvinces();
    if (this.isEdit && this.contingentId) {
      this.fetchContingentDetail(this.contingentId);
    }
  },

  beforeRouteUpdate(to, from, next) {
    if (this.isEdit && to.params.id !== this.contingentId) {
      this.contingentId = to.params.id;
      this.fetchContingentDetail(this.contingentId);
    }
    next();
  },

  watch: {
    // Watch for changes to the contingentId from the route params
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        // Fetch contingent data when route param changes
        if (this.isEdit && newId) {
          this.contingentId = newId;
          this.fetchContingentDetail(newId); 
        }
      },
    }
  },

  methods: {

    async fetchActiveTournaments() {
      await this.fetchData("/tournaments/all", "allTournaments");
    },

    async fetchData(url, targetKey) {
      try {
        const response = await axios.get(url);
        this[targetKey] = response.data;
      } catch (error) {
        this.toast.error(`Failed to fetch ${targetKey}`);
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
    async fetchContingentDetail(id) {
      this.loading = true;
      try {
        const response = await axios.get(
          `/contingents/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );

        if (response.data && response.data.data) {
          const data = response.data.data;

          this.form = {
            name: data.name,
            pic_email: data.pic_email,
            pic_name: data.pic_name,
            pic_phone: data.pic_phone,
            country_id: data.country_id,
            province_id: data.province_id,
            district_id: data.district_id,
            subdistrict_id: data.subdistrict_id,
            ward_id: data.ward_id,
            address: data.address,
            tournament_ids: data.tournaments.map(t => t.id), // ✅ ini tambahan penting
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
        this.toast.error("Error fetching contingent details.");
      } finally {
        this.loading = false;
      }
    },

    
    async submitForm() {
      this.loading = true;

      try {
        const endpoint = this.isEdit ? `/contingents/${this.contingentId}` : "/contingents";
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

        this.toast.success(this.isEdit ? "Contingent updated successfully!" : "Contingent added successfully!");
        this.$router.push("/admin/contingent");
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
