import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { Spinner } from "@chakra-ui/react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";

export default function Home() {
  const { data: session } = useSession();
  const [password, setPassword] = useState("");
  const [isActivated, setIsActivated] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`${process.env.BACKEND_URL}/retrieve`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session?.user?.email,
          }),
        });

        const resJson = await res.json();
        const isActivated = resJson.is_active;
        setIsActivated(isActivated);
      } catch (err) {
        console.log(err);
      }
    };
    if (session?.user?.email) {
      checkStatus();
    }
  }, [isActivated, isSuccess, session?.user?.email]);

  const activate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.BACKEND_URL}/activate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          password: password,
        }),
      });

      if (res.status === 200) {
        setIsLoading(false);
        setIsSuccess(true);
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setIsSuccess(false);
    }
  };

  const deactivate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.BACKEND_URL}/deactivate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          password: password,
        }),
      });
      console.log(await res);
      if (res.status === 200) {
        setIsLoading(false);
        setIsSuccess(true);
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setIsSuccess(false);
    }
  };

  return (
    <div className="h-screen flex flex-col gap-3 justify-center items-center bg-blue-100">
      {session ? (
        <>
          Signed in as {session?.user?.email} <br />{" "}
          <div>
            Gem premium credits are currently
            {isActivated ? " activated." : " not activated."}
          </div>
          <Button onClick={onOpen} colorScheme="blue">
            {isActivated ? "Deactivate" : "Activate"}
          </Button>
          <Button onClick={() => signOut()}>Sign out</Button>
          <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={onClose}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Please re-enter your Google password</ModalHeader>

              <ModalCloseButton />
              {!isLoading && !isSuccess && (
                <ModalBody pb={6}>
                  {isActivated ? (
                    <div className="text-center text-sm py-4">
                      I don&apos;t want Gem to use my premium credits on my
                      behalf anymore.
                    </div>
                  ) : (
                    <div className="text-center text-sm py-4">
                      I authorize Gem to use my premium credits on my behalf.{" "}
                      <br />
                      You can deactivate it anytime.
                    </div>
                  )}
                  <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      ref={initialRef}
                      placeholder="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>
                </ModalBody>
              )}
              {isLoading && !isSuccess && (
                <ModalBody pb={6}>
                  <Spinner />
                </ModalBody>
              )}
              {!isLoading && isSuccess && (
                <ModalBody pb={6}>Success!</ModalBody>
              )}

              {!isSuccess ? (
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => (isActivated ? deactivate() : activate())}
                  >
                    {isActivated ? "Deactivate" : "Activate"}
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              ) : (
                <ModalFooter>
                  {" "}
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => window.location.reload()}
                  >
                    Close
                  </Button>
                </ModalFooter>
              )}
            </ModalContent>
          </Modal>
        </>
      ) : (
        <>
          <Button colorScheme="blue" onClick={() => signIn()}>
            Sign in
          </Button>
        </>
      )}
    </div>
  );
}
