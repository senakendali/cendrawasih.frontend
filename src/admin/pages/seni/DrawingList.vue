<template>
  <div>
    <!-- Bootstrap Modal -->
    <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Konfirmasi Hapus</h5>
            <i class="bi bi-x-square"></i>
          </div>
          <div class="modal-body">
            Apakah Anda yakin ingin menghapus kontingen ini?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
            <button type="button" class="btn btn-danger" @click="deleteContingent">Yes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="dashboard-container">
    <div
      v-if="loading"
      class="progress-bar"
      :style="{ width: progress + '%' }"
    ></div>

    <div class="mb-2 page-title">
      <i class="bi bi-file-earmark-text"></i> Seni
    </div>

    <div class="mb-2 d-flex justify-content-end align-items-center">
      <!-- Search Bar -->
     
      <!-- Create Menu Button -->
      <router-link to="/admin/seni/create" class="button button-primary">
        <i class="bi bi-plus-square"></i> Add New
      </router-link>
    </div>

    <!-- Filter Section -->
    <div class="row mb-4">
      <!-- Match Category -->
      <div class="col-md-3">
        <label><strong>Match Category</strong></label><br />
        <div>
          <input
            type="checkbox"
            :checked="isAllChecked('match_category')"
            @change="toggleAll('match_category', matchCategoryOptions)"
          />
          <strong> All</strong>
        </div>
        <div v-for="opt in matchCategoryOptions" :key="opt.value">
          <input type="checkbox" :value="opt.value" v-model="filters.match_category" /> {{ opt.label }}
        </div>
      </div>

      <!-- Gender -->
      <div class="col-md-3">
        <label><strong>Gender</strong></label><br />
        <div>
          <input
            type="checkbox"
            :checked="isAllChecked('gender')"
            @change="toggleAll('gender', genderOptions)"
          />
          <strong> All</strong>
        </div>
        <div v-for="opt in genderOptions" :key="opt.value">
          <input type="checkbox" :value="opt.value" v-model="filters.gender" /> {{ opt.label }}
        </div>
      </div>

      <!-- Age Category -->
      <div class="col-md-3">
        <label><strong>Age Category</strong></label><br />
        <div>
          <input
            type="checkbox"
            :checked="isAllChecked('age_category')"
            @change="toggleAll('age_category', ageCategoryOptions)"
          />
          <strong> All</strong>
        </div>
        <div v-for="age in ageCategoryOptions" :key="age.id">
          <input type="checkbox" :value="age.id" v-model="filters.age_category" /> {{ age.name }}
        </div>

      </div>

      <!-- Pool -->
      <div class="col-md-3">
        <label><strong>Pool</strong></label><br />
        <div>
          <input
            type="checkbox"
            :checked="isAllChecked('pool')"
            @change="toggleAll('pool', poolOptions)"
          />
          <strong> All</strong>
        </div>
        <div v-for="pool in poolOptions" :key="pool">
          <input type="checkbox" :value="pool" v-model="filters.pool" /> {{ pool }}
        </div>

      </div>
    </div>



    <!-- Table to display navigation data -->
    <div v-for="categoryGroup in filteredMatchList" :key="categoryGroup.category + '-' + categoryGroup.gender">


      <!-- Judul Kategori dan Gender -->
      <h4 class="text-uppercase text-primary mb-3">
        {{ categoryGroup.category }} - {{ categoryGroup.gender === 'male' ? 'PUTRA' : 'PUTRI' }}
      </h4>

      <!-- Loop per Pool -->
      <div v-for="pool in categoryGroup.pools" :key="pool.name" class="mb-5">
        <table class="table mt-4">
          <thead>
            <!-- Header Informasi Pool -->
            <tr>
              <th colspan="6" class="table-header text-start text-uppercase">
                {{ pool.name }}
              </th>
            </tr>
            <tr>
              <th colspan="6" class="text-start text-uppercase">
              
                {{ pool.matches[0]?.pool?.age_category?.name.toUpperCase() }}
              </th>
            </tr>

            <!-- Header Kolom Peserta -->
            <tr class="table-sub-header">
              <th>Match Number</th>
              <th>Kontingen</th>

              <th v-if="pool.matches[0]?.match_type === 'seni_tunggal'">Peserta</th>

              <template v-else-if="pool.matches[0]?.match_type === 'seni_ganda'">
                <th>Peserta 1</th>
                <th>Peserta 2</th>
              </template>

              <template v-else-if="pool.matches[0]?.match_type === 'seni_regu'">
                <th>Peserta 1</th>
                <th>Peserta 2</th>
                <th>Peserta 3</th>
              </template>
            </tr>
          </thead>

          <tbody>
            <tr v-for="entry in pool.matches" :key="entry.id">
              <td>{{ entry.match_order }}</td>
              <td>{{ entry.contingent?.name || '-' }}</td>

              <!-- Tunggal -->
              <td v-if="entry.match_type === 'seni_tunggal'">{{ entry.team_member1?.name || '-' }}</td>

              <!-- Ganda -->
              <template v-else-if="entry.match_type === 'seni_ganda'">
                <td>{{ entry.team_member1?.name || '-' }}</td>
                <td>{{ entry.team_member2?.name || '-' }}</td>
              </template>

              <!-- Regu -->
              <template v-else-if="entry.match_type === 'seni_regu'">
                <td>{{ entry.team_member1?.name || '-' }}</td>
                <td>{{ entry.team_member2?.name || '-' }}</td>
                <td>{{ entry.team_member3?.name || '-' }}</td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>




  </div>
