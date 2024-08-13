import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function Character() {
    const [results, setResults] = useState([]);
    const [name, setName] = useState('');
    const [showModal, setShowModal] = useState(false);

    const fetchCharacter = () => {
        axios.post('/graphql', {
            query: `
                query {
                    searchCharacter(name: "${name}") {
                        name
                        filmName
                        vehicleModel
                    }
                }
            `
        }).then(response => {
            setResults(response.data.data.searchCharacter);
            
        }).catch(error => {
            console.error('There was an error fetching the character!', error);
        });
    };

    const saveCharacter = (character) => {
        axios.post('/graphql', {
            query: `
                mutation {
                    saveCharacter(name: "${character.name}", filmName: "${character.filmName}", vehicleModel: "${character.vehicleModel}") {
                        name
                    }
                }
            `
        }).then(() => {
            setShowModal(true);
        }).catch(error => {
            console.error('There was an error saving the character!', error);
            //setSaveMessage(`Failed to save character ${character.name}.`);
        });
    };
	
    const closeModal = () => {
        setShowModal(false);
    };
	
    return (
        <div className="star-wars-theme">
            <h1>Star Wars Character Search</h1>

            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Character Name"
            />
            <button onClick={fetchCharacter}>Fetch Character</button>

            {results.length > 0 && results.map((result, index) => (
                <div key={index} className="character-table">
                    <h2>{result.name}</h2>
                    <table>
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
                    <button onClick={() => saveCharacter(result)}>Save Character</button>
                </div>
            ))}
			{showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <p>Character saved successfully!</p>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Character;
