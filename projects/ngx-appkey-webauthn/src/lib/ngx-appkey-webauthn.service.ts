import { Injectable } from '@angular/core';
import localeData from './locales.json';
import { User } from './models/user';
import { Application } from './models/application';

@Injectable({
    providedIn: 'root'
})
export class NgxAppkeyWebauthnService {


    public localeList: Array<any> = localeData.list;
    public appLocales: Array<any> = [];
    public user: User = new User()
    public application: Application = new Application()
    public signupToken: String = ""

    private signupData: any = {}
    private apiConfig: any = {}

    constructor() {

    }

    async configure(config: any) {
        if (!config || !config.appToken) {
            throw ("invalid api config for app token")
        }
        this.apiConfig = config
    }

    async getApp(): Promise<any> {
        return await this.apiRequest("GET", "appuser/app")
    }



    /**
     * 
     * @param {
     *   handle :string,
     *   displayName :string,
     *   locale? :string
     * }
     * @returns 
     */
    async loginAnonymous(data: any): Promise<any> {

        try {
            let valid = data.handle && data.displayName
            if (!valid) {
                let error = {
                    message: "invalid loginAnonymous data"
                }
                return error
            }
            data.handle = data.handle.toLowerCase();
            return this.apiRequest('POST', 'appuser/loginAnonymous', data)

        } catch (error) {
            return error
        }
    }


    /**
     * https://w3c.github.io/webauthn/#dictdef-registrationresponsejson
     * @param 
     *  handle: string,
     *  {
     * 
     *  id: Base64URLString;
     *  rawId: Base64URLString;
     *  response: {
     *      clientDataJSON: Base64URLString;
     *      attestationObject: Base64URLString;
     *      authenticatorData?: Base64URLString; 
     *    };
     *  authenticatorAttachment?: string; 
     *  type: string;
     * } attestation 
     * @returns 
     */
    loginAnonymousComplete(handle: string, attestation: any) {
        return new Promise((resolve, reject) => {
            try {

                let valid = handle &&
                    attestation.id &&
                    attestation.rawId &&
                    attestation.response &&
                    attestation.response.clientDataJSON &&
                    attestation.response.attestationObject &&
                    attestation.type;

                if (!valid) {
                    reject({ message: "invalid attestation" })
                    return
                }

                attestation.handle = handle.toLowerCase();

                this.apiRequest('POST', 'appuser/loginAnonymousComplete', attestation).then(result => {
                    if (result.code) reject(result);
                    else {
                        this.user = result;
                        resolve(result);
                    }
                }).catch((error) => reject(error));
            } catch (error) {
                reject(error)
            }
        })
    }





    /**
     * 
     * @param {
      *   handle :string,
      *   displayName :string,
      *   locale? :string
      * }
      * @returns 
      */
    async signup(data: any): Promise<any> {

        try {
            let valid = data.handle && data.displayName
            if (!valid) {
                let error = {
                    message: "invalid signup data"
                }
                return error
            }
            data.handle = data.handle.toLowerCase();
            return this.apiRequest('POST', 'appuser/signup', data)

        } catch (error) {
            return error
        }
    }



    /**
     * https://w3c.github.io/webauthn/#dictdef-registrationresponsejson
     * @param 
     *  handle: string,
     *  {
     * 
     *  id: Base64URLString;
     *  rawId: Base64URLString;
     *  response: {
     *      clientDataJSON: Base64URLString;
     *      attestationObject: Base64URLString;
     *      authenticatorData?: Base64URLString; 
     *    };
     *  authenticatorAttachment?: string; 
     *  type: string;
     * } attestation 
     * @returns 
     */
    signupConfirm(handle: string, attestation: any) {
        return new Promise((resolve, reject) => {
            try {

                let valid = handle &&
                    attestation.id &&
                    attestation.rawId &&
                    attestation.response &&
                    attestation.response.clientDataJSON &&
                    attestation.response.attestationObject &&
                    attestation.type;

                if (!valid) {
                    reject({ message: "invalid attestation" })
                    return
                }

                attestation.handle = handle.toLowerCase();

                this.apiRequest('POST', 'appuser/signupConfirm', attestation).then(result => {
                    if (result.code) reject(result);
                    else {
                        this.signupData = result;
                        resolve(result);
                    }
                }).catch((error) => reject(error));
            } catch (error) {
                reject(error)
            }
        })
    }





    /**
     * 
     * @param { handle:string, code:string} data 
     * @returns 
     */
    signupComplete(data: any) {
        return new Promise((resolve, reject) => {
            try {

                let valid = data.code;
                if (!valid) {
                    reject({ message: "invalid singup data" })
                    return
                }

                this.apiRequest('POST', 'appuser/signupComplete', { code: data.code }).then(result => {
                    if (result.code) reject(result);
                    else {
                        this.user = result;
                        this.signupData = {};
                        resolve(result);
                    }
                }).catch((error) => reject(error));
            } catch (error) {
                reject(error)
            }
        })
    }



