# DevTinder  API

##  authRouter
-POST /signup
-POST /Login
-POST /Logout

## profileRouter
    -GET /profile/view
    -PATCH /profile/edit
    -PATCH /profile/Password

## connectionRequestRouter
    -POST /request/intrested/:userId
    -POST /request/ignored/:userId
    -POST /request/review/accepted/:requestId
    -POST /request/review/rejected/:userId

## userRouter
    -GET /user/connections
    -GET /user/request/recieved
    -GET /user/feed - Gets all profile 

status: 
    ignored
    intrested
    accepted
    rejected