import React from "react";
import { Fragment, useRef, useState, useEffect } from "react";
import { Button } from "flowbite-react";
import { Dialog, Transition } from "@headlessui/react";
import styles from "../styles/Home.module.css";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import { profileManager_data } from "../constants/constants";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Register() {
  const [toggle, setToggle] = useState(false);
  const [name, setName] = useState("");
  const [receiverWallet, setReceiverWallet] = useState("");

  const cancelButtonRef = useRef(null);
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [isUser, setIsUser] = useState(false);

  const Manager_contract = useContract({
    address: profileManager_data.address,
    abi: profileManager_data.abi,
    signerOrProvider: signer || provider,
  });

  const checkUser = async () => {
    try {
      console.log("Checking user");
      const data = await Manager_contract.checkUser(address);
      console.log(data);
      setIsUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  const register = async () => {
    try {
      if (!isUser) {
        console.log("Registering the user ...");
        const tx = await Manager_contract.register(receiverWallet, name);
        await tx.wait();

        console.log(tx);
        console.log("User registered");
      } else {
        console.log("User Already registered");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkUser();
  }, [address]);

  return (
    <div>
      {!isUser ? (
        <button
          onClick={() => {
            setToggle(!toggle);
          }}
          className={`${styles.btnSecondary} `}
        >
          Register
        </button>
      ) : (
        <a>Already registered</a>
      )}

      <Transition.Root show={toggle} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setToggle}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-[#0c0c1764] bg-opacity-75 transition-opacity backdrop-blur-[40px]" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-gray-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 sm:pl-0">
                    <div className="sm:flex sm:items-start ">
                      <div className="mt-3 flex flex-col justify-center items-center text-center sm:mt-0 sm:ml-4 w-full sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-3xl mx-auto mt-2 font-semibold leading-6 mr-auto text-gray-900 px-2"
                        >
                          Enter Details
                        </Dialog.Title>
                        <div className={``}>
                          <div className="flex flex-col  w-[350px] h-[350px] bg-gray-100 flex-wrap justify-center items-center px-6 py-4 rounded-md">
                            <div className="mt-3 flex flex-col flex-wrap mx-auto items-start justify-between">
                              <label className="py-3 text-black" htmlFor="">
                                Name
                              </label>
                              <input
                                onChange={(e) => {
                                  setName(e.target.value);
                                }}
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 w-72 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Please enter your name..."
                                required
                              />
                            </div>
                            <div className="mt-3 flex flex-col flex-wrap mx-auto items-start justify-between">
                              <label className="py-3 text-black" htmlFor="">
                                Wallet address
                              </label>
                              <input
                                type="text"
                                onChange={(e) => {
                                  setReceiverWallet(e.target.value);
                                }}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 w-72 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Please enter wallet address..."
                                required
                              />
                            </div>
                            <div className=" w-full flex justify-around mt-4 items-center ">
                              <Button
                                className="w-[130px] py3 my-3"
                                onClick={() => register()}
                              >
                                Save
                              </Button>
                              <Button
                                onClick={() => {
                                  setToggle(!toggle);
                                }}
                                ref={cancelButtonRef}
                                className="w-[130px] bg-red-500 hover:bg-red-600  py3 my-3"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
