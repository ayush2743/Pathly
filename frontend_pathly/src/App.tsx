import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import RoadmapPage from "./pages/RoadmapPage"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/roadmap/:skillId" element={<RoadmapPage />} />
      </Routes>
    </Router>
  )
}
