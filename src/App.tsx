import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AppSidebar from "./components/AppSidebar"
import Navbar from "./components/Navbar"
import CustomCursor from "./components/CustomCursor"

import Dashboard from "./pages/Dashboard"
import ManageJournal from "./pages/ManageJournal"
import ManageMood from "./pages/ManageMood"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

function App() {
   const queryClient = new QueryClient();
  return (
     <QueryClientProvider client={queryClient}>
       <CustomCursor />
    <Router>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <main className="flex-1 w-full">
          <Navbar />

          <Routes>
            {/* Default / Dashboard */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Journal */}
            <Route path="/journal" element={<ManageJournal />} />

            {/* Mood */}
            <Route path="/mood" element={<ManageMood />} />
          </Routes>
        </main>
      </div>
    </Router>
    </QueryClientProvider>
  )
}

export default App
