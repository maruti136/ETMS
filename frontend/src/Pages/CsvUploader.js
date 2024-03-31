import React, { useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";
import Papa from "papaparse";
import axios from "axios";

const CsvUploadDrawer = ({ isOpen, onClose, uploadApi }) => {
  const [csvFile, setCsvFile] = useState(null);
  const toast = useToast();

  const handleCsvChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleNext = async () => {
    if (!csvFile) {
      toast({
        title: "No CSV file selected",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const parsedData = await parseCsvFile(csvFile);
      await sendDataToApi(parsedData);
      toast({
        title: "Created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error("Failed to create:", error);
      toast({
        title: "Failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const parseCsvFile = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          resolve(result.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  const sendDataToApi = async (data) => {
    try {
      const response = await axios.post(uploadApi, { file: data });
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to create");
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Upload CSV File</DrawerHeader>

        <DrawerBody>
          <Input type="file" onChange={handleCsvChange} />
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleNext}>
            Next
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CsvUploadDrawer;
