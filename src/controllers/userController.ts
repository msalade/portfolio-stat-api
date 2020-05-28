import { Express } from 'express';

import { IUserRepository } from '../dataAccess/userRepository';
import { getUserEmail } from '../auth';

const userController = (app: Express, userRepository: IUserRepository) => {
    const basePath = '/user';

    app.get(`${basePath}/me`, async (req, res) => {
        const email = await getUserEmail(req);
        const result = await userRepository.getByEmail(email);        

        res.json(result);
    });

    app.get(`${basePath}/byEmail/:email`, async (req, res) => {
        const email = req.params.email;
        const result = await userRepository.getByEmail(email);        

        res.json(result);
    });

    app.get(`${basePath}/:id`, async (req, res) => {
        const userId = req.params.id;
        const user = await userRepository.get(userId);

        res.json(user);
    });

    app.post(`${basePath}`, async (req, res) => {
        const userToUpdate = req.body;

        await userRepository.update(userToUpdate);

        res.send('Ok');
    });

    app.put(`${basePath}`, async (req, res) => {
        const newUser = req.body;

        const userId = await userRepository.create(newUser);

        res.json({ id: userId });
    });

    app.delete(`${basePath}/:id`, async (req, res) => {
        const userId = req.params.id;

        await userRepository.remove(userId);

        res.send('Ok');
    });
};

export default userController;
