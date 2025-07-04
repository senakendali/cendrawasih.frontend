import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../main/layouts/MainLayout.vue';
import HomePage from '../main/pages/HomePage.vue';
import AdminLayout from '../admin/layouts/AdminLayout.vue';
import LoginLayout from '../admin/layouts/LoginLayout.vue';
import DashboardPage from '../admin/pages/DashboardPage.vue';
import ContingentRegistrationPage from '../admin/pages/ContingentRegistrationPage.vue';
import TournamentInsightPage from '@/admin/pages/dashboard/TournamentInsightPage.vue';
import LoginPage from '../admin/pages/LoginPage.vue';
import RegistrationPage from '@/main/pages/RegistrationPage.vue';
import TournamentPage from '@/main/pages/TournamentPage.vue';
import AboutPage from '@/main/pages/AboutPage.vue';
import PrivacyPolicyPage from '@/main/pages/PrivacyPolicyPage.vue';
import SchedulePage from '@/main/pages/SchedulePage.vue';
import GalleryDetail from '@/main/pages/GalleryDetail.vue';
import AdminNavigationList from '../admin/pages/navigation/NavigationList.vue';
import NavigationCreatePage from "@/admin/pages/navigation/NavigationCreatePage.vue";
import NavigationEditPage from "@/admin/pages/navigation/NavigationEditPage.vue";
import AdminContingetList from '../admin/pages/contingent/ContingentList.vue';
import ContingentCreatePage from "@/admin/pages/contingent/ContingentCreatePage.vue";
import ContingentEditPage from "@/admin/pages/contingent/ContingentEditPage.vue";
import AdminTeamMembersList from '../admin/pages/team-members/MembersList.vue';
import TeamMembersCreatePage from "@/admin/pages/team-members/MembersCreatePage.vue";
import TeamMembersEditPage from "@/admin/pages/team-members/MembersEditPage.vue";
import AdminPaymentList from '../admin/pages/payment/PaymentList.vue';
import PaymentCreatePage from "@/admin/pages/payment/PaymentCreatePage.vue";
import PaymentEditPage from "@/admin/pages/payment/PaymentEditPage.vue";
import PaymentConfirmationPage from "@/admin/pages/payment/PaymentConfirmationPage.vue";
import ClassesList from '../admin/pages/classes/ClassList.vue';
import ClassesCreatePage from "@/admin/pages/classes/ClassCreatePage.vue";
import ClassesEditPage from "@/admin/pages/classes/ClassEditPage.vue";
import ClasificationList from '@/admin/pages/match-clasification/ClasificationList.vue';
import ClasificationCreatePage from '@/admin/pages/match-clasification/ClasificationCreatePage.vue';
import ClasificationEditPage from '@/admin/pages/match-clasification/ClasificationEditPage.vue';

import DrawingCreatePage from '@/admin/pages/drawing/DrawingCreatePage.vue';
import DrawingEditPage from '@/admin/pages/drawing/DrawingEditPage.vue';
import MatchPage from '@/admin/pages/drawing/MatchPage.vue';
import MatchList from '@/admin/pages/drawing/MatchList.vue';
import DrawingList from '@/admin/pages/drawing/DrawingList.vue';
import MatchChartPage from '@/admin/pages/match-chart/MatchChartPage.vue';
import MatchRecapPage from '@/admin/pages/drawing/MatchRecapPage.vue';


import SeniMatchCreatePage from '@/admin/pages/seni/DrawingCreatePage.vue';
import SeniMatchEditPage from '@/admin/pages/seni/DrawingEditPage.vue';
import SeniMatchPage from '@/admin/pages/seni/MatchPage.vue';
import SeniMatchList from '@/admin/pages/seni/DrawingList.vue';




import TournamentList from '../admin/pages/tournament/TournamentList.vue';
import TournamentCreatePage from "@/admin/pages/tournament/TournamentCreatePage.vue";
import TournamentEditPage from "@/admin/pages/tournament/TournamentEditPage.vue";

