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

const PerformanceUploadDrawer = ({ isOpen, onClose }) => {
  const [csvFile, setCsvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  const handleCsvChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!csvFile) {
      toast({
        title: "No CSV file selected",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUploading(true);

    try {
      const parsedData = await parseCsvFile(csvFile);
      await sendDataToApi(parsedData);
      toast({
        title: "Uploaded",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error("Failed to upload:", error);
      toast({
        title: "Upload Failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
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
      const response = await axios.post("/api/upload-performance", data);
      console.log(response.data);
    } catch (error) {
      throw new Error("Failed to upload performance");
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
          <Button
            colorScheme="blue"
            onClick={handleUpload}
            isLoading={isUploading}
          >
            Upload
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PerformanceUploadDrawer;
