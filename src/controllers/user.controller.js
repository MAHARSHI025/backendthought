import asyncHandler from "../utils/asyncHandler.js"
import { apiResonse } from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"


const generateaccessandrefereshtoken = async (userid) => {
    try {
        const user = await User.findById(userid)

        //take methods from model
        const accesstoken = user.generateAccessToken()
        const refereshtoken = user.generateRefreshToken()

        //update refershtoken in db
        user.refreshtoken = refereshtoken
        await user.save({ validateBeforeSave: false })

        return { accesstoken, refereshtoken }

    } catch (error) {
        throw new apiError(500, "error while making tokens")
    }

}

const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password, thoughts } = req.body
    // console.log("email:" , email);

    if (username === "") {
        throw new apiError(400, "username is required")
    }
    if (email === "") {
        throw new apiError(400, "email is required")
    }
    if (password === "") {
        throw new apiError(400, "password is required")
    }
    if (thoughts === "") {
        throw new apiError(400, "please enter a thought")
    }

    const existedUser = await User.findOne({ email })
    if (existedUser) {
        throw new apiError(409, "user already exist")
    }

    const user = await User.create({
        email,
        thoughts,
        password,
        username: username.toLowerCase()
    })

    const createduser = await User.findById(user._id).select(
        "-password "
    )
    if (!createduser) {
        throw new apiError(500, "something went wrong when create user")
    }

    return res.status(201).json(
        new apiResonse(200, createduser, "user created success")
    )
})

const getAlluser = asyncHandler(async (req, res) => {
    try {
        const user = await User.find()
        if (user) {
            res.status(200).json({
                status: 'success',
                data: user
            })
        } else {
            res.status(404).json({
                status: "fail",
                message: "No User Found"
            })
        }
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
})

const mythoughts = asyncHandler(async (req, res) => {
    try {
        const userthought = await User.findById(req.user._id)

        res.status(200).json({
            status: 'success',
            data: userthought
        })
    } catch (error) {

    }
})

const loginUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body

    if (!username && !email) {
        throw new apiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new apiError(404, "User does not exist")
    }

    const isPasswordValid = await user.ispasswordcorrect(password)

    if (!isPasswordValid) {
        throw new apiError(401, "Invalid user credentials")
    }

    const { accesstoken, refereshtoken } = await generateaccessandrefereshtoken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken ")

    const options = {
        httpOnly: false,
        secure: true,
    }


    return res.status(200)
        .cookie("accesstoken", accesstoken, options)
        .cookie("refreshtoken", refereshtoken, options)
        .json(
            new apiResonse(
                200,
                {
                    user: loggedInUser,
                    accesstoken,
                    refereshtoken,
                },
                "User logged In Successfully"
            )
        );

})

const logoutUser = asyncHandler(async (req, res) => {

    //to find and update db info
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshtoken: undefined
            }
        },
        {
            new: true
        }
    )
    const option = {
        httpOnly: true,
        secure: true
    }

    // to clear cookies in browser
    return res.status(200)
        .clearCookie("accesstoken", option)
        .clearCookie("refreshtoken", option)
        .json(new apiResonse(200, {}, "user logged out"))

})

const updatethought = asyncHandler(async (req, res) => {

    const { thoughts } = req.body
    if (!thoughts) {
        throw new apiError(401, "Please enter Thought")
    }

    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                thoughts: thoughts
            }
        },
        {
            new: true
        }
    )
    return res.status(200)
        .json(new apiResonse(200, {}, "Your thought is updated"))
})



export {
    registerUser,
    loginUser,
    getAlluser,
    logoutUser,
    updatethought,
    mythoughts
}