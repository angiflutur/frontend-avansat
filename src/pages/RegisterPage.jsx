import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Image,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import logo from '../assets/logo.png'; // Asigură-te că ai logo-ul în directorul corect

const RegisterPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const onRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/login"); // Navighează către pagina de login după înregistrare cu succes
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  return (
    <Center height="100vh" bg="purple.50">
      <Image src={logo} boxSize="auto" height="100px" alt="TickTask Logo" position="absolute" top="19" left="20" />
      <Heading color="purple" position="absolute" top="2" left="5" mt="4" fontSize="3xl">ToDoList</Heading>
      
      <Center
        flexDirection="column"
        p="20"
        bg="white"
        boxShadow="xl"
        borderRadius="lg"
        border="1px"
        borderColor="purple.200"
      >
        <Heading color="purple.400" mt={4}>Register</Heading>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            borderColor="purple.300"
            type="email"
          />
        </FormControl>

        <FormControl id="password" mt="5">
          <FormLabel>Password</FormLabel>
          <Input
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            borderColor="purple.300"
            type="password"
          />
        </FormControl>

        {error && <Text color="red.500">{error}</Text>}

        <Button
          mt="5"
          colorScheme="purple"
          onClick={onRegister}
        >
          Register
        </Button>

        <Text
          mt="4"
          color="purple.600"
          _hover={{
            textDecoration: "underline",
            cursor: "pointer"
          }}
          onClick={() => {
            navigate("/login");
          }}
        >
          Do you have an account?
        </Text>
      </Center>
    </Center>
  );
};

export default RegisterPage;
