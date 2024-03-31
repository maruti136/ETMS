import React, { useContext, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Flex, Button, Spacer } from "@chakra-ui/react";
import { UserContext } from "../UserContext";
import CsvUploadDrawer from "./CsvUploader";

const NavBar = () => {
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);
  const [isCsvDrawerOpen, setIsCsvDrawerOpen] = useState(false);
  const [uploadApi, setUploadApi] = useState("http://localhost:3000/user");

  const handleLogout = () => {
    // Perform logout actions (e.g., clear local storage, redirect to login page)
    navigate("/login"); // Redirect to login page after logout
  };

  const handleInternPlanClick = () => {
    navigate("/intern-plan");
  };

  const handleScheduleClick = () => {
    navigate(
      `${
        userDetails.type === "int" ? "/intern-schedule" : "/employee-schedule"
      }`
    );
  };

  const handleCreateUserClick = () => {
    setIsCsvDrawerOpen(true);
    setUploadApi("http://localhost:3000/user");
  };

  const handleUploadPerformanceClick = () => {
    setIsCsvDrawerOpen(true);
    setUploadApi("http://localhost:3000/performance");
  };

  const handlePerformanceClick = () => {
    navigate("/performance");
  };

  const handleCloseCsvDrawer = () => {
    setIsCsvDrawerOpen(false);
  };

  return (
    <>
      <Flex bg="teal.500" p={4} alignItems="center">
        <Box>
          {userDetails && userDetails.type === "admin" ? (
            <>
              <Button onClick={handleCreateUserClick} mr={4}>
                Create User
              </Button>
              <Button onClick={handleInternPlanClick} mr={4}>
                Intern Plan
              </Button>
              <Button onClick={handleUploadPerformanceClick} mr={4}>
                Upload Performance
              </Button>
              <Button onClick={handlePerformanceClick} mr={4}>
                Performance
              </Button>
              <Button as={RouterLink} to="/employee-plan" mr={4}>
                Employee Plan
              </Button>
            </>
          ) : (
            <Button onClick={handleScheduleClick} mr={4}>
              Schedule
            </Button>
          )}
          <Button as={RouterLink} to="/profile" mr={4}>
            Profile
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </Box>
        <Spacer />
      </Flex>
      <CsvUploadDrawer
        isOpen={isCsvDrawerOpen}
        onClose={handleCloseCsvDrawer}
        uploadApi={uploadApi}
      />
    </>
  );
};

export default NavBar;
