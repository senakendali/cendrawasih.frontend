<template>
  <nav class="navbar navbar-expand-lg my-navbar fixed-top" :class="{'scrolled': isScrolled}">
    <div class="container">
      <a class="navbar-brand" href="#">
        <img src="@/assets/float-logo.png" alt="Logo"/>
      </a>
      <div class="navbar-toggler-container ms-auto">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          @click="toggleMenu"
        >
        <i class="bi bi-list"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav" :class="{'show': menuOpen}">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link" exact-active-class="active" @click="hideMenu">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/about-us" class="nav-link" exact-active-class="active" @click="hideMenu">About Us</router-link>
            </li>
           

            <li class="nav-item dropdown position-static" v-if="allTournaments.length">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Schedule
              </a>

              <div class="dropdown-menu w-100 mega-dropdown" style="left: 0; right: 0;">
                <div class="container-fluid py-3">
                  <div class="row">
                    <div class="col-md-4 mb-3" v-for="t in allTournaments" :key="t.id">
                      <div class="fw-bold text-uppercase small mb-2">{{ t.name }}</div>

                      <div class="row">
                        <!-- Preview Column -->
                        <div class="col-6">
                          <div class="fw-semibold text-muted small">Preview</div>
                          <ul class="list-unstyled mb-2">
                            <li>
                              <router-link
                                class="dropdown-item px-0 py-1"
                                :to="`/schedule/${t.slug}/tanding`"
                                @click="menuOpen = false"
                              >Tanding</router-link>
                            </li>
                            <li>
                              <router-link
                                class="dropdown-item px-0 py-1"
                                :to="`/schedule/${t.slug}/seni`"
                                @click="menuOpen = false"
                              >Seni</router-link>
                            </li>
                          </ul>
                        </div>

                        <!-- Live Column -->
                        <div class="col-6">
                          <div class="fw-semibold text-muted small">Live</div>
                          <ul class="list-unstyled">
                            <li>
                              <router-link
                                class="dropdown-item px-0 py-1"
                                :to="`/schedule/live/${t.slug}/tanding`"
                                @click="menuOpen = false"
                              >Tanding</router-link>
                            </li>
                            <li>
                              <router-link
                                class="dropdown-item px-0 py-1"
                                :to="`/schedule/live/${t.slug}/seni`"
                                @click="menuOpen = false"
                              >Seni</router-link>
                            </li>
                          </ul>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </li>






          </ul>
          <button class="btn btn-login" @click="navigateTo('/admin/login')">Login</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from "axios";
import { useRouter } from 'vue-router';

