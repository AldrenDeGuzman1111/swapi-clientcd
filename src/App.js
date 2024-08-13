import './App.css';
import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
  cache: new InMemoryCache()
});

const SEARCH_CHARACTER = gql`
  query searchCharacter($name: String!) {
    searchCharacter(name: $name) {
      name
      filmName
      vehicleModel
    }
  }
`;

const SAVE_CHARACTER = gql`
  mutation saveCharacter($name: String!, $filmName: String!, $vehicleModel: String!) {
    saveCharacter(name: $name, filmName: $filmName, vehicleModel: $vehicleModel) {
      name
    }
  }
`;

function Character() {
    const [id, setId] = useState('');
    const { loading, error, data } = useQuery(SEARCH_CHARACTER, {
        variables: { name: id },
        skip: !id
    });
    const [saveCharacter] = useMutation(SAVE_CHARACTER);

    const handleSave = (name, filmName, vehicleModel) => {
        saveCharacter({ variables: { name, filmName, vehicleModel } });
    };

    return (
        <div className="character-container">
            <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter Character Name"
                className="starwars-input"
            />
            <button onClick={() => setId(id)} className="starwars-button">Fetch Character</button>

            {loading && <p>Loading...</p>}
            {error && <p>Error fetching data</p>}

            {data && data.searchCharacter.map((result, index) => (
                <div key={index} className="character-card">
                    <h2 className="character-name">{result.name}</h2>
                    <table className="character-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Film</th>
                                <th>Vehicle</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{result.name}</td>
                                <td>{result.filmName}</td>
                                <td>{result.vehicleModel}</td>
                            </tr>
                        </tbody>
                    </table>
                    <button onClick={() => handleSave(result.name, result.filmName, result.vehicleModel)} className="starwars-button">Save</button>
                </div>
            ))}
        </div>
    );
}

function App() {
    return (
        <ApolloProvider client={client}>
            <Character />
        </ApolloProvider>
    );
}

export default App;