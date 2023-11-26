import { useState, useEffect } from 'react';
import axios from 'axios';
import { Header, Request } from '../interfaces';



const RestApiClient = () => {
    const [response, setResponse] = useState('');
    const [restState, setRestState] = useState({
        name: '',
        type: '',
        url: '',
        header: [] as Header[],
        body: '',
        list: [] as Request[],
    });


    //By default the url must be the name of the request
    useEffect(() => {
        if (!restState.name && restState.url) {
            setRestState(prevState => ({
                ...prevState,
                name: restState.url,
            }));
        }
        else
            setRestState(prevState => ({
                ...prevState,
                name: prevState.url,
            }));
    }, [restState.url]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setRestState(prevState => ({
            ...prevState,
            name: newName,
        }));
    };


    const fetchData = async () => {
        try {
            const result = await axios.get(restState.url, {
                headers: getHeadersObject(restState.header),
            });
            setResponse(JSON.stringify(result.data, null, 2));
        } catch (error) {
            setResponse('Error fetching data');
        }
    };

    const postData = async () => {
        try {
            const result = await axios.post(restState.url, JSON.parse((restState.body.trim())), {
                headers: getHeadersObject(restState.header),
            });
            console.log(result)
            setResponse('Item created successfully');
        } catch (error) {
            setResponse('Error creating item');
        }
    };

    const putData = async () => {
        try {
            const result = await axios.put(`${restState.url}`, JSON.parse(restState.body), {
                headers: getHeadersObject(restState.header),
            });
            setResponse(JSON.stringify(result.data, null, 2));
        } catch (error) {
            setResponse('Error updating item');
        }
    };

    const deleteData = async () => {
        try {
            const result = await axios.delete(`${restState.url}`, {
                headers: getHeadersObject(restState.header),
            });
            setResponse(JSON.stringify(result.data, null, 2))
        } catch (error) {
            setResponse('Error deleting item');
        }
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setRestState({
            ...restState,
            type: value,
        });
    };

    const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = e.target;
        setRestState((prevState) => {
            const updatedHeaders = [...prevState.header];
            updatedHeaders[index] = { ...updatedHeaders[index], [name]: value };
            return { ...prevState, header: updatedHeaders };
        });
    };

    const getHeadersObject = (headers: Header[]) => {
        return headers.reduce((acc, header) => {
            acc[header.key] = header.value;
            return acc;
        }, {} as Record<string, string>);
    };

    const addHeader = () => {
        setRestState({
            ...restState,
            header: [...restState.header, { key: '', value: '', description: '' }],
        });
    };

    const removeHeader = (index: number) => {
        const updatedHeaders = [...restState.header];
        updatedHeaders.splice(index, 1);
        setRestState({
            ...restState,
            header: updatedHeaders,
        });
    };

    const renderHeaders = () => {
        return restState.header.map((header, index) => (
            <section key={index} style={{ display: 'flex', justifyContent: 'space-between', margin: "10px", width: '650px' }}>
                <input
                    type="text"
                    name="key"
                    placeholder="Header Name"
                    value={header.key}
                    onChange={(e) => handleHeaderChange(e, index)}
                />
                <input
                    type="text"
                    name="value"
                    placeholder="Header Value"
                    value={header.value}
                    onChange={(e) => handleHeaderChange(e, index)}
                />

                <input
                    type="text"
                    name="description"
                    placeholder="Header Description"
                    value={header.description}
                    onChange={(e) => handleHeaderChange(e, index)}
                />
                <button onClick={() => removeHeader(index)}>Remove</button>
            </section>
        ));
    };

    const sendRequest = async () => {
        switch (restState.type) {
            case 'GET':
                await fetchData();
                break;
            case 'POST':
                await postData();
                break;
            case 'PUT':
                await putData();
                break;
            case 'DELETE':
                await deleteData();
                break;
            default:
                break;
        }
    };

    const addRequestToList = () => {
        const newRequest = {
            name: restState.name,
            type: restState.type,
            url: restState.url,
            header: restState.header,
            body: restState.body,
        };

        setRestState(prevState => ({
            ...prevState,
            list: [...prevState.list, newRequest],
        }));
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}> Name:
                <input
                    style={{ width: '300px', height: '25px' }}
                    type="text"
                    value={restState.name}
                    onChange={handleNameChange}
                    placeholder="Enter the name"
                />
                <button onClick={() => {
                    addRequestToList();
                }}>save</button></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: "10px", width: '650px' }}>
                <select value={restState.type} onChange={handleSelectChange} style={{ width: 'auto', height: '30px' }}>
                    <option value={''}>TYPE</option>
                    <option value={'GET'}>GET</option>
                    <option value={'POST'}>POST</option>
                    <option value={'PUT'}>PUT</option>
                    <option value={'DELETE'}>DELETE</option>
                </select>
                <input
                    style={{ width: "300px", height: '25px' }}
                    type="text"
                    value={restState.url}
                    onChange={(e) => setRestState({ ...restState, url: e.target.value })}
                    placeholder="Enter the Endpoint or URL"
                />
                <button onClick={addHeader}>Add Header</button>
                <button onClick={sendRequest}>Send</button>
            </div>
            {renderHeaders()}
            <div>
                <input
                    style={{ width: '500px', height: '200px' }}
                    type="text"
                    value={restState.body}
                    onChange={(e) => setRestState({ ...restState, body: e.target.value })}
                    placeholder="Enter body in json format"
                />
            </div>


            <div style={{ backgroundColor: "lightgray", width: "650px", height: "300px" }}>
                <h3>Response</h3>
                <textarea style={{ width: "500px", height: "200px" }} value={response} readOnly>
                </textarea>

            </div>
        </div>
    );
};

export default RestApiClient;
