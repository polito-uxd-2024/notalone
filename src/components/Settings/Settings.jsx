import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Fieldset } from 'primereact/fieldset';
import { Dropdown } from 'primereact/dropdown';
        
import './Settings.css'


function Settings({handleSettings, handleNewSettings, voice, al, language, street}) {
  const [selectedVoiceOption, setSelectedVoiceOption] = useState(voice);
  const [selectedAlOption, setSelectedAlOption] = useState(al);
  const [selectedLanguageOption, setSelectedLanguageOption] = useState(language);
  const [homeStreet, setHomeStreet] = useState(street);

  const handleVoiceChange = (event) => {
    setVoiceOption(event.target.value);
  };

  const handleAlChange = (event) => {
    setSelectedAlOption(event.target.value);
  };

  const handleHomeStreetChange = (event) => {
    setHomeStreet(event.target.value);
  };

  return (
    <>
    <div className="settings-container">
        <div className="mt-4 settings-wrapper">
        <div>
            <Fieldset legend="Maps" toggleable>
                    <div className="settings-drop-down">
                    <h5>Home: </h5>
                    <Form className="settings-drop">
                    <Form.Group controlId="formHomeStreet">
                        <Form.Control
                        type="text"
                        value={homeStreet}
                        onChange={handleHomeStreetChange}
                        />
                    </Form.Group>
                    </Form>
                    </div>
                </Fieldset>
                <Fieldset legend="Header" toggleable>
                    <div className="settings-drop-down">
                        <h5>Lingua: </h5>
                        <Dropdown value={selectedLanguageOption} onChange={(e) => setSelectedLanguageOption(e.value)} options={["Italiano", "English"]}
    placeholder="Lingua" className="w-full md:w-14rem" />
                    </div>
                    <div className="settings-drop-down">
                        <h5>Voce: </h5>
                        <Form className="settings-drop">
                        <Form.Select
                            as="select"
                            value={selectedVoiceOption}
                            onChange={(e) => setSelectedVoiceOption(e.value)}
                            >
                            <option value="Voce 1">Voce 1</option>
                            <option value="Voce 2">Voce 2</option>
                            <option value="Voce 3">Voce 3</option>
                        </Form.Select>
                        </Form>
                    </div>
                </Fieldset>
        </div>
        </div>
    </div>
        <div className="button-wrapper">
        <div className="cancel-button" onClick={() => handleSettings(false)}>
        <h1> ANNULLA </h1>  
        </div>
        <div className="save-button" onClick={() => {
            handleNewSettings(selectedVoiceOption, selectedLanguageOption, homeStreet, selectedAlOption)
            handleSettings(false)}}>
        <h1> SALVA </h1>  
        </div>
        </div>
    </>
  );
}

export { Settings };