const { default: axios } = require("axios");

// describe blocks 
const BACKEND_URL = "https://localhost:5000"
const WS_URL = "https://localhost:3001"

describe('Authentication' , ()=> {

  test('User is able to Signup only Once' , async()=> {
    let username = "Manik" + Math.random(); 
    let password = "12345678"
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup` , {
      username ,
      password , 
      type : "admin"
    })
    expect(response.statusCode).toBe(200)

    const updatedRespone = await axios.post(`${BACKEND_URL}/api/v1/signup` , {
      username , 
      password ,
      type : 'admin'
    })
    expect(updatedRespone.statusCode).toBe(400)
  })

  test('Signup fails if the username is null' , async()=>{
    let username = `manik-${Math.random()}`
    let password = '12345'
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup` , {
      password
    })
    expect(response.statusCode).toBe(400)
  })

  test("Signup fails if the username and password are incorrect" , async()=>{
    const username = `Manik-${Math.random()}`
    const password = '123456'
    
    await axios.post(`${BACKEND_URL}/api/v1/signin` , 
      username , 
      password
    )

    const response =  await axios.post(`${BACKEND_URL}/api/v1/signup` , {
      username : 'WrongPassword',
      password
    })

    expect(response.statusCode).toBe(403); // unauthorized 
  })

}); 


// describe for user login 
describe('User Information Page' , ()=>{

  const token = ""; 
  const avatarId = ""; 

  beforeAll(async()=>{
    // signup and signin 
    const username = `Manik-${Math.random()}`
    const password = '123456'
    const type = 'admin'

     await axios.post(`${BACKEND_URL}/api/v1/signup`,
      username, 
      password, 
      type
     )
     
     const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, 
      username,
      password
    )
    token = response.data.token; 

     const imageUrl = 'https://imageurl.com'
     const name = 'Manik'
     const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar` , 
      imageUrl , 
      name
     )

     avatarId = avatarResponse.data.avatarId; 

  })

  // metadata 
  test('User not able to Create metadata' , async()=>{
    const avatarId = `WrongId-${Math.random()}`

    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata` , {
      avatarId
    } , {
      headers : {
        "authorization": `Bearer ${token}`
      }
    } 
  )

    expect(response.statusCode).toBe(401)
  })

  test('User created Metadata' , async()=>{
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata` , {
      avatarId
    }, {
      headers : {
        "authorization": `Bearer ${token}`
      }
    } )

    expect(response.statusCode).toBe(200)
  })

  test('Token is not Provided ' , async()=>{
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata` , {
      avatarId
    } )

    expect(response.statusCode).toBe(200)
  })

})

  
// user avatar info  
describe('user Avatar Information' , ()=>{
  const token = ""; 
  const avatarId = "";
  const userId = ""; 

  beforeAll(async()=>{
    // signup and signin 
    const username = `Manik-${Math.random()}`
    const password = '123456'
    const type = 'admin'
    // user signup 
    const Userresponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,
      username, 
      password, 
      type
     )

     userId = Userresponse.data.userId; 

     // user signsin witb the userid
     const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, 
      username,
      password
    )
    
    token = response.data.token; 
    
     const imageUrl = 'https://imageurl.com'
     const name = 'Manik'
     const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar` , 
      imageUrl , 
      name
     )

     avatarId = avatarResponse.data.avatarId; 

  })

  test("Get Back Avatar Information for a User" , async()=>{
    const response = await axios.post(`${BACKEND_URL}/api/v1/metadata/bulk?id=[${userId}]` , 
    {
      headers : `Bearer-${token}`
    }
    )
    expect(response.statusCode).toBe(200)
    expect(response.data.avatars.length).toBe(1)
    expect(response.data.avatars[0].userId).toBe(userId)
  })

  test("Available list of avatar for the users" , async()=>{
    const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`)

    expect(response.data.avatars.length).not.toBe(0)
   const currentAvatar = expect(response.data.avatars.find(x => x.id === avatarId))
    expect(currentAvatar).toBeDefined()

  })

})

// to do : others 

