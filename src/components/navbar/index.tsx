import { Center, Navbar, useMantineTheme } from "@mantine/core"
import { MetalynxIcon } from "../../assets/svgs/MetalynxIcon";

const NavBar = () => {
  const theme = useMantineTheme();

  return (
    <Navbar 
      width={{ base: theme.fontSizes.md * 5 }}
      sx={{
        backgroundColor: theme.colors.gray[3],
        flexGrow: 0,
        borderRight: 0
      }}
    >
      <Navbar.Section>
        <Center sx={{ margin: `${theme.spacing.xl}px 0 ${theme.spacing.sm}px 0` }}>
          <MetalynxIcon 
            dimensions={theme.fontSizes.md * 3} 
            bg={theme.colors.blue[3]}
            fc={theme.white}
          />
        </Center>
      </Navbar.Section>
    </Navbar>
  )
}

export default NavBar;