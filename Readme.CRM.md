# CRM Server | by  Iskandarov Abbos and Isomiddinov Shahriyor

## Admin info
```
{
   "name": "admin",
   "email": "admin@mail.ru",
   "password": "admin",
   "role": "admin"
}
```

## API Auth Model
```
* name
* email
* password
* createdAt
> --------------------  C R U D  ------------------------
[x] =>  POST   |  /api/auth/register
[x] =>  POST   |  /api/auth/login
[x] =>  GET    |  /api/auth/me
[x] =>  PUT    |  /api/auth/updatedetails
[x] =>  PUT    |  /api/auth/updatepassword
[x] =>  POST   |  /api/auth/forgotpassword
[x] =>  PUT    |  /api/auth/resetpassword/:resetToken
[] =>  GET     |  /api/auth/logout

> -------------------- Registration ----------------------
* name
* email
* password
> -------------------- Login ------------------------------
* email
* password
> -------------------- Forget password --------------------
* email
> -------------------- Reset password --------------------
* password


```


## API User Model
```
* name
* email
* password
* tel
* role
* photo
> ----------  C R U D  ----------
[x] =>  POST   |  /api/user/register
[x] =>  GET    |  /api/user/all
[x] =>  POST   |  /api/user/login
[x] =>  GET    |  /api/user/me
[x] =>  GET    |  /api/user/:id
[x] =>  DELETE |  /api/user/:id
[x] =>  PUT    |  /api/user/:id
[x] =>  POST   |  /api/user/upload
[x] =>  POST   |  /api/user/forgotpassword
[x] =>  PUT    |  /api/user/resetpassword/:resetToken
[] =>  GET     |  /api/auth/logout

> -------------------- Registration -----------------------
* name
* email
* password
* tel
* role
* photo
> -------------------- Login ------------------------------
* email
* password
> -------------------- Forget password --------------------
* email
> -------------------- Reset password ---------------------
* password
> -------------------- Upload image -----------------------
* photo
* userID


```


## API Subject Model
```
* name
* createdAt
> ----------  C R U D  ----------

[x] => POST   | 
[x] => GET    |
[x] => GET    |
[x] => PUT    |
[x] => DELETE |

```


## API Test Model
```
* subjectID
* question
* answer
   * test
   * status
> ----------  C R U D  ----------
[x] => POST   | 
[x] => GET    |
[x] => GET    |
[x] => PUT    |
[x] => DELETE |
```


## API Group Model
```
* name
* email
* passwor
* tel
* role
* photo
> ----------  C R U D  ----------
[x] => POST   | 
[x] => GET    |
[x] => GET    |
[x] => PUT    |
[x] => DELETE |


```
