import { IPCMessage } from "../types/popup";

/**
 * This class handles everything relating to inter-process communication (IPC)
 */
export class IPC {
    /**
     * Sends a message to the content script running within the specified tab
     * @param tabId The tabs id
     * @param ipcMessage The IPCMessage object to send to the content script
     */
    static async sendMessage(tabId: number, ipcMessage: IPCMessage) {
        await chrome.tabs.sendMessage(tabId, ipcMessage)
    }
}