import Link from "next/link";
import React from "react";
import styles from "../styles/DahboardLayout.module.css";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import logo from '../assets/navLogoo.png'
import Image from "next/image";
import { useState } from "react";
import { Card } from "flowbite-react";

const menuItems = [
  {
    href: "/dashboard/",
    title: "Home",
  },
  {
    href: "/dashboard/transactions",
    title: "Transactions",
  },
  {
    href: "/dashboard/paylinks",
    title: "Payment Links",
  },
  {
    href: "/dashboard/paypage",
    title: "Payment Pages",
  },
  {
    href: "/dashboard/giftcard",
    title: "Gift Card",
  },
  {
    href: "/dashboard/paysplit",
    title: "Payment Splitter",
  },
  // {
  //   href: "/dashboard/directpay",
  //   title: "Direct Pay",
  // },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const [toggle, setToggle] = useState(true);

  const [isActive, setIsActive] = useState(false);

  function handleClick() {
    setIsActive(!isActive);
  }

  return (
    <div className={` `}>
      <div className="min-h-screen flex flex-col">
        <header>
          <nav className={styles.navbar}>
            <div className={styles.logo}>
              <Link href={"/"}>
                <Image src={logo} />
              </Link>
            </div>

            <ul
              className={
                isActive === false
                  ? styles.navmenu
                  : styles.navmenu + " " + styles.active
              }
            >
              <li className={`${styles.navLink}`}>
                <ConnectButton />
              </li>
            </ul>
            <button
              className={`md:hidden cursor-pointer mr-3 ${
                toggle === false
                  ? styles.hamburger
                  : styles.hamburger + " " + styles.active
              }`}
              onClick={() => setToggle(!toggle)}
            >
              <span className={styles.bar}></span>
              <span className={styles.bar}></span>
              <span className={styles.bar}></span>
            </button>
          </nav>
        </header>
        <div className="flex flex-col md:flex-row flex-1">
          <aside
            className={`${
              toggle ? "block" : "hidden"
            } scroll-auto z-[2] border-r-[0px] md:border-r-[1px] border-[#dff5ff2e] border-0 md:border-[#4a4f92] bg-[#15151f] bg-[#0c0c1712] backdrop-blur-3xl w-full md:w-72 fixed min-h-screen shadow-md`}
          >
            <nav>

              <ul className="px-2 md:pt-[6rem] pt-[4rem]">
                
                {menuItems.map(({ href, title }) => (
                  <li className="m-2" key={title}>
                    <Link legacyBehavior href={href}>
                      <a
                        className={` flex p-2 mt-5 bg-[#21212d] rounded hover:bg-[#8585ff] hover:text-black hover:duration-200 cursor-pointer ${
                          router.asPath === href && "bg-[#8585ff] text-white"
                        }`}
                      >
                        {title}
                      </a>
                    </Link>
                  </li>
                ))}
                <li className="mt-5 mx-2 md:hidden block w-full">
                  <span className="">
                    <ConnectButton />
                  </span>
                </li>
              </ul>
            </nav>
          </aside>
          <main className="flex-1 md:ml-[300px] md:mr-16 md:pt-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
