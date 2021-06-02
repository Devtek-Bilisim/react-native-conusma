import React, { useState } from 'react';
import { AppService } from './app.service';
import { User } from './user';

export default class Conusma {

  private appService: AppService;

  constructor(appId: string, parameters: { apiUrl: string }) {
    this.appService = new AppService(appId, { apiUrl: parameters.apiUrl, deviceId: 'hdpc' });
  }
  public async createUser() {
    var user: User = new User(this.appService);
    await user.create();
    return user;
  }
  public async createGuestUser() {

  }


}
