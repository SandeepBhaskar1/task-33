const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_CLOUD_URL,
    credentials: true
}));

app.post('/cookie/set', (req, res) => {
    const {name, value} =req.body;

    if (!name || !value) {
        return res.status(400).json({
            status: 'Error',
            message: 'Cookie name and value required'
        });
    }

    res.cookie(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 24*60*60*1000
    });

    res.status(201).json({
        status: 'Success',
        message: 'Cookie set successfully!'
    })
});

app.get('/cookie/get/:name', (req,res) => {
    const {name} = req.params;
    const cookieValue = req.cookies[name];

    if (!cookieValue){
        return res.status(404).json({
            status: 'Error',
            message: `Cookie ${name} not found.`
        });
    }

    res.status(200).json({
        status: 'Success',
        data: {
            name,
            value: cookieValue
        }
    });
});

app.post('/demo/status', (req,res)=> {
    const {statusCode} = req.body;

    switch (statusCode){
        case 200:
            return res.status(200).json({
                status: 'Success',
                message: 'OK - request successful.'
            });
            case 201: 
            return res.status(201).json({
                status: 'Success',
                message: 'Created - Resource created successfully'
            });
            case 400:
                return res.status(400).json({
                    staus: 'Error',
                    message: 'Bad Request - invalid input'
                });
                case 404: 
                return res.status(404).json({
                    status: 'Error',
                    message: 'Not found - resource not found'
                });
                case 500:
                    res.status(500).json({
                        status: 'Error',
                        message: 'Internal server error'
                    });
                    default:
                        return res.status(400).json({
                            status: 'Error',
                            message: 'Invalid status code provided.'
                        });
    }
});

app.get('/test-cookies', (req, res) => {
    res.json({
        cookies: req.cookies,
        message: 'Current cookies in request'
    });
});

app.listen(PORT, ()=> {
    console.log(`Server is listening on http://localhost:${PORT}`);
})