# AppKey-WebAuthn-Angular

The AppKey-WebAuthn-Angular module is used to add functional bindings between an Angular application and the AppKey service. To install this module into the Angular application do the following

---

# NPM Install

1. Open terminal and go to root project folder where package.json is

2. npm i ngx-appkey-webauthn


## configure

The * AppKeyWebAuthn()* function call is used to the AppKeyWebAuthn to operate with a REST API that implements the AppKey api service. This function should be called once at the time the application starts up.

```
import { NgxAppkeyWebauthnService} from 'ngx-appkey-webauthn'

private appKeyAuth: NgxAppkeyWebauthnService

this.appKeyAuth.configure({appToken:'APP_TOKEN', apiUrl:'REST_API'}) 

 
```

### Parameters

**APP_TOKEN** : String - this contains the application token for AppKey (usually retrieved from the Keys section of the AppKey Portal. 

**REST_API** : String - this optional parameter contains the HTTPS REST API address for the AppKey service. The default is ' https://api.appkey.io ' if not specified.

For self-hosted versions of the AppKey server, the **REST_API** is the HTTPS REST API address of the AppKey server.


### Example

```
   
let application = await appKeyAuth.getApp();

let result = await appKeyAuth.login({handle:'user_email@appkey.io'});

```

---

### Parameters

**none**

## getApp

The *getApp()* function is used by the client application to get information about the application within AppKey. The *getApp()* function will save user information inside member variables of the **AppKeyAPIManager.shared** object. These member variables include the following information:

* **application** : application object

The Application object contains the following fields  

* **appId** : String - unique 128 bit application id
* **displayAppId** : String - unique display application id
* **name** : String - name of application
* **userId** : String - AppKey user id who owns application
* **status** : String - 'active', 'inactive', 'migrated'
* **handleType** : String - 'email', 'phone'
* **emailExtension** : Bool - email extensions supported
* **appPublicKey** : String - app raw public key
* **appToken** : String - app token
* **smsExtension** : Bool - Twilio sms extensions supported
* **signup** : String - app signup 'open' or 'invite'
* **anonymousLoginEnabled** : Bool - anonymous login enabled
* **userNamesEnabled** : Bool - user names enabled
* **appleLoginEnabled** : Bool - Apple login function enabled
* **googleLoginEnabled** : Bool - Google login function enabled
* **appleBundleId** : String - Apple application bundle id and Application Web Service Id
* **googleClientId** : String - Google Client ID for iOS and Google Client ID for Web
* **relyPartyId** : String - domain url for Passkey WebAuthn
* **userJWTExpiration** : Int - JWT token expirations in hours
* **locales** : [String] - list of locales support by application

```
    let application = await appKeyAuth.getApp();
```

### Parameters

None

### Example

```
    try {
	let application = await appKeyAuth.getApp();

    } catch (error) {
	console.error("getApp error ", error.message)
    }
```
 

## signup

The *signup()* function is used to signup a user with a AppKey application. The signup process is spread accross three functions, which have to be called within the right order:

* **signup**
* **signupConfirm**
* **signupComplete**

The *signup()* function is responsible for registering a new user handle (email or phone) with the application. This handle must be unique to the user and not already assigned to another account. The client must also provide a display name (first and last) and can optionally include a locale (default is ‘EN’ if unspecified). The *signup()* function returns an *SignupChallenge* object, which contains a challenge to be signed by the private key generated on the client side. 

 

```
    await appKeyAuth.signup(data)
```

If an error occurs in the call to the function, a AppKeyError exceptions will be thrown.

### Parameters

**handle** : String - this contains the user's handle (email or phone). 

**displayName** : String - this contains the user's display name.

**locale** : String - 2 letter **locale** for the user

### Example

```
    try {
	let result = await appKeyAuth.signup({handle:'user_email@appkey.io', displayName:'Demo User'})

    } catch (error) {
	console.error("signup error ", error.message)
    }
```

## signupConfirm

The *signupConfirm()* function is the second step in registering a user with an AppKey application. It’s called after the user’s biometric data has been validated on the client device and the passkey has been stored in the keychain. Since biometric verification ensures user authenticity, there’s no need for CAPTCHAs to distinguish between a human and a bot. This process prevents automated bot signups on the AppKey server. The attestation object passed to this function should be generate from your browser or other libary, and the function returns an *Signup Data* object.

```
    await appKeyAuth.signupConfirm('user_email@appkey.io', atttestationObject) 
```

If an error occurs in the call to the function, a error exceptions will be thrown.

### Parameters

**handle** : String - this contains the user's handle (email or phone). 

**attest** : Attestation - this contains the user's attestation object


### Example

```
    try {
        let signupData = await appKeyAuth.signupConfirm('user_email@appkey.io', atttestationObject);

    } catch (error) {
        console.error("signup error ", error.message) 
    }
```

## signupComplete

The *signupComplete()* function is the final step in registering a user with an AppKey application, called after *signupConfirm()*. It takes the six-digit code sent to the user’s handle (email or phone) to verify ownership. AppKey uses two-factor verification: first, the user’s biometric data, and second, the code sent to their handle. If the verification is successful, the function returns a user object - ensuring the user both owns the handle and passes biometric checks.


The passed in *signup_token* is retrieved from the * signupData* object returned by the called to the *signupConfirm()* function. 
The signupComplete will automatically include the signup token in request header.



```
    await appKeyAuth.signupComplete({code:six-digit-code}) 
```

If an error occurs in the call to the function, an error exceptions will be thrown.

### Parameters 

**code** : String - six-digit code sent to user's handle


### Example

```
    try {
        let result = await appKeyAuth.signupComplete({code:345543})
    } catch (error) {
         
    }
```

## login

The *login()* function is used to login into a user's account. The login process is spread accross two functions, which have to be called within the right order:

* **login**
* **loginComplete**

The *login()* function initiates the passkey login process for a user handle (email or phone) that has already been registered with the application. The handle must correspond to a user that’s signed up and stored on the server. This function returns an *Login Challenge* object, which includes a challenge that the client must sign using the private key stored in the device’s keychain. This step ensures the user’s identity is verified securely.

```
    await appKeyAuth.login({handle: String}) 
	
```

If an error occurs in the call to the function, an error exceptions will be thrown.


### Parameters
	{
		handle: String - this contains the user's user name or email. 
	}

### Example

```
    try {
        let challenge = await appKeyAuth.login({handle: email})

    } catch(error) {
        
    }
```

## loginComplete

The *loginComplete()* function is the second step in registering a user with an AppKey application, called after *login()*. It takes the the user’s handle (email or phone) and an Assertion object to verify the login. The assertion object passed to this function should be generate from your browser or other libary.

If the *loginComplete()* is successful it will return to the caller, the login credentials will be saved in member variable of the **appKeyAuth.user** shared object:

* **user** : Object - application user object


The AppUser object contains the following fields

* **appUserId** : String - unique 128 bit user id
* **displayName** : String - user display name
* **handle** : String - user handle (email or phone)
* **status** : String - user status 'pending', 'active', 'suspended'
* **appId** : String - unique 128 bit application id
* **accessToken** : String? - JWT REST access token for logged in user
* **signUpToken** : String? - JWT REST sign up token
* **jwt** : String? - JWT login token
* **userName** : String? - unique user name (alphanumeric)
* **locale** : String? - current user locale
* **loginProvider** :  String - login type
* **lastLogin** :  String? - date stamp of last login

```
	await appKeyAuth.loginComplete(handle: String, assertion: AssertionObject)
     
```
If an error occurs in the call to the function, an error exception will be thrown.

### Parameters

**handle** : String - this contains the user's handle (email or phone). 
**assertion** : Object - this contains the Assertion object

### Example

```
    try {
        let appUser = await appKeyAuth.loginComplete('user_email@appkey.io', AssertionObject)
    } catch (error){
        
    }
```

## loginAnonymous

The *loginAnonymous()* function is used to login anonymously into the AppKey system. The anonymous login process is spread accross two functions, which have to be called within the right order:

* **loginAnonymous**
* **loginAnonymousComplete**

This function will only work if the anonymous login capability is enable with the AppKey portal for the applicaiton. 

The *loginAnonymous()* function initiates the anonymous passkey login process with the application. The function is passed a uuidString string, which is used to create the anonymous handle. That way, if the client wishes to reuse an anonymous handle, it can do so by reusing the same uuidString paramter. This function returns an *Signup Challenge* object, which includes a challenge that the client must sign using the private key stored in the device’s keychain. This step ensures the user’s anonymous identity is verified securely.

```
    await appKeyAuth.loginAnonymous({handle: String})  
```

If an error occurs in the call to the function, an error exception will be thrown.


### Parameters

**handle** : String - this contains a unique string for the anonymous user and must start with ANON_ (e.g. `ANON_${random_string}`)

### Example

```
   
    try {
        let uuid = UUID()
        let result =  await appKeyAuth.loginAnonymous({handle:`ANON_${uuid}`})
    } catch (error) {
        
    }
```

## loginAnonymousComplete

The *loginAnonymousComplete()* function is the second step in registering an anonymous user with an AppKey application, called after *loginAnonymous()*. 


If the *loginAnonymousComplete()* is successful it will return to the caller, the login credentials will be saved in member variable of the **appKeyAuth.user** shared object:

* **appUser** : AppUser - application user object
* **accessToken** : String? - JWT REST access token for logged in user
* **jwt** : String? - JWT login token

The AppUser object contains the following fields

* **appUserId** : String - unique 128 bit user id
* **displayName** : String - user display name
* **handle** : String - user handle (email or phone)
* **status** : String - user status 'pending', 'active', 'suspended'
* **appId** : String - unique 128 bit application id
* **accessToken** : String? - JWT REST access token for logged in user
* **signUpToken** : String? - JWT REST sign up token
* **jwt** : String? - JWT login token
* **userName** : String? - unique user name (alphanumeric)
* **locale** : String? - current user locale
* **lastLogin** :  String? - date stamp of last login

```
    await appKeyAuth.loginAnonymousComplete({handle, atttestationObject})  
```
If an error occurs in the call to the function, an error exception will be thrown.

### Parameters

**handle** : String - this contains the user's handle (email or phone). 
**assertion** : Assertion - this contains the Assertion object

### Example

```
    try {
        let result = await appKeyAuth.loginAnonymousComplete(`ANON_${uuid}`, atttestationObject)  
    } catch (error) {
         
    }
```

## verify

The *verify()* function is used to verify a user's account using a saved passkey. The verify function is a lightweight version of the *login()* function. The verify process is spread accross two functions, which have to be called within the right order:

* **verify**
* **verifyComplete**

The *verify()* function initiates the passkey verification process for a user handle (email or phone) that has already been registered with the application. The handle must correspond to a user that’s signed up and stored on the server. This function returns an *LoginChallenge* object, which includes a challenge that the client must sign using the private key stored in the device’s keychain. This step ensures the user’s identity is verified securely.

```
await appKeyAuth.verify({handle: String})  
     
```

If an error occurs in the call to the function, an error exception will be thrown.


### Parameters

**handle** : String - this contains the user's user name or email. 

### Example

```
    try {
        await appKeyAuth.verify({handle:'user_demo@appkey.io'})  
    } catch (error) {
        
    }
```

## verifyComplete

The *verifyComplete()* function is the second step in registering a user with an AppKey application, called after *verify()*. It takes the the user’s handle (email or phone) and an Assertion object to verify the login. 

If the *verifyComplete()* is successful it will return to the caller with a AppUser object.

```
   await appKeyAuth.verifyComplete(handle: String, assertion:AssertionObject)  
```
If an error occurs in the call to the function, an error exception will be thrown.

### Parameters

**handle** : String - this contains the user's handle (email or phone). 
**assertion** : Assertion - this contains the Assertion object

### Example

```
    try {
        let appUser = await appKeyAuth.verifyComplete('user_demo@appkey.io', AssertionObject)  
    } catch (error) {
        
    }
```

## logout

The *logout()* function is used by the client application to log out of the AppKey server. This function does not actually call the server, rather it erases all the local data associated with the JWT login token. This function should be called when the user logs out.

```
    appKeyAuth.logout() 
```

### Parameters

none

### Example

```
    appKeyAuth.logout()
```

## setUserLocale

The *setUserLocale()* function is used by the client application to set the user's **locale**. The locale is a two letter code that identifies the user's locale - by default the locale is 'EN' for English. The AppKey authentication system supports the ISO 631–1 codes that are described [ISO 639–1 codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes). Note: a client can only set the locale for a user if that locale is supported by the application in the Cosync Portal.

```
    appKeyAuth.setUserLocale({locale:string})
```

### Parameters

**locale** : String - contains the user's locale (always uppercase)

### Example

```
    try {
        await appKeyAuth.setUserLocale({locale:'FR'})
    } catch (error ) {
        
    }
```

## setUserName

The *setUserName()* function is used by the client application to set the user name associated with a user account. User names must be unique names that allow the application to identify a user by something other than the email or phone handle. Typically, a user name is selected the first time a user logs in, or after he/she signs up for the first time. This function will only work if user names are enabled with AppKey for the application in the portal.

User names must consist of alphanumeric characters - starting with a letter. They are not case sensitive

```
    await appKeyAuth.setUserName({userName:userName})
    
```
If an error occurs in the call to the function, an error exception will be thrown.

### Parameters

**userName** : String - user name to be associated with logged in user

### Example

```
    try {
        await appKeyAuth.setUserName({userName:'appuserdemo'})
    } catch (error) {
        
    }
```

## userNameAvailable

The *userNameAvailable()* function is used by the client application whether a user name is available and unique for the application. User names must be unique names that allow the application to identify a user by something other than the email or phone handle. 

User names must consist of alphanumeric characters - starting with a letter. They are not case sensitive

```
    await appKeyAuth.userNameAvailable({userName:'appuserdemo'})
    
```
This fuction returns **true** if user name is available, **false** otherwise. 

If an error occurs in the call to the function, a AppKeyError exceptions will be thrown.

### Parameters

**userName** : String - user name to be associated with logged in user

### Example

```
    try {
        let isAvailable = await appKeyAuth.userNameAvailable({userName:'appuserdemo'})
        if isAvailable {
            ...
        }
    } catch (error) {
        
    }
```

