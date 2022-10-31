import React, { useState } from "react";
import logo from "../assets/logo.png";
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
    { name: "Twitter", link: "https://twitter.com/TheSpotnft" },
    { name: "Discord", link: "https://discord.com/invite/4wvC6xTFyB" },
  ];

  const [open, setOpen] = useState(false);

  return (
    <nav className="main-nav pb-20">
      <div className="shadow-md w-full fixed top-0 left-0 pb-4 md:pb-0 bg-spot-yellow">
        <div className="md:flex items-center justify-between bg-spot-yellow py-0 px-7">
          <div className="desktop-nav">
            <ul
              className={`md:flex md:items-center font-mono md:pb-0 pb-12 absolute md:static bg-spot-yellow md:z-auto z-[-1] 
    left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-300 ease-in ${open ? "top-20 opacity-90" : "top-[-490px]"
                }`}
            >
              <img src={logo} alt="logo" className="m-0 w-20"></img>


              {Links.map((link) => (
                <li
                  key={link.name}
                  className="md:ml-8 lg:ml-8 xl:ml-8 xxl:ml-8 text-xl hover:text-gray-400 duration-300 md:my-0 lg:my-0 xl:my-0 xxl:my-0 my-7 pl-2"
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
            className="text-3xl absolute left-8 top-6 cursor-pointer md:hidden"
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
