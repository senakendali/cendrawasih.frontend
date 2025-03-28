<template>
  <div class="dashboard-container">
    <!-- Loader: Top Progress Bar -->
    <div v-if="loading" class="progress-bar" :style="{ width: progress + '%' }"></div>

    <div class="container">
      <!-- Form Title -->
      <div class="mb-2 page-title">
        <i class="bi bi-file-earmark-text"></i>
        {{ isEdit ? "Edit Payment" : "Add Payment" }}
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="admin-form mt-4">
        <div class="row">
          <!-- Tournament Name -->
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

            <!-- Bank Details -->
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

            <!-- Account Number -->
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
              <div class="invalid-feedback">{{ errors.account_number }}</div>
            </div>

            <!-- Account Name -->
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
            

            <!-- Notes -->
            <div class="mb-3">
              <label for="notes" class="form-label">Notes</label>
              <textarea
                class="form-control"
                :class="{ 'is-invalid': errors.notes }"
                id="notes"
                v-model="form.notes"
              ></textarea>
              <div class="invalid-feedback">{{ errors.notes }}</div>
            </div>
          </div>
        </div>
        <div v-if="isEdit" class="row mb-3">
          <div class="col-lg-12 d-flex justify-content-end">
            <button 
              type="button" 
              class="button button-primary" 
              :disabled="loading" 
              @click="togglePopup"
            >
              <i class="bi" :class="showPopup ? 'bi bi-x-square' : 'bi bi-plus-square'"></i>
              <span>{{ showPopup ? 'Close' : 'Add Another Member' }}</span>
            </button>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-lg-12">
            <div v-if="showPopup" class="popup-overlay">
              <table class="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Contingent</th>
                    <th>Name</th>
                    <th>Championship Category</th>
                    <th>Match Category</th>
                    <th>Registration Fee</th>
                    <th class="text-center">Select</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(member, index) in unselectedMembers" :key="member.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ member.contingent.name }}</td>
                    <td>{{ member.name }}</td>
                    <td>{{ member.championship_category.name }}</td>
                    <td>{{ member.match_category.name }}</td>
                    <td>{{ formatNumber(member.match_category.tournament_categories[0]?.registration_fee) }}</td>
                    <td v-if="isEdit" class="action-column text-center">
                      <button 
                        v-if="!member.exists_in_billing_details"
                        type="button" 
                        class="button button-primary" 
                        :disabled="loading || member.isAdding" 
                        @click="addMemberToBilling(member)"
                      >
                        <i class="bi" :class="member.isAdding ? 'bi bi-hourglass-split' : 'bi bi-plus-square'"></i>
                        <span>{{ member.isAdding ? 'Adding...' : 'Add' }}</span>
                      </button>
                      <span v-else class="text-success"><i class="bi bi-check-circle"></i> Added</span>
                    </td>

                    
                  </tr>
                  <tr v-if="members.length === 0">
                    <td colspan="5" class="text-center">No members found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>


        <!-- Members Table -->
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Contingent</th>
              <th>Name</th>
              <th>Championship Category</th>
              <th>Match Category</th>
              <th>Registration Fee</th>
              <th class="text-center">Select</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in members" :key="member.id">
              <td>{{ index + 1 }}</td>
              <td>{{ member.contingent.name }}</td>
              <td>{{ member.name }}</td>
              <td>{{ member.championship_category.name }}</td>
              <td>{{ member.match_category.name }}</td>
              <td>{{ formatNumber(member.match_category.tournament_categories[0]?.registration_fee) }}</td>
              <td v-if="isEdit" class="action-column text-center">
                <input v-if="member.exists_in_billing_details"
                  type="checkbox"
                  :id="'member-' + member.id"
                  v-model="selectedMembers"
                  :value="member.id"
                />

                

              </td>
              <td v-else class="action-column text-center">
                <input v-if="!member.exists_in_billing_details"
                  type="checkbox"
                  :id="'member-' + member.id"
                  v-model="selectedMembers"
                  :value="member.id"
                />

                

              </td>
            </tr>
            <tr v-if="members.length === 0">
              <td colspan="5" class="text-center">No members found.</td>
            </tr>
          </tbody>
        </table>

        <!-- Submit Button -->
        <div class="row">
          <div class="col-lg-12 text-center">
            <button type="submit" class="button button-primary" :disabled="loading">
              <i class="bi bi-floppy"></i>
              <span>{{ isEdit ? "Update Payment Data" : "Submit Payment Data" }}</span>
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
  name: "PaymentForm",
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
      tournaments: [],
      members: [],
      unselectedMembers: [],
      selectedMembers: [], // This will hold the selected members' IDs
      form: {
        tournament_id: null,
        bank_name: "",
        account_number: "",
        account_name: "",
        notes: "",
      },
      errors: {},
      loading: false,
      progress: 0,
      paymentId: null, // Define paymentId for update mode
      showPopup: false, // Control the pop-up visibility
    };
  },

  created() {
    this.paymentId = this.$route.params.id;
    this.fetchActiveTournaments();

    this.loadTeamMembers();
    if (this.isEdit && this.paymentId) {
      this.fetchPaymentDetail(this.paymentId);
    }
  },

  beforeRouteUpdate(to, from, next) {
    if (this.isEdit && to.params.id !== this.paymentId) {
      this.paymentId = to.params.id;
      this.fetchPaymentDetail(this.paymentId);
    }
    next();
  },

  watch: {
    // Watch for changes to the paymentId from the route params
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        // Fetch contingent data when route param changes
        if (this.isEdit && newId) {
          this.paymentId = newId;
          this.fetchPaymentDetail(newId); 
        }
      },
    }
  },

  methods: {
    togglePopup() {
      this.showPopup = !this.showPopup; // Toggle the pop-up visibility
    },
    formatNumber(value) {
      if (value == null) return "-"; // Return a fallback for empty or null values
      return new Intl.NumberFormat("en-US", { 
        style: "currency", 
        currency: "IDR", 
        minimumFractionDigits: 2 
      }).format(value);
    },

    
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
        this.unselectedMembers = response.data || [];
      } catch (error) {
        console.error("Error loading members:", error);
        this.members = []; // Fallback to an empty array on error
        this.unselectedMembers = [];
      } finally {
        this.loading = false;
      }
    },
    
    async fetchPaymentDetail(id) {
      this.loading = true;
      try {
        const response = await axios.get(
          `/billings/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );
        if (response.data) {
          this.form = {
            tournament_id: response.data.tournament_id || null,
            bank_name: response.data.bank_name || "",
            account_number: response.data.account_number || "",
            account_name: response.data.account_name || "",
            members: response.data.billing_details || [],
            total_amount: response.data.total_amount || 0,
            notes: response.data.notes || "",
          };

          // Update members and pre-select checkboxes based on `exists_in_billing_details`
          this.members = response.data.billing_details || [];
          this.selectedMembers = this.members
            .filter(member => member.exists_in_billing_details)
            .map(member => member.id);

          console.log("Selected members:", this.selectedMembers);

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
        this.toast.error("Error fetching payment details.");
        console.error("Error fetching payment details:", error);
      } finally {
        this.loading = false;
      }
    },

    async addMemberToBilling(member) {
      if (!this.paymentId) {
        this.toast.error("Payment ID is required before adding members.");
        return;
      }

      member.isAdding = true; // Indikasi sedang diproses

      try {
        const response = await axios.post(
          `/billings/add-member`, // Sesuaikan dengan endpoint baru
          {
            billing_id: this.paymentId, // Kirim billing_id sesuai API
            team_member_id: member.id, // Kirim member_id sesuai API
            tournament_category_id: member.match_category.tournament_categories[0]?.id,
            amount: member.match_category.tournament_categories[0]?.registration_fee, // Kirim amount sesuai API
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.status === 201) { // Sesuaikan respons berhasil dengan kode status 201
          this.toast.success("Member successfully added to billing.");
          member.exists_in_billing_details = true; // Tandai anggota sudah ditambahkan
          this.selectedMembers.push(member.id);
          this.fetchPaymentDetail(this.paymentId);
        } else {
          this.toast.error(response.data.message || "Failed to add member.");
        }
      } catch (error) {
        console.error("Error adding member to billing:", error);
        this.toast.error(error.response?.data?.message || "An error occurred while adding the member.");
      } finally {
        member.isAdding = false; // Kembalikan tombol ke status semula
      }
    },

    
    async submitForm() {
      this.loading = true;
      try {
        const payload = {
          ...this.form,
          member_ids: this.selectedMembers, // Include selected members in the request
        };

        const method = this.isEdit ? "put" : "post";
        const endpoint = this.isEdit ? `/billings/${this.paymentId}` : "/billings";

        await axios[method](
          endpoint,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add Authorization header
            },
          }
        );


        this.toast.success(this.isEdit ? "Payment updated" : "Payment added");
        this.$router.push("/admin/payment"); // Redirect after successful submission
      } catch (error) {
        this.toast.error("Error submitting form");
        this.errors = error.response?.data.errors || {};
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