// space informations 
describe('space Information' , async ()=>{
  // elements1 and elements2 (create) , create map , create a space  
  let userId; 
  let usertoken; 
  let adminId;
  let admintoken;  
  let element1Id; 
  let element2Id; 
  let mapId; 

  beforeAll(async()=>{
  let username = `Manik-${Math.random}`
  let password = '123456'

  const adminSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup` , {
    username,
    password
  })
   admintoken = adminSignupResponse.data.token; 

  // adminsign's in 
  const adminSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin` , {
    username , 
    password
  })

   adminId = adminSigninResponse.data.userId; 

  
  const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup` , {
    username,
    password
  })
   usertoken = userSignupResponse.data.token; 

  // usersign's in 
  const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin` , {
    username , 
    password
  })

   userId = userSigninResponse.data.userId; 

   // admin can create an element1
   const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element` , 
    {
    "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
    "width": 1,
    "height": 1,
    "static": true
  }, {
    headers : {
      "authorization": `Bearer ${admintoken}`
    }
  })

  // create an element2 (body , header ,) -- need to see  
  const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element2` , {
    "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
    "width": 1,
    "height": 1,
    "static": true
  } , {
    headers : {
      "authorization": `Bearer ${admintoken}`
    }
  })

   element1Id = element1.data.elementId;
   element2Id = element2.data.elementId; 

  // create a map

  const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map` , {
    "thumbnail": "https://thumbnail.com/a.png",
    "dimensions": "100x200",
    "name": "100 person interview room",
    "defaultElements": [{
        elementId: element1Id,
        x: 20,
        y: 20
      }, {
        elementId: element1Id,
        x: 18,
        y: 20
      }, {
        elementId: element2Id,
        x: 19,
        y: 20
      }
    ]
 } , {
  headers : {
    authorization : `Bearer ${admintoken}` // as only admin are allowed 
  }
 })

   mapId = map.data.mapId;

})

// user's create space 
test("User is able to Create a Space" , async()=>{
  const response = await axios.post(`${BACKEND_URL}/api/v1/space` , {
    "name": "Test",
    "dimensions": "100x200",
    "mapId": "map1"
 } , {
  headers: {
    authorization: `Bearer ${usertoken}`
  }
 })
    expect(response.spaceId).toBeDefined()
})

test(' user is able to create space without mapId (empty space)' , async()=>{
  const response = await axios.post(`${BACKEND_URL}/api/v1/space` , {
    "name": "Test",
    "dimensions": "100x200",
  })
  expect(response.spaceId).toBeDefined()
}, {
  headers: {
    authorization: `Bearer ${usertoken}`
  }
 })

test('user is not able to creatae space without mapId and dimensions' , async()=>{
  const response = await axios.post(`${BACKEND_URL}/api/v1/space` , {
    "name": "Test",
  })
  expect(response.statusCode).toBe(400); 
  expect(response.data.error).toBe('Dimensions and mapId are required')
}, {
  headers: {
    authorization: `Bearer ${usertoken}`
  }
 })

// user deletes space test
test('user is able to delete space' , async()=>{
  const createSpaceResponse = await axios.post(`${BACKEND_URL}/api/v1/space` , {
    "name": "Test",
    "dimensions": "100x200"
 })
 const spaceId = createSpaceResponse.data

  const response = await axios.delete(`${BACKEND_URL}/api/v1/space/${spaceId}` , {
    headers : {
      "authorization": `Bearer ${usertoken}`
    }
  }, {
    headers: {
      authorization: `Bearer ${usertoken}`
    }
   })
  expect(response.statusCode).toBe(200);




})


test('user is not able to delete a space' , async()=>{
  const createSpaceResponse = await axios.post(`${BACKEND_URL}/api/v1/space` , {
    "name": "Test",
 })
})

test('user is not able to delete a space from another user' , async()=>{
   const resposne = await axios.post(`${BACKEND_URL}/api/v1/space` , {
    "name": "Test",
    "dimension": "100x200"
   }, {
    headers: {
      authorization: `Bearer ${usertoken}`
    }
   })
   const spaceId = response.data.spaceId; 
   // trying to delte using an admin token
   const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${spaceId}` , {
    headers: {
      authorization: `Bearer ${usertoken}`
    }
   })
   expect(deleteResponse.statusCode).toBe(403); // unauthorized to delete a space 
})

