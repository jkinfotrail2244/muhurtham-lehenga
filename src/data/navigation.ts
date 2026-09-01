export type NavigationItem = {
  key: string;
  path: string;
  hasMegaMenu?: boolean;
};

export const navigationItems: NavigationItem[] = [
  {
    key: "home",
    path: "",
  },
  {
    key: "lehengas",
    path: "lehengas",
    hasMegaMenu: true,
  },
  {
    key: "sherwanis",
    path: "sherwanis",
    hasMegaMenu: true,
  },
  {
    key: "collections",
    path: "collections",
    hasMegaMenu: true,
  },
  {
    key: "ourStory",
    path: "our-story",
  },
  {
    key: "showroom",
    path: "showroom",
  },
  {
    key: "appointment",
    path: "appointment",
  },
];