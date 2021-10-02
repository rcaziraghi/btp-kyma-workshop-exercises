import { useForm } from "react-hook-form";
import React, { useState } from 'react';
import Head from "next/head";
import {
  Heading,
  Container,
  FormErrorMessage,
  Icon,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Box,
  Text,
  Textarea,
  Flex,
  Stack,
  Image,
  useToast,
  useColorMode
} from '@chakra-ui/react';
import { PhoneIcon, EmailIcon, CalendarIcon } from '@chakra-ui/icons'
import { MdInvertColors } from 'react-icons/md'

export default function EventRegistrationForm() {

  const toast = useToast()
  const toastIdRef = React.useRef()
  const { toggleColorMode } = useColorMode();

  function showSuccessMessage() {
    toastIdRef.current = toast({
      title: "Information registered.",
      description: "You have been registered.",
      status: "success",
      duration: 5000,
      isClosable: true
    });
  }

  function showErrorMessage() {
    toastIdRef.current = toast({
      title: "Error",
      description: "There was an error.",
      status: "error",
      duration: 5000,
      isClosable: true
    });
  }

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegistration = async (data) => {
    console.log('Request data:', JSON.stringify(data));
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    console.log('Response data:', JSON.stringify(resData));
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    try {
      await handleRegistration(data);
      setIsRegistered(true);
      showSuccessMessage();
      reset();
    } catch (error) {
      console.log('There was an error.');
      showErrorMessage();
    }
  };

  return (
    <>
      <div>
        <Head>
          <title>Tech Event - Registration</title>
          <meta property="og:title" content="Tech Event - Registration" key="title" />
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
          <Icon
            w={6}
            h={6}
            mt="5"
            ml="5"
            color='blue.400'
            onClick={toggleColorMode}
            as={MdInvertColors} />
          <Flex p={8} flex={1} align={'center'} justify={'center'}>
            <Flex width="full" align="center" justifyContent="center">
              <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
                <Stack spacing={0} align={'center'}>
                  <Heading
                    fontWeight={700}
                    fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                    lineHeight={'110%'}>
                    <Text as={'span'} color={'green.400'}>
                      Tech Event 2021
                    </Text> <br />
                  </Heading>
                  <Text color={'teal.600'}>
                    <br />
                  Location: Montage Kapalua Bay, Hawaii, USA <br />
                  Address: 1 Bay Dr, Lahaina, HI 96761, United States <br />
                  Date and Time: December 3 to 5, 2021 | 10:00am to 5:00pm <br />
                  Agenda: Everything about Hyperscalers <br /><br />
                  </Text>
                  <Box
                    p={8}
                    maxWidth={'md'}
                    minWidth={'md'}
                    borderWidth={1}
                    borderRadius={8}
                    boxShadow="dark-lg"
                  >
                    {isRegistered ? (
                      <Box textAlign="center">
                        <Text>Thanks for registering for the Tech Event!</Text>
                        <Button rightIcon={<CalendarIcon />}
                          colorScheme="cyan"
                          variant="outline"
                          width="full"
                          mt={4}
                          onClick={() => setIsRegistered(false)}>
                          Register again
                  </Button>
                      </Box>
                    ) : (
                      <>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <Stack spacing={4} w={'full'} maxW={'md'}>
                            <Heading
                              fontWeight={700}
                              fontSize={{ base: '1xl', sm: '2xl', md: '3xl' }}
                              lineHeight={'100%'}>
                              <Text as={'span'} color={'blue.600'}>
                                Registration Form
                              </Text>
                            </Heading>
                            <Text color={'gray.500'}>
                              Please provide your contact information and register for the event.
                            </Text>
                            <FormControl isInvalid={errors.firstName} isRequired>
                              <Input
                                id="firstName"
                                placeholder="First name"
                                variant="filled"
                                {...register("firstName", {
                                  required: "This is required",
                                  minLength: { value: 2, message: "Minimum length should be 4" }
                                })}
                              />
                              <FormErrorMessage>
                                {errors.firstName && errors.firstName.message}
                              </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={errors.lastName} isRequired>
                              <Input
                                id="lastName"
                                placeholder="Last name"
                                variant="filled"
                                {...register("lastName", {
                                  required: "This is required",
                                  minLength: { value: 2, message: "Minimum length should be 4" }
                                })}
                              />
                              <FormErrorMessage>
                                {errors.lastName && errors.lastName.message}
                              </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={errors.email} isRequired>
                              <InputGroup>
                                <InputLeftElement pointerEvents="none">
                                  <EmailIcon color="blue.500" />
                                </InputLeftElement>
                                <Input
                                  id="email"
                                  placeholder="Email address"
                                  type="email"
                                  variant="filled"
                                  {...register("email", {
                                    required: "This is required",
                                    minLength: { value: 4, message: "Minimum length should be 4" }
                                  })}
                                />
                              </InputGroup>
                              <FormErrorMessage>
                                {errors.email && errors.email.message}
                              </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={errors.phone} isRequired>
                              <InputGroup>
                                <InputLeftElement pointerEvents="none">
                                  <PhoneIcon color="blue.500" />
                                </InputLeftElement>
                                <Input
                                  id="phone"
                                  type="tel"
                                  placeholder="Phone number"
                                  variant="filled"
                                  {...register("phone", {
                                    required: "This is required",
                                    minLength: { value: 10, message: "Minimum length should be 10" }
                                  })}
                                />
                              </InputGroup>
                              <FormErrorMessage>
                                {errors.phone && errors.phone.message}
                              </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={errors.comment}>
                              <Textarea
                                id="comment"
                                placeholder="Comment"
                                variant="filled"
                                {...register("comment")}
                                size="sm"
                              />
                              <FormErrorMessage>
                                {errors.comment && errors.comment.message}
                              </FormErrorMessage>
                            </FormControl>

                            <Button mt={4} colorScheme={'blue'} variant={'solid'} isLoading={isSubmitting} type="submit">
                              Submit
                        </Button>

                          </Stack>
                        </form>
                      </>
                    )}
                  </Box>
                </Stack>
              </Container>
            </Flex>
          </Flex>
          <Flex flex={1}>
            <Image
              alt={'Image'}
              objectFit={'cover'}
              src={
                'https://images.unsplash.com/photo-1511578314322-379afb476865?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2069&q=80'
              }
            />
          </Flex>
        </Stack>
      </div>
    </>
  );
}