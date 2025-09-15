type App = {
  id: string;
  name: string;
  secret: string;
  redirectUrl: string;
};

export const BASE_APPS: App[] = [
  {
    name: "Flexy",
    id: "0ec918e2-f297-4cd9-9a48-a4289d7fe098",
    redirectUrl: "http://localhost:3002/api/auth",
    secret: "52665f83-4a09-4d98-9bd3-c03fb60cbf05",
  },
];
