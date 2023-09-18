import { ProductInteraction } from "../types/db";
import { DropdownOption, ShoppingItem, User, UserFilters, Option, InteractionType } from "../types/popup";
import { SupabaseClient, createClient } from "@supabase/supabase-js"

/**
 * Data Access Object (DAO)
 * For now this just manages saving & loading data from chrome storage, 
 * but once we integrate with a database and such this will be the root level 
 * object for interacting with everything
 */
export class DAO {
    static supabase: SupabaseClient;
    
    static init() {
        this.supabase = createClient('https://ctftxukxcbhtpjfxdsjf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZnR4dWt4Y2JodHBqZnhkc2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA1NDgyMDEsImV4cCI6MjAwNjEyNDIwMX0.FELKEykohpgKbdtu2mdWDOICi0HHDlwnJv3ITvYCEBg')
    }

    /**
     * Saves a filter with the given key and value to chrome storage
     * @param key The key to save the filter by. Ex: "gender"
     * @param value The value to store for the filter. Ex: "male"
     */
    static async saveFilter(key: string, value: string | number) {
        await chrome.storage.sync.set({ [key]: value });
    }
    
    /**
     * Retrieves a filter from chrome storage by the given key
     * @param key The key to retrieve the filter by
     * @returns The value of the filter. (Just the value, not the entire DropdownOption)
     */
    static async getFilter(key: string) {
        const value = await chrome.storage.sync.get([key]);
        return value[key];
    }

    /**
     * Wrapper function to save all 3 filters to chrome storage
     * @param selectedGender 
     * @param selectedShoeSize 
     * @param selectedShirtSize 
     */
    static async saveFilters(
        selectedGender: number | string, 
        selectedShoeSize: number | string, 
        selectedShirtSize: number | string
    ) {

        await this.saveFilter("gender", selectedGender);
        await this.saveFilter("shoeSize", selectedShoeSize);
        await this.saveFilter("shirtSize", selectedShirtSize);
    }

    /**
     * Returns a stored filter value from localstorage, or the default value if it doesn't exist
     * @param key The key to retrieve the value by
     * @param optionsArr An array of dropdownoptions to search through
     * @returns
     */
    static async getFilterOrDefault(
        key: string,
        optionsArr: Array<DropdownOption>
    ): Promise<Array<DropdownOption>> {

        const value = await this.getFilter(key);
        const item = optionsArr.find((a) => a.value == value);
        const itemFound = !(item == null || typeof item == "undefined");
        return itemFound ? [item] : [optionsArr[0]];
    }

    /**
     * Loads a users filters from chrome storage and returns them
     * @param genders Array of DropdownOptions representing genders
     * @param mensShoeSizes Array of DropdownOptions representing mens shoe sizes
     * @param shirtSizes Array of DropdownOptions representing shirt sizes
     * @returns A UserFilters object containing the filters retrieved from chrome storage
     */
    static async loadUserFilters(
        genders: Array<DropdownOption>, 
        mensShoeSizes: Array<DropdownOption>, 
        shirtSizes: Array<DropdownOption>
    ): Promise<UserFilters> {

        const gender = await DAO.getFilterOrDefault("gender", genders);
        const shoesize = await DAO.getFilterOrDefault("shoeSize", mensShoeSizes);
        const shirtsize = await DAO.getFilterOrDefault("shirtSize", shirtSizes);
        return {
            gender: gender[0],
            shoeSize: shoesize[0],
            shirtSize: shirtsize[0]
        }
    }

    /**
     * Adds a user to the database
     * @param email The users email
     */
    static async createUser(
        email: string
    ): Promise<void> {
        if(!this.supabase) this.init()

        const alreadyExists = await this.getUser(email)
        if(alreadyExists.hasValue()) return

        const { data, error } = await this.supabase.from("users").insert({
            email: email
        })
        
        if(error) {
            console.log("An error occured while creating user")
            console.log(error)
        }
    }

    /**
     * Gets a user from the database by their email
     * @param email The users email
     * @returns An option type with the users information if it exists
     */
    static async getUser(
        email: string
    ): Promise<Option<User>> {
        if(!this.supabase) this.init()

        const { data, error } = await this.supabase.from("users").select("*").eq("email", email)

        if (error) {
            console.log("Error occured while fetching users")
            console.log(error)
            return new Option<User>()
        }
        return new Option<User>(data[0])
    }

    /**
     * Stores an item view for a user to the database
     * @param userId The users id
     * @param item The item data
     */
    static async storeItemView(
        userId: string,
        item: ShoppingItem
    ): Promise<void> {
        if(!this.supabase) this.init()

        const insertData = {
            user_id: userId,
            interaction: InteractionType.VIEW,
            ...item
        }

        const { data, error } = await this.supabase.from("product-interactions").insert(insertData)
    }

    /**
     * Stores an item added to cart for a user to the database
     * @param userId The users id
     * @param item The item data
     */
    static async storeItemAddToCart(
        userId: string,
        item: ShoppingItem
    ): Promise<void> {
        if(!this.supabase) this.init()

        const insertData = {
            user_id: userId,
            interaction: InteractionType.ADD_TO_CART,
            ...item
        }

        const { data, error } = await this.supabase.from("product-interactions").insert(insertData)
    }

    static async storeItemPurchase(
        userId: string,
        item: ShoppingItem
    ): Promise<void> {
        if(!this.supabase) this.init()

        const insertData = {
            user_id: userId,
            interaction: InteractionType.PURCHASE,
            ...item
        }

        const { data, error } = await this.supabase.from("product-interactions").insert(insertData)
    }

    static async getProductInteractionByUrl(
        url: string
    ): Promise<Option<ProductInteraction>> {
        if(!this.supabase) this.init()
        
        const product_id = url.split("-")[url.split("-").length - 1].split(".aspx")[0]
        const { data, error } = await this.supabase.from("product-interactions").select("*").like("url", `%${product_id}%`)

        if(data) {
            return new Option<ProductInteraction>(data[0])
        } else {
            return new Option<ProductInteraction>()
        }
    }
}