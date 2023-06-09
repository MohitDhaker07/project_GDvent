import logo from "../public/img/Vector.svg";
import Image from "next/image";
import GDG_icon_1 from "../public/img/GDG_icon_1.svg"
import { useEffect, useState } from "react";
import Link from "next/link";
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'

let web3modal;
if (typeof (window) !== "undefined") {
  web3modal = new Web3Modal({
    network: "goerli",
    providerOptions: {},
    disableInjectedProvider: false
  })
}

function Navbar(props) {
  const [hideNav, setHideNav] = useState(true);
  const [screenWidth, setScreenWidth] = useState();
  const [walletConnected, setWalletConnected] = useState(false)
  const [currentAddress, setCurrentAddress] = useState()

  const openNav = () => {
    setHideNav(!hideNav);
  };

  const connectWallet = async (needSigner = false) => {
    try {
      const instance = await web3modal.connect()
      const provider = new ethers.providers.Web3Provider(instance)
      const { chainId } = await provider.getNetwork()
      if (chainId !== 5) {
        window.alert("connect with goerli network")
        throw new Error("inncorrect network")
      }
      if (needSigner) {
        const signer = provider.getSigner()
        setWalletConnected(true)
        setCurrentAddress(signer.getAddress())
        return signer
      }
      const signer = provider.getSigner()
      setCurrentAddress(signer.getAddress())
      setWalletConnected(true)
      return provider
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (window) {
      setScreenWidth(window.innerWidth);
      window.addEventListener("resize", (e) => {
        setScreenWidth(e.target.innerWidth);
      });
    }
    const navContainer = document.querySelector("header");
    const navHeight = navContainer.clientHeight;
    window.addEventListener("scroll", () => {
      window.pageYOffset > navHeight
        ? (navContainer.style.background = "rgba(0, 0, 0, .3)")
        : (navContainer.style.background = "transparent");
    });
  }, []);

  function walletButton() {
    if (!walletConnected) {
      return (
        <button className="tetiary-1" onClick={connectWallet} >Connect Wallet</button>
      )
    }
    if (walletConnected) {
      return (
        <button className="tetiary-1" >Connected</button>
      )
    }
  }

  return (
    <header className="flex flex-wrap justify-center items-center sticky top-0 bg-transparent backdrop-blur-lg z-[99] transition duration-200 py-0.5 px-16">
      <div className="flex mr-auto py-2 pl-6">
        <Link href="/">
          <a className="flex mr-auto hover:bg-[#dbd5d533] ease-in transition duration-700 px-2 py-1 border-0 rounded-xl">
            <div className="font-inter font-semibold text-[26px] text-gradient-1">
              GDvent
            </div>
            <Image src={GDG_icon_1} alt="image" />
          </a>
        </Link>
      </div>
      <div className="absolute space-x-8">

        <Link href="/events">
          <a className="nav-link">Events</a>
        </Link>
        <Link href="/addevent">
          <a className="nav-link">Add Event</a>
        </Link>
        <Link href="/ticket">
          <a className="nav-link">Your Tickets</a>
        </Link>
        <Link href="/ticket">
          <a className="nav-link">Your Events</a>
        </Link>
      </div>
      <div className="items-end">
        {walletButton()}
      </div>
    </header>
  );
}

export default Navbar;
