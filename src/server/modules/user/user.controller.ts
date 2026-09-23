import { userService } from "./user.service";

export async function registerUser(body: unknown) {
  return userService.register(body);
}

export async function loginUser(body: unknown) {
    return userService.login(body);
  }
