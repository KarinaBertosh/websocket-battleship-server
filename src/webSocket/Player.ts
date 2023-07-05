import crypto from "crypto";

export class Player {
  name: string;
  password: string;
  id: string;
  error: boolean;
  errorText: string;

  constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
    this.id = crypto.randomUUID();
    this.error = false;
    this.errorText = "";
  }

  getData() {
    return {
      name: this.name,
      index: this.id,
      error: this.error,
      errorText: this.errorText,
    };
  }
}
