import React from "react";
import styles from "../../styles/Home.module.css";
import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import { useAccount, useSigner, useProvider, useContract } from "wagmi";
import {
  profileManager_data,
  personalized_data,
} from "../../constants/constants";
import { StorePageData } from "../../functionality/storePageData";

export default function Paypage() {
  const [toggle, setToggle] = useState(false);
  const cancelButtonRef = useRef(null);

  const [isUser, setIsUser] = useState("");
  const [pageName, setPageName] = useState("");
  const [domainName, setDomainName] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");

  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();

  const Profile_contract = useContract({
    address: profileManager_data.address,
    abi: profileManager_data.abi,
    signerOrProvider: signer || provider,
  });

  const Personalized_contract = useContract({
    address: personalized_data.address,
    abi: personalized_data.abi,
    signerOrProvider: signer || provider,
  });

  const checkUser = async () => {
    try {
      console.log("Checking user");
      const data = await Profile_contract.checkUser(address);
      console.log(data);
      setIsUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  const uploadData = async () => {
    try {
      console.log("uploading Data ...");
      const cid = await StorePageData(
        pageName,
        description,
        domainName,
        contact
      );
      console.log(cid);
      const URI = `https://ipfs.io/ipfs/${cid}`;

      generatePayPage(URI);
    } catch (err) {
      console.log(err);
    }
  };

  const generatePayPage = async (ipfsURI) => {
    try {
      console.log("Generating Page address...");
      const data = await Personalized_contract.createPage(domainName, ipfsURI);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-[90%] mx-auto pt-20">
        <div className={`${styles.animation} flex flex-col justify-start pt-5`}>
          <h1 className="text-3xl mx-auto text-center font-semibold pb-6">
            Create and Manage Payment Pages
          </h1>

          <div
            className={`${styles.gradient} flex justify-start flex-col w-full `}
          >
            {/* <h1 className="text-2xl text-white font-semibold py-2 pl-9">
            gm samridh!!! welcome to your personalized Onyxfi dashboard 🚀
          </h1> */}

            <div className="py-4 flex flex-wrap justify-center items-center ">
              <button
                className={`${styles.btnPrimary}`}
                onClick={() => {
                  setToggle(!toggle);
                }}
              >
                Create a new payment page
              </button>
            </div>
          </div>
        </div>

        <h1 className="text-center mt-8 text-2xl font-normal underline">
          Payment Page Logs
        </h1>

        <div className="flex flex-row flex-wrap justify-center md:justify-between items-center p-2 text-md mt-2 mb-8 text-gray-200">
          {/* id */}

          <div className="mt-3 flex flex-col flex-wrap mx-auto items-start justify-between">
            <label className="py-3" htmlFor="">
              Transaction Id
            </label>
            <input
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 w-72 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Transaction id..."
              required
            />
          </div>
          {/* amount */}
          <div className="mt-3 flex flex-col flex-wrap mx-auto items-start justify-between">
            <label className="py-3" htmlFor="">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 w-72 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Amount..."
              required
            />
          </div>
          {/* note */}
          <div className=" mt-3 flex flex-col flex-wrap mx-auto  items-start justify-between">
            <label htmlFor="message" className="py-3  ">
              Status
            </label>

            <select
              id="countries"
              className="bg-gray-50 border w-72 md:w-64 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="pending" selected>
                Pending
              </option>
              <option value="completed">Completed</option>
            </select>
          </div>
          {/* date */}
          <div className=" mt-3 flex flex-col flex-wrap mx-auto items-start justify-between">
            <label htmlFor="message" className="py-3">
              Date
            </label>
            <div className="relative">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg
                  // aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                // datepicker
                datepicker-format="mm/dd/yyyy"
                type="date"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-72"
                placeholder="Select date"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto relative z-[-]">
          <table className="w-full text-sm text-left text-gray-100 ">
            <thead className="text-sm uppercase bg-[#282a42] text-gray-100">
              <tr cla>
                <th scope="col" className="py-3 px-6">
                  Transaction Id
                </th>
                <th scope="col" className="py-3 px-6">
                  Amount
                </th>
                <th scope="col" className="py-3 px-6">
                  Created At
                </th>
                <th scope="col" className="py-3 px-6">
                  Status
                </th>
                <th scope="col" className="py-3 px-6">
                  View at Etherscan
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[#8585ff] border-b border-gray-700 text-black">
                <th
                  scope="row"
                  className="py-4 px-6 font-medium  whitespace-nowrap "
                >
                  1
                </th>
                <td className="py-4 px-6">$2000</td>
                <td className="py-4 px-6">12/11/2022</td>
                <td className="py-4 px-6">Pending</td>
                <td className="py-4 px-6">
                  <a
                    className=" underline"
                    target="_blankspace"
                    rel="noreferrer"
                    href="https://etherscan.io/"
                  >
                    {`https://etherscan.io/`.slice(0, 30)}...
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity bg-[#0c0c1764] backdrop-blur-[6px]" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
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
                        {/* <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div> */}
                        <div className="mt-3 flex flex-col justify-center items-center text-center sm:mt-0 sm:ml-4 w-full sm:text-left">
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 mr-auto pl-4 text-gray-900 px-2"
                          >
                            Enter Details
                          </Dialog.Title>
                          <div className="flex flex-row  flex-wrap justify-center items-center p-2 text-sm mt-2  text-gray-500">
                            {/* DomianName */}
                            <div className="w-full mt-3 flex flex-wrap items-center justify-between ">
                              <label className="p-3" htmlFor="">
                                Page Domain :
                              </label>
                              <input
                                type="text"
                                id="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 w-72 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Enter a domain for your page"
                                required
                                onChange={(e) => {
                                  setDomainName(e.target.value);
                                }}
                              />
                            </div>

                            {/* Display domain example like , You pay page would be on "https://Onyxfi.io/domain"  */}
                            {/* title */}
                            <div className="w-full mt-3 flex flex-wrap items-center justify-between ">
                              <label className="p-3" htmlFor="">
                                Page Title
                              </label>
                              <input
                                type="text"
                                id="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 w-72 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Page title..."
                                required
                                onChange={(e) => {
                                  setPageName(e.target.value);
                                }}
                              />
                            </div>

                            {/* description */}
                            <div className="w-full mt-3 flex flex-wrap items-start justify-between">
                              <label htmlFor="message" className="p-3">
                                Page Description
                              </label>
                              <textarea
                                id="message"
                                rows="2"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 w-72 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Page Description..."
                                onChange={(e) => {
                                  setDescription(e.target.value);
                                }}
                              ></textarea>
                            </div>

                            {/* mail */}
                            <div className="w-full mt-3 flex flex-wrap items-start justify-between">
                              <label className="p-3" htmlFor="">
                                Contact Details
                              </label>
                              <input
                                type="email"
                                id="amount"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 w-72 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Enter your email..."
                                required
                                onChange={(e) => {
                                  setContact(e.target.value);
                                }}
                              />
                            </div>

                            {/* amount
                            <div className="w-full mt-3 flex flex-wrap items-start justify-between">
                              <label htmlFor="message" className="p-3">
                                Amount
                              </label>
                              <input
                                type="number"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 w-72 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Enter amount to receive..."
                              />
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        className={` mr-2 w-full inline-flex justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                        // "inline-flex w-full justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => uploadData()}
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        className={`mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                        // mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
                        onClick={() => {
                          setToggle(!toggle);
                        }}
                        ref={cancelButtonRef}
                      >
                        Close
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </DashboardLayout>
  );
}
