import axios from "axios";
import API from "@/config/api";

axios.defaults.baseURL = API.API_BASE_URL;

// src/mixins/permissionMixin.js
export const permissionMixin = {
    data() {
      return {
        permissions: [],         // Store permissions
      };
    },
    async created() {
      // Check if permissions are already fetched
      if (!this.$root.isPermissionsFetched) {
        await this.fetchPermissions();
      }
    },
    methods: {
      async fetchPermissions() {
        try {
        const response = await axios.get("/user/permissions", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });
          this.permissions = response.data;  // Store the permissions
          // Set a global flag to prevent further fetches
          this.$root.isPermissionsFetched = true;
        } catch (error) {
          console.error('Failed to fetch permissions:', error);
        }
      },
    },
  };
  