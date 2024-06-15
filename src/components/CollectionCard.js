import React from 'react';
import { useNavigate } from 'react-router-dom';

const CollectionCard = ({ collection }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/collection/${collection.address}`);
    };

    return (
        <div className="bg-gray-800 p-4 rounded shadow cursor-pointer" onClick={handleClick}>
            <img src={collection.image} alt={collection.name} className="w-full h-auto mb-2 rounded" />
            <div className="mb-2">
                <h2 className="text-4xl font-bold mb-2 text-spot-yellow">{collection.name}</h2>
                <p>{collection.description}</p>
                <div className="pt-2 pb-2 bg-gray-700 rounded-md">
                    <p>Number of Tokens: {collection.tokenCount}</p>
                </div>
            </div>
        </div>
    );
};

export default CollectionCard;
