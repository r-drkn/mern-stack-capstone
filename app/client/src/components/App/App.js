import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import Navbar from "../Navbar/Navbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import MainContainer from "../MainContainer/MainContainer";
import Home from "../../pages/Home/Home";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SignUp from "../../pages/SignUp/SignUp";
import Cart from "../../pages/Cart/Cart";
import Contact from "../../pages/Contact/Contact";
import Footer from "../Footer/Footer";
import News from "../../pages/News/News";

const App = () => {
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <MainContainer>
          <Router>
            <Switch>
              <Route path="/signup" component={SignUp} />
              <Route path="/cart" component={Cart} />
              <Route path="/contact" component={Contact} />
              <Route path="/news" component={News} />
              <Route exact path="/" component={Home} />
            </Switch>
          </Router>
        </MainContainer>
        <Footer />
      </ThemeProvider>
    </React.Fragment>
  );
};

export default App;
