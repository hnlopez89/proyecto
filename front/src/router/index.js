import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { isLoggedInBusiness } from '../utils'
import { isLoggedInUser, isLoggedInAdmin } from '../utils'
import { checkIsAdminUser } from '../utils'

Vue.use(VueRouter)

const routes = [
  ////////////////////////////////RUTAS PÚBLICAS///////////////////////////////////////
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      allowAnon: true,
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      allowAnon: true,
    }
  },
  {
    path: '/contact',
    name: 'Contacto',
    component: () => import('../views/Contact.vue'),
    meta: {
      allowAnon: true,
    }
  },
  /*  {
      path: '/help',
      name: 'Help',
      component: () => import('../views/Help.vue'),
      meta: {
        allowAnon: true,
      }
    },*/
  {
    path: '/createbusiness',
    name: 'CreateBusiness',
    component: () => import('../views/Business/CreateBusiness.vue'),
    meta: {
      allowAnon: true,
    }
  },
  {
    path: '/loginbusiness',
    name: 'LogInBusiness',
    component: () => import('../views/Business/LogInBusiness.vue'),
    meta: {
      allowAnon: true,
    }
  },
  {
    path: '/business/ratings/:id',
    name: 'BookingReviews',
    component: () => import('../views/Business/GetRatings.vue'),
    meta: {
      allowAnon: true,
    }
  },
  {
    path: '/createuser',
    name: 'CreateUser',
    component: () => import('../views/User/CreateUser.vue'),
    meta: {
      allowAnon: true,
    }
  },
  {
    path: '/loginuser',
    name: 'LogInUser',
    component: () => import('../views/User/LoginUser.vue'),
    meta: {
      allowAnon: true,
    }
  },
  {
    path: '/business/:id',
    name: 'BusinessProfile',
    component: () => import('../views/search/BusinessProfile.vue'),
    meta: {
      allowAnon: true,
    }
  },
  {
    path: '/user/reset-password',
    name: 'ResetUserPassword',
    component: () => import('../views/User/ResetUserPassword.vue'),
    meta: {
      allowAnon: true,
    }
  },
  {
    path: '/activate',
    name: 'RegisterValidation',
    component: () => import('../views/User/RegisterValidation.vue'),
    meta: {
      allowAnon: true,
    }
  },
  {
    path: '/activateBusiness',
    name: 'RegisterValidationBusiness',
    component: () => import('../views/Business/RegisterValidationBusiness.vue'),
    meta: {
      allowAnon: true,
    }
  },
  {
    path: '/reset-password/business',
    name: 'ResetBusinessPassword',
    component: () => import('../views/Business/ResetBusinessPassword.vue'),
    meta: {
      allowAnon: true,
    }
  },
  ///////////////////////////////RUTAS PRIVADAS - USUARIO ///////////////////////////
  {
    path: '/myprofile',
    name: 'GetUser',
    component: () => import('../views/User/GetUser.vue'),
    meta: {
      allowAnon: false,
    }
  },
  {
    path: '/edituser',
    name: 'EditUser',
    component: () => import('../views/User/EditUser.vue'),
    meta: {
      allowAnon: false,
    }
  },
  {
    path: '/user/mybookinghistoric',
    name: 'BookingUserHistoric',
    component: () => import('../views/Bookings/User/ListUserHistoricBookings.vue'),
    meta: {
      allowAnon: false,
    }
  },
  {
    path: '/user/mybookingconfirmed',
    name: 'BookingUserConfirmed',
    component: () => import('../views/Bookings/User/ListUserBookingsConfirmed.vue'),
    meta: {
      allowAnon: false,
    }
  },
  {
    path: '/user/mybookings',
    name: 'BookingsUser',
    component: () => import('../views/Bookings/User/ListUserBookings.vue'),
    meta: {
      allowAnon: false,
    }
  },
  {
    path: '/user/booking/:id',
    name: 'BookingUser',
    component: () => import('../views/Bookings/User/UserBooking.vue'),
    meta: {
      allowAnon: false,
    }
  },
  ////////////////////////////////////RUTAS PRIVADAS - BUSINESS //////////////////////
  {
    path: '/mybusiness',
    name: 'GetBusiness',
    component: () => import('../views/Business/GetBusiness.vue'),
    meta: {
      allowAnon: false,
    }
  },
  {
    path: '/editbusiness',
    name: 'EditBusiness',
    component: () => import('../views/Business/EditBusiness.vue'),
    meta: {
      allowAnon: false,
    }
  },
  {
    path: '/editbusiness/pictures',
    name: 'EditPicturesBusiness',
    component: () => import('../views/Business/EditPicturesBusiness.vue'),
    meta: {
      allowAnon: false,
    }
  },
  {
    path: '/mybusiness/mybookingtoday',
    name: 'BookingBusinessToday',
    component: () => import('../views/Bookings/Business/ListBusinessBookingsToday.vue'),
    meta: {
      allowAnon: false,
    }
  },
  {
    path: '/mybusiness/mybookingtomorrow',
    name: 'BookingBusinessTomorrow',
    component: () => import('../views/Bookings/Business/ListBusinessBookingsTomorrow.vue'),
    meta: {
      allowAnon: false,
    }
  },
  {
    path: '/mybusiness/mybookings',
    name: 'BookingsBusiness',
    component: () => import('../views/Bookings/Business/ListBusinessBookings.vue'),
    meta: {
      allowAnon: false,
    }
  },

  {
    path: '/business/booking/:id',
    name: 'BookingBusiness',
    component: () => import('../views/Bookings/Business/BusinessBooking.vue'),
    meta: {
      allowAnon: false,
    }
  },
  {
    path: '/business_availability',
    name: 'CheckAvailability',
    component: () => import('../views/Business/CheckAvailability.vue'),
    meta: {
      allowAnon: false,
    }
  },
  ////////////////////////////////// ADMIN /////////////////////////////
  {
    path: '/check_business/:id',
    name: 'CheckBusiness',
    component: () => import('../views/Admin/CheckBusiness.vue'),
    meta: {
      allowAnon: false,
      onlyAdmin: true
    },
    beforeEnter: (to, from, next) => {
      if (to.meta.onlyAdmin === true && !checkIsAdminUser()) {
        next({
          path: '/home',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    }
  },
  {
    path: '/list_business',
    name: 'ListBusiness',
    component: () => import('../views/Admin/ListBusiness.vue'),
    meta: {
      allowAnon: false,
      onlyAdmin: true
    },
    beforeEnter: (to, from, next) => {
      if (to.meta.onlyAdmin === true && !checkIsAdminUser()) {
        next({
          path: '/home',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    }
  },
  {
    path: '/list_business/pending',
    name: 'ListBusinessPending',
    component: () => import('../views/Admin/ListBusinessPending.vue'),
    meta: {
      allowAnon: false,
      onlyAdmin: true
    },
    beforeEnter: (to, from, next) => {
      if (to.meta.onlyAdmin === true && !checkIsAdminUser()) {
        next({
          path: '/home',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    }
  },
  {
    path: '/list_business/bad_reviews',
    name: 'ListBusinessBadReviews',
    component: () => import('../views/Admin/ListBusinessBadReviews.vue'),
    meta: {
      allowAnon: false,
      onlyAdmin: true
    },
    beforeEnter: (to, from, next) => {
      if (to.meta.onlyAdmin === true && !checkIsAdminUser()) {
        next({
          path: '/home',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    }
  },
  {
    path: '/list_users',
    name: 'ListUsers',
    component: () => import('../views/Admin/ListUsers.vue'),
    meta: {
      allowAnon: false,
      onlyAdmin: true
    },
    beforeEnter: (to, from, next) => {
      if (to.meta.onlyAdmin === true && !checkIsAdminUser()) {
        next({
          path: '/home',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    }
  },
  {
    path: '/check_user/:id',
    name: 'CheckUser',
    component: () => import('../views/Admin/CheckUser.vue'),
    meta: {
      allowAnon: false,
      onlyAdmin: true
    },
    beforeEnter: (to, from, next) => {
      if (to.meta.onlyAdmin === true && !checkIsAdminUser()) {
        next({
          path: '/home',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    }
  },
  {
    path: '/list_bookings/',
    name: 'ListBookings',
    component: () => import('../views/Admin/ListBookings.vue'),
    meta: {
      allowAnon: false,
      onlyAdmin: true
    },
    beforeEnter: (to, from, next) => {
      if (to.meta.onlyAdmin === true && !checkIsAdminUser()) {
        next({
          path: '/home',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    }
  },
  {
    path: '/list_bookings/pending',
    name: 'ListBookingsPending',
    component: () => import('../views/Admin/ListBookingsPending.vue'),
    meta: {
      allowAnon: false,
      onlyAdmin: true
    },
    beforeEnter: (to, from, next) => {
      if (to.meta.onlyAdmin === true && !checkIsAdminUser()) {
        next({
          path: '/home',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    }
  },

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (!to.meta.allowAnon && !isLoggedInUser() && !isLoggedInUser() && !isLoggedInBusiness()) {
    next({
      path: "/home",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
})

export default router
