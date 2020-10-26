import { Button, Alert, AlertDescription, AlertIcon, AlertTitle, CloseButton } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { serverError } from '../utils/serverErrorMap';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';


export type LoginProps = {

}




export const Login: React.FC<LoginProps> = ({ }) => {
    const router = useRouter();
    const [, LoginEndpoint] = useLoginMutation();
    const [serverErr, setServerErr] = useState('');

    const submitRegForm = async (values, { setErrors }) => {
        const { username, password } = values;
        const response = await LoginEndpoint({ username, password });
        if (response?.error) {
            setServerErr(serverError(response.error));
        }
        if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
        }

        if (response.data?.login.user) {
            router.push("/")
        }
    }

    const err = (message) => (
        <Alert status="error" mb="2rem">
            <AlertIcon />
            <AlertTitle mr={2}>Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" />
        </Alert>
    );

    return (
        <Wrapper variant='small'>
            {serverErr ? err(serverErr) : ''}
            <Formik initialValues={{ username: "", password: "" }} onSubmit={submitRegForm}>
                {({ isSubmitting }) => (
                    <Form>
                        {/* Easy Way */}
                        <InputField name='username' placeholder="username or email" label='username' type="username" />

                        {/* Easy Way */}
                        <InputField name="password" placeholder="password" label="Password" type="password" />

                        <Button mt="2rem" float="right" isLoading={isSubmitting} type="submit" color="teal">Login</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};



export default Login;