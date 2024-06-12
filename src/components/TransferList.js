import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SATS_ABI, SATS_ADDRESS } from './Contracts/SatsContract';

const TransferList = ({ chainId, tokenId }) => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://glacier-api.avax.network/v1/chains/${chainId}/addresses/${SATS_ADDRESS}/transactions:listErc1155`, {
        params: {
          pageSize: 10,
          // Additional params if needed, like startBlock, endBlock, etc.
        },
      });
      setTransfers(response.data.transfers || []);
    } catch (error) {
      console.error('Error fetching transfers:', error);
      setTransfers([]); // Ensure transfers is always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
    const interval = setInterval(fetchTransfers, 30000); // Fetch new transfers every 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [chainId, tokenId]);

  return (
    <div className="ml-4 w-1/2">
      <h3 className="text-xl font-bold mb-2">Recent Transfers</h3>
      {loading ? (
        <p>Loading transfers...</p>
      ) : (
        <ul className="space-y-2">
          {transfers.map((transfer, index) => (
            <li key={index} className="bg-gray-800 p-2 rounded">
              <p>From: {transfer.from}</p>
              <p>To: {transfer.to}</p>
              <p>Amount: {transfer.amount}</p>
              <p>Transaction Hash: {transfer.txHash}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransferList;
