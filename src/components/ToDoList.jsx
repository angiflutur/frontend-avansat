import React, { useEffect, useReducer, useState } from "react";
import {
  Box,
  Button,
  useColorModeValue,
  useDisclosure,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  IconButton,
  HStack,
  Checkbox,
  Text,
  Badge,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import TaskForm from "./TaskForm"; // Asigură-te că importul reflectă calea corectă

const todoReducer = (state, action) => {
  switch (action.type) {
    case "setTasks":
      return [...action.payload];
    case "addTask":
      return [...state, action.payload];
    case "removeTask":
      return state.filter((task) => task.id !== action.payload);
    case "toggleTask":
      return state.map((task) =>
        task.id === action.payload
          ? { ...task, completed: !task.completed }
          : task
      );
    default:
      throw new Error("Unhandled action type");
  }
};

const ToDoList = () => {
  const [state, dispatch] = useReducer(todoReducer, []);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userId = user.uid;
      const docRef = doc(db, "todoList", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        dispatch({ type: "setTasks", payload: docSnap.data().tasks });
        setIsInitialLoadComplete(true);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    if (!isInitialLoadComplete) return;
    const updateTasksInFirestore = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userId = user.uid;
      await setDoc(doc(db, "todoList", userId), {
        tasks: state,
      });
    };

    updateTasksInFirestore();
  }, [state]);

  const handleSaveTask = (task) => {
    dispatch({ type: "addTask", payload: task });
  };

  const removeTask = (id) => {
    dispatch({ type: "removeTask", payload: id });
  };

  const toggleTaskCompletion = (id) => {
    dispatch({ type: "toggleTask", payload: id });
  };

  const bgBox = useColorModeValue("gray.100", "gray.700");

  const isDeadlinePassed = (deadline, completed) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    return deadlineDate < today && !completed;
  };

  const compareDeadlines = (task1, task2) => {
    const deadline1 = new Date(task1.deadline);
    const deadline2 = new Date(task2.deadline);
    return deadline1 - deadline2;
  };

  const sortedTasks = [...state].sort(compareDeadlines);

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <VStack spacing={6} mt={5} maxW="lg" width="100%">
        <Button colorScheme="purple" onClick={onOpen} leftIcon={<AddIcon />}>
          Add Task
        </Button>
        {sortedTasks.map((task) => (
          <Box
            key={task.id}
            p={5}
            bg={
              isDeadlinePassed(task.deadline, task.completed)
                ? "pink.100"
                : task.completed
                ? "green.100"
                : bgBox
            }
            borderRadius="xl"
            boxShadow="xl"
            width="100%"
            transition="all 0.3s ease"
            _hover={{ boxShadow: "2xl" }}
          >
            <HStack justifyContent="space-between">
              <VStack align="flex-start" flex={1}>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  isStrikethrough={task.completed}
                >
                  {task.title}
                </Text>
                <Text fontSize="sm">{task.description}</Text>
                <Badge
                  colorScheme={
                    isDeadlinePassed(task.deadline, task.completed)
                      ? "red"
                      : "blue"
                  }
                  p={1}
                  borderRadius="lg"
                >
                  Deadline: {new Date(task.deadline).toLocaleDateString()}
                </Badge>
              </VStack>
              <CustomCheckbox
                isChecked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
              />
              <IconButton
                aria-label="Delete task"
                icon={<DeleteIcon />}
                onClick={() => removeTask(task.id)}
                colorScheme="red"
                size="xs"
              />
            </HStack>
          </Box>
        ))}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <TaskForm onSave={handleSaveTask} onClose={onClose} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

// Component custom pentru checkbox
const CustomCheckbox = ({ isChecked, onChange }) => {
  const color = useColorModeValue(
    isChecked ? "teal.500" : "gray.300",
    isChecked ? "teal.300" : "gray.300"
  );

  return (
    <Checkbox
      isChecked={isChecked}
      onChange={onChange}
      size="lg"
      colorScheme="teal"
      borderRadius="xl"
      bg={color}
    />
  );
};

export default ToDoList;
