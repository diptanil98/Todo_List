import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TodoApp from "./todo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TodoApp />} />
      </Routes>
    </Router>
  );
}

export default App;
