<template>
  <aside class="sidebar">
    <a class="navbar-brand" href="#">
      <img src="@/assets/float-logo.png" alt="Logo" />
    </a>
    <ul class="nav flex-column">
      <li
        v-for="menu in menus"
        :key="menu.id"
        class="nav-item"
        :class="{ 'has-children': menu.children }"
      >
        <!-- Parent Menu Item -->
        <span
          v-if="menu.url === '#'"
          class="nav-link text-start pointer"
          @click.prevent="toggleSubMenu(menu.id, menu.children)"
        >
          <i :class="getMenuIcon(menu)"></i>{{ menu.name }}
        </span>

        <!-- Regular Menu Item -->
        <router-link
          v-else
          class="nav-link text-start"
          :to="'/admin/' + menu.url"
          :class="{ active: isActive(menu) }"
        >
          <i :class="getMenuIcon(menu)"></i>
          {{ menu.name }}
        </router-link>

        <!-- Submenu -->
        <ul v-if="menu.children && isSubMenuOpen === menu.id" class="sub-menu">
          <li v-for="child in menu.children" :key="child.id" class="nav-item">
            <router-link
              class="nav-link text-start"
              :to="'/admin/' + child.url"
              :class="{ active: isActive(child) }"
            >
              <i class="bi bi-file-earmark me-2"></i>
              {{ child.name }}
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>



<script>
import axios from "axios";

export default {
  name: "AdminSidebar",
  data() {
    return {
      isSubMenuOpen: null, // Tracks the currently open submenu
      menus: [], // Stores the fetched menus
    };
  },
  methods: {
    /**
     * Toggles the visibility of submenus.
     * @param {Number} menuId - ID of the menu.
     * @param {Array|null} children - Children of the menu.
     */
    toggleSubMenu(menuId, children) {
      if (children && children.length > 0) {
        this.isSubMenuOpen = this.isSubMenuOpen === menuId ? null : menuId;
      }
    },

    /**
     * Checks if the menu item is active based on the current route.
     * @param {Object} item - Menu item object.
     * @returns {Boolean} - True if the item is active, false otherwise.
     */
    isActive(item) {
      if (item.children) {
        return item.children.some(child => this.isActive(child));
      }
      return this.$route.path.includes(item.url);
    },

    /**
     * Fetches menu items from the API and stores them in the `menus` state.
     */
    async fetchMenus() {
      try {
        const response = await axios.get("/menus", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        this.menus = response.data || [];
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    },

    /**
     * Returns the appropriate icon class for a menu item.
     * @param {Object} menu - Menu object.
     * @returns {String} - Icon class.
     */
    getMenuIcon(menu) {
      if (menu.children && menu.children.length > 0) {
        return this.isSubMenuOpen === menu.id
          ? "bi bi-dash-circle me-2"
          : "bi bi-plus-circle me-2";
      }
      return "bi bi-file-earmark me-2";
    },
  },
  mounted() {
    this.fetchMenus();
  },
};
</script>
<style scoped>
.sidebar {
  background-color: #1e2a57;
  height: 100vh;
  width: 250px;
  position: fixed;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pointer {
  cursor: pointer;
}

.navbar-brand {
  position: absolute;
  top: -40px;
  left: -35px;
  margin-bottom: 30px;
  text-align: center;
}

.navbar-brand img {
  max-width: 200px;
  height: auto;
}

.nav {
  margin-top: 170px;
  width: 100%;
}

.nav-item .nav-link {
  color: white;
  padding: 10px;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.nav-item .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.nav-item.has-children .nav-link {
  font-size: 14px;
  font-weight: bold;
}

.sub-menu {
  margin-top: 5px;
  margin-left: -12px;
}

.sub-menu .nav-link {
  font-size: 14px;
}

.sub-menu .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.bi {
  font-size: 1.2rem;
}

.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  color: white;
}

.nav-item .nav-link.active {
  font-weight: bold;
}
</style>



