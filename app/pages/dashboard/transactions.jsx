import { Dropdown } from "flowbite-react";
import React from "react";
import DashboardLayout from "../../components/DashboardLayout.jsx";

export default function Transactions() {
  return (
    <DashboardLayout>
      <div className="w-[90%] mx-auto pt-20">
        <h1 className="text-4xl pb-0 text-center ">Transactions</h1>

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
              <option value="pending" selected>Pending</option>
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
      </div>
    </DashboardLayout>
  );
}
