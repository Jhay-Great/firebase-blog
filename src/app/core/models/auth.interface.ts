export interface ILogin {
    login(data:{email:string, password:string}) :void
}

export interface ILogOut {
    logout() :void
}

export interface ISignIn {
    signIn() :void
}

export interface ISignOut {
    signOut() :void
}