export enum ButtonType {
    PRIMARY,
    SECONDARY
}

interface Props {
    text: string
    onClick: () => void
    type: ButtonType
}

const Button: React.FC<Props> = ({onClick, text, type}) => {
    return (
        <button onClick={(e)=>{e.stopPropagation(); onClick()}} className={`${type == ButtonType.PRIMARY ? "bg-gray-800 text-white hover:bg-gray-500" : "bg-white text-gray-800 border border-gray-800 hover:bg-gray-100"} shadow-md px-10 py-2 rounded-md mx-auto transition-all hover:scale-110`}>
            {text}
        </button>
    )
}

export default Button