    /**
     * 
     * @param {handle:string} data 
     * 
     * @returns 
     */
    login(data: any) {
        return new Promise((resolve, reject) => {
            try {
                let valid = data.handle;
                if (!valid) {
                    reject({ message: "invalid login data" })
                    return
                }
                data.handle = data.handle.toLowerCase();
                this.apiRequest('POST', 'appuser/login', data).then(result => {
                    if (result.code) reject(result);
                    else {
                        resolve(result);
                    }
                }).catch((error) => reject(error));
            } catch (error) {
                reject(error)
            }
        })
    }



    /**
     * https://w3c.github.io/webauthn/#dictdef-authenticationresponsejson
     * @param 
     * handle:string,
     *  {
     *      id: Base64URLString;
     *      rawId: Base64URLString;
     *      response: {
     *          clientDataJSON:Base64URLString,
     *          authenticatorData:Base64URLString,
     *          signature:Base64URLString,
     *          userHandle?: Base64URLString
     *          };
     *      authenticatorAttachment?: string; 
     *      type: string;
     *  } assertion
     *  
     * @returns 
     */
    loginComplete(handle: string, assertion: any) {
        return new Promise((resolve, reject) => {
            try {

                let valid = handle &&
                    assertion.id &&
                    assertion.rawId &&
                    assertion.response.clientDataJSON &&
                    assertion.response.authenticatorData &&
                    assertion.response.signature &&
                    assertion.type;
                if (!valid) {
                    reject({ message: "invalid assertion" })
                    return
                }

                assertion.handle = handle.toLowerCase();

                this.apiRequest('POST', 'appuser/loginComplete', assertion).then(result => {
                    if (result && result['access-token']) {
                        this.user = result;
                        resolve(result);
                    }
                    else reject(result);

                }).catch((error) => reject(error));
            } catch (error) {
                reject(error)
            }
        });
    }



    /**
     * 
     * @param {token:string, provider:string} data 
     * 
     * @returns 
     */
    socialLogin(data: any) {
        return new Promise((resolve, reject) => {
            try {
                let valid = data.token && data.provider;

                if (!valid) {
                    reject({ message: "invalid data" })
                    return
                }

                let that = this;
                this.apiRequest('POST', 'appuser/socialLogin', data).then(result => {

                    if (result && result['access-token']) {

                        that.user = result;
                        resolve(result);
                    }
                    else reject(result);

                })
            } catch (error) {
                reject(error)
            }
        });
    }

    /**
    * 
    * @param {token:string, provider:string, handle:string} data 
    * 
    * @returns 
    */
    socialSignup(data: any) {
        return new Promise((resolve, reject) => {
            try {
                let valid = data.token && data.provider && data.handle;
                if (!valid) {
                    reject({ message: "invalid data" })
                    return
                }
                let that = this;
                this.apiRequest('POST', 'appuser/socialSignup', data).then(result => {
                    if (result && result['access-token']) {

                        that.user = result;
                        resolve(result);
                    }
                    else reject(result);

                }).catch((error) => reject(error));
            } catch (error) {
                reject(error)
            }
        });
    }


    /**
     * 
     * @param {handle:string} data 
     * 
     * @returns 
     */
    verify(data: any) {
        return new Promise((resolve, reject) => {
            try {
                let valid = data.handle;
                if (!valid) {
                    reject({ message: "invalid data" })
                    return
                }
                data.handle = data.handle.toLowerCase();
                this.apiRequest('POST', 'appuser/verify', data).then(result => {
                    if (result.code) reject(result);
                    else {

                        resolve(result);
                    }
                }).catch((error) => reject(error));
            } catch (error) {
                reject(error)
            }
        })
    }


    /**
    * https://w3c.github.io/webauthn/#dictdef-authenticationresponsejson
    * @param 
    * handle:string,
    * {  
   *      id: Base64URLString;
   *      rawId: Base64URLString;
   *      response: {
   *          clientDataJSON:Base64URLString,
   *          authenticatorData:Base64URLString,
   *          signature:Base64URLString,
   *          userHandle?: Base64URLString
   *          };
   *      authenticatorAttachment?: string; 
   *      type: string
    * } assertion
    *  
    * @returns 
    */
    verifyComplete(handle: string, assertion: any) {
        return new Promise((resolve, reject) => {
            try {

                let valid = handle &&
                    assertion.id &&
                    assertion.rawId &&
                    assertion.response.clientDataJSON &&
                    assertion.response.authenticatorData &&
                    assertion.response.signature &&
                    assertion.type;
                if (!valid) {
                    reject({ message: "invalid assertion" })
                    return
                }

                assertion.handle = handle.toLowerCase();
                let that = this;
                this.apiRequest('POST', 'appuser/verifyComplete', assertion).then(result => {
                    if (result && result['access-token']) {
                        that.user = result;
                        resolve(result);
                    }
                    else reject(result);

                }).catch((error) => reject(error));
            } catch (error) {
                reject(error)
            }
        });
    }



