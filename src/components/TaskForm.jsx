import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Textarea,
  useTheme,
  HStack,
  Icon,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  EditIcon,
  AddIcon,
  DeleteIcon,
  CheckIcon,
  TimeIcon,
  InfoIcon,
  CloseIcon,
} from "@chakra-ui/icons";

const TaskForm = ({ onSave, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [subtasks, setSubtasks] = useState([
    { id: Date.now(), title: "", completed: false },
  ]);
  const theme = useTheme(); // Utilizarea temei Chakra UI

  const bgColor = useColorModeValue("gray.50", "gray.700");
  const inputBgColor = useColorModeValue("white", "gray.600");
  const buttonColor = useColorModeValue("purple.400", "purple.200");

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { id: Date.now(), title: "", completed: false }]);
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
  };

  const handleSubtaskTitleChange = (id, title) => {
    setSubtasks(
      subtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, title } : subtask
      )
    );
  };

  const handleToggleSubtaskCompletion = (id) => {
    setSubtasks(
      subtasks.map((subtask) =>
        subtask.id === id
          ? { ...subtask, completed: !subtask.completed }
          : subtask
      )
    );
  };

  const handleSubmit = () => {
    onSave({
      id: Date.now(),
      title,
      description,
      deadline: deadline.toISOString(),
      completed: false,
      subtasks,
    });
    onClose();
  };

  return (
    <VStack spacing={4}>
      <FormControl>
        <Flex align="center">
          <Icon as={CheckIcon} color={buttonColor} mr={2} />
          <FormLabel fontWeight="bold">Title</FormLabel>
        </Flex>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormControl>
      <FormControl>
        <Flex align="center">
          <Icon as={InfoIcon} color={buttonColor} mr={2} />
          <FormLabel fontWeight="bold">Description</FormLabel>
        </Flex>

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <Flex align="center">
          <Icon as={TimeIcon} color={buttonColor} mr={2} />
          <FormLabel fontWeight="bold">Deadline</FormLabel>
        </Flex>

        <DatePicker
          selected={deadline}
          onChange={(date) => setDeadline(date)}
          className="chakra-input css-0"
          dateFormat="MMMM d, yyyy"
          wrapperClassName="datePickerWrapper"
          customInput={<Input />}
        />
      </FormControl>
      <FormControl>
        <FormLabel fontWeight="bold">Subtasks</FormLabel>
        {subtasks.map((subtask, index) => (
          <HStack key={subtask.id} spacing={2}>
            <Input
              placeholder={`Subtask ${index + 1}`}
              value={subtask.title}
              onChange={(e) =>
                handleSubtaskTitleChange(subtask.id, e.target.value)
              }
            />
            <Button
              colorScheme="red"
              onClick={() => handleRemoveSubtask(subtask.id)}
            >
              <DeleteIcon />
            </Button>
          </HStack>
        ))}
        <Button mt={2} onClick={handleAddSubtask} leftIcon={<AddIcon />}>
          Add Subtask
        </Button>
      </FormControl>
      <Button colorScheme="purple" onClick={handleSubmit} width="full">
        Save Task
      </Button>
    </VStack>
  );
};
export default TaskForm;
