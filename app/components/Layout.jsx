import styles from "../styles/Layout.module.css";
import logo from "../assets/navLogoo.png";
import Image from "next/image";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link href={"/"}>
            <Image src={logo} />
          </Link>
        </div>

        <ul>
          <li className={styles.navLink}>
            <Link href={"/dashboard"}>Dashboard</Link>
          </li>
        </ul>
      </nav>

      <div className="min-h-screen">
        {children}
      </div>

      <footer className={styles.footer}>
        <h4>
          Built by{" "}
          <u>
            <a
              href="https://twitter.com/this_is_samridh"
              target="_blankspace"
              rel="noreferrer"
            >
              @this_is_samridh
            </a>
          </u>
         
        </h4>
      </footer>
    </>
  );
}
