import { useState } from 'react';
import RestApiClient from './rest-api-client';


function Home() {
  const [requests, setRequests] = useState<JSX.Element[]>([]);

  const addRestApiClient = () => {
    setRequests([...requests, <RestApiClient key={requests.length} />]);
  };

  const removeRestApiClient = (index: number) => {
    const updatedrequests = requests.filter((_, i) => i !== index);
    setRequests(updatedrequests);
  };

  return (
    <main>
      <button onClick={addRestApiClient} style={{backgroundColor: 'blue'}}>New</button>
      
      {requests.map((client, index) => (
        <div key={index}>
          {client}
          <button onClick={() => removeRestApiClient(index)} style={{backgroundColor: "red"}}>Remove</button>
        </div>
      ))}
    </main>
  );
}

export default Home;
