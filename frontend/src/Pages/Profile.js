import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import NavBar from "./NavBar";
import { UserContext } from "../UserContext";
import axios from "axios";

const Profile = () => {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [updatedDetails, setUpdatedDetails] = useState({ ...userDetails });
  const [isEdited, setIsEdited] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Fetch user details from the API when component mounts
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(token); // Assuming you store the JWT token in localStorage
        const response = await axios.get("http://localhost:3000/user-details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setUserDetails(response.data);
        setUpdatedDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUserDetails();
  }, [setUserDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails({ ...updatedDetails, [name]: value });
    setIsEdited(true);
  };

  const handleUpdateDetails = async (name) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/personal-info/intern1@gmail.com`,
        { [name]: updatedDetails[name] }
      );
      setUserDetails(response.data.data);
      setUpdatedDetails(response.data.data);
      toast({
        title: "Details Updated",
        description: "Your details have been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsEdited(false);
    } catch (error) {
      console.error("Failed to update details:", error.response.data.error);
      toast({
        title: "Error",
        description: "Failed to update details. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <NavBar />
      <Box p={5}>
        <Box mb={5}>
          <Heading as="h2" mb={3} textAlign="center">
            Profile
          </Heading>
          {userDetails && (
            <Stack spacing={5} direction="row" flexWrap="wrap">
              <EditableField
                label="Phone Number"
                name="phoneNumber"
                value={updatedDetails.phoneNumber || ""}
                onChange={handleInputChange}
                handleUpdateDetails={handleUpdateDetails}
              />
              <EditableField
                label="LinkedIn Profile"
                name="linkedInProfile"
                value={updatedDetails.linkedInProfile || ""}
                onChange={handleInputChange}
                handleUpdateDetails={handleUpdateDetails}
              />
              <EditableField
                label="Skills"
                name="skills"
                value={updatedDetails.skills || ""}
                onChange={handleInputChange}
                handleUpdateDetails={handleUpdateDetails}
              />
              <EditableField
                label="Location"
                name="location"
                value={updatedDetails.location || ""}
                onChange={handleInputChange}
                handleUpdateDetails={handleUpdateDetails}
              />
              <EditableField
                label="College Name"
                name="collegeName"
                value={updatedDetails.collegeName || ""}
                onChange={handleInputChange}
                handleUpdateDetails={handleUpdateDetails}
              />
              <EditableField
                label="Program"
                name="program"
                value={updatedDetails.program || ""}
                onChange={handleInputChange}
                handleUpdateDetails={handleUpdateDetails}
              />
              <EditableField
                label="Stream"
                name="stream"
                value={updatedDetails.stream || ""}
                onChange={handleInputChange}
                handleUpdateDetails={handleUpdateDetails}
              />
            </Stack>
          )}
        </Box>
      </Box>
    </>
  );
};

const EditableField = ({
  label,
  name,
  value,
  onChange,
  handleUpdateDetails,
}) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={5}
      width="calc(33.3333% - 20px)"
      minW="200px"
    >
      <Text fontWeight="bold" mb={3}>
        {label}:
      </Text>
      <Stack direction="row" alignItems="center" spacing={5}>
        <Input
          name={name}
          value={value}
          onChange={onChange}
          placeholder="Add data"
          borderRadius="none"
          px={2}
          py={1}
        />
        <Button
          colorScheme="blue"
          size="sm"
          onClick={() => handleUpdateDetails(name)}
        >
          Update
        </Button>
      </Stack>
    </Box>
  );
};

export default Profile;