import TournamentActivity from '../admin/pages/tournament-activity/TournamentActivityList.vue';
import TournamentActivityCreatePage from "@/admin/pages/tournament-activity/TournamentActivityCreatePage.vue";
import TournamentActivityEditPage from "@/admin/pages/tournament-activity/TournamentActivityEditPage.vue";

import TournamentCategoryCreatePage from '@/admin/pages/tournament-category/TournamentCategoryCreatePage.vue';
import TournamentCategoryEditPage from '@/admin/pages/tournament-category/TournamentCategoryEditPage.vue';
import TournamentCategoryList from '../admin/pages/tournament-category/TournamentCategoryList.vue';

import TournamentArenaList from '@/admin/pages/tournament-arena/TournamentArenaList.vue';
import TournamentArenaCreatePage from '@/admin/pages/tournament-arena/TournamentArenaCreatePage.vue';
import TournamentArenaEditPage from '@/admin/pages/tournament-arena/TournamentArenaEditPage.vue';

import ContactPersonList from '@/admin/pages/tournament-contact-person/ContactPersonList.vue';
import ContactPersonCreatePage from '@/admin/pages/tournament-contact-person/ContactPersonCreatePage.vue';
import ContactPersonEditPage from '@/admin/pages/tournament-contact-person/ContactPersonEditPage.vue';

import TournamentScheduleList from '@/admin/pages/tournament-schedule/TournamentScheduleList.vue';
import TournamentScheduleCreatePage from '@/admin/pages/tournament-schedule/TournamentScheduleCreatePage.vue';
import TournamentScheduleEditPage from '@/admin/pages/tournament-schedule/TournamentScheduleEditPage.vue';


