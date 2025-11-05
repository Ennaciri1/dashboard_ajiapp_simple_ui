import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App';
import Dashboard from '../page/dashboard/Dashboard';
import Features from '../page/features/Features';
import Settings from '../page/Settings/Settings';
import Profile from '../page/Profile/Profile';
import TouristSpots from '../page/services/tourist-spots/TouristSpots';
import FormSpots from '../features/touristSpots/FormSpots';
import Hotels from '../page/services/hotels/Hotels';
import FormHotel from '../features/hotels/FormHotel';
import Stadiums from '../page/services/stadiums/Stadiums';
import FormStadium from '../features/stadiums/FormStadium';
import Cities from '../page/services/cities/Cities';
import FormCity from '../features/cities/FormCity';
import ReviewsPage from '../presentation/pages/ReviewsPage';
import FormReview from '../features/reviews/FormReview';
import Contact from '../page/services/contact/Contact';
import FormContact from '../features/contacts/FormContact';
import Visa from '../page/services/visa/Visa';
import FormVisa from '../features/visas/FormVisa';
import Languages from '../page/services/languages/Languages';
import FormLanguage from '../features/languages/FormLanguage';
import Translations from '../page/services/translations/Translations';
import Activities from '../page/services/activities/Activities';
import PortalUsers from '../page/users/portal/PortalUsers';
import FormActivityUser from '../features/portalUsers/FormActivityUser';
import Login from '../page/auth/Login';
import NotFound from '../page/errors/NotFound';
import { ProtectedRoute } from '../components/common';

const router = createBrowserRouter(
 createRoutesFromElements(
    <>
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<App />}>
        {/* Main Routes */}
        <Route index element={<Dashboard />} />
        <Route path="features" element={<Features />} />
        
        {/* Service Routes */}
        <Route path="services/tourist-spots" element={<TouristSpots />} />
        <Route path="services/tourist-spots/formSpots" element={<FormSpots />} />
        <Route path="services/tourist-spots/edit/:id" element={<FormSpots />} />
        <Route path="services/hotels" element={<Hotels />} />
        <Route path="services/hotels/formHotel" element={<FormHotel />} />
        <Route path="services/hotels/edit/:id" element={<FormHotel />} />
        <Route path="services/stadiums" element={<Stadiums />} />
        <Route path="services/stadiums/formStadium" element={<FormStadium />} />
        <Route path="services/stadiums/edit/:id" element={<FormStadium />} />
        <Route path="services/cities" element={<Cities />} />
        <Route path="services/cities/formCity" element={<FormCity />} />
        <Route path="services/cities/edit/:id" element={<FormCity />} />
        <Route path="services/reviews" element={<ReviewsPage />} />
        <Route path="services/reviews/formReview" element={<FormReview />} />
        <Route path="services/reviews/edit/:id" element={<FormReview />} />
        <Route path="services/contact" element={<Contact />} />
        <Route path="services/contact/formContact" element={<FormContact />} />
        <Route path="services/visa" element={<Visa />} />
        <Route path="services/visa/formVisa" element={<FormVisa />} />
        <Route path="services/visa/edit/:id" element={<FormVisa />} />
        <Route path="services/languages" element={<Languages />} />
        <Route path="services/languages/formLanguage" element={<FormLanguage />} />
        <Route path="services/languages/edit/:id" element={<FormLanguage />} />
        <Route path="services/translations" element={<Translations />} />
        <Route path="services/activities" element={<Activities />} />
        
        {/* User Routes */}
        <Route path="users/portal/activities" element={<PortalUsers />} />
        <Route path="users/portal/activities/add-user" element={<FormActivityUser />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        
        {/* 404 - Catch all unmatched routes within protected routes */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Route>
    
    {/* 404 for unprotected routes (like /login/invalid) */}
    <Route path="*" element={<NotFound />} />
    </>
  )
  );

  export default router;
