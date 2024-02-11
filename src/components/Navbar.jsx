import { Link, Outlet, useMatch } from "react-router-dom";
import { Box, HStack, Text, IconButton } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const homeMatch = useMatch("/");
  const counterMatch = useMatch("/counter");

  return (
    <>
      <HStack bg="purple.200" p="3" spacing="10">
        <Box p="3">
          <Link to="/">
            <Text
              color={homeMatch ? "purple.500" : "black"}
              fontWeight="bold"
              fontSize="24"
            >
              ToDoList
            </Text>
          </Link>
        </Box>

        {/* <Box>
          <Link to="/counter">
            <Text
              color={counterMatch ? "purple.600" : "black"}
              fontWeight="bold"
              fontSize="24"
            >
              Profile
            </Text>
          </Link>
        </Box> */}

        <IconButton
        icon={<FaSignOutAlt />}
        size="md"
        variant="ghost"
        color="purple"
        ml="auto"
        _hover={{ bg: "purple", color: "white" }} // Schimbă culoarea la hover
        aria-label="Sign out"
        onClick={() => signOut(auth)}
      />
      </HStack>

      <Outlet />
    </>
  );
};

export default Navbar;
