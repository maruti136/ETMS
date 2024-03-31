// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Flex, Box, Heading, Input, Button } from "@chakra-ui/react";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:3000/login", {
//         email,
//         password,
//       });
//       console.log(response);
//       const data = response.data;
//       alert(data.message);
//       // Redirect to profile page with user information as route state
//       console.log(data.info);
//       navigate("/profile", { state: { userInfo: data.info } });
//     } catch (error) {
//       alert("Login failed");
//     }
//   };

//   return (
//     <Flex
//       minHeight="100vh"
//       alignItems="center"
//       justifyContent="center"
//       backgroundColor="#dee2e6"
//     >
//       <Box
//         p="8"
//         maxWidth="sm"
//         borderWidth="1px"
//         borderRadius="lg"
//         backgroundColor="#b8c0ff"
//         boxShadow="md"
//         height="auto"
//       >
//         <Heading as="h2" size="xl" mb="6" color="#003049">
//           Login
//         </Heading>
//         <form onSubmit={handleSubmit}>
//           <Input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             required
//             mb="3"
//             bg="#457b9d"
//             border="1px solid #a8dadc"
//             _focus={{ borderColor: "#003049" }}
//           />
//           <Input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             required
//             mb="3"
//             bg="#457b9d"
//             border="1px solid #a8dadc"
//             _focus={{ borderColor: "#003049" }}
//           />
//           <Button
//             type="submit"
//             colorScheme="blue"
//             mt="4"
//             backgroundColor="#003049"
//             _hover={{ backgroundColor: "#001e2c" }}
//           >
//             Login
//           </Button>
//         </form>
//       </Box>
//     </Flex>
//   );
// };

// export default LoginPage;

// src/components/Login.js
// src/components/Login.js
// Login.js
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const { setUserDetails } = useContext(UserContext);

  const handleLogin = async () => {
    try {
      // Make API call to login endpoint
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      // Handle successful login
      console.log("Login successful:", response.data);
      toast({
        title: "Login Successful",
        description: "You have been logged in successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      localStorage.setItem("token", response.data.token);

      // Make another Axios call to fetch user details
      const userDetailsResponse = await axios.get(
        "http://localhost:3000/user-details",
        {
          headers: {
            Authorization: `Bearer ${response.data.token}`, // Send JWT token in the request header
          },
        }
      );

      // Set user details in context
      setUserDetails(userDetailsResponse.data);

      // Navigate to profile page
      navigate("/profile");
    } catch (error) {
      // Handle login failure
      console.error("Login failed:", error.response.data.error);
      toast({
        title: "Login Failed",
        description: error.response.data.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={20} p={5} borderWidth="1px" borderRadius="lg">
      <Heading as="h2" mb={5} textAlign="center">
        Login
      </Heading>
      <FormControl mb={3}>
        <FormLabel>Email address</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleLogin} mt={3} w="100%">
        Login
      </Button>
    </Box>
  );
};

export default Login;
