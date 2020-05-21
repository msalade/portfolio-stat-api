import baseRepository, { IRepository } from './baseRepository';
import User, { UserRepo, UserWithRef } from '../dataTypes/user';
import app from './firebaseApp';

export type IUserRepository = IRepository<User, UserRepo> & {
    getByEmail: (email: string) => any;
};

const userRepository = (): IUserRepository => {
    const currColName = 'currencies';
    const collectionName = 'users';
    
    const currencies = app.firestore().collection(currColName);
    const repo = baseRepository<UserRepo, UserWithRef>(collectionName);

    const getByEmail = async (email: string): Promise<User[]> => {
        return await repo.collection
            .where('email', '==', email)
            .get()
            .then(querySnapshot => {
                return Promise.all(
                    querySnapshot.docs.map(async doc => {
                        const user = await doc.data();
                        const haveCurrency = !!user.currency.get;

                        const res = {
                            ...user,
                            currency: haveCurrency
                                ? await user.currency
                                      .get()
                                      .then((curr: any) => ({
                                          ...curr.data(),
                                          id: curr.id
                                      }))
                                : user.currency
                        };

                        return res as User;
                    })
                );
            });
    };

    const get = async (id: string): Promise<User> => {
        return repo.get(id).then(async user => {
            const res = {
                ...user,
                currency: await user.currency.get().then((curr: any) => ({
                    ...curr.data(),
                    id: curr.id
                }))
            };

            return res;
        });
    };

    const create = async (user: UserWithRef): Promise<string> => {
        const newUser = {
            ...user,
            currency: (await currencies.doc(`${user.currency}`).get()).ref
        } as UserRepo;

        return repo.create(newUser);
    };

    const update = async (user: UserWithRef): Promise<void> => {
        const userToUpdate = {
            ...user,
            currency: (await currencies.doc(`${user.currency}`).get()).ref
        } as UserRepo;

        return repo.update(userToUpdate);
    };

    return {
        ...repo,
        get,
        create,
        update,
        getByEmail
    };
};

export default userRepository;
