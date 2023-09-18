import { DropdownOption } from "../types/popup"
import Select from "react-select"

interface Props {
    title: string
    options: Array<DropdownOption>
    defaultValue: DropdownOption
    isMulti?: boolean
    onChange: (newValue: any) => void
}

const Dropdown: React.FC<Props> = ({title, options, defaultValue, isMulti, onChange}) => {
    console.log("Dropdown: Default value: ")
    console.log(defaultValue)
    return (
        <div className="text-black my-2 w-full text-left flex flex-col gap-1">
            <p>{title}</p>
            <Select options={options} isMulti={isMulti} value={defaultValue} onChange={onChange}/>
        </div>
    )
}

export default Dropdown