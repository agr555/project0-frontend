export type LoginResponseType = {
    error:  boolean,
/*    accessToken?: string,
    refreshToken?: string,
    fullName?: string,
    userId?: number,*/
    message: string,
    tokens: { accessToken: string, refreshToken: string }
    user: {   name: string, lastName: string,id: number}
}
