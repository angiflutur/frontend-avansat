import { useTheme } from "../store/Theme.context";
import { useNavigate } from "react-router-dom";
import { Button, VStack, Input, Center, Text } from "@chakra-ui/react";

const HomePage = () => {
  const { theme, switchTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <Center>
      <VStack>
        <Button
          colorScheme="red"
          variant="outline"
          onClick={() => switchTheme()}
        >
          Switch theme
        </Button>
        <Text>Theme is: {theme}</Text>

      </VStack>
    </Center>
  );
};

export default HomePage;
