import React, { useEffect, useState } from "react";
import Link from "next/link.js";
import DashboardLayout from "../../components/DashboardLayout";
import styles from "../../styles/Home.module.css";
import { Card } from "flowbite-react";
import { useAccount, useSigner, useProvider, useContract } from "wagmi";
import { profileManager_data } from "../../constants/constants";
import Register from "../../components/Register";

export default function DashboardHome() {
  const [account, setAccount] = useState("");
  const [userData, setUserData] = useState([]);
  const [userName, setUserName] = useState("");
  const [wallet, setWallet] = useState("");
  const [isUser, setIsUser] = useState("");

  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();

  const Profile_contract = useContract({
    address: profileManager_data.address,
    abi: profileManager_data.abi,
    signerOrProvider: signer || provider,
  });

  const checkUser = async () => {
    try {
      console.log("Checking user");
      const data = await Profile_contract.checkUser(address);
      console.log(data);
      setIsUser(data);
      if (data) {
        fetchUser();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUser = async () => {
    try {
      console.log("Fetching the user Data");
      const user = await Profile_contract.getUser(address);
      console.log(user);
      setUserData(user);
      setUserName(user.name);
      setWallet(user._wallet);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isConnected) {
      setAccount(address);
    } else {
      setAccount("Connect Wallet first");
    }
    checkUser();
  }, [account]);

  return (
    <div>
      <DashboardLayout>
        <div className="flex flex-col justify-start pt-20">
          <h1 className="text-xl pt-3 md:pt-0 md:text-3xl font-semibold pb-8 text-center w-[95%] mx-auto">
            gm {`${account}`.slice(0, 10)}.... welcome to your personalized
            Onyxfi dashboard 🚀
          </h1>

          <div className="">
            <Card
              className={`${styles.profileCard} md:w-[75%] mx-auto transition hover:scale-105 ease-in-out`}
            >
              <div className="mb-4">
                <Register />
              </div>
              <div className="flex flex-col items-center pb-4 ">
                <img
                  className="mb-3 h-24 w-24 rounded-full shadow-lg"
                  src="https://cdn.dribbble.com/users/1684249/screenshots/15431837/media/b8793da764afaf229379b316181bf8eb.gif"
                  alt="Bonnie image"
                />
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                  {userName}
                </h5>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-400">
                  Wallet : {wallet}
                </span>
                <div className="mt-4 flex space-x-3 lg:mt-6">
                  <a
                    href="#"
                    className="inline-flex items-center rounded-lg bg-blue-700 py-2 px-4 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Withdraw
                  </a>

                  {/* withdraw loading btn */}
                  {/* <button
                    disabled
                    type="button"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                  >
                    <svg
                      role="status"
                      class="inline mr-3 w-4 h-4 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    In progress...
                </button> */}

                  <a
                    href="#"
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white py-2 px-4 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                  >
                    Verify
                  </a>

                  {/* verify loading btn */}
                  {/* <button
                    type="button"
                    class="py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
                  >
                    <svg
                      role="status"
                      class="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="#1C64F2"
                      />
                    </svg>
                    Verifying...
                  </button> */}
                </div>
              </div>
            </Card>

            <h1 className="text-3xl font-semibold mt-8 text-center ">
              <span className="underline">Explore Features</span> 😎
            </h1>

            <div className="flex justify-center flex-wrap my-5">
              <div className=" md:max-w-[550px] w-[90%] transition text-[#140f21] hover:ease-in-out hover:scale-105 bg-[#8585ff] border border-[#ffffff2e] p-4 mx-4 my-3 rounded-sm text-start">
                <h2 className="text-xl font-semibold pb-2">
                  <u>
                    <Link href={"/dashboard/paylinks"}>Payment Links</Link>{" "}
                  </u>
                </h2>
                <span className="">
                  Receive payments personalized payment
                  links and get paid in easily
                </span>
              </div>

              <div className=" md:max-w-[550px] w-[90%] transition text-[#140f21] hover:ease-in-out hover:scale-105 bg-[#8585ff] border border-[#ffffff2e] p-4 mx-4 my-3 rounded-sm text-start">
                <h2 className="text-xl font-semibold pb-2">
                  <u>
                    <Link href={"/dashboard/transactions"}>
                      Manage Transactions
                    </Link>
                  </u>
                </h2>
                <span className="">
                  View and manage all the transactions in the transactions page
                </span>
              </div>

              <div className=" md:max-w-[550px] w-[90%] transition text-[#140f21] hover:ease-in-out hover:scale-105 bg-[#8585ff] border border-[#ffffff2e] p-4 mx-4 my-3 rounded-sm text-start">
                <h2 className="text-xl font-semibold pb-2">
                  <u>
                    <Link href={"/dashboard/invest"}>Gift Card</Link>
                  </u>
                </h2>
                <span className="">
                  Send claimable crypto gift cards to your favorite people
                </span>
              </div>

            
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