test('admin has no spaces intially' , async()=>{
  const response = await axios.get(`${BACKEND_URL}/api/v1/space`)
  expect(response.data.spaces).toEqual(1)
} , {
  header: {
    authorization: `Bearer ${admintoken}`
  }
})

test('admin can create a space' , async()=>{
  const createSpaceResponse = await axios.post(`${BACKEND_URL}/api/v1/space` , {
    "name": "Test",
    "dimensions": "100x200"
 }, { 
  headers: {
    authorization: `Bearer ${adminToken}`
  }
})

  const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`)
  const filterSpaces = response.data.space.filter((x)=>x.id == createSpaceResponse.data.spaceId)
  expect(filterSpaces.data.length).toBe(1)
  expect(filterSpaces).toBeDefined
})


})

describe('Create an Element' , async ()=>{
    // admin and user can create an element 
    let adminToken; 
    let adminId; 
    let userToken; 
    let userId;

    beforeAll(async()=>{
      // admin and user signups 
      const username = `Manik-${Math.random()}`
      const password = '123456'

      const adminSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup` , {
        username,
        password,
        type: 'admin'
      })
      adminToken = adminSignupResponse.data.token;

      const adminSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin` , {
        username,
        password
      })
      adminId = adminSigninResponse.data.userId;

      const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup` , {
        username: `${username}-user`,
        password  
      })

      userToken = userSignupResponse.data.token;

      const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin` , {
        username: `${username}-user`,
        password
      })

      userId = userSigninResponse.data.userId; 
      })

    test('Admin is not able to hit the Endpoints' , async()=>{

               // admin can create an element1
            const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element` , 
    {
    "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
    "width": 1,
    "height": 1,
    "static": true
  }, {
    headers : {
      "authorization": `Bearer ${admintoken}`
    }
            })

            const element1Id = element1.data.elementId;

          expect(element1Id).toBe(undefined)

           
          // to do

    })

    test('admin is able to creata a space' , async()=>{

    })


    test('admin is able to update image url for an element' , async()=>{

    })

})

