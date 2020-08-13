import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { isLoggedInBusiness } from '../utils'
import { isLoggedInUser } from '../utils'
import { checkIsAdmin } from '../utils'

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
  {
    path: '/help',
    name: 'Help',
    component: () => import('../views/Help.vue'),
    meta: {
      allowAnon: true,
    }
  },
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
    path: '/business/reset-password',
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
    path: '/edituserpassword',
    name: 'EditUserPassword',
    component: () => import('../views/User/EditUserPassword.vue'),
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
    path: '/editbusinesspassword',
    name: 'EditBusinessPassword',
    component: () => import('../views/Business/EditBusinessPassword.vue'),
    meta: {
      allowAnon: false,
    }
  },

  {
    path: '/business/mybookingtoday',
    name: 'BookingBusinessToday',
    component: () => import('../views/Bookings/Business/ListBusinessBookingsToday.vue'),
    meta: {
      allowAnon: false,
    }
  },
  {
    path: '/business/mybookingtomorrow',
    name: 'BookingBusinessTomorrow',
    component: () => import('../views/Bookings/Business/ListBusinessBookingsTomorrow.vue'),
    meta: {
      allowAnon: false,
    }
  },
  {
    path: '/business/mybookings',
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
    path: '/business/availability',
    name: 'CheckAvailability',
    component: () => import('../views/Business/CheckAvailability.vue'),
    meta: {
      allowAnon: false,
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
