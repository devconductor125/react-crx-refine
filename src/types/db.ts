import { InteractionType } from "./popup"

export type ProductInteraction = {
    id: number,
    created_at: string,
    price: number,
    url: string,
    title: string,
    image: string,
    description: string,
    interaction: InteractionType,
    user_id: number
}