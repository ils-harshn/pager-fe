const ROUTES = {
  INDEX: "/",
  JOIN_ROOM: "/join/:id",
  PAGER: "/pager/:id/:username",
  GET_PAGER: (id, username) => `/pager/${id}/${username}`,
  GET_JOIN_ROOM: (id) => `/join/${id}`,
};

export default ROUTES;