import TournamentScheduleSeniCreatePage from '@/admin/pages/tournament-schedule/TournamentScheduleSeniCreatePage.vue';
import TournamentScheduleSeniEditPage from '@/admin/pages/tournament-schedule/TournamentScheduleSeniEditPage.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: HomePage }
    ]
  },
  {
    path: '/about-us',
    component: MainLayout,
    children: [
      { path: '', component: AboutPage }
    ]
  },
  {
    path: '/privacy-policy',
    component: MainLayout,
    children: [
      { path: '', component: PrivacyPolicyPage }
    ]
  },
  
  {
    path: '/registration/:slug',
    component: MainLayout,
    children: [
      {
        props: true, // Kirim parameter ID ke komponen sebagai props
        name: 'registration', // Name should be here in the child route
        path: '', // Child route should not redefine ":id"
        component: RegistrationPage,
      },
    ],
  },  
  {
    path: '/detail',
    component: MainLayout, // Use MainLayout for all /kejuaraan routes
    children: [
      {
        path: '', // Matches /kejuaraan
        name: 'TournamentPage',
        component: TournamentPage, // TournamentPage as the default view
      },
      {
        path: ':slug', // Matches /kejuaraan/:id
        name: 'GalleryDetail',
        component: GalleryDetail, // GalleryDetail for specific IDs
        props: true, // Pass route params as props
      },
    ],
  },
  
  {
    path: '/schedule',
    component: MainLayout,
    children: [
      { path: '', component: SchedulePage }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', component: DashboardPage }
    ]
  },
  {
    path: '/contingent-registration/:id',
    component: AdminLayout,
    children: [
      {
        props: true, // Kirim parameter ID ke komponen sebagai props
        name: 'contingent-registration', // Name should be here in the child route
        path: '', // Child route should not redefine ":id"
        component: ContingentRegistrationPage,
      },
    ],
  },  
  {
    path: '/tournament-insight/:id',
    component: AdminLayout,
    children: [
      {
        props: true, // Kirim parameter ID ke komponen sebagai props
        name: 'tournament-insight', // Name should be here in the child route
        path: '', // Child route should not redefine ":id"
        component: TournamentInsightPage,
      },
    ],
  }, 
  { 
    path: '/admin/login', 
    component: LoginLayout, 
    children: [ 
      { path: '', component: LoginPage } // Use LoginLayout for login page ] }
    ]
  },
  {
    path: '/admin/navigation',
    component: AdminLayout,
    children: [
      { path: '', component: AdminNavigationList }
    ]
    //meta: { requiresAdmin: true }  // for admin-only route
  },
  {
    path: '/admin/navigation/create',
    component: AdminLayout,
    children: [
      { path: '', component: NavigationCreatePage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/navigation/edit/:id',
    name: "EditMenu",
    component: AdminLayout,
    props: true, // Kirim parameter ID ke komponen sebagai props
    children: [
      { path: '', component: NavigationEditPage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/contingent',
    component: AdminLayout,
    children: [
      { path: '', component: AdminContingetList }
    ]
    //meta: { requiresAdmin: true }  // for admin-only route
  },
  {
    path: '/admin/contingent/create',
    component: AdminLayout,
    children: [
      { path: '', component: ContingentCreatePage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/contingent/edit/:id',
    name: 'EditContingent',
    component: AdminLayout, // This should be the main layout component
    props: true, // This makes the route parameters available as props to your component
    children: [
      {
        path: '', // Empty path indicates this is the default child route
        component: ContingentEditPage, // The component rendered inside the <router-view> in AdminLayout
      }
    ]
  },
  {
    path: '/admin/team-members',
    component: AdminLayout,
    children: [
      { path: '', component: AdminTeamMembersList }
    ]
    //meta: { requiresAdmin: true }  // for admin-only route
  },
  {
    path: '/admin/team-members/create',
    component: AdminLayout,
    children: [
      { path: '', component: TeamMembersCreatePage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/team-members/edit/:id',
    name: "EditMember",
    component: AdminLayout,
    props: true, // Kirim parameter ID ke komponen sebagai props
    children: [
      { path: '', component: TeamMembersEditPage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/payment',
    component: AdminLayout,
    children: [
      { path: '', component: AdminPaymentList }
    ]
    //meta: { requiresAdmin: true }  // for admin-only route
  },
  {
    path: '/admin/payment/create',
    component: AdminLayout,
    children: [
      { path: '', component: PaymentCreatePage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/payment/edit/:id',
    name: "EditPayment",
    component: AdminLayout,
    props: true, // Kirim parameter ID ke komponen sebagai props
    children: [
      { path: '', component: PaymentEditPage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/payment/confirm/:id',
    name: "ConfirmPayment",
    component: AdminLayout,
    props: true, // Kirim parameter ID ke komponen sebagai props
    children: [
      { path: '', component: PaymentConfirmationPage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/classes',
    component: AdminLayout,
    children: [
      { path: '', component: ClassesList }
    ]
    //meta: { requiresAdmin: true }  // for admin-only route
  },
  {
    path: '/admin/classes/create',
    component: AdminLayout,
    children: [
      { path: '', component: ClassesCreatePage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/classes/edit/:id',
    name: "EditClass",
    component: AdminLayout,
    props: true, // Kirim parameter ID ke komponen sebagai props
    children: [
      { path: '', component: ClassesEditPage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/match-clasification',
    component: AdminLayout,
    children: [
      { path: '', component: ClasificationList }
    ]
    //meta: { requiresAdmin: true }  // for admin-only route
  },
  {
    path: '/admin/match-clasification/create',
    component: AdminLayout,
    children: [
      { path: '', component: ClasificationCreatePage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/match-clasification/edit/:id',
    name: "EditClasification",
    component: AdminLayout,
    props: true, // Kirim parameter ID ke komponen sebagai props
    children: [
      { path: '', component: ClasificationEditPage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/tanding',
    component: AdminLayout,
    children: [
      { path: '', component: DrawingList }
    ]
    //meta: { requiresAdmin: true }  // for admin-only route
  },
  {
    path: '/admin/tanding/create',
    component: AdminLayout,
    children: [
      { path: '', component: DrawingCreatePage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/tanding/edit/:id',
    name: "EditDrawing",
    component: AdminLayout,
    props: true, // Kirim parameter ID ke komponen sebagai props
    children: [
      { path: '', component: DrawingEditPage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/tanding/match/:id',
    name: "GenerateMatch",
    component: AdminLayout,
    props: true, // Kirim parameter ID ke komponen sebagai props
    children: [
      { 
        path: '', 
        component: MatchPage 
      }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/tanding/match/list/:id',
    name: "ViewMatch",
    component: AdminLayout,
    props: true, // Kirim parameter ID ke komponen sebagai props
    children: [
      { 
        path: '', 
        component: MatchList
      }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/tanding/matches',
    component: AdminLayout,
    children: [
      {
        path: ':tournament_id',
        name: "MatchRecap",
        component: MatchRecapPage,
        props: true
      }
    ]
  },


  {
    path: '/admin/seni',
    component: AdminLayout,
    children: [
      { path: '', component: SeniMatchList }
    ]
    //meta: { requiresAdmin: true }  // for admin-only route
  },
  {
    path: '/admin/seni/create',
    component: AdminLayout,
    children: [
      { path: '', component: SeniMatchCreatePage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/seni/edit/:id',
    name: "EditSeniMatch",
    component: AdminLayout,
    props: true, // Kirim parameter ID ke komponen sebagai props
    children: [
      { path: '', component: SeniMatchEditPage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/seni/match/:id',
    name: "GenerateSeniMatch",
    component: AdminLayout,
    props: true, // Kirim parameter ID ke komponen sebagai props
    children: [
      { 
        path: '', 
        component: SeniMatchPage 
      }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/seni/match/list/:id',
    name: "ViewSeniMatch",
    component: AdminLayout,
    props: true, // Kirim parameter ID ke komponen sebagai props
    children: [
      { 
        path: '', 
        component: SeniMatchList
      }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },



  {
    path: '/admin/match-chart',
    component: AdminLayout,
    children: [
      { path: '', component: MatchChartPage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/tournament',
    component: AdminLayout,
    children: [
      { path: '', component: TournamentList }
    ]
    //meta: { requiresAdmin: true }  // for admin-only route
  },
  {
    path: '/admin/tournament/create',
    component: AdminLayout,
    children: [
      { path: '', component: TournamentCreatePage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/tournament/edit/:id',
    name: 'EditTournament',
    component: AdminLayout, // This should be the main layout component
    props: true, // This makes the route parameters available as props to your component
    children: [
      {
        path: '', // Empty path indicates this is the default child route
        component: TournamentEditPage, // The component rendered inside the <router-view> in AdminLayout
      }
    ]
  },
  {
    path: '/admin/tournament-activity',
    component: AdminLayout,
    children: [
      { path: '', component: TournamentActivity }
    ]
    //meta: { requiresAdmin: true }  // for admin-only route
  },
  {
    path: '/admin/tournament-activity/create',
    component: AdminLayout,
    children: [
      { path: '', component: TournamentActivityCreatePage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/tournament-activity/edit/:id',
    name: 'EditActivity',
    component: AdminLayout, // This should be the main layout component
    props: true, // This makes the route parameters available as props to your component
    children: [
      {
        path: '', // Empty path indicates this is the default child route
        component: TournamentActivityEditPage, // The component rendered inside the <router-view> in AdminLayout
      }
    ]
  },
  {
    path: '/admin/tournament-category',
    component: AdminLayout,
    children: [
      { path: '', component: TournamentCategoryList}
    ]
    //meta: { requiresAdmin: true }  // for admin-only route
  },
  {
    path: '/admin/tournament-category/create',
    component: AdminLayout,
    children: [
      { path: '', component: TournamentCategoryCreatePage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/tournament-category/edit/:id',
    name: 'EditCategory',
    component: AdminLayout, // This should be the main layout component
    props: true, // This makes the route parameters available as props to your component
    children: [
      {
        path: '', // Empty path indicates this is the default child route
        component: TournamentCategoryEditPage, // The component rendered inside the <router-view> in AdminLayout
      }
    ]
  },
  {
    path: '/admin/tournament-arena',
    component: AdminLayout,
    children: [
      { path: '', component: TournamentArenaList }
    ]
    //meta: { requiresAdmin: true }  // for admin-only route
  },
  {
    path: '/admin/tournament-arena/create',
    component: AdminLayout,
    children: [
      { path: '', component: TournamentArenaCreatePage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/tournament-arena/edit/:id',
    name: 'EditArena',
    component: AdminLayout, // This should be the main layout component
    props: true, // This makes the route parameters available as props to your component
    children: [
      {
        path: '', // Empty path indicates this is the default child route
        component: TournamentArenaEditPage, // The component rendered inside the <router-view> in AdminLayout
      }
    ]
  },
  {
    path: '/admin/contact-person',
    component: AdminLayout,
    children: [
      { path: '', component: ContactPersonList }
    ]
    //meta: { requiresAdmin: true }  // for admin-only route
  },
  {
    path: '/admin/contact-person/create',
    component: AdminLayout,
    children: [
      { path: '', component: ContactPersonCreatePage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/contact-person/edit/:id',
    name: 'EditContactPerson',
    component: AdminLayout, // This should be the main layout component
    props: true, // This makes the route parameters available as props to your component
    children: [
      {
        path: '', // Empty path indicates this is the default child route
        component: ContactPersonEditPage, // The component rendered inside the <router-view> in AdminLayout
      }
    ]
  },
  {
    path: '/admin/tournament-schedule',
    component: AdminLayout,
    children: [
      { path: '', component: TournamentScheduleList }
    ]
    //meta: { requiresAdmin: true }  // for admin-only route
  },
  {
    path: '/admin/tournament-schedule/tanding/create',
    component: AdminLayout,
    children: [
      { path: '', component: TournamentScheduleCreatePage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/tournament-schedule/tanding/edit/:id',
    name: 'EditScheduleTanding',
    component: AdminLayout, // This should be the main layout component
    props: true, // This makes the route parameters available as props to your component
    children: [
      {
        path: '', // Empty path indicates this is the default child route
        component: TournamentScheduleEditPage, // The component rendered inside the <router-view> in AdminLayout
      }
    ]
  },

  {
    path: '/admin/tournament-schedule/seni/create',
    component: AdminLayout,
    children: [
      { path: '', component: TournamentScheduleSeniCreatePage }
    ]
    //meta: { requiresAdmin: true }  // admin-only form for menu
  },
  {
    path: '/admin/tournament-schedule/seni/edit/:id',
    name: 'EditScheduleSeni',
    component: AdminLayout, // This should be the main layout component
    props: true, // This makes the route parameters available as props to your component
    children: [
      {
        path: '', // Empty path indicates this is the default child route
        component: TournamentScheduleSeniEditPage, // The component rendered inside the <router-view> in AdminLayout
      }
    ]
  },

  {
    path: '/schedule/:slug/tanding',
    component: MainLayout,
    props: true,
    children: [
      {
        path: '',
        name: 'ScheduleTanding',
        component: () => import('@/main/pages/ScheduleTandingPage.vue'),
        props: true
      }
    ]
  },
  {
    path: '/schedule/:slug/seni',
    component: MainLayout,
    props: true,
    children: [
      {
        path: '',
        name: 'ScheduleSeni',
        component: () => import('@/main/pages/ScheduleSeniPage.vue'),
        props: true
      }
    ]
  },
  {
    path: '/schedule/live/:slug/tanding',
    component: MainLayout,
    props: true,
    children: [
      {
        path: '',
        name: 'ScheduleLiveTanding',
        component: () => import('@/main/pages/ScheduleLiveTandingPage.vue'),
        props: true
      }
    ]
  },
  {
    path: '/schedule/live/:slug/seni',
    component: MainLayout,
    props: true,
    children: [
      {
        path: '',
        name: 'ScheduleLiveSeni',
        component: () => import('@/main/pages/ScheduleLiveSeniPage.vue'),
        props: true
      }
    ]
  }

  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