export default {
  name: 'MainHeader',
  data() {
    return {
      isScrolled: false,
      isLoading: false,
      menuOpen: false, // Add state to handle menu open/close
      allTournaments: [], 
      selectedTournament: '', 
    };
  },

  mounted() {
    this.fetchActiveTournaments(); 
    document.title = 'Cenderawasih Juara Manajemen'; // Set your desired title here
    window.addEventListener('scroll', this.handleScroll);
    const router = useRouter();
    router.beforeEach((to, from, next) => {
      this.startLoading();
      next();
    });
    router.afterEach(() => {
      this.isLoading = false;
    });
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    async fetchActiveTournaments() {
      try {
        const response = await axios.get("/tournaments/active");
        this.allTournaments = response.data;
        // ✅ Set default turnamen aktif pertama
        if (this.allTournaments.length) {
          this.selectedTournament = this.allTournaments[0].id;
          //this.redirectToSchedule(this.selectedTournament);
        }
      } catch (error) {
        console.error("Failed to fetch tournaments:", error);
      }
    },
    /*redirectToSchedule(tournamentId) {
      this.$router.push({ path: '/schedule', query: { tournament_id: tournamentId } });
      this.menuOpen = false;
    },*/

    redirectToSchedule(tournamentSlug, category = 'tanding', isLive = false) {
      const basePath = isLive ? '/schedule/live' : '/schedule';
      const path = `${basePath}/${tournamentSlug}/${category}`;
      this.$router.push({ path });
      this.menuOpen = false;
    },

  
    handleScroll() {
      this.isScrolled = window.scrollY > 50; // Adjust the scroll position as needed
    },
    startLoading() {
      this.isLoading = true;
    },
    navigateTo(path) {
      this.startLoading();
      this.$router.push(path);
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen; // Toggle menu open/close state
    },
    hideMenu() { 
      this.menuOpen = false; // Hide menu 
    }
  },
  watch: {
    $route() {
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.my-navbar {
  background-color: rgba(0, 0, 0, 0.8); /* Set navbar background to transparent initially */
  padding: 10px;
  transition: background-color 0.3s ease, height 0.3s ease, padding 0.3s ease; /* Smooth transition for background color, height, and padding changes */
  height: 120px;
}

.my-navbar .navbar-brand {
  position: fixed;
  top: -55px;
}

.my-navbar .navbar-brand img {
  height: 160px;
  transition: height 0.3s ease; /* Smooth transition for logo size */
}

.my-navbar.scrolled .navbar-brand{ 
  top: -55px;
  position: fixed;
}

.my-navbar.scrolled .navbar-brand img {
  height: 160px;
  transition: height 0.3s ease; /* Smooth transition for logo size */
}

.my-navbar.scrolled {
  background-color: rgba(0, 0, 0, 0.8); /* Semi-transparent black background */
  height: 60px; /* Reduced height when scrolled */
  padding: 5px; /* Reduced padding when scrolled */
}

.my-navbar .navbar-nav .nav-link {
  color: #FFF;
  font-family: "Urbanist", sans-serif;
  font-size: 16px;
  width: 120px;
}

.my-navbar .navbar-nav .nav-link:hover {
  color: #D32F2F;
  text-decoration: none;
  transition: 0.3s ease;
}

.position-static {
  position: static !important;
}
.mega-dropdown {
  left: 0 !important;
  right: 0 !important;
  width: 100vw;
  border-top: 2px solid #0d6efd;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}


/* Active link styling */
.my-navbar .navbar-nav .nav-link.active {
  color: #D32F2F; /* Change active link color */
  font-weight: bold; /* Optional: Make active link text bold */
}


.mega-dropdown .dropdown-item {
  font-size: 0.9rem;
  white-space: normal;
}


.position-static {
  position: static !important;
}

.mega-dropdown {
  left: 0 !important;
  right: 0 !important;
  border-top: 3px solid #D32F2F;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .dropdown-menu.mega-dropdown {
    width: 100vw;
    max-width: none;
    border-radius: 0;
  }
}


.dropdown-submenu:hover > .dropdown-menu {
  display: block;
  top: 0;
  left: 100%;
  margin-left: 0.1rem;
}
.dropdown-submenu {
  position: relative;
}


.btn-login {
  background-color: #D32F2F;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.btn-login:hover {
  background-color: #FF5722;
  color: #FFFFFF;
}

.navbar-toggler-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column; /* Stack the toggle and menu vertically */
}

.navbar-toggler + .collapse {
  width: 100%;
}

/* For mobile devices */
@media only screen and (max-width: 600px) {
  .my-navbar {
    background-color: #000000; 
    height: 60px; /* Reduced height when scrolled */
    padding: 5px; /* Reduced padding when scrolled */
  }

  .my-navbar.scrolled {
    background-color: rgba(0, 0, 0, 0.8); /* Semi-transparent black background */
    height: 60px; /* Reduced height when scrolled */
    padding: 5px; /* Reduced padding when scrolled */
  }

  .my-navbar .nav-item .nav-link{
    width: 100%;
    text-align: center;
  }

  .btn-login{
    margin-top: 50px;
    width: 100%;
  }

  .my-navbar .navbar-toggler{
    position: absolute;
    right: 15px;
    top: 15px;
    border: 1px solid #fff;
    color: #FFFFFF;
  }

  .my-navbar .navbar-toggler:focus {
    text-decoration: none;
    outline: 0;
    box-shadow: none;
  }

  .my-navbar .navbar-collapse{
    top: 60px;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    padding: 10px;
    border-radius: 5px;
    position: absolute;
    left: 0;
    padding-top: 60px;
    z-index: -1;
  }

  .navbar-brand {
    position: fixed;
    top: -50px;
  }

  .navbar-brand img{
    height: 140px;
  }

  .my-navbar.scrolled .navbar-brand{ 
    top: -50px;
    position: fixed;
  }

  .my-navbar.scrolled .navbar-brand img {
    height: 140px;
  }
}

/* For tablets */
@media only screen and (max-width: 768px) {
  .navbar-brand {
    position: fixed;
    top: -50px;
  }

  .navbar-brand img{
    height: 140px;
  }

  .my-navbar.scrolled .navbar-brand{ 
    top: -50px;
    position: fixed;
  }

  .my-navbar.scrolled .navbar-brand img {
    height: 140px;
  }
}
</style>
