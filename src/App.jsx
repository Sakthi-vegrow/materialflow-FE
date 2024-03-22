import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "./pages/index";
import { GraphView } from "./pages/GraphView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/graph" element={<GraphView />} />
      </Routes>
    </Router>
  );
}

export default App;
