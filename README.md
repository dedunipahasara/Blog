# Blog

Blog
This is a backend testing part for blog website .users can upload a pins(images,video) other users can view it can react to apin ,comment to a pin, share pins and follow users who uploaded the pins

﻿

POST
register
http://localhost:8080/api/auth/register
we have to put actual email address to register this blog website. if we havent put a acutual email we cant register and get 404 error


﻿

﻿

﻿
﻿

Body
raw (json)
json
{
    "username": "pahasara",
    "email": "pahasarakarunarathna69@gmail.com",
    "password": "zaara@1234",
    "fullName": " pahasara karunarathna",
    "bio": "peaceful girl",
    "profileImageUrl": "https://pin.it/51NJsmDd1"
}
POST
login
http://localhost:8080/api/auth/login
before login we have to veify our email. email verify link send to our gmail account .after verifying emaol account we can login. we have to put correct username and password in raw jason


﻿
﻿

Body
raw (json)
json
{
    "username": "duni",
    "password": "deduni@1234"
   
}
POST
post apin
http://localhost:8080/api/pins
afte rlogin we have to create the profile first . after create profile we can post a pin . we can upload image or video for this in form-data


﻿
﻿

Authorization
Bearer Token
Token
<token>
Body
form-data
file
postman-cloud:///1f075c0d-690a-4660-935f-bd90d1bfd56b
this is a video

title
My first pin
title dis

description
My description
didcriptionabout the file type is video

category
videos
video cat

POST
post comment
http://localhost:8080/comments/1
user who created pin and other users can comment to the pin .


﻿
﻿

Authorization
Bearer Token
Token
<token>
Body
raw (json)
json
"🥰🥰🥰🥰"
GET
get all comments
http://localhost:8080/api/comments
﻿

Authorization
Bearer Token
Token
<token>
GET
getting aprofile
http://localhost:8080/api/profile
creating the profile


﻿
﻿

Authorization
Bearer Token
Token
<token>
Body
raw (json)
json
{
    "id":2,
    "username": "thamasha",
    "email": "thamashadeduni@gmail.com",
    "password": "thama@1234",
    "fullName": "thamasha deduni",
    "bio": "kdrma lover",
    "profileImageUrl": "https://pin.it/2lss3FqsV"
}
POST
add reaction to pin
http://localhost:8080/api/reactions/1
user who created pin and other users canreact to the pins


﻿
﻿

Authorization
Bearer Token
Token
<token>
Body
raw (json)
json
{
    "type": "HEART"
}
GET
verify email
http://localhost:8080/api/auth/verify?code=5b5837d8-5ed4-495b-bd26-6b4c61e86f25
getting link from email for verifying email


﻿
﻿

Query Params
code
5b5837d8-5ed4-495b-bd26-6b4c61e86f25
POST
changing password
http://localhost:8080/api/auth/change-password
we can change password like this when we remember our current password . we have to use our token for this


﻿
﻿

Authorization
Bearer Token
Token
<token>
Body
raw (json)
json
{
  "currentPassword": "duni@1234",
  "newPassword": "dedu@1234"
}
POST
fogot password send otp
http://localhost:8080/api/auth/forgot-password/send-otp?email=dunibandara41@gmail.com
when we forgot our password we can send otp to email


﻿

﻿
﻿

Query Params
email
dunibandara41@gmail.com
POST
forgot password verify otp
http://localhost:8080/api/auth/forgot-password/verify-otp
after sending otp to email. use that six digit code for changing new password


﻿
﻿

Body
raw (json)
json
{
  "email": "dunibandara41@gmail.com",
  "otp": "529746",
  "newPassword": "deduni@1234"
}
GET
share a pin
http://localhost:8080/api/pins/1/share
we can share a pin too. options whatsapp facebook copylink


﻿
﻿

POST
Follow a user
http://localhost:8080/api/profile/follow/2
we can follow a other users by using thier token


﻿
﻿

Authorization
Bearer Token
Token
<token>
POST
logout a user
http://localhost:8080/api/auth/logout
when we not using this blog we can logout


﻿
﻿

Authorization
Bearer Token
Token
<token>
PUT
update profile
http://localhost:8080/api/profile
we can update our profile by using token


﻿
﻿

Authorization
Bearer Token
Token
<token>
Body
raw (json)
json
{
  "fullName": "deduni zara",
  "bio": "I love nature",
  "profileImageUrl": "https://pin.it/1Ep0uF5kU"
}
