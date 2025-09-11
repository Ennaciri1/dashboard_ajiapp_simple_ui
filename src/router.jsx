import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { createRoutesFromElements, Route } from "react-router-dom";
import Dashboard from "./page/dashboard/Dashboard";
import Features from "./page/features/Features";
import Paramètres from "./page/Paramètres/Paramètres";
import Profil from "./page/Profil/Profil";
import TouristSpots from "./page/services/tourist-spots/TouristSpots";
import FormSpots from "./page/services/tourist-spots/components/FormSpots";
import Hotels from "./page/services/hotels/Hotels";
import FormHotel from "./page/services/hotels/components/FormHotel";

const router = createBrowserRouter(
 createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Routes principales */}
      <Route index element={<Dashboard />} />
      <Route path="features" element={<Features />} />
      
      {/* Routes Services */}
      <Route path="services/tourist-spots" element={<TouristSpots />} />
      <Route path="services/tourist-spots/formSpots" element={<FormSpots />} />
      <Route path="services/hotels" element={<Hotels />} />
      <Route path="services/hotels/formHotel" element={<FormHotel />} />
      
      {/* Routes existantes */}
      <Route path="paramètres" element={<Paramètres />} />
      <Route path="profil" element={<Profil />} />
    </Route>
  )
  );

  export default router;