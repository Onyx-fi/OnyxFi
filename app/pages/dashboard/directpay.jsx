import React from "react";
import DashboardLayout from "../../components/DashboardLayout.jsx";

export default function Directpay() {
  return (
    <DashboardLayout>
      <div className="w-[90%] mx-auto pt-20">
        <div className="flex flex-col items-center justify-center pt-5 pb-10">
          <h1 className="text-3xl font-semibold ml-3 pb-6 text-center">
            Split Payments
          </h1>
        </div>
      </div>
    </DashboardLayout>
  );
}
