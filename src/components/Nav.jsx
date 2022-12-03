import React, { useState } from "react";
import logo from "../assets/logo192.png";
import LogoutButton from "./Logout";
import { GiHamburgerMenu } from "react-icons/gi";

export const Nav = ({
  account,
  web3Modal,
  loadWeb3Modal,
  web3Provider,
  setWeb3Provider,
  logoutOfWeb3Modal,
}) => {

  let Links = [
    { name: "Home", link: "/" },
    { name: "NFTombstones", link: "/gravedigger" },
    { name: "View Engraved NFTombstones", link: "https://joepegs.com/collections/0xe3525413c2a15daec57c92234361934f510356b8" },
    { name: "Unnamed Branding", link: "/unnamed" },
    { name: "Analog", link: "/analog" },
    { name: "Spot Staking", link: "/staking" },
    { name: "Scribble Custom Cards", link: "/scribble" },
    { name: "Twitter", link: "https://twitter.com/TheSpotnft" },
    { name: "Discord", link: "https://discord.com/invite/4wvC6xTFyB" },
  ];

  const [open, setOpen] = useState(false);

  return (
    <nav className="main-nav pb-20 md:pb-20 lg:pb-15 xl:pb-15 2xl:pb-15">
      <div className="shadow-md w-full fixed top-0 left-0 pb-0 md:pb-4 sm:pb-4 bg-spot-yellow">
        <div className="flex items-center justify-between bg-spot-yellow py-0 px-7">
          <div className="desktop-nav">
            <ul
              className={`overflow-y-visible xl:flex xl:items-center font-mono md:pb-0 sm:pb-0 absolute xl:static bg-spot-yellow xl:z-auto z-[-1] 
    left-0 w-full xl:w-auto xl:pl-0 pl-0 transition-all duration-300 ease-in ${open ? "top-[65px] opacity-90 z-[1]]" : "top-[-550px]"
                }`}
            >
              <img src={logo} alt="logo" className="m-0 w-20 sm:hidden md:hidden lg:block"></img>


              {Links.map((link) => (
                <li
                  key={link.name}
                  className="md:ml-8 lg:ml-8 xl:ml-8 xxl:ml-8 sm:text-base md:text-xl hover:text-gray-400 duration-300 md:my-4 lg:my-4 xl:my-0 xxl:my-0 my-4 pl-2"
                >
                  <a
                    target={
                      (link.name === "Twitter" ||
                        link.name === "Discord") &&
                      "_blank"
                    }
                    href={link.link}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div
            onClick={() => setOpen(!open)}
            className="text-3xl absolute left-8 top-6 cursor-pointer xl:hidden"
          >
            <GiHamburgerMenu name={open ? "close" : "menu"} />
          </div>
          <LogoutButton
            account={account}
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            web3Provider={web3Provider}
            setWeb3Provider={setWeb3Provider}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
          />
        </div>
      </div>
    </nav>
  );
};
