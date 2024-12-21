class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        (this.data = null), (this.message = message);
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        (this.statusCode = statusCode), (this.data = data);
        this.message = message;
        this.success = statusCode < 400;
    }
}

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) =>{
            console.error(err); // Log the error for debugging
            res.status(500).json({
                success: false,
                message: err.message || "An unexpected error occurred",
            });
        });
    };
};
  

import { google } from "googleapis";

/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
 * from the client_secret.json file. To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 */
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;

export const oauth2client=new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "postmessage"
);


export { 
    ApiError, 
    ApiResponse, 
    asyncHandler, 
    uploadOnCloudinary,
    oauth2client
};
