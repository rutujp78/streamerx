const validator = require('validator');
const Notification = require('../model/Notification');
const { kafkaConfig } = require('../configs/initKafka');

const validateAndPrioritrize = async (req, res) => {
    const userId = req.user.id;
    const email = req.user.email;

    const { senderEmail, emails, content, type, priority } = req.body;

    if(!type || type !=='email') {
        return res.status(400).json({
            success: false,
            msg: 'Only e-mail notifications are supported for now.'
        })
    }

    if(content === undefined) {
        return res.status(400).json({
            success: false,
            msg: 'Content is empty.'
        })
    }

    if(type === 'email') {
        if(email !== senderEmail) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid credentials.'
            });
        }
        for(const email of emails) {
            if(!validator.isEmail(email)) {
                return res.status(400).json({
                    success: false,
                    msg: 'Invalid email of receiver.'
                });
            }
            else continue;
        }

        const finalNotification = {
            userId: userId,
            from: senderEmail,
            to: emails,
            content: { subject: content.subject, msg: content.msg },
            type: type,
            priority: priority || 'promo',
            time: new Date(),
            status: 'sending'
        }

        try {
            // save info to db
            const notifcation = new Notification(finalNotification);
            const savedNotification = await notifcation.save();
            // send to queue
            const topic1 = process.env.KAFKA_TOPIC1 || '';
            const messages1 = [{
                key: 'emails-promo', value: JSON.stringify(savedNotification)
            }];
            await kafkaConfig.produceMessages(topic1, messages1);
            console.log('Msg sent to kafka');
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                msg: 'Internal server error.'
            });
        }
    }

    // return response
    res.status(200).json({
        success: true,
        msg: 'Notification will be sent shortly.'
    });
}

module.exports = { validateAndPrioritrize };