// Arean Informations 
describe('Arena EndPoints' , async ()=>{
  let userId; 
  let usertoken; 
  let adminId;
  let admintoken;  
  let element1Id; 
  let element2Id; 
  let mapId; 
  let spaceId; 

  beforeAll(async()=>{
  let username = `Manik-${Math.random}`
  let password = '123456'

  const adminSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup` , {
    username,
    password
  })
   admintoken = adminSignupResponse.data.token; 

  // adminsign's in 
  const adminSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin` , {
    username , 
    password
  })

   adminId = adminSigninResponse.data.userId; 

  
  const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup` , {
    username: `${username}-user`,
    password
  })
   usertoken = userSignupResponse.data.token; 

  // usersign's in 
  const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin` , {
    username: `${usernanme}-user`, 
    password
  })

   userId = userSigninResponse.data.userId; 

   // admin can create an element1
   const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element` , 
    {
    "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
    "width": 1,
    "height": 1,
    "static": true
  }, {
    headers : {
      "authorization": `Bearer ${admintoken}`
    }
  })

  // create an element2 (body , header ,) -- need to see  
  const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element2` , {
    "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
    "width": 1,
    "height": 1,
    "static": true
  } , {
    headers : {
      "authorization": `Bearer ${admintoken}`
    }
  })

   element1Id = element1.data.elementId;
   element2Id = element2.data.elementId; 

  // create a map

  const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map` , {
    "thumbnail": "https://thumbnail.com/a.png",
    "dimensions": "100x200",
    "name": "100 person interview room",
    "defaultElements": [{
        elementId: element1Id,
        x: 20,
        y: 20
      }, {
        elementId: element1Id,
        x: 18,
        y: 20
      }, {
        elementId: element2Id,
        x: 19,
        y: 20
      }
    ]
 } , {
  headers : {
    authorization : `Bearer ${admintoken}` // as only admin are allowed 
  }
 })

   mapId = map.data.mapId;

   // create a space 
   const space = await axios.post(`${BACKEND_URL}/api/v1/space` ,  {
    "name": "Test",
    "dimensions": "100x200",
    "mapId": mapId
   } , {
    headers : {
    authorization : `Bearer ${usertoken}` // a user can also create a space
    }
   })

    spaceId = space.data.spaceId;
  })

  test('User can able to get a space' , async()=>{
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`)
    expect(response.statusCode).toBe(200);
  })

  test('correct SpaceId Returns all the elements' , async()=>{
    const response = await axios.post(`${BACKEND_URL}/api/v1/space/${spaceId}`)
    expect(response.statusCode).toBe(200);
    expect(response.data.elements.length).toBe(3);
  })

  test('User is able to Delete an element' , async()=>{
    const response = await axios.post(`${BACKEND_URL}/api/v1/space/${spaceId}`) // fetch a particular space to element an elemetn from it
    
    await axios.delete(`${BACKEND_URL}/api/v1/space/element` ,  {
      spaceId: spaceId , 
      elementId : response.data.element[0].id
    })

    // expect element to be upated 
    const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`)
    expect(newResponse.status).toBe(200); 
    expect(newResponse.data.element.length).toBe(2); 
  })

  test('Adding element get back as expected' , async()=>{
    await axios.post(`${BACKEND_URL}/api/v1/space/element` , {
      "spaceId": spaceId, 
      "elementId": element1Id, 
      "x": 100, 
      "y": 200
    })

    const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`)
    expect(newResponse.data.elements.length).toBe(3); 
  })

  test('User is not able to delete Incorrect dimesions element' , async()=>{
   const response =  await axios.post(`${BACKEND_URL}/api/v1/space/element` , {
      "spaceId": spaceId, 
      "elementId": element1Id, 
      "x": 100, 
      "y": 200
    })

    // dummy x and y delete 
    const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/element` , {
      "spaceId" : spaceId , 
      "elementId": element1Id, 
      "x": 1000, 
      "y": 2000
    })

    expect(deleteResponse.statusCode).toBe(400); 
    expect(deleteResponse.data.elements.length).toBe(3); 
  })
})

// for web-sockets 
describe('Websockets Tests', async() => {  
  // users1 and user2 , map , spaces , elements 
  let adminToken ; 
  let adminUserId; 
  let userToken; 
  let userId; 
  let admintoken;  
  let element1Id; 
  let element2Id; 
  let mapId; 
  let spaceId;
  let ws1; 
  let ws2; 
  let ws1Message;
  let ws2Message;
  let userx;
  let usery; 
  let adminx; 
  let adminy; 

  function waitAndPopForrLatestMessage(MessageArray){
      return new Promise((resolve) => {
          if (MessageArray.length > 0) {
            // return the first message 
            resolve(MessageArray.shift());
          }
          else{
            // wait for a message
           const interaval = setTimeout(() => {
              if (MessageArray.length > 0) {
                resolve(MessageArray.shift());
              }
              clearInterval(interaval); // clear the interval after reciving messasge 
            } , 100)
          }
      })  
  }

  // http and ws functions
  async function setupHttp() {
    // some what similar to the beforeall in this
      // admin and user signups 
      const username = `Manik-${Math.random()}`
      const password = '123456'
  
      // admin signsup 
      const adminSignsupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
          username , 
          password ,
          role: 'Admin'
      })
       adminToken = adminSignsupResponse.data.token
  
      const adminSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin` , {
        username , 
        password 
      })
  
      adminUserId = adminSigninResponse.data.userId; 
  
      // usersignup 
  
      const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup` , {
        username: username + `-user` , 
        password,
      })
  
       userToken = userSignupResponse.data.token; 
  
      // user sign's in
  
      const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
        username , 
        password
      })
       userId = userSigninResponse.data.useId; 
  
      // create an element 
      const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element` , 
        {
        "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        "width": 1,
        "height": 1,
        "static": true
      }, {
        headers : {
          "authorization": `Bearer ${admintoken}`
        }
      })
    
      // create an element2 (body , header ,) -- need to see  
      const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element2` , {
        "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        "width": 1,
        "height": 1,
        "static": true
      } , {
        headers : {
          "authorization": `Bearer ${admintoken}`
        }
      })
    
       element1Id = element1.data.elementId;
       element2Id = element2.data.elementId; 
    
      // create a map
    
      const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map` , {
        "thumbnail": "https://thumbnail.com/a.png",
        "dimensions": "100x200",
        "name": "100 person interview room",
        "defaultElements": [{
            elementId: element1Id,
            x: 20,
            y: 20
          }, {
            elementId: element1Id,
            x: 18,
            y: 20
          }, {
            elementId: element2Id,
            x: 10,
            y: 10
          }]
      } , {
        headers : {
          "authorization": `Bearer ${admintoken}`
        }
      })
  
      mapId = map.data.mapId;
  
      // create a space
  
      const space = await axios.post(`${BACKEND_URL}/api/v1/admin/space` , {        
        "name": "Test", 
        "dimensions": "100x200", 
        "mapId": mapId
      } , {
        headers : {
          "authorization": `Bearer ${admintoken}`
        }
      })  
  
      spaceId = space.data.spaceId;
  
  }

  async function setupWs(){
    // make ws connection
    ws1 = new WebSocket(WS_URL)
    ws2 = new WebSocket(WS_URL) 

    // wait for both ws to connect
    await new Promise((r) => {
      ws1.onmessage = r; 
    })

    await new Promise((r) => {
        ws2.onmessage = r; // shoot a message when the promise is resolved
    })

    ws1.onmessage = (event) => {
        ws1Message.push(JSON.parse(event.data)); // pushed  in msg array before running test cases 
    }

    ws2.onmessage = (event) => {
        ws2Message.push(JSON.parse(event.data));
    } 

  } 


  // before running all the other test case for th ws 
  beforeAll(async()=>{
    })


  test('user is able to get an ack after joining a space' , async()=>{
        // user join a space 
        ws1.send(JSON.stringify(
          {type: "join" ,
           payload: {
            "spaceId": spaceId, 
            "token": userToken
          }}
        ))
    
        ws2.send(JSON.stringify(
          {type: "join" ,
           payload: {
            "spaceId": spaceId, 
            "token": adminToken
          }}
        ))

      const message1 = await waitAndPopForrLatestMessage(ws1Message); 
      const message2 = await waitAndPopForrLatestMessage(ws2Message); 

      expect(message1.type).toBe("space-joined")
      expect(message2.type).toBe("space-joined")  
      
      // users expected 
      expect(message1.payload.users.length + message2.payload.users.length).toBe(1); 
      userx = message1.payload.spawn.x; 
      usery = message1.payload.spawn.y;
      adminx = message2.payload.spawn.x;
      adminy = message2.payload.spawn.y;




  })

  test('user is not Allowed to move out of the space' , async()=>{

    ws1.send(JSON.stringify(
      {
      type: "move" ,
       payload: {
        "x": 100000000,
        "y": 1000000
      }}
    ))

    const message = await waitAndPopForrLatestMessage(ws1Message);
    expect(message.type).toBe('type-rejected')
    // expcted to returns back to the orginal position
    expect(message.payload.x).toBe(userx)
    expect(message.payload.y).toBe(usery)
  })

  test('user is not allowed to move 2 blocks at a time' , async()=>{
      ws1.send(JSON.stringify(
        {
        type: "move" ,
         payload: {
          "x": adminx + 2 ,
          "y": adminy
        }}
      ))

      const message1 = await waitAndPopForrLatestMessage(ws1Message);
      expect(message1.type).toBe('movement-rejected')
      expect(message1.payload.x).toBe(adminx+2); 
      expect(message1.payload.y).toBe(adminy); 

  })


  test('Correct Movement Should be BroadCasted to another user' , async()=>{
      ws1.send(JSON.stringify(
        {
        type: "movement" ,
         payload: {
          "x": adminx + 1 ,
          "y": adminy ,
          "userid": userToken

        }}
      ))

      const message2 = await waitAndPopForrLatestMessage(ws2Message);
      expect(message2.type).toBe('movement')
      expect(message2.payload.x).toBe(adminx+1); 
      expect(message2.payload.y).toBe(adminy);  
  })

  test('If a User Leaves Then Another user Should be Informed about it' , async()=>{
    ws1.close(); 

    const message2 = await waitAndPopForrLatestMessage(ws2Message);
    expect(message2.type).toBe('user-left') 
    expet(message2.payload.userid).toBe(adminUserId)
  })
  })
  
