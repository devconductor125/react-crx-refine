import { DropdownOption } from "../types/popup";

const genders: Array<DropdownOption> = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

const shirtSizes: Array<DropdownOption> = [
    { value: "XXS", label: "XXS" },
    { value: "XS", label: "XS" },
    { value: "S", label: "Small" },
    { value: "M", label: "Medium" },
    { value: "L", label: "Large" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" },
    { value: "3XL", label: "3XL" },
    { value: "XXXXL", label: "4XL" },
];

/**
 * Generates a list of men's shoe sizes from 6 to 15.5 in half sizes
 * @returns An array of DropdownOptions representing each shoe size
 */
function generateMensShoeSizes(): Array<DropdownOption> {
    const shoeSizes: Array<DropdownOption> = [];

    const hostname = window.location.hostname
    console.log(hostname)
    if(hostname == "footlocker.com"){
      for (let i = 4; i <= 20; i += 0.5) {
        if(i>14 && i%1 == 0.5){
          continue;
        } 
        else shoeSizes.push({ value: i.toString(), label: i.toString() });
      }
      return shoeSizes;
    } else {
      for (let i = 6; i <= 15.5; i += 0.5) {
        shoeSizes.push({ value: i.toString(), label: i.toString() });
      }
      return shoeSizes;
    }
    
}

export {genders, shirtSizes, generateMensShoeSizes}