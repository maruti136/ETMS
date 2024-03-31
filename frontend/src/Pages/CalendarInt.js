import React, { useState, useEffect, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
} from "@chakra-ui/react";
import axios from "axios";
import { UserContext } from "../UserContext";

const IntCalendar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scheduleDetails, setScheduleDetails] = useState({
    date: "",
    time: "",
    trainingName: "",
    trainerName: "",
  });
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const toast = useToast();
  const { userDetails: contextUserDetails } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(
    () => JSON.parse(localStorage.getItem("userDetails")) || contextUserDetails
  );
  const [popoverContent, setPopoverContent] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState({});

  useEffect(() => {
    setUserDetails(contextUserDetails);
    localStorage.setItem("userDetails", JSON.stringify(contextUserDetails));
  }, [contextUserDetails]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/intSchedules");
      setEvents(
        response.data.map((event) => ({
          title: "Training", // Initial placeholder text
          start: new Date(event.date),
          time: event.time,
          trainingName: event.planName,
          trainerName: event.trainerName,
          color: new Date(event.date) < new Date() ? "gray" : "orange",
        }))
      );
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleDateClick = (info) => {
    setScheduleDetails({ ...scheduleDetails, date: info.dateStr });
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleDetails({ ...scheduleDetails, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.post(
        "http://localhost:3000/internal-training-plan",
        scheduleDetails
      );
      fetchEvents();
      toast({
        title: "Schedule saved successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast({
        title: "Failed to save schedule. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsOpen(false);
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);

    // Show popover for event details
    const { extendedProps } = info.event;
    const popoverContent = (
      <PopoverContent>
        <PopoverHeader
          bg="blue.500"
          color="white"
          fontWeight="bold"
          fontSize="lg"
          textAlign="center"
        >
          {extendedProps.trainingName}
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <p>
            <strong>Time:</strong> {extendedProps.time}
          </p>
          <p>
            <strong>Trainer:</strong> {extendedProps.trainerName}
          </p>
        </PopoverBody>
      </PopoverContent>
    );
    setPopoverContent(popoverContent);

    // Set popover position
    setPopoverPosition({
      top: `${info.jsEvent.clientY}px`,
      left: `${info.jsEvent.clientX}px`,
    });
  };

  const renderCalendar = () => {
    if (userDetails && userDetails.type === "admin") {
      return (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          events={events}
          eventClick={handleEventClick}
        />
      );
    } else {
      return (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          editable={false} // Disable editing for non-admin users
        />
      );
    }
  };

  return (
    <>
      {renderCalendar()}
      {popoverContent && (
        <Popover
          isOpen={true}
          onClose={() => setPopoverContent(null)}
          placement="bottom"
          closeOnBlur={true}
          style={{
            transform: "translate(-50%, -50%)",
            maxWidth: "400px", // Set maximum width
            height: "200px",
            padding: "40px", // Add padding
            background: "#FFFFFF", // Set background color
            borderRadius: "8px", // Add border radius
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add box shadow
            color: "#333333", // Set text color
            // fontFamily: "Arial, sans-serif", // Set font family
          }}
        >
          <PopoverTrigger>
            <div style={{ display: "none" }}>Hidden Trigger</div>
          </PopoverTrigger>
          {popoverContent}
        </Popover>
      )}
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Schedule</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Date</FormLabel>
              <Input
                type="text"
                name="date"
                value={scheduleDetails.date}
                isReadOnly
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Time</FormLabel>
              <Input
                type="text"
                name="time"
                value={scheduleDetails.time}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Training Name</FormLabel>
              <Input
                type="text"
                name="trainingName"
                value={scheduleDetails.trainingName}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Trainer Name</FormLabel>
              <Input
                type="text"
                name="trainerName"
                value={scheduleDetails.trainerName}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default IntCalendar;
