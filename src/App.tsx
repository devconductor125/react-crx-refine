import { useEffect, useState } from "react";
import { DropdownOption } from "./types/popup";
import "./App.css";
import Button, { ButtonType } from "./components/Button";
import Dropdown from "./components/Dropdown";
import { DAO } from "./lib/dao";
import { IPC } from "./lib/ipc";
import {
  genders,
  generateMensShoeSizes,
  shirtSizes,
} from "./lib/dropdownoptions";

function App() {
  const mensShoeSizes = generateMensShoeSizes();

  const [selectedGender, setSelectedGender] = useState<DropdownOption>(
    genders[0]
  );
  const [selectedShoeSize, setSelectedShoeSize] = useState<DropdownOption>(
    mensShoeSizes[0]
  );
  const [selectedShirtSize, setSelectedShirtSize] = useState<DropdownOption>(
    shirtSizes[0]
  );

  const isContentApp = document.getElementById("crx-content-root");

  function closeContentBox(){
    const contentPopup: any = document.getElementById("crx-content-root");
    contentPopup.style.display = "none";
  }

  /**
   * Saves current filters and runs the content script
   */
  async function saveFiltersAndRun() {
    await DAO.saveFilters(
      selectedGender.value,
      selectedShoeSize.value,
      selectedShirtSize.value
    );
    run();
  }

  /**
   * Message via IPC that the content script should now should run
   */
  async function run() {

  // Send a message to the background script
  chrome.runtime.sendMessage({ message: "runScript" }, function (response) {
    console.log(response.message); 
  });

  }

  /**
   * Load the user's saved filters from chrome storage
   */
  async function loadFilters() {
    const userFilters = await DAO.loadUserFilters(
      genders,
      mensShoeSizes,
      shirtSizes
    );
    setSelectedGender(userFilters.gender);
    setSelectedShoeSize(userFilters.shoeSize);
    setSelectedShirtSize(userFilters.shirtSize);
  }

  useEffect(() => {
    loadFilters();
  }, []);

  return (
    <div className="App px-5 flex flex-col mb-5 mx-auto">
      {isContentApp ?<div className="flex flex-row justify-between mt-5">
      <p className="text-xl mb-0">Refine V3</p>
       <button
          id="crx-close-button"
          type="button"
          title="Close prompt"
          aria-label="Close prompt"
          onClick={closeContentBox}
        >
         <svg viewBox="0 0 10 10" width="0.95em" height="0.95em" stroke="currentColor" strokeWidth="2">
      <path d="M1,1 9,9 M9,1 1,9" />
    </svg>
        </button> 
      </div> :
      <p className="text-xl">Refine V3</p>
      
      }
     
      <Dropdown
        title="Gender"
        options={genders}
        defaultValue={selectedGender}
        isMulti={false}
        onChange={(newValue) => setSelectedGender(newValue)}
      />
      <Dropdown
        title="Shoe Size"
        options={mensShoeSizes}
        defaultValue={selectedShoeSize}
        isMulti={false}
        onChange={(newValue) => setSelectedShoeSize(newValue)}
      />
      <Dropdown
        title="Shirt Size"
        options={shirtSizes}
        defaultValue={selectedShirtSize}
        isMulti={false}
        onChange={(newValue) => setSelectedShirtSize(newValue)}
      />

      <div className="mt-10">
        <Button
          text="Refine"
          type={ButtonType.SECONDARY}
          onClick={() => {
            saveFiltersAndRun();
            console.log("Filters saved");
          }}
        />
      </div>
    </div>
  );
}

export default App;
