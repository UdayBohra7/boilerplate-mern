import "flatpickr/dist/themes/material_red.css";
import "./App.css";

import { AppProvider } from "@/providers/app";
import { AppRoutes } from "@/routes";

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
