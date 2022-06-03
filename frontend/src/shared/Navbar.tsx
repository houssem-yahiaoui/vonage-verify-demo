import jwtDecode from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Image,
  Text,
  useToast,
  AvatarBadge,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';

// Icons
import { RiLogoutBoxLine } from 'react-icons/ri';

// State
import { useSelector, useDispatch } from "react-redux";
import { landingSelector, logout } from '../landing/state/landingSlice'

export default function Nav() {
  const toast = useToast()
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector(landingSelector)
  let user:any;
  if(token) user = jwtDecode(token);
  const navigateLandingPage = () => {
    navigate("/")
  }
  const toast_logout_id = "toast_logout_id"
  const logingOut = () => {
    dispatch(logout());
    if(!toast.isActive(toast_logout_id)) {
      toast({
        id: toast_logout_id,
        title: 'Good Bye!',
        description: "Sad to see you leave, comeback soon 🙏🏻",
        status: 'success',
        duration: 3500,
        isClosable: true,
      })  
    }
    navigateLandingPage();
  }

  return (
    <>
      <Box bg={useColorModeValue('gray.200', 'gray.900')} px={4} shadow='md'>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box onClick={navigateLandingPage} cursor="pointer">
            {/* {colorMode === 'light' ? <BlackLogo /> : <WhiteLogo /> } */}
          </Box>
          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <ColorModeSwitcher />
              {
                token ? (
                  <Menu isLazy>
                    <MenuButton
                      as={Button}
                      rounded={'full'}
                      variant={'link'}
                      cursor={'pointer'}
                      minW={0}>
                      <Avatar
                        size={'sm'}
                        name={user.name}
                        src={user.picture}
                      >
                        <AvatarBadge boxSize='1.25em' bg='green.500' />
                      </Avatar>
                    </MenuButton>
                    <MenuList alignItems='right'>
                      <MenuItem minH='48px'>
                        <Image
                          boxSize='2rem'
                          borderRadius='full'
                          src={user.picture}
                          alt={user.picture}
                          mr='12px'
                        />
                        <Text fontWeight="bold" >{user.name}</Text>
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem icon={<RiLogoutBoxLine />} onClick={logingOut}>Logout</MenuItem>
                    </MenuList>
                  </Menu>
                ): (
                  ""
                )
              }
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
