import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';

import firebase from 'firebase/compat/app';
import { UserDetails } from '../interfaces/user-details';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser: WritableSignal<firebase.User | undefined> = signal(undefined);
  userDetails: WritableSignal<UserDetails | undefined> = signal(undefined);
  fullName: Signal<string> = computed(() => {
    const user = this.userDetails();
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
    return '';
  });
  abbreviatedDisplay: Signal<string> = computed(() => {
    const user = this.userDetails();
    if (user) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    return '';
  });
  email: Signal<string> = computed(() => {
    const { email } = this.currentUser() as firebase.User;
    return email ?? '';
  });

  private userId = '';

  setUser(data: firebase.User | undefined) {
    this.currentUser.set(data);
  }

  setUserDetails(data: UserDetails | undefined) {
    this.userDetails.set(data);
  }

  getUser(): firebase.User | undefined {
    return this.currentUser();
  }

  setUserId(key: string) {
    this.userId = key;
  }

  getUserId(): string {
    return this.userId;
  }
}
