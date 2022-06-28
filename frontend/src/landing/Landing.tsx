import { useEffect, useState } from "react";
import { useTitle } from "react-use";
import { useNavigate } from "react-router-dom";
import jwtDecode from 'jwt-decode';
import Lottie from "react-lottie";
import * as hello from '../lotties/hello.json'
import * as secure from '../lotties/secure.json'

// UI Elements.
import {
  Box, Heading, Container, Text, Image, Button, Input,
  Stack, Center, Badge, useToast, HStack, VStack, ModalOverlay, Modal, ModalContent, ModalBody, Flex, useDisclosure,
} from '@chakra-ui/react';
import { PhoneIcon } from '@chakra-ui/icons'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { formatPhoneNumberIntl } from 'react-phone-number-input'

// Icons
import { FcGoogle } from 'react-icons/fc';

// State
import { useSelector } from "react-redux";
import { useGetAccountMetadataQuery, useLoginMutation, useAddPhoneNumberMutation } from '../store/services/landing'
import { landingSelector } from './state/landingSlice'

// Auth
import firebaseApp from '../firebase';
import { getAuth } from 'firebase/auth';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { E164Number } from "libphonenumber-js/types";

const auth = getAuth(firebaseApp);

export default function Landing() {
  let openPhoneModal = false;
  useTitle('2FA Demo - Vonage Demo');
  const [phone, setPhone] = useState<E164Number | undefined>()
  const { isOpen, onClose } = useDisclosure();
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const { token, requestId } = useSelector(landingSelector);
  const toast = useToast();
  const navigate = useNavigate();
  const userMetadata: any = token ? jwtDecode(token): {};
  const {data: accountConfiguration, isLoading: getAccountMetadataLoading} = useGetAccountMetadataQuery(userMetadata?.id, {
    refetchOnMountOrArgChange: true,
    skip: !token
  });

  if(!getAccountMetadataLoading) {
    if(!accountConfiguration?.phone_number) {
      // Open modal to add the phone number
      openPhoneModal = !accountConfiguration?.phone_number && !isOpen;
    }
  }

  if(requestId) {
    navigate(`/two-factor-verification?reqId=${requestId}`);
  }

  useEffect(() => {
    if (user && user.user.email && !token) {
      login({
        uid: user.user.uid,
        photo: user.user.photoURL,
        email: user.user.email,
        name: user.user.displayName
      });
      if(!toast.isActive(toast_auth_id) && !openPhoneModal) {
        toast({
          id: toast_auth_id,
          title: 'Welcome to you 2FA Demo',
          description: "We optimized your experience with your accesses, enjoy !",
          status: 'success',
          duration: 3500,
          isClosable: true
        })  
      }
    }
  }, [user]);

  const [login] = useLoginMutation();
  const [addPhoneNumber] = useAddPhoneNumberMutation();
  const toast_auth_id = "toast_auth_id";
  const toast_auth_error = "toast_auth_error";

  if(!toast.isActive(toast_auth_error) && error) {
    toast({
      id: toast_auth_error,
      title: 'Error',
      description: "Problem while logging in !",
      status: 'error',
      duration: 3500,
      isClosable: true
    })  
  }

  function getLottie(lo: any) {
    return {
      loop: true,
      autoplay: true,
      animationData: lo,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    }
  };
  return (
    <>
      {
        !token ? 
          (
            <Container>
              <Stack as={Box} textAlign={'center'} spacing={4} py={{ base: 9, md: 16 }}>
              <Lottie 
                    options={getLottie(hello)}
                    height={290}
                    width={300}
                />
                <Heading fontWeight={600} fontSize='5xl' lineHeight={'110%'}>
                    2FA Demo With Vonage Verify API
                </Heading>
                <Text color={'gray.500'} fontWeight="bold">
                  2FA is <Badge colorScheme="red" variant="solid">Powerful Vonage API</Badge> used to help you secure your users account
                  using simple, intuitive and reliable API.
                </Text>
                <Center>
                  <Button
                    w={'full'}
                    maxW={'md'}
                    variant={'outline'}
                    leftIcon={<FcGoogle />}
                    isLoading= {loading}
                    onClick={() => signInWithGoogle()}
                    >
                    <Center>
                      <Text>Sign in with Google</Text>
                    </Center>
                  </Button>
                </Center>
              </Stack>
            </Container>
          ) :
          (
            <>
              <Modal isOpen={openPhoneModal} onClose={onClose} isCentered motionPreset='slideInBottom' size={'lg'}>
                <ModalOverlay />
                <ModalContent>
                  <ModalBody>
                    <Flex direction="column" justifyContent="center" justifyItems="center" gap={3} mb={4} mt={4}>
                      <Center><Heading size="lg">Your account was created 🎉</Heading></Center>
                      <Center><Text>Add your Phone Number to <Badge colorScheme={'green'}>finalize</Badge> your account verification</Text></Center>
                      <PhoneInput
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={setPhone}
                        
                        inputComponent={Input}
                      /> 
                    </Flex>
                    {phone && phone?.toString().length >= 12 ? <Center mb={2}>
                    <Button size="md" colorScheme={'teal'} leftIcon={<PhoneIcon />} onClick={async () => {
                      if(phone && phone?.toString().length >= 12) {
                        const result = await addPhoneNumber({
                          id: userMetadata.id,
                          number: formatPhoneNumberIntl(phone)
                        }).unwrap();
                        if(result.success) {
                          console.log(result)
                          navigate(`/two-factor-verification?reqId=${result.requestId}`);
                          onClose();
                        }
                      }
                    }}>Add number</Button> </Center>: ''}                  
                  </ModalBody>
                </ModalContent>
              </Modal>
              <VStack mt={20} gap={5}>
                <Lottie 
                    options={getLottie(secure)}
                    height={290}
                    width={300}
                />
                <Heading fontSize="4xl">
                  Welcome to Your 2FA Demo
                </Heading>
                {accountConfiguration?.phone_number ? 
                <>
                  <Text color={'gray.300'} fontWeight="bold">
                  In this Demo we exploited <Badge colorScheme={'purple'}>Vonage Verify API</Badge> which let us implement the two factor authentication via mobile phone.
                  </Text>
                  <Text color={'gray.300'} fontWeight="bold">
                  Hope you enjoyed it :D 
                  </Text>
                </>: ""}
                
              </VStack>
            </>
          )
        }
    </>
  )
}
