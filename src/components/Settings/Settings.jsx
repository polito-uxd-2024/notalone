import React, { useState } from "react";
import { InputText } from 'primereact/inputtext';
import { Fieldset } from 'primereact/fieldset';
import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';
        
import './Settings.css'


function Settings({handleSettings, handleNewSettings, voice, al, language, street}) {
  const [selectedVoiceOption, setSelectedVoiceOption] = useState(voice);
  const [selectedLanguageOption, setSelectedLanguageOption] = useState(language);
  const [homeStreet, setHomeStreet] = useState(street);
  const [selectedAlOption, setSelectedAlOption] = useState(al);

  const handleAlOption = (value, index) => {
    setSelectedAlOption((prev) => {
      const updated = [...prev]; 
      updated[index] = value; 
      return updated;
    });
  };

  const personalityOptions = [
    {
      groupName: 'Tono della Conversazione',
      options: ['Caldo', 'Formale', 'Ironico'],
    },
    {
      groupName: 'Stile di Comunicazione',
      options: ['Diretta', 'Chiara', 'Creativa'],
    },
    {
      groupName: 'Emotività',
      options: ['Empatica', 'Neutra', 'Fredda'],
    },
  ];
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
        <div className="settings-wrapper">
        <div>
            <Fieldset legend="Maps" toggleable>
            <div className="flex flex-column gap-1">
                <label htmlFor="homeStreet">Indirizzo di casa</label>
                <InputText id="homeStreet" value={homeStreet} onChange={(e) => setHomeStreet(e.target.value)} />
            </div>
            </Fieldset>
            <Fieldset legend="Al" toggleable className="mt-2">
                <div className="flex flex-column gap-1 mb-3">
                <label htmlFor="language">Lingua</label>
                    <Dropdown variant="filled" id="language" value={selectedLanguageOption} onChange={(e) => setSelectedLanguageOption(e.value)} options={languages} optionLabel="name"/>
                </div>
                <div className="flex flex-column gap-1">
                <label htmlFor="voice">Voce</label>
                    <Dropdown variant="filled" id="voice" value={selectedVoiceOption} onChange={(e) => setSelectedVoiceOption(e.value)} options={voices} optionLabel="name"/>
                </div>
                {personalityOptions.map((op, index) => {
                return (
                  <div className="mt-3 flex flex-column gap-1">
                    <label htmlFor={`personality-${index}`}>{op.groupName}</label>
                    <SelectButton key={`personality-${index}`} id={`personality-${index}`} value={selectedAlOption[index]} onChange={(e) => handleAlOption(e.value, index)} options={op.options} />
                  </div>
                )
                })}
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