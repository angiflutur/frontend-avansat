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
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TaskForm = ({ onSave, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [subtasks, setSubtasks] = useState([
    { id: Date.now(), title: "", completed: false },
  ]);
  const theme = useTheme(); // Utilizarea temei Chakra UI

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
        subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
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
        <FormLabel fontWeight="bold">Title</FormLabel>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel fontWeight="bold">Description</FormLabel>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel fontWeight="bold">Deadline</FormLabel>
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
              Remove
            </Button>

          </HStack>
        ))}
        <Button mt={2} onClick={handleAddSubtask}>
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
