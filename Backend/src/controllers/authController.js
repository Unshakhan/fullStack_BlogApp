import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const SignUp = async(req , res)=>{
  const {name,email,password,role} = req.body
  console.log("SIGNUP BODY:", req.body)  //
 try{
   if (!email || !password || !name || !role) {
      return res.json({
        status: false,
        message: "required feilds",
      });
    }
      const hashPass = await bcrypt.hash(req.body.password, 10);
    console.log("this is hashpassword=================>",hashPass);
  const exist = await User.findOne({email})
  if(exist){
    return res.json({
      msg: "Email already exist"
    })
  }
    const userData= { name, email, password: hashPass,role};
    const user = new User(userData);
    const data = await user.save();
    if(data){
      res.status(200).json({
      message: "signup succesfull"
    })
    }
   
   
  }catch(err){
    res.json({
      status: false,
      message: err.message,
    });
  }
}

const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.json({
        status: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.json({
        status: false,
        message: "User not found",
      });
    }

    // Need password for bcrypt compare, so fetch it separately
    const userWithPass = await User.findOne({ email })
    const isMatch = await bcrypt.compare(password, userWithPass.password)

    if (isMatch) {
      // ✅ Correct: options object as 3rd arg, token returned directly
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }  // ✅ 3rd arg = options, not callback
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
      });

      return res.json({
        status: true,
        message: "Login successful",
        token: token,
        user: user,  // ✅ password already excluded via .select('-password')
      });

    } else {
      return res.status(401).json({
        status: false,
        message: "Invalid credentials",
      });
    }

  } catch (error) {
    console.log("Login error:", error.message);
    res.json({
      status: false,
      message: error.message,
    });
  }
};

const Logout = (req, res) => {
  try {
    res.clearCookie("token");
    console.log("yeh line bhi chali hai");

    res.json({
      status: true,
      message: "user logout successfully",
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
};

const AllUsers = async (req, res) => {
  try {
    console.log('req.user--->',req.user);
    
    // all data
    const user = await User.find();
    // const user = await Users.find({name:"sana"}) // specific data
    res.json({
      status: true,
      message: "user fetched successfully",
      data: user,
    });
    console.log(user);
  } catch (error) {
    console.log("error in fetching user-->", error.message);

    res.json({
      status: false,
      message: error.message,
    });
  }
};

const GetUser = async(req,res)=>{
  const {id} = req.params
  try {
    console.log("this is idsss", id , req.user.id);
    
    if(req.user.id !== id){
         return res.status(403).json({
        status:false,
        message:"Unauthorized access"
      });}else{
res.json({
      status: true,
      message: "user fetched successfully",
      data: req.user,
    });
      }
       

    
  } catch (error) {
     console.log(error.message);

    res.status(500).json({
      status:false,
      message:error.message
    });
  }
    
  }
const updateUser = async (req, res) => {

  const { id } = req.params;

  try {

    // check logged in user same hai ya nahi
    if (req.user.id != id) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized access",
      });
  }
  if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }    const updatedUser = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      status: true,
      message: "User updated successfully",
      data: updatedUser,
    });

  } catch (error) {

    console.log(error.message);

    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {

  const { id } = req.params;

  try {

    // check user apna hi account delete kar raha hai ya nahi
    if (req.user.id != id) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized access",
      });
    }

    await User.findByIdAndDelete(id);

    res.json({
      status: true,
      message: "User deleted successfully",
    });

  } catch (error) {

    console.log(error.message);

    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
export {SignUp,Login,Logout,AllUsers,GetUser,updateUser,deleteUser} 