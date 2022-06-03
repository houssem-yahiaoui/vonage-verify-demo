import { Badge, Box, Center, Container, Heading, Stack, Text, PinInput, PinInputField, HStack, useToast} from "@chakra-ui/react";
import Lottie from "react-lottie";
import * as twofa from '../lotties/2fa.json';


import { useVerify2FAMutation } from '../store/services/landing'


// router
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { handlePost2FA } from "./state/landingSlice";

export default function TwoFactorVerifier() {
    const dispatch = useDispatch();
    let [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [verify2FA] = useVerify2FAMutation();
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: twofa,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    };

    const toast_auth_id = "toast_auth_id";
    const handlePostCodeAdding = async (value: string) => {
        const result = await verify2FA({
            verificationCode: value,
            requestId: searchParams.get('reqId')
        }).unwrap();
        console.log(result);
        if(result.success) {
            if(!toast.isActive(toast_auth_id)) {
                toast({
                  id: toast_auth_id,
                  title: 'Verified',
                  description: "Your account is now fully verified !",
                  status: 'success',
                  duration: 3500,
                  isClosable: true
                })  
            }
            dispatch(handlePost2FA());
            navigate('/');
        }
    } 

    return (
        <>
            <Container>
              <Stack as={Box} textAlign={'center'} spacing={4} py={{ base: 9, md: 14 }}>
                <Lottie 
                    options={defaultOptions}
                    height={300}
                    width={400}
                />
                <Heading fontWeight={600} fontSize='3xl' lineHeight={'110%'}>
                    Verify your Identity
                </Heading>
                <Text fontWeight={'semibold'}>We just sent you an <Badge>sms</Badge> with a 6 number as your <Badge colorScheme={'cyan'}>personal verification code</Badge></Text>
                <Center>
                <HStack mt={5}>
                    <PinInput size='lg' onComplete={handlePostCodeAdding} otp={true} type={'number'}>
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                    </PinInput>
                </HStack>
                </Center>
              </Stack>
            </Container>
        </>
    )
}

function toast(arg0: { id: any; title: string; description: string; status: string; duration: number; isClosable: boolean; }) {
    throw new Error("Function not implemented.");
}
