import React, { useState, useEffect } from 'react';
import { Device } from 'twilio-client';
import axios from 'axios';

const Caller = () => {
  const [device, setDevice] = useState(null);
  const [status, setStatus] = useState(false);
  const [token, setToken] = useState(null);
  const [perm, setPerm] = useState(false);
  const [num, setNum] = useState('');

  const makeCall = () => {
    device.connect({
      phoneNumber: num,
    });
  };

  useEffect(() => {
    const getToken = async () => {
      const res = await axios.post('https://mmarshall.eu.ngrok.io/auth');
      let newDevice = new Device(res.data.token, {
        codecPreferences: ['opus', 'pcmu'],
        fakeLocalDTMF: true,
        enableRingingState: true,
      });
      newDevice.on('ready', (device) => {
        console.log('Device ready!');
        setStatus(true);
      });
      newDevice.on('error', (err) => {
        console.log(err);
      });
      setDevice(newDevice);
    };
    if (perm) {
      getToken();
    }
  }, [perm]);

  return (
    <>
      <button onClick={() => setPerm(true)}>Get Started</button>
      <input
        value={num}
        onChange={(e) => setNum(e.target.value)}
        placeholder="number"
      />
      <button onClick={() => makeCall()}>Make Call</button>
    </>
  );
};

export default Caller;
