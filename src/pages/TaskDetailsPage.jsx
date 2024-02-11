import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import {
  Box,
  Text,
  Heading,
  VStack,
  Container,
  Divider,
  Checkbox,
  Input,
  Textarea,
  Button,
  useColorModeValue,
  Flex,
  Icon,
  Stack,
} from "@chakra-ui/react";
import {
  EditIcon,
  AddIcon,
  DeleteIcon,
  CheckIcon,
  TimeIcon,
  InfoIcon,
  CloseIcon,
} from "@chakra-ui/icons";

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingDeadline, setIsEditingDeadline] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");

  const bgColor = useColorModeValue("gray.50", "gray.700");
  const inputBgColor = useColorModeValue("white", "gray.600");
  const buttonColor = useColorModeValue("purple.400", "purple.200");

  useEffect(() => {
    const fetchTaskDetails = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userId = user.uid;
      const docRef = doc(db, "todoList", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const tasks = docSnap.data().tasks;
        const foundTask = tasks.find((t) => t.id.toString() === taskId);

        if (foundTask) {
          setTask(foundTask);
          setTitle(foundTask.title);
          setDescription(foundTask.description);
          setDeadline(foundTask.deadline);
        } else {
          console.log("Task not found");
        }
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleToggleTaskCompletion = async () => {
    const updatedTask = { ...task, completed: !task.completed };
    setTask(updatedTask);

    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const docRef = doc(db, "todoList", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const tasks = docSnap
            .data()
            .tasks.map((t) => (t.id.toString() === taskId ? updatedTask : t));

          await updateDoc(docRef, { tasks });
        }
      }
    } catch (error) {
      console.error("Error updating task completion status:", error);
    }
  };

  const handleToggleSubtaskCompletion = async (subtaskId) => {
    const updatedSubtasks = task.subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );

    updatedSubtasks.sort((a, b) =>
      a.completed === b.completed ? 0 : a.completed ? 1 : -1
    );

    const allSubtasksCompleted = updatedSubtasks.every(
      (subtask) => subtask.completed
    );

    const updatedTask = {
      ...task,
      subtasks: updatedSubtasks,
      completed: allSubtasksCompleted,
    };

    setTask(updatedTask);

    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const docRef = doc(db, "todoList", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const tasks = docSnap
            .data()
            .tasks.map((t) => (t.id.toString() === taskId ? updatedTask : t));

          await updateDoc(docRef, { tasks });
        }
      }
    } catch (error) {
      console.error("Error updating subtask completion status:", error);
    }
  };

  const handleSaveChanges = async () => {
    const updatedTask = {
      ...task,
      title,
      description,
      deadline,
    };

    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const docRef = doc(db, "todoList", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const tasks = docSnap
          .data()
          .tasks.map((t) => (t.id.toString() === taskId ? updatedTask : t));

        await updateDoc(docRef, { tasks });

        // Actualizează starea locală pentru a reflecta schimbările fără a necesita un refresh
        setTask(updatedTask);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSaveChanges();
      setIsEditingTitle(false);
      setIsEditingDescription(false);
      setIsEditingDeadline(false);
    }
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim() !== "") {
      const updatedSubtasks = [
        ...task.subtasks,
        { id: Date.now(), title: newSubtask, completed: false },
      ];
      const updatedTask = { ...task, subtasks: updatedSubtasks };
      setTask(updatedTask);
      setNewSubtask("");
    }
  };

  const handleDeleteSubtask = (subtaskId) => {
    const updatedSubtasks = task.subtasks.filter(
      (subtask) => subtask.id !== subtaskId
    );
    const updatedTask = { ...task, subtasks: updatedSubtasks };
    setTask(updatedTask);
  };

  if (loading) {
    return <Box p={5}>Loading...</Box>;
  }

  if (!task) {
    return <Box p={5}>Task not found</Box>;
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container
      maxW="container.md"
      centerContent
      p={5}
      bg={bgColor}
      borderRadius="lg"
      boxShadow="md"
    >
      <VStack spacing={5} align="stretch" w="100%">
        {/* Titlu task */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bg={inputBgColor}
          p={3}
          borderRadius="md"
          boxShadow="sm"
        >
          <Flex align="center">
            <Icon as={CheckIcon} color={buttonColor} mr={2} />
            {isEditingTitle ? (
              <Input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSaveChanges}
                onKeyPress={handleKeyPress}
                bg="white"
              />
            ) : (
              <Heading as="h3" size="md">
                {task.title}
              </Heading>
            )}
          </Flex>
          <Button
            size="sm"
            onClick={() => setIsEditingTitle(true)}
            leftIcon={<EditIcon />}
            colorScheme="purple"
            variant="ghost"
          >
            Edit
          </Button>
        </Box>

        {/* Descriere task */}
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          align="center"
          bg={inputBgColor}
          p={3}
          borderRadius="md"
          boxShadow="sm"
        >
          <Icon as={InfoIcon} color={buttonColor} />
          {isEditingDescription ? (
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSaveChanges}
              onKeyPress={handleKeyPress}
              bg="white"
              placeholder="Task description"
              size="sm"
            />
          ) : (
            <Text>{task.description || "No description"}</Text>
          )}
          <Button
            size="sm"
            onClick={() => setIsEditingDescription(true)}
            leftIcon={<EditIcon />}
            colorScheme="purple"
            variant="ghost"
          >
            Edit
          </Button>
        </Stack>

        {/* Data limită și checkbox completare */}
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          align="center"
          bg={inputBgColor}
          p={3}
          borderRadius="md"
          boxShadow="sm"
        >
          <Icon as={TimeIcon} color={buttonColor} />
          {isEditingDeadline ? (
            <Input
              autoFocus
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              onBlur={handleSaveChanges}
              onKeyPress={handleKeyPress}
              bg="white"
            />
          ) : (
            <Text>{formatDate(task.deadline)}</Text>
          )}
          <Button
            size="sm"
            onClick={() => setIsEditingDeadline(true)}
            leftIcon={<EditIcon />}
            colorScheme="purple"
            variant="ghost"
          >
            Edit
          </Button>
        </Stack>
        {/* Butonul "Mark as completed" */}
        <Flex align="center" mt={4}>
          <Button
            onClick={handleToggleTaskCompletion}
            colorScheme="purple"
            variant="solid"
            size="sm"
            leftIcon={task.completed ? <CheckIcon /> : <CloseIcon />}
          >
            {task.completed ? "Completed" : "Mark as completed"}
          </Button>
        </Flex>
        <Divider my={4} />
        {/* Subtask-uri */}
        <Box>
          <Text fontWeight="bold" mb={2}>
            Subtasks:
          </Text>
          {task.subtasks.length > 0 ? (
            task.subtasks.map(
              (subtask) =>
                subtask.title && ( // Verifică dacă subtask-ul are un titlu valid
                  <Flex
                    key={subtask.id}
                    align="center"
                    bg={inputBgColor}
                    p={2}
                    mb={2}
                    borderRadius="md"
                    boxShadow="sm"
                  >
                    <Checkbox
                      isChecked={subtask.completed}
                      onChange={() => handleToggleSubtaskCompletion(subtask.id)}
                      colorScheme="purple"
                    />
                    <Text
                      ml={2}
                      textDecoration={
                        subtask.completed ? "line-through" : "none"
                      }
                      flexGrow={1}
                    >
                      {subtask.title}
                    </Text>
                    <Button
                      size="sm"
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      colorScheme="red"
                      variant="ghost"
                    >
                      <DeleteIcon />
                    </Button>
                  </Flex>
                )
            )
          ) : (
            <Text>No subtasks</Text>
          )}
          {/* Adăugare subtask */}
          <Flex mt={4}>
            <Input
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Add new subtask"
              bg="white"
              mr={2}
            />
            <Button
              onClick={handleAddSubtask}
              colorScheme="purple"
              leftIcon={<AddIcon />}
            >
              Add
            </Button>
          </Flex>
        </Box>
      </VStack>
    </Container>
  );
};

export default TaskDetailsPage;
