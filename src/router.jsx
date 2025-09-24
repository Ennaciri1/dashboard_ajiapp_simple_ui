import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App';
import Dashboard from './page/dashboard/Dashboard';
import Features from './page/features/Features';
import Paramètres from './page/Paramètres/Paramètres';
import Profil from './page/Profil/Profil';
import TouristSpots from './page/services/tourist-spots/TouristSpots';
import FormSpots from './features/touristSpots/FormSpots';
import Hotels from './page/services/hotels/Hotels';
import FormHotel from './features/hotels/FormHotel';
import Cities from './page/services/cities/Cities';
import FormCity from './features/cities/FormCity';
import Reviews from './page/services/reviews/Reviews';
import FormReview from './features/reviews/FormReview';
import Contact from './page/services/contact/Contact';
import FormContact from './features/contacts/FormContact';
import Visa from './page/services/visa/Visa';
import FormVisa from './features/visas/FormVisa';
import Login from './page/auth/Login';
import { ProtectedRoute } from './components/common';

const router = createBrowserRouter(
 createRoutesFromElements(
    <>
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<App />}>
        {/* Routes principales */}
        <Route index element={<Dashboard />} />
        <Route path="features" element={<Features />} />
        
        {/* Routes Services */}
        <Route path="services/tourist-spots" element={<TouristSpots />} />
        <Route path="services/tourist-spots/formSpots" element={<FormSpots />} />
        <Route path="services/hotels" element={<Hotels />} />
        <Route path="services/hotels/formHotel" element={<FormHotel />} />
        <Route path="services/cities" element={<Cities />} />
        <Route path="services/cities/formCity" element={<FormCity />} />
        <Route path="services/reviews" element={<Reviews />} />
        <Route path="services/reviews/formReview" element={<FormReview />} />
        <Route path="services/contact" element={<Contact />} />
        <Route path="services/contact/formContact" element={<FormContact />} />
        <Route path="services/visa" element={<Visa />} />
        <Route path="services/visa/formVisa" element={<FormVisa />} />
        
        {/* Routes existantes */}
        <Route path="paramètres" element={<Paramètres />} />
        <Route path="profil" element={<Profil />} />
      </Route>
    </Route>
    </>
  )
  );

  export default router;
