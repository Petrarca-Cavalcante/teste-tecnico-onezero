import users from "../data-source";

const listUsersService = (page = 1) => {
  const pageSize = 5;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedUsers = users.slice(startIndex, endIndex);

  return {
    users: paginatedUsers,
    currentPage: +page,
    totalPages: Math.ceil(users.length / pageSize),
    totalUsers: users.length,
  };
};

export default listUsersService;
