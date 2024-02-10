import React, { useState } from 'react';
import { Button, FormControl, FormLabel, Input, VStack, Textarea, useTheme } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskForm = ({ onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const theme = useTheme(); // Utilizarea temei Chakra UI

  const handleSubmit = () => {
    onSave({
      id: Date.now(),
      title,
      description,
      deadline: deadline.toISOString(),
      completed: false,
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
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel fontWeight="bold">Deadline</FormLabel>
        <DatePicker
          selected={deadline}
          onChange={date => setDeadline(date)}
          className="chakra-input css-0"
          dateFormat="MMMM d, yyyy"
          wrapperClassName="datePickerWrapper"
          customInput={<Input />}
          popperClassName="datePickerPopper" // Adăugați această linie pentru a seta stilul Popper-ului
        />
      </FormControl>
      <Button colorScheme="purple" onClick={handleSubmit} width="full">Save Task</Button>
    </VStack>
  );
};

export default TaskForm;
