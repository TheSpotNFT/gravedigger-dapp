import React, { useEffect, useMemo, useState } from "react";
import { ethers, Contract } from "ethers";
import { useAuth } from "../../Auth";
import {
    VIBES_ADDRESS,
    VIBES_ABI,
    GUD_VIBE_ID,
    BAD_VIBE_ID,
    VIBES_LEADER_ADDRESSES,
} from "../Contracts/VibesContract";
import {
    VIBES_ALIAS_REGISTRY_ADDRESS,
    VIBES_ALIAS_REGISTRY_ABI,
} from "../Contracts/VibesAliasRegistry";

const shorten = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

const VibesLeaderboard = () => {
    const { account, web3Provider, loadWeb3Modal } = useAuth();

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(false);

    const [aliases, setAliases] = useState({});
    const [editAddress, setEditAddress] = useState(null);
    const [editAliasValue, setEditAliasValue] = useState("");

    const [sendingTo, setSendingTo] = useState(null);
    const [sending, setSending] = useState(false);
    const [sendStatus, setSendStatus] = useState(null); // "success" | "error" | null

    const isConnected = !!account;

    // --- Provider / signer setup using your existing web3Provider pattern ---

    useEffect(() => {
        if (web3Provider) {
            setProvider(web3Provider);
            setSigner(web3Provider.getSigner());
        } else if (window.ethereum) {
            const p = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(p);
            setSigner(p.getSigner());
        } else {
            setProvider(null);
            setSigner(null);
        }
    }, [web3Provider]);

    // --- Build leaderboard from VIBES balances ---

    useEffect(() => {
        const load = async () => {
            if (!provider || !VIBES_ADDRESS || VIBES_LEADER_ADDRESSES.length === 0)
                return;

            try {
                setLoading(true);
                const vibes = new Contract(VIBES_ADDRESS, VIBES_ABI, provider);

                const rows = await Promise.all(
                    VIBES_LEADER_ADDRESSES.map(async (addr) => {
                        try {
                            const [gudRaw, badRaw] = await Promise.all([
                                vibes.balanceOf(addr, GUD_VIBE_ID),
                                vibes.balanceOf(addr, BAD_VIBE_ID),
                            ]);
                            const good = Number(gudRaw);
                            const bad = Number(badRaw);
                            const net = good - bad;
                            return { address: addr, good, bad, net };
                        } catch (err) {
                            console.error("Error reading balances for", addr, err);
                            return { address: addr, good: 0, bad: 0, net: 0 };
                        }
                    })
                );

                const sorted = rows
                    .slice()
                    .sort((a, b) => b.net - a.net || b.good - a.good);

                setLeaderboard(sorted);
            } catch (err) {
                console.error("Error loading leaderboard:", err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [provider]);

    // --- Load aliases from on-chain alias registry ---

    useEffect(() => {
        const loadAliases = async () => {
            if (
                !provider ||
                !VIBES_ALIAS_REGISTRY_ADDRESS ||
                leaderboard.length === 0
            ) {
                return;
            }

            try {
                const registry = new Contract(
                    VIBES_ALIAS_REGISTRY_ADDRESS,
                    VIBES_ALIAS_REGISTRY_ABI,
                    provider
                );

                const entries = await Promise.all(
                    leaderboard.map(async (row) => {
                        try {
                            const alias = await registry.getAlias(row.address);
                            return { address: row.address, alias };
                        } catch (e) {
                            console.error("Error loading alias for", row.address, e);
                            return { address: row.address, alias: "" };
                        }
                    })
                );

                const map = {};
                for (const { address, alias } of entries) {
                    map[address.toLowerCase()] = alias;
                }
                setAliases(map);
            } catch (e) {
                console.error("Error loading aliases from registry:", e);
            }
        };

        loadAliases();
    }, [provider, leaderboard]);

    // --- Alias helpers ---

    const getAliasFor = (addr) => {
        if (!addr) return "no alias configured";
        const key = addr.toLowerCase();
        const a = aliases[key];
        return a && a.trim().length > 0 ? a.trim() : "no alias configured";
    };

    const canEditAlias = (addr) => {
        if (!account || !addr) return false;
        return addr.toLowerCase() === account.toLowerCase();
    };

    const startEditAlias = (addr) => {
        setEditAddress(addr);
        setEditAliasValue(aliases[addr.toLowerCase()] || "");
    };

    const cancelEditAlias = () => {
        setEditAddress(null);
        setEditAliasValue("");
    };

    // Save alias on-chain using VibesAliasRegistry.setAlias
    const saveAlias = async () => {
        if (!editAddress) return;

        if (!signer) {
            await loadWeb3Modal();
            return;
        }

        const newAlias = editAliasValue.trim();

        try {
            const registry = new Contract(
                VIBES_ALIAS_REGISTRY_ADDRESS,
                VIBES_ALIAS_REGISTRY_ABI,
                signer
            );

            const tx = await registry.setAlias(newAlias);
            await tx.wait();

            const key = editAddress.toLowerCase();
            setAliases((prev) => ({
                ...prev,
                [key]: newAlias,
            }));

            setEditAddress(null);
            setEditAliasValue("");
        } catch (e) {
            console.error("Error setting alias:", e);
            alert(e?.data?.message || e?.message || "Error setting alias");
        }
    };

    // --- Send gudVibes / badVibes using VIBES mint(to, id, amount) ---

    const handleSendVibes = async (target, vibeType = "good") => {
        try {
            if (!window.ethereum) {
                alert("Please install / unlock a Web3 wallet (MetaMask, Core, etc).");
                return;
            }

            // Ensure wallet is connected
            if (!signer || !account) {
                await loadWeb3Modal();
                // re-grab signer from provider after connect
                const nextProvider =
                    web3Provider || new ethers.providers.Web3Provider(window.ethereum);
                setProvider(nextProvider);
                setSigner(nextProvider.getSigner());
            }

            const activeProvider =
                web3Provider || new ethers.providers.Web3Provider(window.ethereum);
            const activeSigner = activeProvider.getSigner();
            const fromAddress = await activeSigner.getAddress();

            // Optional: ensure Avalanche C-Chain
            const network = await activeProvider.getNetwork();
            if (network.chainId !== 43114) {
                alert("Please switch your wallet to Avalanche C-Chain (chainId 43114).");
                return;
            }

            setSending(true);
            setSendStatus(null);
            setSendingTo(target);

            const vibes = new Contract(VIBES_ADDRESS, VIBES_ABI, activeSigner);

            // Amount: 1 vibe
            const amount = ethers.BigNumber.from(1);

            // Read mint fee from chain, with log + fallback
            let mintFee;
            try {
                mintFee = await vibes._mintFee();
                console.log(
                    "Mint fee from contract (wei):",
                    mintFee.toString(),
                    "=>",
                    ethers.utils.formatEther(mintFee),
                    "AVAX"
                );
            } catch (e) {
                console.error("_mintFee() call failed, falling back to 0.2 AVAX:", e);
                mintFee = ethers.utils.parseEther("0.2");
            }

            const totalValue = mintFee.mul(amount);

            const tokenId = vibeType === "bad" ? BAD_VIBE_ID : GUD_VIBE_ID;

            console.log(
                `Sending ${vibeType} vibes`,
                "\n  from:",
                fromAddress,
                "\n  to:",
                target,
                "\n  tokenId:",
                tokenId,
                "\n  amount:",
                amount.toString(),
                "\n  value (wei):",
                totalValue.toString()
            );

            const tx = await vibes.mint(target, tokenId, amount, {
                value: totalValue,
            });

            console.log("mint tx sent:", tx.hash);
            await tx.wait();
            console.log("mint tx confirmed");

            setSendStatus("success");
        } catch (err) {
            console.error("Error sending vibes:", err);
            const msg =
                err?.data?.message ||
                err?.error?.message ||
                err?.reason ||
                err?.message ||
                "Transaction failed";
            alert(`Error sending vibes: ${msg}`);
            setSendStatus("error");
        } finally {
            setSending(false);
            setTimeout(() => {
                setSendingTo(null);
                setSendStatus(null);
            }, 3000);
        }
    };

    // Row for the connected user, if present
    const myRow = useMemo(
        () =>
            leaderboard.find(
                (row) =>
                    account && row.address.toLowerCase() === account.toLowerCase()
            ),
        [leaderboard, account]
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <header className="m:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            gudVibes Leaderboard
                        </h1>
                        <p className="text-sm text-slate-400 mt-2">
                            Net gudVibes = gudVibes − badVibes. Top wallets, their{" "}
                            <span className="text-spot-yellow font-semibold">alias</span>, and
                            quick actions to send gudVibes or badVibes.
                        </p>
                    </div>
                </header>

                {/* My summary */}
                {myRow && (
                    <section className="mb-6 border border-slate-800 rounded-xl bg-slate-900/70 p-4">
                        <h2 className="text-xs uppercase tracking-wide text-slate-400 mb-2">
                            My gudVibes
                        </h2>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                            <div>
                                <div className="font-mono text-spot-yellow">
                                    {getAliasFor(myRow.address)}
                                </div>
                                <div className="text-slate-400 text-xs">
                                    {shorten(myRow.address)}
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div>
                                    <div className="text-slate-400 text-xs">gudVibes</div>
                                    <div className="font-mono">{myRow.good}</div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-xs">badVibes</div>
                                    <div className="font-mono">{myRow.bad}</div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-xs">netVibes</div>
                                    <div className="font-mono text-lime-300">{myRow.net}</div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Leaderboard */}
                <section className="border border-slate-800 rounded-xl bg-slate-900/70 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Top gudVibes wallets
                        </h2>
                        <span className="text-[11px] text-slate-500">
                            Balances from Vibes; aliases from AliasRegistry
                        </span>
                    </div>

                    {loading ? (
                        <div className="p-4 text-sm text-slate-400">Loading…</div>
                    ) : leaderboard.length === 0 ? (
                        <div className="p-4 text-sm text-slate-400">
                            No leaderboard addresses configured yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {/* header row */}
                            <div className="grid grid-cols-12 px-4 py-2 text-[11px] text-slate-500 uppercase tracking-wide">
                                <span className="col-span-1">#</span>
                                <span className="col-span-4">Alias</span>
                                <div className="col-span-7 flex items-center justify-between">
                                    <span>Wallet</span>
                                    <span>NET</span>
                                    <span>Send</span>
                                </div>
                            </div>

                            {leaderboard.map((row, idx) => {
                                const isMe =
                                    account &&
                                    row.address.toLowerCase() === account.toLowerCase();
                                const alias = getAliasFor(row.address);
                                const editing =
                                    editAddress &&
                                    editAddress.toLowerCase() === row.address.toLowerCase();

                                const isSendingThis = sending && sendingTo === row.address;

                                return (
                                    <div
                                        key={row.address}
                                        className={`grid grid-cols-12 px-4 py-2 text-xs sm:text-sm items-center ${isMe ? "bg-spot-yellow/5" : ""
                                            }`}
                                    >
                                        {/* rank */}
                                        <span className="col-span-1 text-slate-500">
                                            {idx + 1}
                                        </span>

                                        {/* alias */}
                                        <div className="col-span-4 flex flex-col gap-1">
                                            {!editing ? (
                                                <>
                                                    <span
                                                        className={`font-mono ${alias === "no alias configured"
                                                            ? "text-slate-500"
                                                            : "text-spot-yellow"
                                                            }`}
                                                    >
                                                        {alias}
                                                    </span>
                                                    {canEditAlias(row.address) && (
                                                        <button
                                                            onClick={() => startEditAlias(row.address)}
                                                            className="text-[10px] text-slate-400 underline underline-offset-2 w-fit"
                                                        >
                                                            Edit alias
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={editAliasValue}
                                                        onChange={(e) =>
                                                            setEditAliasValue(e.target.value)
                                                        }
                                                        placeholder="Enter alias"
                                                        className="bg-slate-800 border border-slate-600 text-xs px-2 py-1 rounded font-mono w-full"
                                                    />
                                                    <button
                                                        onClick={saveAlias}
                                                        className="text-[10px] px-2 py-1 rounded bg-spot-yellow text-black font-mono"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEditAlias}
                                                        className="text-[10px] text-slate-400 font-mono"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* right side: wallet + net + buttons spaced out */}
                                        <div className="col-span-7 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                                            {/* wallet */}
                                            <span className="font-mono text-slate-200 justify-self-start">
                                                {shorten(row.address)}
                                            </span>

                                            {/* net */}
                                            <span className="font-mono text-lime-300 text-center justify-self-center min-w-[3rem]">
                                                {row.net}
                                            </span>

                                            {/* send buttons */}
                                            <div className="flex justify-end gap-2 justify-self-end">
                                                <button
                                                    onClick={() =>
                                                        handleSendVibes(row.address, "good")
                                                    }
                                                    disabled={isSendingThis}
                                                    className={`px-3 py-1 text-[11px] rounded-full border border-spot-yellow font-mono transition-all duration-150 ${isSendingThis
                                                        ? "bg-gray-700 text-gray-400 cursor-not-allowed border-gray-600"
                                                        : "text-spot-yellow hover:bg-spot-yellow hover:text-slate-900"
                                                        }`}
                                                >
                                                    {isSendingThis ? "Sending…" : "Send gudVibes"}
                                                </button>

                                                <button
                                                    onClick={() => handleSendVibes(row.address, "bad")}
                                                    disabled={isSendingThis}
                                                    className={`px-3 py-1 text-[11px] rounded-full border border-spot-yellow font-mono transition-all duration-150 ${isSendingThis
                                                        ? "bg-gray-700 text-gray-400 cursor-not-allowed border-gray-600"
                                                        : "text-spot-yellow hover:bg-spot-yellow hover:text-slate-900"
                                                        }`}
                                                >
                                                    {isSendingThis ? "Sending…" : "Send badVibes"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                <div className="mt-6 text-[11px] text-slate-500 text-center">
                    Aliases are stored on-chain in the VibesAliasRegistry at{" "}
                    <span className="font-mono">
                        0x0B9204d2F95F8F2BD7426327eaDF56DE4E7a656D
                    </span>
                    .
                    {sendStatus === "success" && (
                        <div className="mt-2 text-lime-300">
                            Vibes sent successfully ✨
                        </div>
                    )}
                    {sendStatus === "error" && (
                        <div className="mt-2 text-red-400">
                            Error sending vibes – check your wallet / console.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VibesLeaderboard;
