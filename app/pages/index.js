import Head from "next/head";
import styles from "../styles/Home.module.css";
import styles2 from "../styles/Features.module.css";
import Image from "next/image";
import Layout from "../components/Layout";
import wallet from "../assets/wallet.png";
import Link from "next/link";
import Register from "../components/Register";
import poly from "../assets/poly1.png";
import swiftpay from "../assets/swiftpay.png";

export default function Home() {
  return (
    <>
      <Layout>
        <div className="pt-[3rem]">
          <div className={`${styles.main} pt-14`}>
            <div className={`${styles.left} md:pt-0 pt-14`}>
              <h1 className={styles.heading}>
                <span className={styles.color1}>Onyx</span>
                <span className={styles.color2}>Fi</span>
              </h1>
              <p>
                Onyxfi is a platform that lets you receive payments in the form
                of crypto by generating a unique link for every user.
              </p>
              <br />
              <p>
                Onyxfi also offers you four different payment options, Pay Now,
                Pay Later, Pay using EMI, Pay in Stream
              </p>
              <br />
              <p>
                You can also use gift cards to send money to your loved ones.
                <br />
                <br />
                OnyxPay is another feature of Onyxfi that offers you a npm
                package which you can use in your projects and integrate
                different payment options all at once :D
              </p>
              <div
                className={`flex items-center justify-start ${styles.buttons}`}
              >
                <Link href={"/dashboard"}>
                  <button className={styles.btnPrimary}>Dashboard 🚀</button>
                </Link>

                <Register />
                {/* <a
                  target="_blank"
                  href="https://github.com/Onyxfi"
                  rel="noopener noreferrer"
                > 
               <button className={styles.btnSecondary}>Github 😎</button> 

                 </a> */}
              </div>
            </div>
            <div className={`${styles.right}`}>
              {/* <Image className={styles.hero} src={wallet} /> */}
              <div
                className={`  my-20 sm:my-20 lg:my-0 hover:scale-110 transition-transform ease-in-out ${styles2.tariffCards}`}
              >
                <div className={styles2.economy}>
                  {/*<Image
                    className=" mx-auto w-fit top"
                    src={poly}
                    alt="eth"
                    height="150"
                  />*/ }
                  <h3>Create Unique Payment Links</h3>
                  <span>
                    Receive payments easily by setting up unique payment links{" "}
                  </span>
                </div>
                <div className={styles2.premiumeconomy}>
                  {/*<Image
                    className=" mx-auto w-fit top"
                    src={poly}
                    alt="eth"
                    height="150"
                  />*/ }
                  <h3>Send Gift Cards</h3>
                  <span>
                    Create Gift Cards and send them to your loved ones
                  </span>
                </div>
                <div className={styles2.business}>
                  {/*<Image
                    className=" mx-auto w-fit top"
                    src={poly}
                    alt="eth"
                    height="150"
                  />*/ }
                  <h3>Cretae Unique Payment Pages </h3>
                  <span>
                    Create payment pages easily for special events and recieve
                    money easily{" "}
                  </span>
                </div>
                <div className={styles2.first}>
                  {/*<Image
                    className=" mx-auto w-fit top"
                    src={poly}
                    alt="eth"
                    height="150"
                  />*/ }
                  <h3>Choose b/w 4 Options</h3>
                  <span>
                    Onyxfi offers you options like Pay Now, Pay Later, Pay EMI,
                    Pay in Stream{" "}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="my-8 flex justify-evenly items-start flex-wrap-reverse md:flex-wrap">
            <div
              className={`px-4 w-[550px] hover:scale-105 transition-transform ease-in-out ${styles.swiftpay}`}
            >
              <Image className="" src={swiftpay} alt="swiftpay" />
            </div>
            <div className=" ">
              <h1 className="my-8 px-4 underline text-center text-3xl font-semibold">
                OnyxPay - The Payment Component{" "}
              </h1>
              <div className="max-w-[500px] md:p-0 p-4 text-justify text-[17px] ">
                Onyxfi - Payment Component to enable accepting payments in
                crypto with multi-chain and multi-coin support . Offer payment
                options like PayNow , PayLater , PayViaEMI and PayVia Stream to
                your payers directly from the component , powered by Onyxfi
                Smart Contracts deployed on Blockchain . Integrate in your
                Website with just few lines of Code and provide seemless
                experience of paying via crypto to your users.
              </div>
              <div className="my-5 mx-3 md:mx-0
              ">
                <a
                  target="_blank"
                  href="https://github.com/Onyx-fi/OnyxFi-Package"
                  rel="noopener noreferrer"
                >
                  <button className={styles.btnPrimary}>
                    {" "}
                    Get OnyxPay Package 😎
                  </button>
                </a>
              </div>
            </div>
          </div>

          <div>
            <main className={styles.features_main}>
              <section className={styles.features_section}>
                <h1 className={styles.section__title}>
                  <span>Onyxfi Features</span>
                </h1>
                <p className={styles.section__desc}>
                  Onyxfi offers variety of features to help you make and manage
                  payments easily. We have planned to release a complete banking
                  suite that can be used widely help us all take web3 one-step closer to mass adoption
                </p>
                <div className={styles.features}>
                  <div className={`${styles.feature} ${styles.feature_one}`}>
                    <h2 className={styles.feature__title}>Payment Links</h2>
                    <p className={styles.feature__desc}>
                      You can generate unique payment links directlyfrom the dashboard and use them to receive funds in the wallet of your choice. Onyxfi also offers a in-built wallet
                    </p>
                    <img
                      className={styles.feature__img}
                      src="https://kellychi22.github.io/frontend-mentor-solutions/10-four-card-feature-section/images/icon-supervisor.svg"
                      alt=""
                    />
                  </div>
                  <div className={styles.wrapper}>
                    <div className={`${styles.feature} ${styles.feature_two}`}>
                      <h2 className={styles.feature__title}>
                        Onyxfi-Pay Node Package
                      </h2>
                      <p className={styles.feature__desc}>
                       A Node package to help you built payment features in your applications easily
                      </p>
                      <img
                        className={styles.feature__img}
                        src="https://kellychi22.github.io/frontend-mentor-solutions/10-four-card-feature-section/images/icon-team-builder.svg"
                        alt=""
                      />
                    </div>
                    <div
                      className={`${styles.feature} ${styles.feature_three}`}
                    >
                      <h2 className={styles.feature__title}>Gift Cards</h2>
                      <p className={styles.feature__desc}>
                        Claimable crytpo gift cards to that you can send to anyone in the world
                      </p>
                      <img
                        className={styles.feature__img}
                        src="https://kellychi22.github.io/frontend-mentor-solutions/10-four-card-feature-section/images/icon-karma.svg"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className={`${styles.feature} ${styles.feature_four}`}>
                    <h2 className={styles.feature__title}>Payment Pages</h2>
                    <p className={styles.feature__desc}>
                      Payment pages to help you generate new pages directly using Onyxfi and receive money with ease
                    </p>
                    <img
                      className={styles.feature__img}
                      src="https://kellychi22.github.io/frontend-mentor-solutions/10-four-card-feature-section/images/icon-calculator.svg"
                      alt=""
                    />
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </Layout>
    </>
  );
}
