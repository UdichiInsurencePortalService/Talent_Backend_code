const {testtakerdemo} = require('../Model/testtakerdemo')

async function testtaker(req,res) {
    
    try{
      const{firstname,lastname,email,phonenumber} = req.body

      if(!firstname || firstname.trim()=== ""){

        return res.status(400).json({
          success:false,
          message:"firstname is required"
        });
      }

      if(!lastname || lastname.trim()=== ""){

        return res.status(400).json({
          success:false,
          message:"lastname is required"
        });
      }

      if(!email || email.trim()=== ""){

        return res.status(400).json({
          success:false,
          message:"email is required"
        });
      }

      if(!phonenumber || phonenumber.trim()=== ""){

        return res.status(400).json({
          success:false,
          message:"phone Number is required"
        });
      }
        //take data from req.body frontend 
        // const payload = req.body;

     // call model function -> insert into databse 
     const newtaker = await testtakerdemo(req.body);

     res.status(201).json({
        success:true,
        message:"test taker created successfully",
        data: newtaker
     });

    } catch(error){
console.error("controller error ",error);
    // 4️⃣ Handle error response

 res.status(500).json({
      success: false,
      message: "Server error while creating Test Taker"
    });
    }
}

module.exports={
  testtaker
}