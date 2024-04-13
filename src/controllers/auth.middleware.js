import { User } from "../models/user.model.js"
import { apiError } from "../utils/apiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"

//to verify generated accesstoken is valid
export const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new apiError(401, "unauthorized request")
        }

        const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedtoken?._id).select("-password -refreshtoken")

        if (!user) {
            throw new apiError(401, "invalid access token")
        }

        req.user = user
        next()
    } catch (error) {
        throw new apiError(401, "error while verify")
    }
})


