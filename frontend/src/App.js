// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Login from "./Pages/Login";
// import AdminPage from "./Pages/AdminPage";
// import UserPage from "./Pages/UserPage";
// import SendEmail from "./Pages/SendEmail";
// import ResetPassword from "./Pages/ResetPassword";
// import Profile from "./Pages/Profile";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/admin" element={<AdminPage />} />
//         <Route path="/user" element={<UserPage />} />
//         <Route path="/send-email" element={<SendEmail />} />
//         <Route path="/reset-password/:token" element={<ResetPassword />} />

//         {/* Redirect user to the login page if route does not exist and user is not logged in */}
//         <Route render={() => <h1>Page not found</h1>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./UserContext";
import Login from "./Pages/Login";
import ResetPassword from "./Pages/ResetPassword";
import Profile from "./Pages/Profile";
import PerformancePage from "./Pages/PerformancePage";
import IntCalendar from "./Pages/CalendarInt"; // Import the Calendar component
import EmpCalendar from "./Pages/CalendarEmp"; // Import the Calendar component

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/calendar" element={<Calendar />} /> */}
          <Route path="/intern-schedule" element={<IntCalendar />} />
          <Route path="/employee-schedule" element={<EmpCalendar />} />
          <Route path="/performance" element={<PerformancePage />} />

          <Route path="/intern-plan" element={<IntCalendar />} />
          <Route path="/employee-plan" element={<EmpCalendar />} />

          {/* Add this route for Calendar */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Redirect user to the login page if route does not exist and user is not logged in */}
          <Route render={() => <h1>Page not found</h1>} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
