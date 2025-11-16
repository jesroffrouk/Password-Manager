export const validateFile = (obj) => {
    // first check if it's an object or not
    if (typeof obj != "object" || Array.isArray(obj)) {
        console.log("check1")
        return false
    }
    // It should have Accounts and Hash as first object
    const keys = Object.keys(obj)
    const AccountsHashCheck = keys.length !== 2 ||  !keys.includes("Accounts") || !keys.includes("Hash") || typeof obj.Accounts !== "object" || typeof obj.Hash !== "string"
    if (AccountsHashCheck) {
        console.log("check2")
        return false
    }
    // for Accounts, It can only contains object with name, can contain a list of more than one item, name can by anything but capital at first
    const accountEntries = Object.entries(obj.Accounts)
    for (const [key,value] of accountEntries) {
        if (!/^[A-Z]/.test(key)){
        console.log("check3")
            return false
        }
        if (typeof value !== "object" || value == null || Array.isArray(value)) {
        console.log("check4")
            return false
        }
        const keys = Object.keys(value)
        if (keys.length !== 3 || !keys.includes("Identifier") || !keys.includes("Passwd") || !keys.includes("Decrypt")) {
            return false
        }

        // validating Identifier , Passwd and decrypt
        const decryptKeys = Object.keys(value.Decrypt)
        if (typeof value.Identifier !== "string" || typeof value.Passwd !== "string" || typeof value.Decrypt !== "object" || !decryptKeys.includes("Salt") || !decryptKeys.includes("Iv")) {
            console.log("check6")
            return false
        }
        if (typeof value.Decrypt.Salt !== "string" || typeof value.Decrypt.Iv !== "string") {
            console.log("check7")
            return false
        }
    }
        return true
}