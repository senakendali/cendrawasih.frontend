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
        {{ isEdit ? "Edit Tournament" : "Add Tournament" }}
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="admin-form mt-4">
        <div class="row">
          <!-- Tournament Name -->
          <div class="col-lg-6">
            <div class="mb-3">
              <label for="name" class="form-label">Tournament Name</label>
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
              <label for="document" class="form-label">THB</label>
              <div class="input-group">
                <input class="form-control" type="file" id="document" @change="handleFileUpload($event, 'document')">
              </div>
              <div class="invalid-feedback">{{ errors.document }}</div>
              
            </div> 

            <div class="mb-3" v-if="isEdit">
              <a v-if="form.existingDocumentUrl" :href="form.existingDocumentUrl" target="_blank" rel="noopener" class="button button-primary">
                <i class="bi bi-file-earmark-post-fill"></i> View File
              </a>

            </div>

            <div class="mb-3">
              <label for="image" class="form-label">Banner</label>
              <div class="input-group">
                <input class="form-control" type="file" id="image" @change="handleFileUpload($event, 'image')">
              </div>
              <div class="invalid-feedback">{{ errors.image }}</div>
              
            </div> 

            <div class="mb-3" v-if="isEdit">
              <a v-if="form.existingDocumentUrl" :href="form.existingImageUrl" target="_blank" rel="noopener" class="button button-primary">
                <i class="bi bi-file-earmark-post-fill"></i> View File
              </a>

            </div>

            <div class="mb-3">
              <label for="technical_meeting_date" class="form-label">Technical Meeting Date</label>
              <input
                type="date"
                class="form-control"
                :class="{ 'is-invalid': errors.technical_meeting_date }"
                id="technical_meeting_date"
                v-model="form.technical_meeting_date"
              />
              <div class="invalid-feedback">{{ errors.technical_meeting_date }}</div>
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

            
          </div>
          <!-- Person Responsible -->
          <div class="col-lg-6">
            <div class="mb-3">
              <label for="status" class="form-label">Status</label>

              <select
                class="form-select"
                id="status"
                name="status"
                v-model="form.status"
                :class="{ 'is-invalid': errors.status  }"
              > 
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                
              </select>
              <div class="invalid-feedback">{{ errors.status }}</div>
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
              <label for="location" class="form-label">Location</label>
              <textarea
                class="form-control"
                :class="{ 'is-invalid': errors.location }"
                id="location"
                v-model="form.location"
              ></textarea>
              <div class="invalid-feedback">{{ errors.location }}</div>
            </div>

            
          </div>
        </div>

        <!-- Submit Button -->
        <div class="row">
          <div class="col-lg-12 text-center">
            <button type="submit" class="button button-primary" :disabled="loading">
              <i class="bi bi-floppy"></i>
              <span>{{ isEdit ? "Update Tournament" : "Add Tournament" }}</span>
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
  name: "TournamentForm",
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
      TournamentId: null,
      form: {
        name: "",
        tournament_document: null,
        tournament_image: null,
        existingDocumentUrl : null,
        existingImageUrl : null,
        technical_meeting_date: "",
        start_date: "",
        end_date: "",
        status: "",
        description: "",
        location: "",
      },
      errors: {},
      loading: false,
      progress: 0,
    };
  },

  created() {
    this.TournamentId = this.$route.params.id;
    
    if (this.isEdit && this.TournamentId) {
      this.fetchTournamentDetail(this.TournamentId);
    }
  },

  beforeRouteUpdate(to, from, next) {
    if (this.isEdit && to.params.id !== this.TournamentId) {
      this.TournamentId = to.params.id;
      this.fetchTournamentDetail(this.TournamentId);
    }
    next();
  },

  watch: {
    // Watch for changes to the TournamentId from the route params
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        // Fetch Tournament data when route param changes
        if (this.isEdit && newId) {
          this.TournamentId = newId;
          this.fetchTournamentDetail(newId); 
        }
      },
    }
  },

  methods: {

    handleFileUpload(event) {
      const field = event.target.id; // 'document' atau 'image'
      const file = event.target.files[0];

      if (!file) return;

      if (field === 'document') {
        this.form.tournament_document = file;
      } else if (field === 'image') {
        this.form.tournament_image = file;
      }
    },

    
    async fetchTournamentDetail(id) {
      this.loading = true;
      try {
        const response = await axios.get(
          `/tournament-settings/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
        if (response.data) {
          this.form = {
            name: response.data.name,
            existingDocumentUrl: response.data.document,
            existingImageUrl: response.data.image,
            technical_meeting_date: response.data.technical_meeting_date,
            start_date: response.data.start_date,
            end_date: response.data.end_date,
            status: response.data.status,
            description: response.data.description,
            location: response.data.location,
           
          };
        }
      } catch (error) {
        this.toast.error("Error fetching Tournament details.");
      } finally {
        this.loading = false;
      }
    },

    
    async submitForm() {
      this.loading = true;

      let formData = new FormData();

      // Loop semua isi form dan append ke FormData
      for (const key in this.form) {
        if (this.form[key] !== null && this.form[key] !== "") {
          formData.append(key, this.form[key]);
        }
      }

      if (this.form.tournament_document instanceof File) {
        formData.append("tournament_document", this.form.tournament_document);
      }

      if (this.form.tournament_image instanceof File) {
        formData.append("tournament_image", this.form.tournament_image);
      }

      if (!this.isEdit) {
        if (!this.form.tournament_document && !this.form.tournament_image) {
          console.error("No file selected!");
          this.toast.error("Please upload a valid tournament document or image.");
          this.loading = false;
          return;
        }
      }



      try {
        const endpoint = this.isEdit ? `/tournament-settings/update/${this.TournamentId}` : "/tournament-settings";
        const method = this.isEdit ? "post" : "post";

        await axios[method](
          endpoint,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add Authorization header
            },
          }
        );

        this.toast.success(this.isEdit ? "Tournament updated successfully!" : "Tournament added successfully!");
        this.$router.push("/admin/tournament");
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
