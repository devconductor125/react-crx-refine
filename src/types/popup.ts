export type DropdownOption = {
    value: string,
    label: string
}

export type IPCMessage = {
    message: string,
    data?: any
}

export type UserFilters = {
    gender: DropdownOption,
    shoeSize: DropdownOption,
    shirtSize: DropdownOption
}

export type ShoppingItem = {
    url: string,
    price: number,
    title: string,
    image: string,
    description: string
}

export enum InteractionType {
    VIEW = "VIEW",
    ADD_TO_CART = "ADD_TO_CART",
    PURCHASE = "PURCHASE"
}

export type User = {
    id: string,
    email: string,
}

export class Option<T> {
    value?: T

    constructor(value?: T) {
        this.value = value
    }

    hasValue(): boolean {
        return this.value !== undefined
    }
}