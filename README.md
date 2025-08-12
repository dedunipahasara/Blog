# Blog

Blog
This is a backend testing part for blog website .users can upload a pins(images,video) other users can view it can react to apin ,comment to a pin, share pins and follow users who uploaded the pins

﻿

POST
register

http://localhost:8080/api/auth/register

we have to put actual email address to register this blog website. if we havent put a acutual email we cant register and get 404 error

<img width="1482" height="809" alt="registering_user_to_the_blog" src="https://github.com/user-attachments/assets/33c811e3-662a-4e43-8c5c-b0e87d73be98" />

<img width="904" height="37" alt="getting_email_to_register_successful_email" src="https://github.com/user-attachments/assets/1434d9e3-cd8a-4898-97a0-59a61bd7e78b" />

<img width="1597" height="39" alt="getting_email_verification_link" src="https://github.com/user-attachments/assets/9fca1ae8-15a5-4882-8241-cdd512568529" />

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

<img width="1504" height="725" alt="login_user_getting_token" src="https://github.com/user-attachments/assets/d1e30da7-7605-4af0-a133-745065dab2ac" />


Body
raw (json)
json
{

    "username": "duni",
    
    "password": "deduni@1234"
   
}



POST

post a pin

http://localhost:8080/api/pins

afte rlogin we have to create the profile first . after create profile we can post a pin . we can upload image or video for this in form-data

<img width="1500" height="889" alt="user_uploading_a _pin_to_blog" src="https://github.com/user-attachments/assets/4e0db570-0a23-4da1-a5ca-457422282130" />


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

<img width="1486" height="911" alt="adding_comment_to_pin" src="https://github.com/user-attachments/assets/41b6b621-37b2-4b46-b9a1-2c7991a9f22b" />
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

<img width="1486" height="886" alt="getting_profile" src="https://github.com/user-attachments/assets/96fc52f2-a6b5-4322-9f54-26dc45e1b4f7" />


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


<img width="1489" height="900" alt="adding_a_reaction_to_pin" src="https://github.com/user-attachments/assets/1cafe6ee-8277-4772-9568-7c911b517045" />

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

<img width="1492" height="723" alt="email_verified_successfully" src="https://github.com/user-attachments/assets/d33f8f0f-cce5-4123-90b8-98eabec6d5b0" />

Query Params
code
5b5837d8-5ed4-495b-bd26-6b4c61e86f25



POST

changing password

http://localhost:8080/api/auth/change-password

we can change password like this when we remember our current password . we have to use our token for this


﻿<img width="1487" height="817" alt="change_password_with_token_when_we_rememberd_current_password" src="https://github.com/user-attachments/assets/0a7e3902-a23f-4f36-8114-b4eba17acd82" />

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

<img width="1494" height="804" alt="send_otp_to_email" src="https://github.com/user-attachments/assets/f3735bbb-c9f9-49d7-ab35-449fefe23444" />

<img width="1607" height="32" alt="successfully_sent_otp_to_email_address" src="https://github.com/user-attachments/assets/0cca6cc0-4c93-4a07-95ce-4cae7e32a6bd" />


Query Params
email
dunibandara41@gmail.com


POST
forgot password verify otp

http://localhost:8080/api/auth/forgot-password/verify-otp

after sending otp to email. use that six digit code for changing new password

<img width="1495" height="825" alt="change_password_by_forget_password_otp" src="https://github.com/user-attachments/assets/bcc0903b-6a11-4f58-bbc9-f886bc6ba527" />
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

<img width="1485" height="794" alt="share_a_pin" src="https://github.com/user-attachments/assets/f4c6988c-5af0-46e3-b4c7-c169e58da988" />



﻿
﻿

POST

Follow a user

http://localhost:8080/api/profile/follow/2

we can follow a other users by using thier token

<img width="1489" height="822" alt="follow_a_user" src="https://github.com/user-attachments/assets/ef7bc587-d9bd-4eea-9439-9930be635679" />

﻿
Authorization
Bearer Token
Token
<token>


POST

logout a user

http://localhost:8080/api/auth/logout

when we not using this blog we can logout

<img width="1496" height="797" alt="user_loggout_part" src="https://github.com/user-attachments/assets/d8d3a789-c3d1-4818-b10d-ea79fa5a1606" />



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

<img width="1495" height="907" alt="update_user_profile" src="https://github.com/user-attachments/assets/c45fd6fb-4d77-4c76-94b7-c3c2a56aa0f4" />



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
