import React, { useState } from 'react';
import { AppService } from './app.service';
import { User } from './User';
import { ConusmaException } from './Exceptions/conusma-exception';
import { GuestUser } from './guest-user';

export default class Conusma {

  private appService: AppService;

  constructor(appId: string, parameters: { apiUrl: string }) {
    this.appService = new AppService(appId, { apiUrl: parameters.apiUrl, deviceId: "hdpc" ,version:'1.0.0'});
  }
  public async createUser() {
    try {
      var user: User = new User(this.appService);
      await user.create();
      return user;
    } catch (error) {
      throw new ConusmaException("createUser","User cannot be created.", error);
    }
  }
  public async createGuestUser() {
    try {
      var user: GuestUser = new GuestUser(this.appService);
      await user.create();
      return user;
    } catch (error) {
      throw new ConusmaException("createGuestUser","GuestUser cannot be created.", error);
    }
  }

}
