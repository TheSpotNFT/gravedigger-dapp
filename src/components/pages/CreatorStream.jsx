import React, { useState, useRef } from 'react';
import { io } from 'socket.io-client';



const CreatorPortal = ({ account }) => {
    const socket = io(`http://localhost:3001?userId=${account}`); // Replace with your server URL
    const [isStreaming, setIsStreaming] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const localVideoRef = useRef();
    const peerConnection = useRef(null);


    const startStreaming = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });

            // Log the devices in the stream
            stream.getTracks().forEach((track) => {
                console.log('Track Label:', track.label);
                console.log('Track Kind:', track.kind);
                console.log('Track ID:', track.id);
                console.log('Track Enabled:', track.enabled);
            });

            localVideoRef.current.srcObject = stream;

            // Initialize WebRTC connection
            peerConnection.current = new RTCPeerConnection();

            // Add local stream to peer connection
            stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

            // Send offer to viewers
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);

            socket.emit('offer', { target: 'viewer', offer, account });
            console.log('Emitting offer to viewer:', account);

            setIsStreaming(true);
        } catch (error) {
            console.error('Error starting the stream:', error);

            // Check if the error is related to media devices
            if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                // Log available devices
                navigator.mediaDevices.enumerateDevices().then((devices) => {
                    console.log('Available Devices:', devices);
                });

                setError(
                    `Failed to start the stream. Error: ${error.message}. No audio or video devices found.`
                );
            } else {
                setError(`Failed to start the stream. Error: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };


    const stopStreaming = () => {
        // Close the WebRTC connection
        if (peerConnection.current) {
            peerConnection.current.close();
        }

        // Stop local video stream
        localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());

        // Notify viewers that the stream is stopping
        socket.emit('stop-stream');

        setIsStreaming(false);
    };

    return (
        <div className='text-white'>
            <h1>Creator's Portal</h1>
            {isLoading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isStreaming ? (
                <button onClick={stopStreaming}>Stop Streaming</button>
            ) : (
                <button onClick={startStreaming} disabled={isLoading}>
                    Start Streaming
                </button>
            )}
            <video ref={localVideoRef} autoPlay playsInline muted />
        </div>
    );
};

export default CreatorPortal;
