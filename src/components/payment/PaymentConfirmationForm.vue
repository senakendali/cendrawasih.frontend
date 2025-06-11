<template>
  <div class="dashboard-container">
    <!-- Loader: Top Progress Bar -->
    <div v-if="loading" class="progress-bar" :style="{ width: progress + '%' }"></div>

    <div class="modal fade" id="paymentModal" tabindex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-custom">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="paymentModalLabel">View Struk</h5>
                    <a href="#" data-bs-dismiss="modal" aria-label="Close"><i class="bi bi-x-square"></i></a>
                </div>
                <div class="modal-body d-flex justify-content-center">
                  <img :src="form.payment_document" class="img-fluid" alt="Payment Document">
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

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
            

            <!-- ✅ FIX FINAL: hanya tampil jika BUKAN sedang confirm payment dengan status 'waiting for confirmation' -->
<div class="mb-3" v-if="showUploadStruk">
  <label for="payment_document" class="form-label">Payment Struk</label>
  <div class="input-group">
    <input class="form-control" type="file" id="payment_document" @change="handleFileUpload">
  </div>
  <div class="invalid-feedback">{{ errors.payment_document }}</div>
</div>


            <div class="mb-3">
                <a href="#" v-if="form.payment_document  && form.status !== 'waiting for payment'" class="button button-primary"  @click="openModal"><i class="bi bi-file-earmark-post-fill"></i> View Struk</a>
            </div>
            <div v-if="permissions && permissions.includes('confirm payment') && form.status !== 'waiting for payment'" class="mb-3">
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
              <div class="invalid-feedback">{{ errors.status }}</div>
            </div>
            <div class="mb-3" v-if="form.status === 'failed'">
              <label for="reject_reason" class="form-label">Reject Reason</label>
              <textarea
                class="form-control"
                :class="{ 'is-invalid': errors.reject_reason }"
                id="reject_reason"
                v-model="form.reject_reason"
              ></textarea>
              <div class="invalid-feedback">{{ errors.reject_reason }}</div>
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
            <tr v-for="(member, index) in validMembers" :key="member.id">
              <td>{{ index + 1 }}</td>
              <td>{{ member.contingent.name }}</td>
              <td>{{ member.name }}</td>
              <td>{{ member.championship_category.name }}</td>
              <td>{{ member.match_category.name }}</td>
              <td>{{ formatNumber(member.registration_fee) }}</td>
            </tr>
            <tr v-if="members.length === 0">
              <td colspan="5" class="text-center">No members found.</td>
            </tr>
          </tbody>
        </table>

        <!-- Submit Button -->
        <div class="row">
          <div class="col-lg-12 text-center">
            <!--button v-if="permissions && permissions.includes('upload payment struk')" type="submit" class="button button-primary" :disabled="loading">
              <i class="bi bi-floppy"></i>
              <span>{{ isConfirm ? "Send Payment Struk" : "Submit Payment" }}</span>
            </button-->
            <button
              v-if="permissions && permissions.includes('upload payment struk') && form.status === 'waiting for payment'"
              type="submit"
              class="button button-primary"
              :disabled="loading"
            >
              <i class="bi bi-floppy"></i>
              <span>{{ isConfirm ? "Send Payment Struk" : "Submit Payment" }}</span>
            </button>

            <!--p>{{ form.status }}</p-->
            <button v-if="permissions && permissions.includes('confirm payment') && (form.status === 'waiting for confirmation' || form.status === 'paid')" type="submit" class="button button-primary" :disabled="loading">
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
import { Modal } from 'bootstrap';


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
      selectedFile: null,
      tournaments: [],
      members: [],
      unselectedMembers: [],
      selectedMembers: [], // This will hold the selected members' IDs
      form: {
        status: '', // Default to "Approve Payment"
        reject_reason: '',
        payment_document: '', // File will be stored here
      },
      errors: {},
      loading: false,
      progress: 0,
      paymentId: null, // Define paymentId for update mode
      showPopup: false, // Control the pop-up visibility
    };
  },

  computed: {
    showUploadStruk() {
    return this.permissions.includes('upload payment struk') &&
           (!this.permissions.includes('confirm payment') || this.form.status !== 'waiting for confirmation');
  },
    validMembers() {
      return this.members.filter(m => m && m.match_category && m.championship_category);
    }
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

    openModal(event) {
    event.preventDefault();
        let modal = new Modal(document.getElementById('paymentModal'));
        modal.show();
    },

    handleFileUpload(event) {
      this.form.payment_document = event.target.files[0];
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
        const response = await axios.get("/team-members?fetch_all=false&is_payment_confirmation=true", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        //this.members = response.data || []; // Ensure it assigns an array even if data is empty
        this.members = response.data?.data ?? []; 
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

      let formData = new FormData();

      if (this.permissions.includes("confirm payment") && (this.form.status === 'waiting for confirmation' || this.form.status === 'paid')) {
        formData.append("status", this.form.status);

        // Hanya kirim reject_reason jika status = "failed"
        if (this.form.status === "failed") {
          formData.append("reject_reason", this.form.reject_reason || ""); 
        }
      } else {
        if (this.form.payment_document) {
          formData.append("payment_document", this.form.payment_document);
        } else {
          console.error("No file selected!");
          this.toast.error("Please upload a valid payment document.");
          this.loading = false;
          return;
        }
      }

      console.log("Submitting form with:", formData.get("payment_document"));

      try {
        const method = "post"; 
        
        const endpoint = this.permissions.includes("confirm payment") && (this.form.status === 'waiting for confirmation' || this.form.status === 'paid')
        ? `/billings/${this.paymentId}/confirm-payment`
        : `/billings/${this.paymentId}/update-document`;


        await axios({
          method: method,
          url: endpoint,
          data: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
          },
        });

        if (this.permissions.includes("confirm payment") && (this.form.status === 'waiting for confirmation' || this.form.status === 'paid')) {
          this.toast.success("Payment confirmed successfully.");
          this.$router.push("/admin/payment");
        } else {
          this.toast.success("Payment document submitted successfully.");
          this.$router.push("/admin/payment");
        }
        
      } catch (error) {
        console.error("Error submitting form:", error);
        this.toast.error(error.response?.data.message || "An error occurred while submitting the form.");
        this.errors = error.response?.data.errors || {};
      } finally {
        this.loading = false;
      }
    }




    


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
