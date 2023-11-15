// ViewerPage.js
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';


const ViewerPage = () => {
    const videoRef = useRef();
    const peerConnection = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isStreamAvailable, setIsStreamAvailable] = useState(false);
    const creatorAccount = "0x3Aa3a263061C8395362b0098372D33c8F78072Ed";
    const socket = io(`http://localhost:3001?userId=${creatorAccount}`); // Replace with your server URL


    const handleDisconnect = () => {
        // Notify the server that the viewer is disconnecting
        socket.emit('disconnect-viewer');

        // Perform additional disconnection logic if needed

        // Update state to reflect that the stream is no longer available
        setIsStreamAvailable(false);
        setIsLoading(false);
        console.log('Updated WebRTC State:', peerConnection.current.connectionState);
    };

    useEffect(() => {
        // Initialize WebRTC connection
        console.log('Entering useEffect');
        const socket = io(`http://localhost:3001`); // Replace with your server URL
        console.log(`socket: ${socket}`);

        socket.on('connect', () => {
            console.log('Viewer connected:', socket.connected);
            // Join the room based on the creator's account
            socket.emit('join-room', { room: creatorAccount });
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        socket.on('connect_timeout', () => {
            console.error('Socket connection timeout');
        });

        socket.onAny((event, ...args) => {
            console.log(`Received socket event: ${event}`, JSON.stringify(args, null, 2));
        });

        // Handle received offer from creator
        socket.on('offer', async (data) => {
            console.log("Received Offer:", data);

            if (data.account === creatorAccount) {
                console.log('Connecting to stream:', data.account);

                try {
                    setIsLoading(true);

                    console.log('Setting remote description...');
                    // Simplified: Set remote description, create answer, set local description
                    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));

                    console.log('Creating answer...');
                    const answer = await peerConnection.current.createAnswer();

                    console.log('Setting local description...');
                    await peerConnection.current.setLocalDescription(answer);

                    console.log('Emitting answer to creator...');
                    // Emit the answer to the creator
                    socket.emit('answer', { target: 'creator', answer, account: creatorAccount });

                    setIsStreamAvailable(true);
                } catch (error) {
                    console.error('Error handling offer:', error);
                    setIsStreamAvailable(false);
                } finally {
                    setIsLoading(false);
                }
            }
        });




        // Handle received answer from creator
        socket.on('answer', async (data) => {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            console.log('Updated WebRTC State:', peerConnection.current.connectionState);
        });

        // Handle received ICE candidates from creator
        socket.on('ice-candidate', (candidate) => {
            console.log('Received ICE Candidate:', candidate);
            peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            console.log('Updated WebRTC State:', peerConnection.current.connectionState);
        });

        // Handle stream start event
        socket.on('start-stream', () => {
            setIsStreamAvailable(true);
            console.log('Updated WebRTC State:', peerConnection.current.connectionState);
        });

        // Handle stream stop event
        socket.on('stop-stream', () => {
            setIsStreamAvailable(false);
            console.log('Updated WebRTC State:', peerConnection.current.connectionState);
        });



        return () => {
            // Cleanup WebRTC connection when the component unmounts
            if (peerConnection.current) {
                peerConnection.current.close();
            }
        };
    }, []);

    return (
        <div className='text-white'>
            <h1>Viewer's Page</h1>
            {isLoading && <p>Loading...</p>}
            {!isLoading && !isStreamAvailable && <p>Waiting for the stream to start...</p>}
            {isStreamAvailable && <video ref={videoRef} autoPlay playsInline />}
            <button onClick={handleDisconnect}>Disconnect</button>
            <video ref={videoRef} autoPlay playsInline />
        </div>
    );
};

export default ViewerPage;
