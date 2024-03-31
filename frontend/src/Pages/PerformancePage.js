import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

const PerformancePage = () => {
  const [internData, setInternData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPerformanceData = async (api) => {
    try {
      const response = await axios.get(api);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch performance data:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchInternPerformance = async () => {
      const data = await fetchPerformanceData(
        "http://localhost:3000/getPerformance/intern"
      );
      setInternData(data);
    };

    const fetchEmployeePerformance = async () => {
      const data = await fetchPerformanceData(
        "http://localhost:3000/getPerformance/employee"
      );
      setEmployeeData(data);
    };

    fetchInternPerformance();
    fetchEmployeePerformance();
  }, []);

  const handleTabChange = (index) => {
    if (index === 0) {
      setSelectedData(internData);
    } else {
      setSelectedData(employeeData);
    }
  };

  const handleCardHover = (data) => {
    setSelectedData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Tabs onChange={handleTabChange}>
      <TabList>
        <Tab>Intern</Tab>
        <Tab>Employee</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
            gap={4}
          >
            {internData.map((data) => (
              <Box
                key={data.fullName}
                p={4}
                border="1px solid gray"
                borderRadius="md"
                cursor="pointer"
                onClick={() => handleCardHover(data)}
              >
                {data.fullName}
              </Box>
            ))}
          </Box>
        </TabPanel>
        <TabPanel>
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
            gap={4}
          >
            {employeeData.map((data) => (
              <Box
                key={data.fullName}
                p={4}
                border="1px solid gray"
                borderRadius="md"
                cursor="pointer"
                onClick={() => handleCardHover(data)}
              >
                {data.fullName}
              </Box>
            ))}
          </Box>
        </TabPanel>
      </TabPanels>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Performance Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedData && (
              <Box>
                <Box fontWeight="bold">Name: {selectedData.fullName}</Box>
                <Box mt={2} fontWeight="bold">
                  Scores:
                </Box>
                <Box mt={1}>
                  {selectedData.score &&
                    Object.entries(selectedData.score).map(
                      ([topic, scores]) => (
                        <Box key={topic} mt={1}>
                          {topic}: {scores.join(", ")}
                        </Box>
                      )
                    )}
                </Box>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Tabs>
  );
};

export default PerformancePage;
