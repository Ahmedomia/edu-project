import { Routes, Route } from "react-router-dom";
import LandingPage from "../Pages/LandingPage";
import MainpageTeachers from "../Pages/MainpageTeachers";
import Mainpagecompany from "../Pages/MainpageCompany";
import Login from "../Pages/LoginPage";
import Register from "../Pages/Register";
import Profile from "../Pages/Profile";
import PostJob from "../Pages/PostJop";
import TeachersDatabase from "../Pages/TeacherDatabase";
import CompanyProfile from "../Pages/CompanyProfile";
import JobSearch from "../Pages/JobSearch";
import TeacherProfile from "../Pages/TeacherProfile";
import ApplicantProfile from "../Pages/ApplicantProfile";
import CompanyDatabase from "../Pages/CompanyDatabase";
import CompanyDetail from "../Pages/CompanyDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/TeacherDashBoard" element={<MainpageTeachers />} />
      <Route path="/CompanyDashBoard" element={<Mainpagecompany />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/PostJop" element={<PostJob />} />
      <Route path="/TeacherDatabase" element={<TeachersDatabase />} />
      <Route path="/CompanyDatabase" element={<CompanyDatabase />} />
      <Route path="/CompanyProfile" element={<CompanyProfile />} />
      <Route path="/company/:email" element={<CompanyDetail />} />
      <Route path="/JobSearch" element={<JobSearch />} />
      <Route path="/teacher/:email" element={<TeacherProfile />} />
      <Route path="/applicant/:applicationId" element={<ApplicantProfile />} />
    </Routes>
  );
}

export default App;