    /**
     * 
     * @param {token:string, provider:string} data  
     * @returns 
     */
    verifySocialAccount(data: any) {
        return new Promise((resolve, reject) => {
            try {

                let valid = data.token && data.provider;
                if (!valid) {
                    reject({ message: "invalid data" })
                    return
                }
                let that = this;
                this.apiRequest('POST', 'appuser/verifySocialAccount', data).then(result => {
                    if (result && result['access-token']) {
                        that.user = result;
                        resolve(result);
                    }
                    else reject(result);

                }).catch((error) => reject(error));
            } catch (error) {
                reject(error)
            }
        });
    }


    logout() {
        this.user = new User()
    }


    /**
     * 
     * @returns application user
     */
    getAppUser() {
        return new Promise((resolve, reject) => {
            try {
                this.apiRequest('GET', 'appuser/user').then(result => {

                    if (result.code) reject(result);
                    else {
                        this.user = result;
                        resolve(result);
                    }

                }).catch((error) => reject(error));
            } catch (error) {
                reject(error);
            }

        })
    }



    /**
    * 
    * @param {locale:string} data 
    * @returns 
    */
    setLocale(data: any) {
        return new Promise((resolve, reject) => {
            try {
                let valid = data.locale;
                if (!valid) {
                    reject({ message: "invalid data" })
                    return
                }

                this.apiRequest('POST', 'appuser/setLocale', data).then(result => {
                    if (result == true) resolve(result);
                    else reject(result);
                }).catch((error) => reject(error));
            } catch (error) {
                resolve(error)
            }
        })
    }



    /**
     * 
     * @param {displayName:string} data 
     * @returns  
     */
    updateProfile(data: any) {
        return new Promise((resolve, reject) => {
            try {
                let valid = data.displayName;
                if (!valid) {
                    reject({ message: "invalid data" })
                    return
                }


                this.apiRequest('POST', 'appuser/updateProfile', data).then(result => {
                    if (result.code) resolve(result);
                    else reject(result);
                }).catch((error) => reject(error));
            } catch (error) {

            }
        })
    }

    /**
     * 
     * @param {userName:string} data 
     * @returns  
     */
    setUserName(data: any) {
        return new Promise((resolve, reject) => {
            try {

                if (!data.userName) {
                    reject({ message: "invalid data" });
                    return
                }

                data.userName = data.userName.toLowerCase();

                this.apiRequest('POST', 'appuser/setUserName', data).then(result => {
                    if (result.code) reject(result);
                    else resolve(result);
                }).catch((error) => reject(error));
            } catch (error) {
                reject(error);
            }
        })
    }



    /**
     * 
     * @param {userName:string} data 
     * @returns  
     */
    userNameAvailable(data: any) {
        return new Promise((resolve, reject) => {
            try {

                if (!data.userName) {
                    reject({ message: "invalid data" });
                    return
                }

                data.userName = data.userName.toLowerCase();

                this.apiRequest('GET', `appuser/userNameAvailable?userName=${data.userName}`).then(result => {
                    if (result.code) reject(result);
                    else resolve(result);
                }).catch((error) => reject(error));
            } catch (error) {
                reject(error)
            }
        })
    }


    /**
     * 
     * 
     * @returns  
     */
    deleteAccount() {
        return new Promise((resolve, reject) => {
            try {

                this.apiRequest('POST', 'appuser/deleteAccount', {}).then(result => {
                    if (result.code) reject(result);
                    else resolve(result);
                }).catch((error) => reject(error));
            } catch (error) {
                reject(error)
            }
        })
    }



    private async apiRequest(method: string, endpoint: string, data?: any): Promise<any> {
        try {
            if (!this.apiConfig.appToken) {
                throw ("invalid api config for app token")
            }

            console.log("apiRequest this.apiConfig ", this.apiConfig);

            let options: any = {
                method: method ? method : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            if (this.user && this.user.accessToken != "") options.headers['access-token'] = this.user.accessToken;
            else if (this.signupData && this.signupData['signup-token'] != undefined) options.headers['signup-token'] = this.signupToken;
            else options.headers['app-token'] = this.apiConfig.appToken

            if (method == "POST" || method == "PUT") options.body = JSON.stringify(data);

            const response = await fetch(`${this.apiConfig.apiUrl}/api/${endpoint}`, options);
            let result = await response.json();

            console.log(`apiRequest path: ${endpoint} - result: `, result)

            if (response.status !== 200) return { error: result }
            else return result

        } catch (error) {

            console.log(`apiRequest error:`, error)
            return { error: error }
        }
    }


}
