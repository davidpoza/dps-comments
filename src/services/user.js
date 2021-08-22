import { Container } from 'typedi';

export default class UserService {
  constructor() {

  }

  static getTemplate(user) {
    if (user) {
      return ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }
    return null;
  }


};