</template>

<script>
import axios from "axios";
import API from "@/config/api";
import { Modal } from "bootstrap";
import { useToast } from "vue-toastification";
import { inject } from 'vue';

axios.defaults.baseURL = API.API_BASE_URL;

export default {
  name: "ContingentList",
  data() {
    return {
      poolId: null,
      deleteModal: null,
      pools: [],
      matchList: {}, // <- ini
      loading: false,
      progress: 0,
      filters: {
        match_category: ['seni_tunggal', 'seni_ganda', 'seni_regu'],
        gender: ['male', 'female'],
        age_category: [], // diisi setelah load
        pool: [] // diisi setelah load
      },
      matchCategoryOptions: [
        { label: 'Tunggal', value: 'seni_tunggal' },
        { label: 'Ganda', value: 'seni_ganda' },
        { label: 'Regu', value: 'seni_regu' },
      ],
      genderOptions: [
        { label: 'Putra', value: 'male' },
        { label: 'Putri', value: 'female' },
      ],
      ageCategoryOptions: [], // diisi saat loadPools
      poolOptions: [] // diisi saat loadPools

    };
  },

  computed: {
    filteredPools() {
      return this.allPools.filter(pool => this.shouldShowPool(pool));
    },
    filteredMatchList() {
      const data = Array.isArray(this.matchList) ? this.matchList : Object.values(this.matchList);

      return data.filter(item => {
        const matchType = item.pools[0]?.matches[0]?.match_type;
        const gender = item.gender;

        const matchCategoryMatch =
          this.filters.match_category.length === 0 ||
          this.filters.match_category.includes(matchType);

        const genderMatch =
          this.filters.gender.length === 0 ||
          this.filters.gender.includes(gender);

        const ageCategoryMatch =
          this.filters.age_category.length === 0 ||
          item.pools.some(pool =>
            pool.matches[0]?.pool?.age_category &&
            this.filters.age_category.includes(pool.matches[0].pool.age_category.id)
          );

        const poolMatch =
          this.filters.pool.length === 0 ||
          item.pools.some(pool => this.filters.pool.includes(pool.name));

        return matchCategoryMatch && genderMatch && ageCategoryMatch && poolMatch;
      });
    },
  },


  setup() {
    const toast = useToast();
    const permissions = inject('permissions', []); // Ensure permissions is always an array
    
    return { toast, permissions };
  },
  mounted() {
    this.loadPools(); // Corrected the method name
    this.deleteModal = new Modal(document.getElementById("confirmDeleteModal"));
  },
  methods: {
    isAllChecked(type) {
      if (type === 'match_category') {
        return this.filters.match_category.length === this.matchCategoryOptions.length;
      } else if (type === 'gender') {
        return this.filters.gender.length === this.genderOptions.length;
      } else if (type === 'age_category') {
        return this.filters.age_category.length === this.ageCategoryOptions.length;
      } else if (type === 'pool') {
        return this.filters.pool.length === this.poolOptions.length;
      }
      return false;
    },
    toggleAll(type) {
      if (type === 'match_category') {
        this.filters.match_category = this.isAllChecked(type)
          ? []
          : this.matchCategoryOptions.map(o => o.value);
      } else if (type === 'gender') {
        this.filters.gender = this.isAllChecked(type)
          ? []
          : this.genderOptions.map(o => o.value);
      } else if (type === 'age_category') {
        this.filters.age_category = this.isAllChecked(type)
          ? []
          : this.ageCategoryOptions.map(o => o.value);
      } else if (type === 'pool') {
        this.filters.pool = this.isAllChecked(type)
          ? []
          : this.poolOptions.map(o => o.value);
      }
    },
    groupByClassAndPool() {
      const grouped = {};
      for (const pool of this.pools) {
        const className = `${pool.category_class.gender} - ${pool.category_class.name} (${pool.category_class.weight_min} - ${pool.category_class.weight_max} KG)`;
        if (!grouped[className]) grouped[className] = {};
        if (!grouped[className][pool.name]) grouped[className][pool.name] = [];
        grouped[className][pool.name].push(pool);
      }
      this.groupedPools = grouped;
    },

    confirmDelete(id) {
      this.poolId = id;
      this.deleteModal.show();
    },
    
    async loadPools() {
      this.loading = true;
      try {
        const response = await axios.get("/seni/matches", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        this.matchList = response.data;

        // Pool list (unique)
        const poolNames = [...new Set(response.data.flatMap(g => g.pools.map(p => p.name)))];
        this.poolOptions = poolNames;
        this.filters.pool = poolNames;

        // Age Category list (pakai ID & name)
        const ageMap = new Map();
        response.data.flatMap(g => g.pools).forEach(pool => {
          const age = pool.matches[0]?.pool?.age_category;
          if (age && !ageMap.has(age.id)) {
            ageMap.set(age.id, age.name);
          }
        });

        this.ageCategoryOptions = Array.from(ageMap.entries()).map(([id, name]) => ({ id, name }));
        this.filters.age_category = this.ageCategoryOptions.map(item => item.id);

      } catch (error) {
        console.error("Error loading seni match list:", error);
      } finally {
        this.loading = false;
      }
    },


    shouldShowPool(poolName) {
      return this.matchList.some(group =>
        group.pools.some(pool => pool.name === poolName)
      );
    },



    GenerateMatch(id) {
      this.$router.push({ name: "GenerateMatch", params: { id } });
    },
    ViewMatch(id) {
      this.$router.push({ name: "ViewMatch", params: { id } });
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
  position: relative;
}

.table th,
.table td {
  padding: 10px;
}

.navbar {
  background-color: #1E2A57 !important;
}

.navbar-toggler-icon {
  background-color: white;
}

.nav-link {
  color: white !important;
}

input::placeholder {
    color: #888;  /* Change text color */
    font-size: 15px;  /* Change font size */
    font-style: italic;  /* Change font style */
    opacity: 1;  /* Full opacity (default is 0.5) */
    font-family: 'Figtree', sans-serif;
}




.form-control {
  width: 250px;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 5px;
  background-color: #388E3C;
  animation: loader-animation 1.5s infinite;
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

.table-header{
  background-color: #1E2A57 !important;
  color: #ffffff;
}

.table-sub-header th{
  background-color: #f2f2f2 !important;
  
}
</style>
