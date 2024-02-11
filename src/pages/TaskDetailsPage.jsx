import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc  } from 'firebase/firestore';
import { auth, db } from "../lib/firebase";
import {
  Box,
  Text,
  Heading,
  VStack,
  Badge,
  Container,
  Divider,
  Checkbox,
} from '@chakra-ui/react';

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userId = user.uid;
      const docRef = doc(db, "todoList", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const tasks = docSnap.data().tasks;
        const foundTask = tasks.find(t => t.id.toString() === taskId);

        if (foundTask) {
          setTask(foundTask);
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
  
    // Actualizează în Firestore
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const docRef = doc(db, "todoList", userId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const tasks = docSnap.data().tasks.map(t =>
          t.id === task.id ? updatedTask : t
        );
  
        await updateDoc(docRef, { tasks });
      }
    }
  };
  
  const handleToggleSubtaskCompletion = async (subtaskId) => {
    const updatedSubtasks = task.subtasks.map(subtask =>
      subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
    );
    const updatedTask = { ...task, subtasks: updatedSubtasks };
    setTask(updatedTask);
  
    // Actualizează în Firestore
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const docRef = doc(db, "todoList", userId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const tasks = docSnap.data().tasks.map(t =>
          t.id === task.id ? updatedTask : t
        );
  
        await updateDoc(docRef, { tasks });
      }
    }
  };

  if (loading) {
    return <Box p={5}>Loading...</Box>;
  }

  if (!task) {
    return <Box p={5}>Task not found</Box>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container maxW="container.md" centerContent p={5}>
      <VStack spacing={4} align="stretch" w="100%">
        <Heading as="h1">{task.title}</Heading>
        <Text fontSize="lg">{task.description}</Text>
        <Divider />
        <Badge colorScheme={task.completed ? "green" : "red"} p={2}>
          {task.completed ? "Completed" : "Not Completed"}
        </Badge>
        <Text>Deadline: {formatDate(task.deadline)}</Text>
        <Checkbox
          isChecked={task.completed}
          onChange={handleToggleTaskCompletion}
        >
          Mark as completed
        </Checkbox>
        <Divider />
        <Text fontWeight="bold">Subtasks:</Text>
        {task.subtasks.map(subtask => (
          <Box key={subtask.id} ml={4}>
            <Checkbox
              isChecked={subtask.completed}
              onChange={() => handleToggleSubtaskCompletion(subtask.id)}
            >
              {subtask.title}
            </Checkbox>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default TaskDetailsPage;
