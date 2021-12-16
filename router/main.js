const { serviceRouter } = require("./serviceRouter");
const { userRouter } = require("./userRouter");

exports.router = (app) => {
  serviceRouter(app);
  userRouter(app);
};
