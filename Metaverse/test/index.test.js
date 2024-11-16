
// describe blocks 
const BACKEND_URL = "https://localhost:5000"

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

    const Userresponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,
      username, 
      password, 
      type
     )

     userId = Userresponse.data.userId; 
     
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

