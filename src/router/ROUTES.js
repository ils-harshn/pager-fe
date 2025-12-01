const ROUTES = {
  INDEX: "/",
  PAGER: "/pager/:id/:username",
  GET_PAGER: (id, username) => `/pager/${id}/${username}`,
};

export default ROUTES;
