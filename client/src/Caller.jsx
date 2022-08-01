import React, { useState, useEffect } from 'react';
import { Device } from 'twilio-client';
import axios from 'axios';
import './Caller.css';

const Caller = () => {
  const [device, setDevice] = useState(null);
  const [incoming, setIncoming] = useState(null);

  const makeCall = () => {
    if (device) {
      device.connect({
        // Number to call
        recipientNumber: '+447557955350',
      });
    }
  };

  const acceptCall = (response) => {
    if (response) {
      incoming.accept();
    } else {
      incoming.reject();
    }
  };

  useEffect(() => {
    const getToken = async () => {
      // Request to tken server
      const res = await axios.post('https://mmarshall.ngrok.io/token', {
        // This is the ID of the client device
        identity: 'mm',
      });

      let newDevice = new Device(res.data, {
        codecPreferences: ['opus', 'pcmu'],
        fakeLocalDTMF: true,
        enableRingingState: true,
      });

      newDevice.on('ready', (device) => {
        console.log('Device ready!');
      });
      newDevice.on('disconnect', (device) => {
        console.log('disconnected');
        setIncoming(null);
      });

      newDevice.on('cancel', (device) => {
        console.log('canceled');
      });

      newDevice.on('error', (err) => {
        console.log(err);
      });

      newDevice.on('incoming', (connection) => {
        console.log('incoming');
        setIncoming(connection);
      });

      newDevice.on('reject', () => {
        console.log('reject');
      });

      setDevice(newDevice);
    };

    getToken();
  }, []);

  return (
    <>
      <img src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3667&q=80" />
      {incoming ? (
        <div className="button-cluster inbound-controls">
          <button onClick={() => acceptCall(true)}>Accept</button>
          <button onClick={() => acceptCall(false)}>Reject</button>
        </div>
      ) : (
        <div className="button-cluster">
          <button onClick={() => makeCall()}>Call Estate Agent</button>
        </div>
      )}
    </>
  );
};

export default Caller;
