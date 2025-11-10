import React, { useEffect, useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
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
import gudVibes from "../../assets/gud.png";

const shorten = (addr) =>
    addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : "";

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

    // send vibes modal state
    const [sendModalOpen, setSendModalOpen] = useState(false);
    const [modalTarget, setModalTarget] = useState(null);
    const [modalTargetAlias, setModalTargetAlias] = useState("");
    const [modalVibeType, setModalVibeType] = useState("good");
    const [modalAmount, setModalAmount] = useState("1");

    // --- Provider / signer setup ---

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

    // Save alias on-chain
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

    // --- Send vibes with amount ---

    const handleSendVibes = async (target, vibeType = "good", amountNum = 1) => {
        try {
            if (!window.ethereum) {
                alert("Please install / unlock a Web3 wallet (MetaMask, Core, etc).");
                return;
            }

            if (!amountNum || amountNum <= 0) {
                alert("Please enter a valid amount of vibes to send.");
                return;
            }

            if (!signer || !account) {
                await loadWeb3Modal();
                const nextProvider =
                    web3Provider || new ethers.providers.Web3Provider(window.ethereum);
                setProvider(nextProvider);
                setSigner(nextProvider.getSigner());
            }

            const activeProvider =
                web3Provider || new ethers.providers.Web3Provider(window.ethereum);
            const activeSigner = activeProvider.getSigner();
            const fromAddress = await activeSigner.getAddress();

            const network = await activeProvider.getNetwork();
            if (network.chainId !== 43114) {
                alert("Please switch your wallet to Avalanche C-Chain (chainId 43114).");
                return;
            }

            setSending(true);
            setSendStatus(null);
            setSendingTo(target);

            const vibes = new Contract(VIBES_ADDRESS, VIBES_ABI, activeSigner);
            const amount = ethers.BigNumber.from(amountNum);

            let mintFee;
            try {
                mintFee = await vibes._mintFee();
            } catch (e) {
                console.error("_mintFee() call failed, falling back to 0.2 AVAX:", e);
                mintFee = ethers.utils.parseEther("0.2");
            }

            const totalValue = mintFee.mul(amount);
            const tokenId = vibeType === "bad" ? BAD_VIBE_ID : GUD_VIBE_ID;

            const tx = await vibes.mint(target, tokenId, amount, {
                value: totalValue,
            });

            console.log("mint tx sent:", tx.hash);
            await tx.wait();
            console.log("mint tx confirmed");

            setSendStatus("success");
            setSendModalOpen(false);
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

    // send modal helpers
    const openSendModal = (row) => {
        const alias = getAliasFor(row.address);
        setModalTarget(row.address);
        setModalTargetAlias(alias);
        setModalVibeType("good");
        setModalAmount("1");
        setSendModalOpen(true);
    };

    const closeSendModal = () => {
        if (sending) return;
        setSendModalOpen(false);
        setModalTarget(null);
    };

    const confirmSendFromModal = async () => {
        const amountNum = Number(modalAmount);
        await handleSendVibes(modalTarget, modalVibeType, amountNum);
    };

    // my row
    const myRow = useMemo(
        () =>
            leaderboard.find(
                (row) =>
                    account && row.address.toLowerCase() === account.toLowerCase()
            ),
        [leaderboard, account]
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden pt-24 md:pt-4">
            <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
                {/* Header */}
                <header className="flex flex-col gap-3 mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                            gudVibes Leaderboard
                        </h1>
                        <div className="flex items-center justify-center">
                            <img src={gudVibes} className="md:w-1/4 md:h-1/4 w-1/2 h-1/2 pt-4" alt="gud vibes" />
                        </div>



                    </div>
                </header>

                {/* My summary */}
                {myRow && (
                    <section className="mb-6 border border-slate-800 rounded-2xl bg-slate-900/70 p-4 flex flex-col gap-3">
                        <h2 className="text-[10px] uppercase tracking-wide text-slate-400">
                            My gudVibes
                        </h2>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-1 max-w-full">
                                <div className="font-mono text-spot-yellow text-sm break-all">
                                    {getAliasFor(myRow.address)}
                                </div>
                                <div className="text-slate-400 text-[11px] break-all">
                                    {shorten(myRow.address)}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs sm:text-sm">
                                <div>
                                    <div className="text-slate-400 text-[10px] uppercase">
                                        gudVibes
                                    </div>
                                    <div className="font-mono">{myRow.good}</div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-[10px] uppercase">
                                        badVibes
                                    </div>
                                    <div className="font-mono">{myRow.bad}</div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-[10px] uppercase">
                                        netVibes
                                    </div>
                                    <div className="font-mono text-lime-300">{myRow.net}</div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Leaderboard */}
                <section className="border border-slate-800 rounded-2xl bg-slate-900/70 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                        <h2 className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Top gudVibes wallets
                        </h2>
                        <span className="hidden sm:inline text-[11px] text-slate-500" />
                    </div>

                    {loading ? (
                        <div className="p-4 text-sm text-slate-400">Loading…</div>
                    ) : leaderboard.length === 0 ? (
                        <div className="p-4 text-sm text-slate-400">
                            No leaderboard addresses configured yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {/* desktop header row */}
                            <div className="hidden sm:grid grid-cols-12 px-4 py-2 text-[11px] text-slate-500 uppercase tracking-wide">
                                <span className="col-span-1">#</span>
                                <span className="col-span-4">Alias</span>
                                <div className="col-span-7 flex items-center justify-between">
                                    <span>Wallet</span>
                                    <span>Net</span>
                                    <span className="pr-2">Send</span>
                                </div>
                            </div>

                            {leaderboard.map((row, idx) => {
                                const isMe =
                                    account &&
                                    row.address.toLowerCase() === account.toLowerCase();
                                const alias = getAliasFor(row.address);
                                const isSendingThis = sending && sendingTo === row.address;

                                return (
                                    <div
                                        key={row.address}
                                        className={`px-4 py-3 text-xs sm:text-sm ${isMe ? "bg-spot-yellow/5" : ""
                                            }`}
                                    >
                                        {/* Mobile layout */}
                                        <div className="flex flex-col gap-2 sm:hidden">
                                            <div className="flex items-center justify-between">
                                                <div className="text-[11px] text-slate-500">
                                                    #{idx + 1}
                                                </div>
                                                <div className="font-mono text-lime-300 text-center w-full">
                                                    net {row.net}
                                                </div>
                                            </div>

                                            {/* alias + wallet + edit button (no inline edit) */}
                                            <div className="flex flex-col gap-1 max-w-full">
                                                <span
                                                    className={`font-mono break-all ${alias === "no alias configured"
                                                        ? "text-slate-500"
                                                        : "text-spot-yellow"
                                                        }`}
                                                >
                                                    {alias}
                                                </span>
                                                <span className="font-mono text-slate-300 break-all">
                                                    <a
                                                        href={`https://snowtrace.io/address/${row.address}?chainid=43114`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 font-mono text-slate-200 justify-self-start hover:text-spot-yellow transition-colors"
                                                    >
                                                        {shorten(row.address)}
                                                        <ExternalLink
                                                            size={12}
                                                            className="opacity-60 hover:opacity-100"
                                                        />
                                                    </a>
                                                </span>
                                                {canEditAlias(row.address) && (
                                                    <button
                                                        onClick={() => startEditAlias(row.address)}
                                                        className="text-[10px] text-slate-400 underline underline-offset-2 w-fit"
                                                    >
                                                        Edit alias
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mt-1 gap-2">
                                                <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                                                    <span>gud: {row.good}</span>
                                                    <span>bad: {row.bad}</span>
                                                </div>
                                                <button
                                                    onClick={() => openSendModal(row)}
                                                    disabled={isSendingThis}
                                                    className={`px-2 py-1 text-[10px] rounded-full border font-mono transition-all duration-150 shrink-0 ${isSendingThis
                                                        ? "bg-gray-700 text-gray-400 cursor-not-allowed border-gray-600"
                                                        : "border-spot-yellow text-spot-yellow hover:bg-spot-yellow hover:text-slate-900"
                                                        }`}
                                                >
                                                    {isSendingThis ? "Sending…" : "Send vibes"}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Desktop / tablet layout */}
                                        <div className="hidden sm:grid grid-cols-12 items-center">
                                            {/* rank */}
                                            <span className="col-span-1 text-slate-500">
                                                {idx + 1}
                                            </span>

                                            {/* alias column (no inline edit, just button) */}
                                            <div className="col-span-4 flex flex-col gap-1 max-w-full">
                                                <span
                                                    className={`font-mono truncate ${alias === "no alias configured"
                                                        ? "text-slate-500"
                                                        : "text-spot-yellow"
                                                        }`}
                                                    title={alias}
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
                                            </div>

                                            {/* right side: wallet + net + button */}
                                            <div className="col-span-7 grid grid-cols-3 items-center gap-4">
                                                {/* wallet */}
                                                <span className="font-mono text-slate-200 justify-self-start truncate">
                                                    <a
                                                        href={`https://snowtrace.io/address/${row.address}?chainid=43114`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 font-mono text-slate-400 text-[11px] hover:text-spot-yellow transition-colors"
                                                    >
                                                        {shorten(row.address)}
                                                        <ExternalLink
                                                            size={10}
                                                            className="opacity-60 hover:opacity-100"
                                                        />
                                                    </a>
                                                </span>

                                                {/* net */}
                                                <span className="font-mono text-lime-300 text-center w-full pl-2">
                                                    {row.net}
                                                </span>

                                                {/* send button */}
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => openSendModal(row)}
                                                        disabled={isSendingThis}
                                                        className={`px-3 py-1 text-[11px] rounded-full border font-mono transition-all duration-150 text-center ${isSendingThis
                                                            ? "bg-gray-700 text-gray-400 cursor-not-allowed border-gray-600"
                                                            : "border-spot-yellow text-spot-yellow hover:bg-spot-yellow hover:text-slate-900"
                                                            }`}
                                                    >
                                                        {isSendingThis ? (
                                                            "Sending…"
                                                        ) : (
                                                            <>
                                                                <span className="block leading-tight">Send</span>
                                                                <span className="block leading-tight">vibes</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                <div className="mt-6 text-[11px] text-slate-500 text-center space-y-1">
                    <div className="break-all">
                        Aliases are stored on-chain in the VibesAliasRegistry at{" "}
                        <span className="font-mono">
                            0x0B9204d2F95F8F2BD7426327eaDF56DE4E7a656D
                        </span>
                        .
                    </div>
                    {sendStatus === "success" && (
                        <div className="text-lime-300">Vibes sent successfully ✨</div>
                    )}
                    {sendStatus === "error" && (
                        <div className="text-red-400">
                            Error sending vibes – check your wallet / console.
                        </div>
                    )}
                </div>
            </div>

            {/* Alias Edit Modal */}
            {editAddress && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-4 shadow-xl">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-slate-100">
                                Edit alias
                            </h3>
                            <button
                                onClick={cancelEditAlias}
                                className="text-xs text-slate-400 hover:text-slate-200"
                            >
                                Close
                            </button>
                        </div>

                        <div className="mb-3">
                            <div className="text-[11px] text-slate-500 mb-1">Wallet</div>
                            <div className="font-mono text-xs text-slate-200 break-all">
                                {shorten(editAddress)}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-[11px] text-slate-400 mb-1">
                                Alias
                            </label>
                            <input
                                type="text"
                                value={editAliasValue}
                                onChange={(e) => setEditAliasValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        saveAlias();
                                    }
                                    if (e.key === "Escape") {
                                        e.preventDefault();
                                        cancelEditAlias();
                                    }
                                }}
                                placeholder="Enter alias"
                                className="w-full bg-slate-800 border border-slate-600 text-xs px-2 py-2 rounded font-mono focus:outline-none focus:ring-1 focus:ring-spot-yellow"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <button
                                onClick={cancelEditAlias}
                                className="text-xs px-3 py-1 rounded border border-slate-600 text-slate-300 hover:text-slate-100 hover:border-slate-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveAlias}
                                className="text-xs px-3 py-1 rounded bg-spot-yellow text-black font-semibold hover:brightness-110"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Send Vibes Modal */}
            {sendModalOpen && modalTarget && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-4 shadow-xl">
                        <div className="flex items-start justify-between mb-3">
                            <div className="pr-4">
                                <h3 className="text-sm font-semibold">Send vibes (0.2 avax each)</h3>
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Choose vibe type and amount to send.
                                </p>
                            </div>
                            <button
                                onClick={closeSendModal}
                                disabled={sending}
                                className="text-slate-400 hover:text-slate-200 text-lg leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="text-[11px] text-slate-400">
                                To:
                                <div className="font-mono text-spot-yellow text-xs break-all">
                                    {modalTargetAlias}
                                </div>
                                <div className="font-mono text-slate-300 text-[11px] break-all">
                                    {shorten(modalTarget)}
                                </div>
                            </div>

                            {/* Vibe type toggle */}
                            <div>
                                <div className="text-[11px] text-slate-400 mb-1">
                                    Vibe type
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setModalVibeType("good")}
                                        className={`flex-1 px-3 py-1.5 rounded-full text-[11px] font-mono border ${modalVibeType === "good"
                                            ? "border-spot-yellow bg-spot-yellow text-slate-900"
                                            : "border-slate-600 text-slate-200"
                                            }`}
                                    >
                                        gudVibes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setModalVibeType("bad")}
                                        className={`flex-1 px-3 py-1.5 rounded-full text-[11px] font-mono border ${modalVibeType === "bad"
                                            ? "border-spot-yellow bg-spot-yellow text-slate-900"
                                            : "border-slate-600 text-slate-200"
                                            }`}
                                    >
                                        badVibes
                                    </button>
                                </div>
                            </div>

                            {/* Amount input */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[11px] text-slate-400">Amount</span>
                                    <span className="text-[10px] text-slate-500">
                                        whole numbers only
                                    </span>
                                </div>
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={modalAmount}
                                    onChange={(e) => setModalAmount(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-100"
                                />
                            </div>
                        </div>

                        <button
                            onClick={confirmSendFromModal}
                            disabled={sending}
                            className={`w-full px-3 py-2 rounded-full text-[12px] font-mono border transition-all duration-150 ${sending
                                ? "bg-gray-700 text-gray-400 cursor-not-allowed border-gray-600"
                                : "border-spot-yellow bg-spot-yellow text-slate-900 hover:brightness-105"
                                }`}
                        >
                            {sending ? "Sending vibes…" : "Send vibes"}
                        </button>

                        <div className="mt-2 text-[10px] text-slate-500 text-center">
                            Your wallet will ask you to confirm the transaction.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VibesLeaderboard;
