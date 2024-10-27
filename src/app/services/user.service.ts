import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';  // JSON server URL
  private userData: any; // Use the appropriate type based on your data structure

  constructor(private http: HttpClient) {}

  setUserData(data: any) {
    this.userData = data; // Store user data
  }

  getUserData() {
    return this.userData; // Retrieve user data
  }

  // Method to save registration data to JSON server
  registerUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }

// User service method to update user data
updateUserData(userId: number, updatedUser: any): Observable<any> {
  const url = `${this.apiUrl}/${userId}`; // Construct the URL with the user ID
  return this.http.put(url, updatedUser);
}

}
