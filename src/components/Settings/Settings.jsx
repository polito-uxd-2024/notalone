import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { InputText } from 'primereact/inputtext';
import { Fieldset } from 'primereact/fieldset';
import { Dropdown } from 'primereact/dropdown';
        
import './Settings.css'


function Settings({handleSettings, handleNewSettings, voice, al, language, street}) {
  const [selectedVoiceOption, setSelectedVoiceOption] = useState(voice);
  const [selectedAlOption, setSelectedAlOption] = useState(al);
  const [selectedLanguageOption, setSelectedLanguageOption] = useState(language);
  const [homeStreet, setHomeStreet] = useState(street);

  const languages = [
    "Italiano",
    "English",
  ]
  const voices = [
    "Voce 1",
    "Voce 2",
    "Voce 3"
  ]
  console.log(selectedLanguageOption)
  return (
    <>
    <div className="settings-container">
        <div className="mt-4 settings-wrapper">
        <div>
            <Fieldset legend="Maps" toggleable>
            <div className="flex flex-column gap-2">
                <label htmlFor="homeStreet">Indirizzo di casa</label>
                <InputText id="homeStreet" value={homeStreet} onChange={(e) => setHomeStreet(e.target.value)} />
            </div>
            </Fieldset>
                <Fieldset legend="Al" toggleable>
                <label htmlFor="language">Lingua</label>
                <div className="flex flex-column gap-2">
                    <Dropdown variant="filled" id="language" value={selectedLanguageOption} onChange={(e) => setSelectedLanguageOption(e.value)} options={languages} optionLabel="name"/>
                </div>
                <label htmlFor="voice">Voce</label>
                <div className="flex flex-column gap-2">
                    <Dropdown variant="filled" id="voice" value={selectedVoiceOption} onChange={(e) => setSelectedVoiceOption(e.value)} options={voices} optionLabel="name"/>
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