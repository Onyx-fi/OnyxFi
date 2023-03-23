import Link from "next/link.js";
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import { Label, TextInput, Checkbox, Button } from "flowbite-react";
import Image from "next/image.js";
import gc from "../../assets/giftcard.gif";
import gradient from "../../assets/gc.png";
import { useAccount, useSigner, useProvider, useContract } from "wagmi";
import {
  giftCardCreator_data,
  giftCard_ABI,
} from "../../constants/constants.js";
import { StoreGiftCard } from "../../functionality/storeGiftCards";
import { ethers } from "ethers";

export default function GiftCard() {
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [name, setName] = useState("");
  const [receiversAddress, setReceiversAddress] = useState("");
  const [amount, setamount] = useState(0);
  const [note, setNote] = useState("");
  const [validity, setValidity] = useState("");
  const [giftCardNo, setgiftCardNo] = useState("");
  const GiftCard_Contract = useContract({
    address: giftCardCreator_data.address,
    abi: giftCardCreator_data.abi,
    signerOrProvider: signer || provider,
  });

  const uploadData = async () => {
    try {
      console.log("Uploading Data ...");
      const cid = await StoreGiftCard(
        name,
        amount,
        note,
        receiversAddress,
        validity
      );
      console.log(cid);
      const URI = `https://ipfs.io/ipfs/${cid}`;
      createGiftCard(URI);
    } catch (err) {
      console.log(err);
    }
  };

  const createGiftCard = async (_ipfsURI) => {
    try {
      console.log("Creating gift Card... deploying Contracts");
      const expiry = Date.parse(validity);
      console.log(expiry);
      const _amount = ethers.utils.parseEther(amount);
      const tx = await GiftCard_Contract.createGiftCard(
        receiversAddress,
        expiry,
        _amount,
        _ipfsURI
      );
      await tx.wait();
      console.log(tx);
      const id = tx.v;
      getGiftCard(id);
    } catch (err) {
      console.log(err);
    }
  };

  const getGiftCard = async (_gcID) => {
    try {
      const gcContract = await GiftCard_Contract.getGcContractAddress(_gcID);
      const GiftCardNo = gcContract.slice(2, 18);
      console.log(GiftCardNo);
      setgiftCardNo(GiftCardNo);
    } catch (err) {
      console.log(err);
    }
  };

  const addBalancetoGiftCard = async (_contractAddress) => {
    try {
      console.log("Adding Balance ...");
      const gcContract = new ethers.Contract(
        _contractAddress,
        giftCard_ABI,
        provider
      );
      const _amount = ethers.utils.parseEther(amount);
      gcContract.initialize({ value: _amount });
      console.log("Gift Card Intialized");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-[90%] mx-auto pt-20">
        <div className="flex flex-col justify-start pt-5 pb-10">
          <h1 className="text-3xl font-semibold ml-3 pb-6 text-center">
            Gift Card
          </h1>

          {/* ${styles.gradient} */}
          <div
            className={`
          w-full flex justify-between items-start flex-wrap flex-row `}
          >
            {/* gift card form */}
            <div className="bg-gray-50 p-4 rounded-md mx-4 my-6 w-6/12">
              <div className="mt-3 flex flex-col justify-center items-center text-center sm:mt-0 sm:ml-4  sm:text-left">
                <h1 className="text-xl font-medium leading-6 mr-auto pl-2 text-gray-900 ">
                  Enter Details
                </h1>
                <div className="flex flex-row  flex-wrap justify-center items-center p-2 text-sm text-gray-500">
                  {/* name */}
                  <div className="w-full mt-1 flex flex-wrap items-center justify-between ">
                    <label className="py-3" htmlFor="">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Receivers name..."
                      required
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </div>

                  {/* wallet address */}
                  <div className="w-full mt-3 flex flex-wrap items-center justify-between ">
                    <label className="py-3" htmlFor="">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                      placeholder="Receivers wallet address..."
                      required
                      onChange={(e) => {
                        setReceiversAddress(e.target.value);
                      }}
                    />
                  </div>

                  {/* amount */}
                  <div className="w-full mt-3 flex flex-wrap items-start justify-between">
                    <label className="py-3" htmlFor="">
                      Amount
                    </label>
                    <input
                      type="number"
                      id="amount"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Amount in USD..."
                      required
                      onChange={(e) => {
                        setamount(e.target.value);
                      }}
                    />
                  </div>

                  {/* note */}
                  <div className="w-full mt-3 flex flex-wrap items-start justify-between">
                    <label htmlFor="message" className="py-3">
                      Note
                    </label>
                    <textarea
                      id="message"
                      rows="5"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Special message for receiver..."
                      onChange={(e) => {
                        setNote(e.target.value);
                      }}
                    ></textarea>
                  </div>

                  {/* validity */}
                  <div className="w-full mt-3 flex flex-wrap items-start justify-between">
                    <label htmlFor="message" className="py-3">
                      Validity
                    </label>
                    <div className="relative w-full">
                      <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none w-full">
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
                        datepicker-format="mm/dd/yyyy"
                        type="date"
                        className="bg-gray-50 w-full  border border-gray-300 text-gray-900 sm:text-sm rounded-[5px] focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Select date"
                        onChange={(e) => {
                          setValidity(e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  {/* border */}
                  <div className="w-full mt-8 flex flex-wrap items-start justify-between">
                    <span className="border-t-2 w-full border-gray-300"></span>
                  </div>

                  {/* button */}
                  <div className="w-full mt-4 flex flex-wrap items-start justify-between">
                    <Button
                      className="w-full"
                      type="submit"
                      onClick={() => uploadData()}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="h-min min-h-[80vh] border-l border-gray-500 "></div> */}

            {/* rendered gift card */}
            <div
              className={`flex hover:scale-[1.01] cursor-pointer transition ease-in-out bg-gray-900 items-center py-4 justify-center flex-col rounded-lg mx-4 my-6  w-5/12`}
            >
              <div className={` w-full `}>
                {/* <h1>Onyxfi Gift Card</h1> */}
              </div>
              <div className="flex flex-col ">
                <Image src={gradient} />
                <h2 className="text-xl mt-8 font-semibold text-gray-100">
                  gm!!! samridh,
                </h2>
                <span className="text-md mt-2 font-normal text-gray-100">
                  <u>
                    {" "}
                    You&#39;ve got a <span className="font-bold ">
                      Onyxfi
                    </span>{" "}
                    Gift Card
                  </u>
                </span>
                <span className="text-lg mt-2 font-semibold italic text-gray-100 max-w-[50ch]">
                  Hey samridh, please accept your Diwali Gift card, I wish you
                  and your family a happy one
                </span>
                <div className="flex flex-wrap justify-start items-start w-full mt-4">
                  <div className=" max-w-[250px] rounded-sm p-2 border-gray-600 border my-4">
                    {/* hover:scale-[1.02] transition ease-in-out */}
                    <Image src={gc} />
                  </div>
                  <div className="max-w-[220px] mx-6 ">
                    <h1 className="text-3xl mt-6 font-semibold text-gray-100">
                      $ 5500
                    </h1>
                    <h1 className="text-md mt-3 font-semibold text-gray-100">
                      Gifted to:{" "}
                      <span className="text-xs">
                        {" "}
                        0xA25c5bE1324764573dE0a14ABFe0279B4291adfA
                      </span>
                    </h1>
                    <h1 className="text-md mt-3 font-semibold text-gray-100">
                      Valid Till: <u>11/11/2022</u>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
