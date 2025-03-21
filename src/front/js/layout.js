import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import LandingPage from "./pages/landingpage";
import { ResetPasswordForm } from "./pages/ResetPasswordForm";
import { EditProfile } from "./pages/EditProfile";
// import { Habits } from "./pages/habits";
import { Loginview } from "./pages/loginview";
import { ResetPassword } from "./pages/resetpassword";
import { Home } from "./pages/home";
//import { Demo } from "./pages/demo";
//import { Single } from "./pages/single";
import injectContext from "./store/appContext";
import { Profile } from "./pages/profile";
import { Notes } from "./pages/notes";
import { Register } from "./pages/register";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Pomodoro } from "./component/pomodoro";
import HabitTracker from "./pages/habit-tracker";
import Projects from "./pages/projects";
import { ContactUs } from "./pages/ContactUs";
//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;
    return (
        <div>
            <HashRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        {/* <Route element={<Home />} path="/" /> */}
                        <Route element={<Loginview />} path="/login" />
                        <Route element={<ResetPassword />} path="/resetpassword" />
                        <Route element={<Notes />} path="/notes" />
                        {/* <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" /> */}
                        <Route element={<h1>Not found!</h1>} />
                        <Route element={<Profile />} path="/profile" />
                        <Route element={<LandingPage />} path="/" />
                        <Route element={<Register />} path="/register" />
                        <Route element={<EditProfile />} path="/editprofile" />
                        <Route element={<Pomodoro />} path="/pomodoro" />
                        <Route element={<HabitTracker />} path="/habits" />
                        <Route element={<Projects />} path="/projects" />
                        <Route element={<ResetPasswordForm />} path="/reset-password/:token" />
                        <Route element={<ContactUs />} path="/contactus" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </HashRouter>
        </div>
    );
};
export default injectContext(Layout);