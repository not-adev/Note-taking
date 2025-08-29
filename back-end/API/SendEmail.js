import nodemailer from "nodemailer"

export function sendEmail(req, res) {
    console.log("OTP VARification hi")
    try {
        const { email, OTP } = req.body;
        //  const transporter = nodemailer.createTransport({
        //         service: 'gmail',
        //         auth: {
        //             user: 'ansariarif123111@gmail.com',
        //             pass: `${process.env.APP_PASSWORD}`,
        //         },
        //     });

        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "41164c6c0059b5",
                pass: "66760fec0ce4f6"
            }
        });

        const mailOptions = {
            from: 'arif@gmail',
            to: `${email}`,
            subject: 'OTP',
            text: `<p> The Otp for your Gmail Varifation is ${OTP} .Dont share your OTP with other users </p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        res.status(200).json({ code: 1, message: 'Mail send succesfully' });
    } catch (error) {
        res.status(400).json({ code: 0, message: error.message });
    }


}