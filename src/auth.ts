import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

const databaseURL = process.env.FIREBASE_DATABASE;
const serviceAccount = require('../fbServiceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL
});

const auth = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authtoken) {
        admin
            .auth()
            .verifyIdToken(req.headers.authtoken as string)
            .then(() => {
                next();
            })
            .catch(() => {
                res.status(403).send('Unauthorized');
            });
    } else {
        res.status(403).send('Unauthorized');
    }
};

export const getUserEmail = async (req: Request) =>
    admin
        .auth()
        .verifyIdToken(req.headers.authtoken as string)
        .then(user => user.email);

export default auth;
