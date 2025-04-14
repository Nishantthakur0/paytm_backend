import mongoose,{model,Schema} from "mongoose";
mongoose.connect("mongodb://localhost:27017/paytm")
const userSchema = new Schema ({
    username: {type: String, unique: true, require: true, minLength: 3, maxLength: 20 },
    password: {type: String, minLength: 6, require: true},
    firstname: {type: String , require: true , maxLength: 30},
    lastname: {type: String ,require: true , maxlength: 30}
})
export const Usermodel = model ("User",userSchema);