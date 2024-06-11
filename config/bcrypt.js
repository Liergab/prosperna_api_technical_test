import bcrypt from 'bcryptjs'

export const hashPassword = async(password) => {
    const saltRounds = 10; 
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt); 

    return hash;
}

export const comparedPassword = async(plain, hashPassword) => {
   return await bcrypt.compare(plain, hashPassword)
}