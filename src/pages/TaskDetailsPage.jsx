import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from "../lib/firebase";
import {
  Box,
  Text,
  Heading,
  VStack,
  Badge,
  Container,
  Divider
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
      </VStack>
    </Container>
  );
};

export default TaskDetailsPage;
