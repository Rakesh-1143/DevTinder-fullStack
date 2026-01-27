import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Auth from "./components/Auth";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import store from "./utils/appstore";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body></Body>}>
              <Route index={true} element={<Auth></Auth>} />
              <Route path="/feed" element={<Feed></Feed>}></Route>
              <Route path="/profile" element={<Profile></Profile>} />
              <Route
                path="/connections"
                element={<Connections></Connections>}
              />
              <Route path="/requests" element={<Requests></Requests>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
