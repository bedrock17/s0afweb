type APIResponse<T> = {
  data: T,
  error: string | null,
};

type GoogleAuthValidate = {
  email: string,
  name: string,
};

type UserProfile = {
  username: string,
  tag: string,
};
