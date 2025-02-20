<template>
  <div class="dashboard-container">
    <!-- Loader: Top Progress Bar -->
    <div v-if="loading" class="progress-bar" :style="{ width: progress + '%' }"></div>

    <div class="container">
      <!-- Form Title -->
      <div class="mb-2 page-title">
        <i class="bi bi-file-earmark-text"></i>
        Confirm Payment
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
          <div class="col-lg-6">
            <div class="mb-3">
              <label for="invoice_number" class="form-label">Invoice Number</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.invoice_number }"
                id="invoice_number"
                name="invoice_number"
                v-model="form.invoice_number"
              />
              
            </div>
            <div class="mb-3">
              <label for="amount" class="form-label">Amount</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.amount }"
                id="amount"
                name="amount"
                v-model="form.amount"
              />
              
            </div>
            

            <div class="mb-3">
              <label for="payment_document" class="form-label">Payment Struk (Google Drive)</label>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.payment_document }"
                  id="payment_document"
                  name="payment_document"
                  v-model="form.payment_document"
                /><a :href="form.payment_document" v-if="isConfirm" class="btn btn-outline-secondary" target="blank">View Struk</a>
              </div>
              <div class="invalid-feedback">{{ errors.payment_document }}</div>
              <div id="passwordHelpBlock" class="form-text">
                Upload your proof of payment on Google Drive, and enter the link here for us to validate.
              </div> 
            </div> 
            <div v-if="permissions && permissions.includes('confirm payment')" class="mb-3">
              <label for="status" class="form-label">Payment Status</label>

              <select
                class="form-select"
                id="status"
                name="status"
                v-model="form.status"
                :class="{ 'is-invalid': errors.status  }"
              > 
                <option value="paid">Approve Payment</option>
                <option value="failed">Reject Payment</option>
                
              </select>
              <div class="invalid-feedback">{{ errors.championship_category_id }}</div>
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
            </tr>
            <tr v-if="members.length === 0">
              <td colspan="5" class="text-center">No members found.</td>
            </tr>
          </tbody>
        </table>

        <!-- Submit Button -->
        <div class="row">
          <div class="col-lg-12 text-center">
            <button v-if="permissions && permissions.includes('upload payment struk')" type="submit" class="button button-primary" :disabled="loading">
              <i class="bi bi-floppy"></i>
              <span>{{ isConfirm ? "Send Payment Struk" : "Submit Payment" }}</span>
            </button>

            <button v-if="permissions && permissions.includes('confirm payment')" type="submit" class="button button-primary" :disabled="loading">
              <i class="bi bi-floppy"></i>
              <span>{{ isConfirm ? "Confirm Payment" : "Submit Payment" }}</span>
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
import { inject } from 'vue';

export default {
  name: "PaymentConfirmationForm",
  props: {
    isConfirm: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const toast = useToast();
    const permissions = inject('permissions', []);  // Ensure permissions is always an array

  
    return { toast,permissions };
  },
  data() {
    return {
      tournaments: [],
      members: [],
      unselectedMembers: [],
      selectedMembers: [], // This will hold the selected members' IDs
      form: {
        status: '', // Default to "Approve Payment"
        payment_document: '', // File will be stored here
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
    if (this.isConfirm && this.paymentId) {
      this.fetchPaymentDetail(this.paymentId);
    }
  },

  beforeRouteUpdate(to, from, next) {
    if (this.isConfirm && to.params.id !== this.paymentId) {
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
        if (this.isConfirm && newId) {
          this.paymentId = newId;
          this.fetchPaymentDetail(newId); 
        }
      },
    }
  },

  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0]; // Get the uploaded file
      this.form.payment_document = file; // Store it in the `form` object
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
        const response = await axios.get("/team-members?fetch_all=true&is_payment_confirmation=true", {
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
            invoice_number: response.data.invoice_number,
            status: response.data.status,
            tournament_id: response.data.tournament_id || null,
            bank_name: response.data.bank_name || "",
            account_number: response.data.account_number || "",
            account_name: response.data.account_name || "",
            members: response.data.billing_details || [],
            total_amount: response.data.total_amount || 0,
            notes: response.data.notes || "",
            payment_document: response.data.payment_document || null,
            amount: this.formatNumber(response.data.amount),
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

    

    
    async submitForm() {
      this.loading = true;
      try {
        

        const method = 'put'; // Since we're updating
        //const endpoint = `/billings/${this.paymentId}/update-document`; // API endpoint for document update
        const endpoint = this.permissions.includes("confirm payment")
        ? `/billings/${this.paymentId}/confirm-payment`
        : `/billings/${this.paymentId}/update-document`;


        // Make the request (no need to manually set Content-Type when using FormData)
        const response = await axios[method](endpoint, this.form, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
            // Do not manually set 'Content-Type': 'multipart/form-data' when using FormData
          },
        });

        // Using response here
        if (response.data.message) {
          this.toast.success(response.data.message);  // Use the message sent by backend
        }

        this.$router.push("/admin/payment"); // Redirect after successful submission
      } catch (error) {
        this.toast.error("Error submitting document");
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
