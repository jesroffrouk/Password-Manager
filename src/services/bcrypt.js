import bcrypt from 'bcryptjs'
import { addHashPassword, dataExist, RetriveHashPassword } from '../db/models'

export const checkPasswordConsistency = async(Masterkey) => {
    // first check if it's first value or not ,if first value , add convert password to hash and save to db
    const isFirstData = !(await dataExist())
    if (isFirstData) {
        const hashPassword = await bcrypt.hash(Masterkey,10)
        await addHashPassword(hashPassword)
        return true
    }
    // otherwise check password if it matches the old one and if it does let it pass
    
    const oldHashPassword = await RetriveHashPassword()
    // match old hash , new master key if they match return true.
    const match = await bcrypt.compare(Masterkey,oldHashPassword)
    if(match) {
        return true
    }else{
        return false
    }
}