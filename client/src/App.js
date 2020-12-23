import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/authentication/Register";
import Login from "./components/authentication/Login";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navbar />
          <Route exact path="/" component={Landing} /> 
          <div className="container">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </div>
          <Footer />
        </header>
      </div>
    </Router>
  );
}

export default App;
