import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import { profileManager_data } from "../constants/constants";

import { useState } from "react";

export default function login() {
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();

  const [name, setName] = useState("");
  const [isUser, setIsUser] = useState("");

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
        const tx = await Manager_contract.register(address, name);
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
}
