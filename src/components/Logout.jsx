import React from "react";

function LogoutButton({
  account,
  web3Modal,
  loadWeb3Modal,
  web3Provider,
  setWeb3Provider,
  logoutOfWeb3Modal,
}) {
  // const { logout, isAuthenticating, account } = useMoralis();
  // const { switchNetwork, chainId } = useChain();
  if (account) {
    return (
      <div className="text-right lg:flex align-middle py-2">
        <div className="align-middle py-2">
          {/* <h1 className="text-slate-600 text-right font-mono px-10 py-0"><b>Wallet:</b> {(chainId==="0xa86a")?account.substring(0,5)+'...'+account.slice(-4):<button className="text-[red]" onClick={()=>switchNetwork("0xa86a")}>Switch to Avalanche!</button>}</h1> */}
        </div>
        <button
          className="rounded-lg px-4 md:px-8 xl:px-12 py-1 border-4  border-spot-yellow text-xs md:text-l 2xl:text-xl font-mono text-slate-500 bg-slate-900 bg-opacity-50 
            hover:bg-spot-yellow hover:border-white hover:text-gray-900 duration-300"
          onClick={() => logoutOfWeb3Modal()}
        >
          {account.substring(0, 5) +
            "..." +
            account.substring(account.length - 4)}
        </button>
      </div>
    );
  }
  return (
    <div className="text-right lg:flex align-middle py-0">
      <div className="align-middle py-2">
        <button
          className="rounded-lg px-8 md:px-8 xl:px-12 py-1 border-4 border-spot-yellow text-xs md:text-l 2xl:text-xl font-mono text-spot-yellow 
            hover:bg-spot-yellow hover:border-white hover:text-slate-900 duration-300 bg-slate-900 bg-opacity-50"
          onClick={() => loadWeb3Modal()}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default LogoutButton;
